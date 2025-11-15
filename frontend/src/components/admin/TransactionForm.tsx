"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { donationService } from '@/services/donation.service';
import { ticketService } from '@/services/ticket.service';
import { eventRegistrationService } from '@/services/eventRegistration.service';
import { cafeSaleService } from '@/services/cafeSale.service';
import { giftShopSaleService } from '@/services/giftShopSale.service';
import { customerService } from '@/services/customer.service';
import { eventService } from '@/services/event.service';
import { cafeItemService } from '@/services/cafeItem.service';
import { giftShopItemService } from '@/services/giftShopItem.service';
import { useAuth } from '@/context/AuthContext';

interface TransactionFormProps {
  initialType: string | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function TransactionForm({ initialType, onSuccess, onCancel }: TransactionFormProps) {
  const { user } = useAuth();
  const [transactionType, setTransactionType] = useState(initialType || 'Ticket');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Common fields
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');

  // Ticket fields
  const [visitDate, setVisitDate] = useState('');
  const [ticketType, setTicketType] = useState<'adult' | 'child' | 'senior' | 'student'>('adult');
  const [ticketPrice, setTicketPrice] = useState('45.00');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit' | 'debit' | 'online'>('cash');

  // Event registration fields
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [numParticipants, setNumParticipants] = useState('1');
  const [eventPaymentStatus, setEventPaymentStatus] = useState<'pending' | 'paid' | 'cancelled'>('paid');

  // Gift Shop fields
  const [giftShopItems, setGiftShopItems] = useState<any[]>([]);
  const [giftShopCartItems, setGiftShopCartItems] = useState<{ itemId: number; quantity: number; price: number }[]>([]);

  // Cafe fields
  const [cafeItems, setCafeItems] = useState<any[]>([]);
  const [cafeCartItems, setCafeCartItems] = useState<{ itemId: number; quantity: number; price: number }[]>([]);

  // Donation fields
  const [donationAmount, setDonationAmount] = useState('');
  const [donationMessage, setDonationMessage] = useState('');

  useEffect(() => {
    loadCustomers();
    loadEvents();
    loadCafeItems();
    loadGiftShopItems();
  }, []);

  useEffect(() => {
    // Update ticket price when ticket type changes
    const prices = {
      adult: '45.00',
      child: '30.00',
      senior: '35.00',
      student: '38.00',
    };
    setTicketPrice(prices[ticketType]);
  }, [ticketType]);

  const loadCustomers = async () => {
    try {
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (err) {
      console.error('Failed to load customers:', err);
    }
  };

  const loadEvents = async () => {
    try {
      const data = await eventService.getAll();
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events:', err);
    }
  };

  const loadCafeItems = async () => {
    try {
      const data = await cafeItemService.getAll();
      setCafeItems(data.filter((item: any) => item.is_available));
    } catch (err) {
      console.error('Failed to load cafe items:', err);
    }
  };

  const loadGiftShopItems = async () => {
    try {
      const data = await giftShopItemService.getAll();
      setGiftShopItems(data.filter((item: any) => item.quantity_in_stock > 0));
    } catch (err) {
      console.error('Failed to load gift shop items:', err);
    }
  };

  const addGiftShopItem = (itemId: number, price: number) => {
    const existing = giftShopCartItems.find(i => i.itemId === itemId);
    if (existing) {
      setGiftShopCartItems(giftShopCartItems.map(i =>
        i.itemId === itemId ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setGiftShopCartItems([...giftShopCartItems, { itemId, quantity: 1, price }]);
    }
  };

  const removeGiftShopItem = (itemId: number) => {
    setGiftShopCartItems(giftShopCartItems.filter(i => i.itemId !== itemId));
  };

  const addCafeItem = (itemId: number, price: number) => {
    const existing = cafeCartItems.find(i => i.itemId === itemId);
    if (existing) {
      setCafeCartItems(cafeCartItems.map(i =>
        i.itemId === itemId ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setCafeCartItems([...cafeCartItems, { itemId, quantity: 1, price }]);
    }
  };

  const removeCafeItem = (itemId: number) => {
    setCafeCartItems(cafeCartItems.filter(i => i.itemId !== itemId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const customerId = selectedCustomerId ? parseInt(selectedCustomerId) : undefined;

      switch (transactionType) {
        case 'Ticket':
          if (!visitDate) {
            setError('Visit date is required');
            return;
          }
          await ticketService.create({
            customer_id: customerId,
            visit_date: visitDate,
            ticket_type: ticketType,
            price: parseFloat(ticketPrice),
            payment_method: paymentMethod,
          });
          break;

        case 'Event':
          if (!selectedEventId) {
            setError('Event is required');
            return;
          }
          const selectedEvent = events.find(e => e.event_id === parseInt(selectedEventId));
          await eventRegistrationService.create({
            event_id: parseInt(selectedEventId),
            customer_id: customerId,
            number_of_participants: parseInt(numParticipants),
            total_amount: selectedEvent ? selectedEvent.ticket_price * parseInt(numParticipants) : 0,
            payment_status: eventPaymentStatus,
          });
          break;

        case 'Gift Shop':
          if (giftShopCartItems.length === 0) {
            setError('Please add at least one item');
            return;
          }
          const giftShopTotal = giftShopCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          await giftShopSaleService.create({
            gift_shop_id: 1, // Default gift shop
            customer_id: customerId,
            employee_id: user?.employee_id || 0,
            total_amount: giftShopTotal,
            payment_method: paymentMethod as 'cash' | 'credit' | 'debit',
            items: giftShopCartItems.map(item => ({
              item_id: item.itemId,
              quantity: item.quantity,
              unit_price: item.price,
            })),
          });
          break;

        case 'Cafe':
          if (cafeCartItems.length === 0) {
            setError('Please add at least one item');
            return;
          }
          await cafeSaleService.create({
            cafe_id: 1, // Default cafe
            customer_id: customerId,
            employee_id: user?.employee_id || 0,
            items: cafeCartItems.map(item => ({
              item_id: item.itemId,
              quantity: item.quantity,
              line_total: item.price * item.quantity,
            })),
          });
          break;

        case 'Donation':
          if (!donationAmount || parseFloat(donationAmount) <= 0) {
            setError('Donation amount must be greater than 0');
            return;
          }
          if (!customerId) {
            setError('Customer is required for donations');
            return;
          }
          await donationService.createDonationAdmin({
            customer_id: customerId,
            amount: parseFloat(donationAmount),
            message: donationMessage || undefined,
          });
          break;
      }

      onSuccess();
    } catch (err: any) {
      console.error('Failed to create transaction:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create transaction');
    } finally {
      setLoading(false);
    }
  };

  const renderFormFields = () => {
    switch (transactionType) {
      case 'Ticket':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Customer (Optional)</label>
              <Select value={selectedCustomerId} onChange={(e) => setSelectedCustomerId(e.target.value)}>
                <option value="">Walk-in Customer</option>
                {customers.map(c => (
                  <option key={c.customer_id} value={c.customer_id}>
                    {c.first_name} {c.last_name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Visit Date *</label>
              <Input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Ticket Type *</label>
              <Select value={ticketType} onChange={(e) => setTicketType(e.target.value as any)}>
                <option value="adult">Adult - $45.00</option>
                <option value="child">Child - $30.00</option>
                <option value="senior">Senior - $35.00</option>
                <option value="student">Student - $38.00</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <Input
                type="number"
                step="0.01"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Payment Method *</label>
              <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as any)}>
                <option value="cash">Cash</option>
                <option value="credit">Credit Card</option>
                <option value="debit">Debit Card</option>
                <option value="online">Online</option>
              </Select>
            </div>
          </div>
        );

      case 'Event':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Event *</label>
              <Select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)} required>
                <option value="">Select an event...</option>
                {events.map(event => (
                  <option key={event.event_id} value={event.event_id}>
                    {event.name} - ${event.ticket_price}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Customer (Optional)</label>
              <Select value={selectedCustomerId} onChange={(e) => setSelectedCustomerId(e.target.value)}>
                <option value="">Walk-in Customer</option>
                {customers.map(c => (
                  <option key={c.customer_id} value={c.customer_id}>
                    {c.first_name} {c.last_name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Number of Participants *</label>
              <Input
                type="number"
                min="1"
                value={numParticipants}
                onChange={(e) => setNumParticipants(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Payment Status *</label>
              <Select value={eventPaymentStatus} onChange={(e) => setEventPaymentStatus(e.target.value as any)}>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </Select>
            </div>

            {selectedEventId && (
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm font-medium">Total: ${(events.find(e => e.event_id === parseInt(selectedEventId))?.ticket_price || 0) * parseInt(numParticipants || '1')}</p>
              </div>
            )}
          </div>
        );

      case 'Gift Shop':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Customer (Optional)</label>
              <Select value={selectedCustomerId} onChange={(e) => setSelectedCustomerId(e.target.value)}>
                <option value="">Walk-in Customer</option>
                {customers.map(c => (
                  <option key={c.customer_id} value={c.customer_id}>
                    {c.first_name} {c.last_name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Payment Method *</label>
              <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as any)}>
                <option value="cash">Cash</option>
                <option value="credit">Credit Card</option>
                <option value="debit">Debit Card</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Add Items</label>
              <div className="border rounded p-2 max-h-40 overflow-y-auto space-y-1">
                {giftShopItems.map(item => (
                  <div key={item.item_id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                    <span className="text-sm">{item.name} - ${item.price}</span>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => addGiftShopItem(item.item_id, item.price)}
                    >
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {giftShopCartItems.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">Cart</label>
                <div className="border rounded p-2 space-y-2">
                  {giftShopCartItems.map(item => {
                    const shopItem = giftShopItems.find(i => i.item_id === item.itemId);
                    return (
                      <div key={item.itemId} className="flex justify-between items-center">
                        <span className="text-sm">
                          {shopItem?.name} x{item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeGiftShopItem(item.itemId)}
                        >
                          Remove
                        </Button>
                      </div>
                    );
                  })}
                  <div className="pt-2 border-t font-semibold">
                    Total: ${giftShopCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'Cafe':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Customer (Optional)</label>
              <Select value={selectedCustomerId} onChange={(e) => setSelectedCustomerId(e.target.value)}>
                <option value="">Walk-in Customer</option>
                {customers.map(c => (
                  <option key={c.customer_id} value={c.customer_id}>
                    {c.first_name} {c.last_name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Add Items</label>
              <div className="border rounded p-2 max-h-40 overflow-y-auto space-y-1">
                {cafeItems.map(item => (
                  <div key={item.item_id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                    <span className="text-sm">{item.name} - ${item.price}</span>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => addCafeItem(item.item_id, item.price)}
                    >
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {cafeCartItems.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">Cart</label>
                <div className="border rounded p-2 space-y-2">
                  {cafeCartItems.map(item => {
                    const cafeItem = cafeItems.find(i => i.item_id === item.itemId);
                    return (
                      <div key={item.itemId} className="flex justify-between items-center">
                        <span className="text-sm">
                          {cafeItem?.name} x{item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeCafeItem(item.itemId)}
                        >
                          Remove
                        </Button>
                      </div>
                    );
                  })}
                  <div className="pt-2 border-t font-semibold">
                    Total: ${cafeCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'Donation':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Customer *</label>
              <Select value={selectedCustomerId} onChange={(e) => setSelectedCustomerId(e.target.value)} required>
                <option value="">Select a customer...</option>
                {customers.map(c => (
                  <option key={c.customer_id} value={c.customer_id}>
                    {c.first_name} {c.last_name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Amount *</label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message (Optional)</label>
              <Textarea
                value={donationMessage}
                onChange={(e) => setDonationMessage(e.target.value)}
                placeholder="Add a message..."
                rows={3}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Transaction Type</label>
        <Select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
          <option value="Ticket">Ticket</option>
          <option value="Event">Event</option>
          <option value="Gift Shop">Gift Shop</option>
          <option value="Cafe">Cafe</option>
          <option value="Donation">Donation</option>
        </Select>
      </div>

      {renderFormFields()}

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Transaction'}
        </Button>
      </div>
    </form>
  );
}
