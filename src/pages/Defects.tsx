
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

interface Defect {
  id: number;
  product: string;
  category: string;
  description: string;
  reportedBy: string;
  reportDate: string;
  status: string;
  severity: string;
}

// Sample data
const initialDefects: Defect[] = [
  { id: 1, product: "Industrial Valve X200", category: "Manufacturing Defect", description: "Valve leaking at high pressure", reportedBy: "John Smith", reportDate: "2023-05-10", status: "Open", severity: "High" },
  { id: 2, product: "Electric Motor M500", category: "Design Defect", description: "Motor overheating after 2 hours of operation", reportedBy: "Sarah Johnson", reportDate: "2023-06-15", status: "In Progress", severity: "Critical" },
  { id: 3, product: "Control Panel CP100", category: "Electrical Fault", description: "Touchscreen unresponsive in certain areas", reportedBy: "Michael Brown", reportDate: "2023-07-20", status: "Resolved", severity: "Medium" },
  { id: 4, product: "Hydraulic Pump HP50", category: "Performance Issue", description: "Pressure inconsistent during operation", reportedBy: "Robert Davis", reportDate: "2023-08-05", status: "Open", severity: "High" },
  { id: 5, product: "Steel Pipe S100", category: "Material Defect", description: "Pipe showing signs of premature corrosion", reportedBy: "Jane Doe", reportDate: "2023-09-12", status: "In Progress", severity: "Medium" },
];

const Defects = () => {
  const [defects, setDefects] = useState<Defect[]>(initialDefects);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentDefect, setCurrentDefect] = useState<Defect | null>(null);
  const [formData, setFormData] = useState({
    product: "",
    category: "",
    description: "",
    reportedBy: "",
    reportDate: new Date().toISOString().split('T')[0],
    status: "Open",
    severity: "Medium",
  });

  const columns = [
    { key: "product", label: "Product" },
    { key: "category", label: "Category" },
    { key: "reportedBy", label: "Reported By" },
    { key: "reportDate", label: "Report Date" },
    { key: "status", label: "Status" },
    { key: "severity", label: "Severity" },
  ];

  const handleAddNew = () => {
    setFormData({
      product: "",
      category: "",
      description: "",
      reportedBy: "",
      reportDate: new Date().toISOString().split('T')[0],
      status: "Open",
      severity: "Medium",
    });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (defect: Defect) => {
    setCurrentDefect(defect);
    setFormData({
      product: defect.product,
      category: defect.category,
      description: defect.description,
      reportedBy: defect.reportedBy,
      reportDate: defect.reportDate,
      status: defect.status,
      severity: defect.severity,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (defect: Defect) => {
    setCurrentDefect(defect);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = () => {
    const newDefect: Defect = {
      id: defects.length > 0 ? Math.max(...defects.map(d => d.id)) + 1 : 1,
      product: formData.product,
      category: formData.category,
      description: formData.description,
      reportedBy: formData.reportedBy,
      reportDate: formData.reportDate,
      status: formData.status,
      severity: formData.severity,
    };
    
    setDefects([...defects, newDefect]);
    setIsAddDialogOpen(false);
    toast({
      title: "Defect Reported",
      description: `Defect for ${newDefect.product} has been reported successfully.`,
    });
  };

  const handleEditSubmit = () => {
    if (!currentDefect) return;
    
    const updatedDefects = defects.map(def => 
      def.id === currentDefect.id 
        ? { 
            ...def, 
            product: formData.product,
            category: formData.category,
            description: formData.description,
            reportedBy: formData.reportedBy,
            reportDate: formData.reportDate,
            status: formData.status,
            severity: formData.severity,
          } 
        : def
    );
    
    setDefects(updatedDefects);
    setIsEditDialogOpen(false);
    toast({
      title: "Defect Updated",
      description: `Defect for ${formData.product} has been updated successfully.`,
    });
  };

  const handleDeleteSubmit = () => {
    if (!currentDefect) return;
    
    const filteredDefects = defects.filter(
      (def) => def.id !== currentDefect.id
    );
    
    setDefects(filteredDefects);
    setIsDeleteDialogOpen(false);
    toast({
      title: "Defect Deleted",
      description: `Defect for ${currentDefect.product} has been deleted successfully.`,
      variant: "destructive",
    });
  };

  const renderActions = (defect: Defect) => (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleEdit(defect)}
      >
        <Pencil className="h-4 w-4 mr-1" /> Edit
      </Button>
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={() => handleDelete(defect)}
      >
        <Trash className="h-4 w-4 mr-1" /> Delete
      </Button>
    </div>
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <EntityManager
          title="Defects"
          subtitle="Track and manage product defects"
          columns={columns}
          data={defects}
          onAdd={handleAddNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
          renderActions={renderActions}
        />

        {/* Add Defect Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Report New Defect</DialogTitle>
              <DialogDescription>
                Report a new product defect in the system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="product" className="text-right">
                  Product
                </Label>
                <Input
                  id="product"
                  name="product"
                  value={formData.product}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select a category</option>
                  <option value="Manufacturing Defect">Manufacturing Defect</option>
                  <option value="Design Defect">Design Defect</option>
                  <option value="Material Defect">Material Defect</option>
                  <option value="Electrical Fault">Electrical Fault</option>
                  <option value="Performance Issue">Performance Issue</option>
                  <option value="Other">Other</option>
                </select>
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reportedBy" className="text-right">
                  Reported By
                </Label>
                <Input
                  id="reportedBy"
                  name="reportedBy"
                  value={formData.reportedBy}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reportDate" className="text-right">
                  Report Date
                </Label>
                <Input
                  id="reportDate"
                  name="reportDate"
                  type="date"
                  value={formData.reportDate}
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
                  onChange={handleInputChange}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="severity" className="text-right">
                  Severity
                </Label>
                <select
                  id="severity"
                  name="severity"
                  value={formData.severity}
                  onChange={handleInputChange}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSubmit}>Report Defect</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Defect Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Edit Defect</DialogTitle>
              <DialogDescription>
                Update the defect details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-product" className="text-right">
                  Product
                </Label>
                <Input
                  id="edit-product"
                  name="product"
                  value={formData.product}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">
                  Category
                </Label>
                <select
                  id="edit-category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Manufacturing Defect">Manufacturing Defect</option>
                  <option value="Design Defect">Design Defect</option>
                  <option value="Material Defect">Material Defect</option>
                  <option value="Electrical Fault">Electrical Fault</option>
                  <option value="Performance Issue">Performance Issue</option>
                  <option value="Other">Other</option>
                </select>
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-reportedBy" className="text-right">
                  Reported By
                </Label>
                <Input
                  id="edit-reportedBy"
                  name="reportedBy"
                  value={formData.reportedBy}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-reportDate" className="text-right">
                  Report Date
                </Label>
                <Input
                  id="edit-reportDate"
                  name="reportDate"
                  type="date"
                  value={formData.reportDate}
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
                  onChange={handleInputChange}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-severity" className="text-right">
                  Severity
                </Label>
                <select
                  id="edit-severity"
                  name="severity"
                  value={formData.severity}
                  onChange={handleInputChange}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditSubmit}>Update Defect</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the defect for "{currentDefect?.product}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteSubmit}>
                Delete Defect
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Defects;
