
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

interface MaterialMapping {
  id: number;
  product: string;
  material: string;
  quantity: number;
  unit: string;
  cost: string;
}

// Sample data
const initialMappings: MaterialMapping[] = [
  { id: 1, product: "Industrial Valve X200", material: "Stainless Steel", quantity: 2.5, unit: "kg", cost: "$31.25" },
  { id: 2, product: "Industrial Valve X200", material: "Copper Wire", quantity: 0.5, unit: "m", cost: "$4.38" },
  { id: 3, product: "Electric Motor M500", material: "Copper Wire", quantity: 15, unit: "m", cost: "$131.25" },
  { id: 4, product: "Electric Motor M500", material: "Silicon Wafer", quantity: 2, unit: "units", cost: "$90.00" },
  { id: 5, product: "Control Panel CP100", material: "Aluminum Sheets", quantity: 1.2, unit: "m²", cost: "$21.96" },
  { id: 6, product: "Control Panel CP100", material: "Silicon Wafer", quantity: 3, unit: "units", cost: "$135.00" },
  { id: 7, product: "Hydraulic Pump HP50", material: "Stainless Steel", quantity: 1.8, unit: "kg", cost: "$22.50" },
  { id: 8, product: "Hydraulic Pump HP50", material: "Nylon Polymer", quantity: 0.75, unit: "kg", cost: "$4.65" },
  { id: 9, product: "Steel Pipe S100", material: "Stainless Steel", quantity: 10, unit: "kg", cost: "$125.00" },
];

// Sample products and materials for dropdowns
const products = [
  "Industrial Valve X200",
  "Electric Motor M500",
  "Control Panel CP100",
  "Hydraulic Pump HP50",
  "Steel Pipe S100",
];

const materials = [
  "Stainless Steel",
  "Copper Wire",
  "Nylon Polymer",
  "Silicon Wafer",
  "Aluminum Sheets",
];

const MaterialMapping = () => {
  const [mappings, setMappings] = useState<MaterialMapping[]>(initialMappings);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentMapping, setCurrentMapping] = useState<MaterialMapping | null>(null);
  const [formData, setFormData] = useState({
    product: "",
    material: "",
    quantity: "",
    unit: "",
  });

  const columns = [
    { key: "product", label: "Product" },
    { key: "material", label: "Material" },
    { key: "quantity", label: "Quantity" },
    { key: "unit", label: "Unit" },
    { key: "cost", label: "Cost" },
  ];

  const handleAddNew = () => {
    setFormData({
      product: "",
      material: "",
      quantity: "",
      unit: "",
    });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (mapping: MaterialMapping) => {
    setCurrentMapping(mapping);
    setFormData({
      product: mapping.product,
      material: mapping.material,
      quantity: mapping.quantity.toString(),
      unit: mapping.unit,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (mapping: MaterialMapping) => {
    setCurrentMapping(mapping);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Calculate the cost based on material and quantity
  const calculateCost = (material: string, quantity: number): string => {
    const unitCosts: { [key: string]: number } = {
      "Stainless Steel": 12.5, // per kg
      "Copper Wire": 8.75, // per m
      "Nylon Polymer": 6.2, // per kg
      "Silicon Wafer": 45, // per unit
      "Aluminum Sheets": 18.3, // per m²
    };

    const cost = unitCosts[material] ? unitCosts[material] * quantity : 0;
    return `$${cost.toFixed(2)}`;
  };

  const handleAddSubmit = () => {
    const quantity = parseFloat(formData.quantity) || 0;
    const cost = calculateCost(formData.material, quantity);

    const newMapping: MaterialMapping = {
      id: mappings.length > 0 ? Math.max(...mappings.map(m => m.id)) + 1 : 1,
      product: formData.product,
      material: formData.material,
      quantity: quantity,
      unit: formData.unit,
      cost: cost,
    };
    
    setMappings([...mappings, newMapping]);
    setIsAddDialogOpen(false);
    toast({
      title: "Material Mapping Added",
      description: `Mapping between ${newMapping.product} and ${newMapping.material} has been added successfully.`,
    });
  };

  const handleEditSubmit = () => {
    if (!currentMapping) return;
    
    const quantity = parseFloat(formData.quantity) || 0;
    const cost = calculateCost(formData.material, quantity);
    
    const updatedMappings = mappings.map(map => 
      map.id === currentMapping.id 
        ? { 
            ...map, 
            product: formData.product,
            material: formData.material,
            quantity: quantity,
            unit: formData.unit,
            cost: cost,
          } 
        : map
    );
    
    setMappings(updatedMappings);
    setIsEditDialogOpen(false);
    toast({
      title: "Material Mapping Updated",
      description: `Mapping between ${formData.product} and ${formData.material} has been updated successfully.`,
    });
  };

  const handleDeleteSubmit = () => {
    if (!currentMapping) return;
    
    const filteredMappings = mappings.filter(
      (map) => map.id !== currentMapping.id
    );
    
    setMappings(filteredMappings);
    setIsDeleteDialogOpen(false);
    toast({
      title: "Material Mapping Deleted",
      description: `Mapping between ${currentMapping.product} and ${currentMapping.material} has been deleted successfully.`,
      variant: "destructive",
    });
  };

  const renderActions = (mapping: MaterialMapping) => (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleEdit(mapping)}
      >
        <Pencil className="h-4 w-4 mr-1" /> Edit
      </Button>
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={() => handleDelete(mapping)}
      >
        <Trash className="h-4 w-4 mr-1" /> Delete
      </Button>
    </div>
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <EntityManager
          title="Material Mappings"
          subtitle="Manage product-material relationships"
          columns={columns}
          data={mappings}
          onAdd={handleAddNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
          renderActions={renderActions}
        />

        {/* Add Material Mapping Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Material Mapping</DialogTitle>
              <DialogDescription>
                Create a new product-material relationship.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="product" className="text-right">
                  Product
                </Label>
                <select
                  id="product"
                  name="product"
                  value={formData.product}
                  onChange={handleInputChange}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product} value={product}>
                      {product}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="material" className="text-right">
                  Material
                </Label>
                <select
                  id="material"
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select a material</option>
                  {materials.map((material) => (
                    <option key={material} value={material}>
                      {material}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  step="0.01"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unit" className="text-right">
                  Unit
                </Label>
                <select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select a unit</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="m">Meters (m)</option>
                  <option value="m²">Square Meters (m²)</option>
                  <option value="units">Units</option>
                  <option value="pcs">Pieces</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSubmit}>Save Mapping</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Material Mapping Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Edit Material Mapping</DialogTitle>
              <DialogDescription>
                Update the product-material relationship.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-product" className="text-right">
                  Product
                </Label>
                <select
                  id="edit-product"
                  name="product"
                  value={formData.product}
                  onChange={handleInputChange}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {products.map((product) => (
                    <option key={product} value={product}>
                      {product}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-material" className="text-right">
                  Material
                </Label>
                <select
                  id="edit-material"
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {materials.map((material) => (
                    <option key={material} value={material}>
                      {material}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-quantity" className="text-right">
                  Quantity
                </Label>
                <Input
                  id="edit-quantity"
                  name="quantity"
                  type="number"
                  step="0.01"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-unit" className="text-right">
                  Unit
                </Label>
                <select
                  id="edit-unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="m">Meters (m)</option>
                  <option value="m²">Square Meters (m²)</option>
                  <option value="units">Units</option>
                  <option value="pcs">Pieces</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditSubmit}>Update Mapping</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the mapping between "{currentMapping?.product}" and "{currentMapping?.material}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteSubmit}>
                Delete Mapping
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default MaterialMapping;
