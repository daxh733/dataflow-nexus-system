
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { EntityManager } from "@/components/EntityManager";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Customer {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  order_count: number;
  created_at?: string;
}

const Customers = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
    status: "Active",
    order_count: 0
  });

  const columns = [
    { key: "name", label: "Company Name" },
    { key: "contact", label: "Contact Person" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "status", label: "Status" },
  ];

  // Fetch customers
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching customers:', error);
        toast({
          title: "Error fetching customers",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      
      return data as Customer[];
    },
  });

  // Add customer mutation
  const addCustomerMutation = useMutation({
    mutationFn: async (newCustomer: Omit<Customer, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('customers')
        .insert(newCustomer)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setIsAddDialogOpen(false);
      toast({
        title: "Customer Added",
        description: `${formData.name} has been added successfully.`,
      });
    },
    onError: (error: any) => {
      console.error('Error adding customer:', error);
      toast({
        title: "Error adding customer",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update customer mutation
  const updateCustomerMutation = useMutation({
    mutationFn: async (customer: Partial<Customer>) => {
      const { data, error } = await supabase
        .from('customers')
        .update(customer)
        .eq('id', currentCustomer?.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setIsEditDialogOpen(false);
      toast({
        title: "Customer Updated",
        description: `${formData.name} has been updated successfully.`,
      });
    },
    onError: (error: any) => {
      console.error('Error updating customer:', error);
      toast({
        title: "Error updating customer",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete customer mutation
  const deleteCustomerMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setIsDeleteDialogOpen(false);
      toast({
        title: "Customer Deleted",
        description: `${currentCustomer?.name} has been deleted successfully.`,
        variant: "destructive",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting customer:', error);
      toast({
        title: "Error deleting customer",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Set up real-time listener
  useEffect(() => {
    const channel = supabase
      .channel('customers-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'customers' }, 
        (payload) => {
          console.log('Real-time update:', payload);
          queryClient.invalidateQueries({ queryKey: ['customers'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleAddNew = () => {
    setFormData({
      name: "",
      contact: "",
      email: "",
      phone: "",
      address: "",
      status: "Active",
      order_count: 0
    });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setCurrentCustomer(customer);
    setFormData({
      name: customer.name,
      contact: customer.contact,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      status: customer.status,
      order_count: customer.order_count
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (customer: Customer) => {
    setCurrentCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, status: e.target.value }));
  };

  const handleAddSubmit = () => {
    addCustomerMutation.mutate(formData);
  };

  const handleEditSubmit = () => {
    if (!currentCustomer) return;
    updateCustomerMutation.mutate(formData);
  };

  const handleDeleteSubmit = () => {
    if (!currentCustomer) return;
    deleteCustomerMutation.mutate(currentCustomer.id);
  };

  const renderActions = (customer: Customer) => (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleEdit(customer)}
      >
        <Pencil className="h-4 w-4 mr-1" /> Edit
      </Button>
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={() => handleDelete(customer)}
      >
        <Trash className="h-4 w-4 mr-1" /> Delete
      </Button>
    </div>
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <EntityManager
          title="Customers"
          subtitle="Manage your customer relationships"
          columns={columns}
          data={customers}
          onAdd={handleAddNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
          renderActions={renderActions}
          isLoading={isLoading}
        />

        {/* Add Customer Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>
                Create a new customer in the system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Company Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact" className="text-right">
                  Contact Person
                </Label>
                <Input
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleStatusChange}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSubmit}>Save Customer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Customer Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Edit Customer</DialogTitle>
              <DialogDescription>
                Update the customer details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Company Name
                </Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-contact" className="text-right">
                  Contact Person
                </Label>
                <Input
                  id="edit-contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="edit-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-address" className="text-right">
                  Address
                </Label>
                <Input
                  id="edit-address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Status
                </Label>
                <select
                  id="edit-status"
                  name="status"
                  value={formData.status}
                  onChange={handleStatusChange}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditSubmit}>Update Customer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the customer "{currentCustomer?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteSubmit}>
                Delete Customer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Customers;
