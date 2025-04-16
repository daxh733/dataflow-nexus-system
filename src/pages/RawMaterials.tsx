
import { useState } from "react";
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

interface RawMaterial {
  id: number;
  name: string;
  code: string;
  category: string;
  supplier: string;
  stockQuantity: number;
  unitCost: string;
  description: string;
}

// Sample data
const initialMaterials: RawMaterial[] = [
  { id: 1, name: "Stainless Steel", code: "MAT-SS-001", category: "Metal", supplier: "Steel Industries Inc.", stockQuantity: 5000, unitCost: "$12.50/kg", description: "High-grade stainless steel for industrial applications" },
  { id: 2, name: "Copper Wire", code: "MAT-CW-002", category: "Electrical", supplier: "ElectroCom Suppliers", stockQuantity: 2500, unitCost: "$8.75/m", description: "Heavy-duty copper wiring for electrical systems" },
  { id: 3, name: "Nylon Polymer", code: "MAT-NP-003", category: "Polymer", supplier: "PolyTech Solutions", stockQuantity: 1800, unitCost: "$6.20/kg", description: "Durable nylon polymer for various manufacturing applications" },
  { id: 4, name: "Silicon Wafer", code: "MAT-SW-004", category: "Electronics", supplier: "TechWare Components", stockQuantity: 500, unitCost: "$45.00/unit", description: "High-purity silicon wafers for electronic components" },
  { id: 5, name: "Aluminum Sheets", code: "MAT-AS-005", category: "Metal", supplier: "MetalWorks Co.", stockQuantity: 750, unitCost: "$18.30/m²", description: "Lightweight aluminum sheets for structural components" },
];

const RawMaterials = () => {
  const [materials, setMaterials] = useState<RawMaterial[]>(initialMaterials);
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

  const handleAddSubmit = () => {
    const newMaterial: RawMaterial = {
      id: materials.length > 0 ? Math.max(...materials.map(m => m.id)) + 1 : 1,
      name: formData.name,
      code: formData.code,
      category: formData.category,
      supplier: formData.supplier,
      stockQuantity: parseInt(formData.stockQuantity) || 0,
      unitCost: `$${formData.unitCost}`,
      description: formData.description,
    };
    
    setMaterials([...materials, newMaterial]);
    setIsAddDialogOpen(false);
    toast({
      title: "Raw Material Added",
      description: `${newMaterial.name} has been added successfully.`,
    });
  };

  const handleEditSubmit = () => {
    if (!currentMaterial) return;
    
    const updatedMaterials = materials.map(mat => 
      mat.id === currentMaterial.id 
        ? { 
            ...mat, 
            name: formData.name,
            code: formData.code,
            category: formData.category,
            supplier: formData.supplier,
            stockQuantity: parseInt(formData.stockQuantity) || 0,
            unitCost: `$${formData.unitCost}`,
            description: formData.description,
          } 
        : mat
    );
    
    setMaterials(updatedMaterials);
    setIsEditDialogOpen(false);
    toast({
      title: "Raw Material Updated",
      description: `${formData.name} has been updated successfully.`,
    });
  };

  const handleDeleteSubmit = () => {
    if (!currentMaterial) return;
    
    const filteredMaterials = materials.filter(
      (mat) => mat.id !== currentMaterial.id
    );
    
    setMaterials(filteredMaterials);
    setIsDeleteDialogOpen(false);
    toast({
      title: "Raw Material Deleted",
      description: `${currentMaterial.name} has been deleted successfully.`,
      variant: "destructive",
    });
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
