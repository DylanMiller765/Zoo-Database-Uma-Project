'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, X } from 'lucide-react';

export interface PaymentData {
  cardNumber: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
  savePaymentMethod?: boolean;
}

interface PaymentFormProps {
  onPaymentSubmit: (paymentData: PaymentData) => void;
  isLoading?: boolean;
  showSaveOption?: boolean; // Allow parent to control if save option is shown
}

export default function PaymentForm({ onPaymentSubmit, isLoading = false, showSaveOption = true }: PaymentFormProps) {
  const { isAuthenticated } = useAuth();
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingState, setBillingState] = useState('');
  const [billingZip, setBillingZip] = useState('');
  const [savePaymentMethod, setSavePaymentMethod] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingSavedPayment, setLoadingSavedPayment] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [savedPaymentMethod, setSavedPaymentMethod] = useState<any>(null);
  const [useSavedCard, setUseSavedCard] = useState(false);
  const [showSavedCardPrompt, setShowSavedCardPrompt] = useState(false);

  // Helper function to format card number (defined before useEffect)
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Check if card is expired (real-time validation)
  const checkExpiry = (month: string, year: string) => {
    if (!month || !year) {
      setIsExpired(false);
      return;
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const expiryYearNum = parseInt(year, 10);
    const expiryMonthNum = parseInt(month, 10);

    const expired = expiryYearNum < currentYear || 
                    (expiryYearNum === currentYear && expiryMonthNum < currentMonth);
    setIsExpired(expired);

    // Clear expiry error if card is no longer expired
    if (!expired && errors.expiry === 'This card has expired. Please use a different card.') {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.expiry;
        return newErrors;
      });
    }
  };

  // Load saved payment method on component mount
  useEffect(() => {
    const loadSavedPaymentMethod = async () => {
      if (!isAuthenticated) return;

      try {
        setLoadingSavedPayment(true);
        const response = await apiClient.get('/me/payment-method');
        const savedPayment = response.data.data;

        if (savedPayment && savedPayment.card_number_full) {
          setSavedPaymentMethod(savedPayment);
          setShowSavedCardPrompt(true);
        }
      } catch (error) {
        // Silently fail - no saved payment method or error loading
        console.log('No saved payment method found');
      } finally {
        setLoadingSavedPayment(false);
      }
    };

    loadSavedPaymentMethod();
  }, [isAuthenticated]);

  // Autofill when user chooses to use saved card
  useEffect(() => {
    if (useSavedCard && savedPaymentMethod && savedPaymentMethod.card_number_full) {
      // Format and set card number
      const formattedCard = formatCardNumber(savedPaymentMethod.card_number_full);
      setCardNumber(formattedCard);
      
      // Set other fields
      setCardholderName(savedPaymentMethod.cardholder_name || '');
      const month = String(savedPaymentMethod.expiry_month).padStart(2, '0');
      const year = String(savedPaymentMethod.expiry_year);
      setExpiryMonth(month);
      setExpiryYear(year);
      setBillingAddress(savedPaymentMethod.billing_address || '');
      setBillingCity(savedPaymentMethod.billing_city || '');
      setBillingState(savedPaymentMethod.billing_state || '');
      setBillingZip(savedPaymentMethod.billing_zip || '');
      
      // Check if the saved card has expired
      checkExpiry(month, year);
      
      // Note: CVV is not stored for security, user must enter it
    } else if (!useSavedCard && !showSavedCardPrompt) {
      // Clear form if user chooses not to use saved card (but only if prompt is dismissed)
      setCardNumber('');
      setCardholderName('');
      setExpiryMonth('');
      setExpiryYear('');
      setCvv('');
      setBillingAddress('');
      setBillingCity('');
      setBillingState('');
      setBillingZip('');
      setIsExpired(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useSavedCard, savedPaymentMethod]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }
    if (!cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }
    if (!expiryMonth || !expiryYear) {
      newErrors.expiry = 'Expiry date is required';
    } else {
      // Check if card has expired
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
      const expiryYearNum = parseInt(expiryYear, 10);
      const expiryMonthNum = parseInt(expiryMonth, 10);

      // Check if expiry date is in the past
      if (expiryYearNum < currentYear || 
          (expiryYearNum === currentYear && expiryMonthNum < currentMonth)) {
        newErrors.expiry = 'This card has expired. Please use a different card.';
      }
    }
    if (!cvv || cvv.length !== 3) {
      newErrors.cvv = 'CVV must be exactly 3 digits';
    }
    if (!billingAddress.trim()) {
      newErrors.billingAddress = 'Billing address is required';
    }
    if (!billingCity.trim()) {
      newErrors.billingCity = 'City is required';
    } else if (!/^[a-zA-Z\s'-]+$/.test(billingCity.trim())) {
      newErrors.billingCity = 'City must contain only letters, spaces, hyphens, and apostrophes';
    }
    if (!billingState.trim()) {
      newErrors.billingState = 'State is required';
    } else if (!/^[a-zA-Z\s'-]+$/.test(billingState.trim())) {
      newErrors.billingState = 'State must contain only letters, spaces, hyphens, and apostrophes';
    }
    if (!billingZip.trim()) {
      newErrors.billingZip = 'ZIP code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const paymentData: PaymentData = {
      cardNumber: cardNumber.replace(/\s/g, ''),
      cardholderName: cardholderName.trim(),
      expiryMonth,
      expiryYear,
      cvv,
      billingAddress: billingAddress.trim(),
      billingCity: billingCity.trim(),
      billingState: billingState.trim(),
      billingZip: billingZip.trim(),
      savePaymentMethod: isAuthenticated && savePaymentMethod && showSaveOption,
    };

    onPaymentSubmit(paymentData);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
      </CardHeader>
      <CardContent>
        {loadingSavedPayment && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
            Loading saved payment method...
          </div>
        )}
        
        {/* Saved Card Prompt */}
        {showSavedCardPrompt && savedPaymentMethod && !useSavedCard && (
          <div className="mb-4 p-4 bg-sea_green-50 border border-sea_green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-sea_green-700" />
                <div>
                  <p className="text-sm font-medium text-sea_green-900">
                    You have a credit card on file
                  </p>
                  <p className="text-xs text-sea_green-700 mt-0.5">
                    {savedPaymentMethod.card_number || '**** **** **** ****'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setUseSavedCard(true);
                    setShowSavedCardPrompt(false);
                  }}
                  className="p-2 bg-sea_green-600 hover:bg-sea_green-700 text-white rounded-lg transition-colors"
                  title="Use saved card"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUseSavedCard(false);
                    setShowSavedCardPrompt(false);
                  }}
                  className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                  title="Enter manually"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Card Number */}
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
              className={errors.cardNumber ? 'border-red-500' : ''}
            />
            {errors.cardNumber && <p className="text-sm text-red-500 mt-1">{errors.cardNumber}</p>}
          </div>

          {/* Cardholder Name */}
          <div>
            <Label htmlFor="cardholderName">Cardholder Name</Label>
            <Input
              id="cardholderName"
              type="text"
              placeholder="John Doe"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              className={errors.cardholderName ? 'border-red-500' : ''}
            />
            {errors.cardholderName && <p className="text-sm text-red-500 mt-1">{errors.cardholderName}</p>}
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="expiryMonth">Month</Label>
              <select
                id="expiryMonth"
                value={expiryMonth}
                onChange={(e) => {
                  setExpiryMonth(e.target.value);
                  checkExpiry(e.target.value, expiryYear);
                }}
                className={`w-full px-3 py-2 border rounded-md ${errors.expiry || isExpired ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              >
                <option value="">MM</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={String(month).padStart(2, '0')}>
                    {String(month).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="expiryYear">Year</Label>
              <select
                id="expiryYear"
                value={expiryYear}
                onChange={(e) => {
                  setExpiryYear(e.target.value);
                  checkExpiry(expiryMonth, e.target.value);
                }}
                className={`w-full px-3 py-2 border rounded-md ${errors.expiry || isExpired ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              >
                <option value="">YYYY</option>
                {years.map((year) => (
                  <option key={year} value={String(year)}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                type="text"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                maxLength={3}
                className={errors.cvv ? 'border-red-500' : ''}
              />
              {errors.cvv && <p className="text-sm text-red-500 mt-1">{errors.cvv}</p>}
              {cardNumber && !cvv && (
                <p className="text-xs text-gray-500 mt-1">CVV required for security</p>
              )}
            </div>
            {(errors.expiry || isExpired) && (
              <div className="col-span-3 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600 font-medium flex items-center gap-2">
                  <span>⚠️</span>
                  {errors.expiry || 'This card has expired. Please use a different card.'}
                </p>
                <p className="text-xs text-red-500 mt-1 ml-6">Please check your card's expiration date and try again.</p>
              </div>
            )}
          </div>

          {/* Billing Address */}
          <div>
            <Label htmlFor="billingAddress">Billing Address</Label>
            <Input
              id="billingAddress"
              type="text"
              placeholder="123 Main St"
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
              className={errors.billingAddress ? 'border-red-500' : ''}
            />
            {errors.billingAddress && <p className="text-sm text-red-500 mt-1">{errors.billingAddress}</p>}
          </div>

          {/* City, State, ZIP */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="billingCity">City</Label>
              <Input
                id="billingCity"
                type="text"
                placeholder="Springfield"
                value={billingCity}
                onChange={(e) => {
                  // Only allow letters, spaces, hyphens, and apostrophes
                  const value = e.target.value.replace(/[^a-zA-Z\s'-]/g, '');
                  setBillingCity(value);
                  // Clear error when user starts typing valid characters
                  if (errors.billingCity && /^[a-zA-Z\s'-]*$/.test(value)) {
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.billingCity;
                      return newErrors;
                    });
                  }
                }}
                className={errors.billingCity ? 'border-red-500' : ''}
              />
              {errors.billingCity && <p className="text-sm text-red-500 mt-1">{errors.billingCity}</p>}
            </div>
            <div>
              <Label htmlFor="billingState">State</Label>
              <Input
                id="billingState"
                type="text"
                placeholder="IL"
                value={billingState}
                onChange={(e) => {
                  // Only allow letters, spaces, hyphens, and apostrophes
                  const value = e.target.value.replace(/[^a-zA-Z\s'-]/g, '');
                  setBillingState(value);
                  // Clear error when user starts typing valid characters
                  if (errors.billingState && /^[a-zA-Z\s'-]*$/.test(value)) {
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.billingState;
                      return newErrors;
                    });
                  }
                }}
                className={errors.billingState ? 'border-red-500' : ''}
              />
              {errors.billingState && <p className="text-sm text-red-500 mt-1">{errors.billingState}</p>}
            </div>
            <div>
              <Label htmlFor="billingZip">ZIP Code</Label>
              <Input
                id="billingZip"
                type="text"
                placeholder="62701"
                value={billingZip}
                onChange={(e) => setBillingZip(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className={errors.billingZip ? 'border-red-500' : ''}
              />
              {errors.billingZip && <p className="text-sm text-red-500 mt-1">{errors.billingZip}</p>}
            </div>
          </div>

          {/* Save Payment Method (only if logged in) */}
          {isAuthenticated && showSaveOption && (
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="savePaymentMethod"
                checked={savePaymentMethod}
                onChange={(e) => setSavePaymentMethod(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-sea_green-600 focus:ring-sea_green-500"
              />
              <Label htmlFor="savePaymentMethod" className="text-sm text-gray-700 cursor-pointer">
                Save payment method to my account for faster checkout
              </Label>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-sea_green-600 hover:bg-sea_green-700 text-white"
          >
            {isLoading ? 'Processing...' : 'Complete Payment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

