"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { customerService } from '@/services/customer.service';
import { Customer } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search, Edit, Trash2, UserCircle, RotateCcw } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { CustomerForm } from '@/components/admin/CustomerForm';
import { EntityDetailModal } from '@/components/ui/EntityDetailModal';
import { ShowDeletedToggle } from '@/components/admin/ShowDeletedToggle';
import { RestoreConfirmationModal } from '@/components/admin/RestoreConfirmationModal';

export default function CustomersPage() {
  const { isAuthenticated, loading: authLoading, hasRole } = useAuth();
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailCustomer, setDetailCustomer] = useState<Customer | null>(null);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [customerToRestore, setCustomerToRestore] = useState<Customer | null>(null);
  const isManager = hasRole('manager');

  useEffect(() => {
    if (isAuthenticated) {
      loadCustomers();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      loadCustomers();
    }
  }, [showDeleted]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getAll(showDeleted);
      setCustomers(data);
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedCustomer(null);
    setIsModalOpen(true);
  };

  const handleEdit = (customer: Customer, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleRowClick = (customer: Customer) => {
    setDetailCustomer(customer);
    setIsDetailModalOpen(true);
  };

  const handleRestoreClick = (customer: Customer, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomerToRestore(customer);
    setIsRestoreModalOpen(true);
  };

  const handleRestore = async () => {
    if (!customerToRestore?.customer_id) return;

    try {
      await customerService.restore(customerToRestore.customer_id);
      await loadCustomers();
      setIsRestoreModalOpen(false);
      setCustomerToRestore(null);
    } catch (error) {
      console.error('Failed to restore customer:', error);
    }
  };

  const handleDeleteClick = (customer: Customer, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  const isDeleted = (customer: Customer) => customer.deleted_at !== null && customer.deleted_at !== undefined;

  const handleDelete = async () => {
    if (!customerToDelete?.customer_id) return;

    try {
      await customerService.delete(customerToDelete.customer_id);
      await loadCustomers();
      setIsDeleteModalOpen(false);
      setCustomerToDelete(null);
    } catch (error) {
      console.error('Failed to delete customer:', error);
    }
  };

  const handleFormSuccess = async () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
    await loadCustomers();
  };

  const filteredCustomers = customers
    .filter(customer => customer) // Add this line to filter out null or undefined customers
    .filter(customer =>
    customer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAnnualPassBadge = (annualPass?: string): "default" | "success" => {
    return annualPass === 'yes' ? 'success' : 'default';
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark_spring_green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <UserCircle className="h-8 w-8 text-sea_green-600" />
            Customers Management
          </h1>
          <p className="text-gray-600 mt-1">Manage customer records and memberships</p>
        </div>
        <Button onClick={handleAdd} variant="secondary" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {isManager && (
          <ShowDeletedToggle
            checked={showDeleted}
            onChange={setShowDeleted}
          />
        )}

        <Badge variant="outline" className="text-sm">
          {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Annual Pass</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow
                key={customer.customer_id}
                onClick={() => handleRowClick(customer)}
                className={`cursor-pointer hover:bg-gray-50 ${isDeleted(customer) ? 'opacity-60 bg-red-50' : ''}`}
              >
                <TableCell className="font-medium">
                  {customer.first_name} {customer.last_name}
                </TableCell>
                <TableCell>{customer.email || 'N/A'}</TableCell>
                <TableCell>{customer.phone || 'N/A'}</TableCell>
                <TableCell>
                  {isDeleted(customer) ? (
                    <Badge variant="danger">Deleted</Badge>
                  ) : (
                    <Badge variant={getAnnualPassBadge(customer.annual_pass)} className="capitalize">
                      {customer.annual_pass === 'yes' ? 'Yes' : 'No'}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {customer.registration_date || 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {!isDeleted(customer) ? (
                      <>
                        <Button variant="ghost" size="sm" onClick={(e) => handleEdit(customer, e)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDeleteClick(customer, e)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      isManager && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleRestoreClick(customer, e)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <UserCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No customers found</p>
          </div>
        )}
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCustomer ? 'Edit Customer' : 'Add New Customer'}
        description={selectedCustomer ? `Update information for ${selectedCustomer.first_name} ${selectedCustomer.last_name}` : 'Add a new customer'}
        size="xl"
      >
        <CustomerForm customer={selectedCustomer} onSuccess={handleFormSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Customer"
        description="Are you sure you want to delete this customer? This action cannot be undone."
      >
        <div className="space-y-4">
          {customerToDelete && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-gray-900">
                <span className="font-semibold">{customerToDelete.first_name} {customerToDelete.last_name}</span>
                {customerToDelete.email && ` (${customerToDelete.email})`}
              </p>
            </div>
          )}
          <div className="flex items-center gap-3 justify-end">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <EntityDetailModal
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Customer Details"
        entity={detailCustomer}
        sections={[
          {
            title: 'Basic Information',
            fields: [
              { label: 'First Name', key: 'first_name' },
              { label: 'Last Name', key: 'last_name' },
              { label: 'Email', key: 'email' },
              { label: 'Phone', key: 'phone' },
              { label: 'Registration Date', key: 'registration_date', type: 'date' as const },
            ],
          },
          {
            title: 'Address',
            fields: [
              { label: 'Street Address', key: 'address' },
              { label: 'City', key: 'city' },
              { label: 'State', key: 'state' },
              { label: 'Zip Code', key: 'zip_code' },
            ],
          },
          {
            title: 'Membership',
            fields: [
              { label: 'Annual Pass', key: 'annual_pass', type: 'enum' as const },
              { label: 'Membership Start', key: 'membership_start_date', type: 'date' as const },
              { label: 'Membership End', key: 'membership_end_date', type: 'date' as const },
            ],
          },
        ]}
        onEdit={detailCustomer && !isDeleted(detailCustomer) ? () => {
          setIsDetailModalOpen(false);
          setSelectedCustomer(detailCustomer);
          setIsModalOpen(true);
        } : undefined}
        canEdit={detailCustomer ? !isDeleted(detailCustomer) : false}
      />

      {/* Restore Confirmation Modal */}
      <RestoreConfirmationModal
        open={isRestoreModalOpen}
        onClose={() => setIsRestoreModalOpen(false)}
        onConfirm={handleRestore}
        itemName={customerToRestore ? `${customerToRestore.first_name} ${customerToRestore.last_name}` : ''}
        itemType="customer"
      />
    </div>
  );
}
