"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface TransactionFormProps {
  initialType: string | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function TransactionForm({ initialType, onSuccess, onCancel }: TransactionFormProps) {
  const [transactionType, setTransactionType] = useState(initialType || 'Ticket');

  const renderFormFields = () => {
    switch (transactionType) {
      case 'Ticket':
        return (
          <div>
            <h3 className="text-lg font-medium mb-4">Ticket Details</h3>
            {/* Ticket fields will go here */}
            <p>Ticket form fields will be implemented here.</p>
          </div>
        );
      case 'Event':
        return (
          <div>
            <h3 className="text-lg font-medium mb-4">Event Registration Details</h3>
            {/* Event fields will go here */}
            <p>Event registration form fields will be implemented here.</p>
          </div>
        );
      case 'Gift Shop':
        return (
          <div>
            <h3 className="text-lg font-medium mb-4">Gift Shop Sale Details</h3>
            {/* Gift Shop fields will go here */}
            <p>Gift shop sale form fields will be implemented here.</p>
          </div>
        );
      case 'Cafe':
        return (
          <div>
            <h3 className="text-lg font-medium mb-4">Cafe Sale Details</h3>
            {/* Cafe fields will go here */}
            <p>Cafe sale form fields will be implemented here.</p>
          </div>
        );
      case 'Donation':
        return (
          <div>
            <h3 className="text-lg font-medium mb-4">Donation Details</h3>
            {/* Donation fields will go here */}
            <p>Donation form fields will be implemented here.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
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

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button>Save Transaction</Button>
      </div>
    </div>
  );
}
