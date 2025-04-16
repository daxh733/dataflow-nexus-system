
import { useEffect, useState } from "react";
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

type RawMaterial = {
  id: number;
  name: string;
  code: string;
  category: string;
  supplier: string;
  stockQuantity: number;
  stock_quantity: number;
  unitCost: string;
  unit_cost: string;
  description: string;
  created_at?: string;
};

const RawMaterials = () => {
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<RawMaterial | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    category: "",
    supplier: "",
    stockQuantity: "",
    unitCost: "",
    description: "",
  });

  const columns = [
    { key: "name", label: "Material Name" },
    { key: "code", label: "Code" },
    { key: "category", label: "Category" },
    { key: "supplier", label: "Supplier" },
    { key: "stockQuantity", label: "Stock Qty" },
    { key: "unitCost", label: "Unit Cost" },
  ];

  // Fetch raw materials from Supabase
  const fetchMaterials = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('raw_materials')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        throw error;
      }

      if (data) {
        // Convert snake_case database fields to camelCase for the component
        const formattedMaterials = data.map(mat => ({
          id: mat.id,
          name: mat.name,
          code: mat.code,
          category: mat.category,
          supplier: mat.supplier,
          stockQuantity: mat.stock_quantity,
          stock_quantity: mat.stock_quantity,
          unitCost: mat.unit_cost,
          unit_cost: mat.unit_cost,
          description: mat.description,
          created_at: mat.created_at
        }));
        setMaterials(formattedMaterials);
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
      toast({
        title: "Error",
        description: "Failed to fetch raw materials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('materials-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'raw_materials' }, () => {
        fetchMaterials();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAddNew = () => {
    setFormData({
      name: "",
      code: "",
      category: "",
      supplier: "",
      stockQuantity: "",
      unitCost: "",
      description: "",
    });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (material: RawMaterial) => {
    setCurrentMaterial(material);
    setFormData({
      name: material.name,
      code: material.code,
      category: material.category,
      supplier: material.supplier,
      stockQuantity: material.stockQuantity.toString(),
      unitCost: material.unitCost.replace("$", ""),
      description: material.description,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (material: RawMaterial) => {
    setCurrentMaterial(material);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async () => {
    try {
      const newMaterial = {
        name: formData.name,
        code: formData.code,
        category: formData.category,
        supplier: formData.supplier,
        stock_quantity: parseInt(formData.stockQuantity) || 0,
        unit_cost: `$${formData.unitCost}`,
        description: formData.description,
      };
      
      const { data, error } = await supabase
        .from('raw_materials')
        .insert([newMaterial])
        .select();

      if (error) {
        throw error;
      }

      setIsAddDialogOpen(false);
      toast({
        title: "Raw Material Added",
        description: `${formData.name} has been added successfully.`,
      });
      fetchMaterials();
    } catch (error) {
      console.error('Error adding raw material:', error);
      toast({
        title: "Error",
        description: "Failed to add raw material",
        variant: "destructive",
      });
    }
  };

  const handleEditSubmit = async () => {
    if (!currentMaterial) return;
    
    try {
      const updatedMaterial = {
        name: formData.name,
        code: formData.code,
        category: formData.category,
        supplier: formData.supplier,
        stock_quantity: parseInt(formData.stockQuantity) || 0,
        unit_cost: `$${formData.unitCost}`,
        description: formData.description,
      };
      
      const { error } = await supabase
        .from('raw_materials')
        .update(updatedMaterial)
        .eq('id', currentMaterial.id);

      if (error) {
        throw error;
      }

      setIsEditDialogOpen(false);
      toast({
        title: "Raw Material Updated",
        description: `${formData.name} has been updated successfully.`,
      });
      fetchMaterials();
    } catch (error) {
      console.error('Error updating raw material:', error);
      toast({
        title: "Error",
        description: "Failed to update raw material",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSubmit = async () => {
    if (!currentMaterial) return;
    
    try {
      const { error } = await supabase
        .from('raw_materials')
        .delete()
        .eq('id', currentMaterial.id);

      if (error) {
        throw error;
      }

      setIsDeleteDialogOpen(false);
      toast({
        title: "Raw Material Deleted",
        description: `${currentMaterial.name} has been deleted successfully.`,
        variant: "destructive",
      });
      fetchMaterials();
    } catch (error) {
      console.error('Error deleting raw material:', error);
      toast({
        title: "Error",
        description: "Failed to delete raw material",
        variant: "destructive",
      });
    }
  };

  const renderActions = (material: RawMaterial) => (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleEdit(material)}
      >
        <Pencil className="h-4 w-4 mr-1" /> Edit
      </Button>
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={() => handleDelete(material)}
      >
        <Trash className="h-4 w-4 mr-1" /> Delete
      </Button>
    </div>
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <EntityManager
          title="Raw Materials"
          subtitle="Manage your raw materials inventory"
          columns={columns}
          data={materials}
          onAdd={handleAddNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
          renderActions={renderActions}
          isLoading={isLoading}
        />

        {/* Add Raw Material Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Raw Material</DialogTitle>
              <DialogDescription>
                Create a new raw material in the system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
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
                <Label htmlFor="code" className="text-right">
                  Code
                </Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="supplier" className="text-right">
                  Supplier
                </Label>
                <Input
                  id="supplier"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stockQuantity" className="text-right">
                  Stock Quantity
                </Label>
                <Input
                  id="stockQuantity"
                  name="stockQuantity"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unitCost" className="text-right">
                  Unit Cost
                </Label>
                <Input
                  id="unitCost"
                  name="unitCost"
                  value={formData.unitCost}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSubmit}>Save Raw Material</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Raw Material Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Edit Raw Material</DialogTitle>
              <DialogDescription>
                Update the raw material details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
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
                <Label htmlFor="edit-code" className="text-right">
                  Code
                </Label>
                <Input
                  id="edit-code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">
                  Category
                </Label>
                <Input
                  id="edit-category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-supplier" className="text-right">
                  Supplier
                </Label>
                <Input
                  id="edit-supplier"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-stockQuantity" className="text-right">
                  Stock Quantity
                </Label>
                <Input
                  id="edit-stockQuantity"
                  name="stockQuantity"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-unitCost" className="text-right">
                  Unit Cost
                </Label>
                <Input
                  id="edit-unitCost"
                  name="unitCost"
                  value={formData.unitCost}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditSubmit}>Update Raw Material</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the raw material "{currentMaterial?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteSubmit}>
                Delete Raw Material
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default RawMaterials;
