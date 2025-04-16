
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
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Supplier {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  materials: string;
  status: string;
  created_at?: string;
}

const Suppliers = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
    materials: "",
    status: "Active",
  });

  const columns = [
    { key: "name", label: "Company Name" },
    { key: "contact", label: "Contact Person" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "materials", label: "Materials Supplied" },
    { key: "status", label: "Status" },
  ];

  // Fetch suppliers
  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching suppliers:', error);
        toast({
          title: "Error fetching suppliers",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      
      return data as Supplier[];
    },
  });

  // Add supplier mutation
  const addSupplierMutation = useMutation({
    mutationFn: async (newSupplier: Omit<Supplier, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('suppliers')
        .insert(newSupplier)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setIsAddDialogOpen(false);
      toast({
        title: "Supplier Added",
        description: `${formData.name} has been added successfully.`,
      });
    },
    onError: (error: any) => {
      console.error('Error adding supplier:', error);
      toast({
        title: "Error adding supplier",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update supplier mutation
  const updateSupplierMutation = useMutation({
    mutationFn: async (supplier: Partial<Supplier>) => {
      const { data, error } = await supabase
        .from('suppliers')
        .update(supplier)
        .eq('id', currentSupplier?.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setIsEditDialogOpen(false);
      toast({
        title: "Supplier Updated",
        description: `${formData.name} has been updated successfully.`,
      });
    },
    onError: (error: any) => {
      console.error('Error updating supplier:', error);
      toast({
        title: "Error updating supplier",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete supplier mutation
  const deleteSupplierMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setIsDeleteDialogOpen(false);
      toast({
        title: "Supplier Deleted",
        description: `${currentSupplier?.name} has been deleted successfully.`,
        variant: "destructive",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting supplier:', error);
      toast({
        title: "Error deleting supplier",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Set up real-time listener
  useEffect(() => {
    const channel = supabase
      .channel('suppliers-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'suppliers' }, 
        (payload) => {
          console.log('Real-time update:', payload);
          queryClient.invalidateQueries({ queryKey: ['suppliers'] });
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
      materials: "",
      status: "Active",
    });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setCurrentSupplier(supplier);
    setFormData({
      name: supplier.name,
      contact: supplier.contact,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      materials: supplier.materials,
      status: supplier.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (supplier: Supplier) => {
    setCurrentSupplier(supplier);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, status: e.target.value }));
  };

  const handleAddSubmit = () => {
    addSupplierMutation.mutate(formData);
  };

  const handleEditSubmit = () => {
    if (!currentSupplier) return;
    updateSupplierMutation.mutate(formData);
  };

  const handleDeleteSubmit = () => {
    if (!currentSupplier) return;
    deleteSupplierMutation.mutate(currentSupplier.id);
  };

  const renderActions = (supplier: Supplier) => (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleEdit(supplier)}
      >
        <Pencil className="h-4 w-4 mr-1" /> Edit
      </Button>
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={() => handleDelete(supplier)}
      >
        <Trash className="h-4 w-4 mr-1" /> Delete
      </Button>
    </div>
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <EntityManager
          title="Suppliers"
          subtitle="Manage your supplier relationships"
          columns={columns}
          data={suppliers}
          onAdd={handleAddNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
          renderActions={renderActions}
          isLoading={isLoading}
        />

        {/* Add Supplier Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
              <DialogDescription>
                Create a new supplier in the system.
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
                <Label htmlFor="materials" className="text-right">
                  Materials Supplied
                </Label>
                <Textarea
                  id="materials"
                  name="materials"
                  value={formData.materials}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="e.g., Steel, Copper, Plastic"
                  rows={2}
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
              <Button onClick={handleAddSubmit}>Save Supplier</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Supplier Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Edit Supplier</DialogTitle>
              <DialogDescription>
                Update the supplier details.
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
                <Label htmlFor="edit-materials" className="text-right">
                  Materials Supplied
                </Label>
                <Textarea
                  id="edit-materials"
                  name="materials"
                  value={formData.materials}
                  onChange={handleInputChange}
                  className="col-span-3"
                  rows={2}
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
              <Button onClick={handleEditSubmit}>Update Supplier</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the supplier "{currentSupplier?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteSubmit}>
                Delete Supplier
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Suppliers;
