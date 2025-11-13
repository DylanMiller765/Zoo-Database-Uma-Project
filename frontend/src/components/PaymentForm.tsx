'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
    }
    if (!cvv || cvv.length < 3) {
      newErrors.cvv = 'CVV is required';
    }
    if (!billingAddress.trim()) {
      newErrors.billingAddress = 'Billing address is required';
    }
    if (!billingCity.trim()) {
      newErrors.billingCity = 'City is required';
    }
    if (!billingState.trim()) {
      newErrors.billingState = 'State is required';
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

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
      </CardHeader>
      <CardContent>
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
                onChange={(e) => setExpiryMonth(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${errors.expiry ? 'border-red-500' : 'border-gray-300'}`}
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
                onChange={(e) => setExpiryYear(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${errors.expiry ? 'border-red-500' : 'border-gray-300'}`}
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
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                maxLength={4}
                className={errors.cvv ? 'border-red-500' : ''}
              />
              {errors.cvv && <p className="text-sm text-red-500 mt-1">{errors.cvv}</p>}
            </div>
            {errors.expiry && <p className="text-sm text-red-500 col-span-3">{errors.expiry}</p>}
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
                onChange={(e) => setBillingCity(e.target.value)}
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
                onChange={(e) => setBillingState(e.target.value)}
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

