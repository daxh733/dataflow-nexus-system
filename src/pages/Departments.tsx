
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Department {
  id: number;
  name: string;
  location: string;
  manager: string;
  employeeCount: number;
}

// Sample data
const initialDepartments: Department[] = [
  { id: 1, name: "Production", location: "Building A", manager: "John Smith", employeeCount: 45 },
  { id: 2, name: "R&D", location: "Building B", manager: "Jane Doe", employeeCount: 18 },
  { id: 3, name: "Quality Assurance", location: "Building A", manager: "Michael Brown", employeeCount: 12 },
  { id: 4, name: "Logistics", location: "Building C", manager: "Sarah Johnson", employeeCount: 20 },
  { id: 5, name: "Administration", location: "Main Building", manager: "Robert Davis", employeeCount: 15 },
];

const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    manager: "",
  });

  const columns = [
    { key: "name", label: "Department Name" },
    { key: "location", label: "Location" },
    { key: "manager", label: "Manager" },
    { key: "employeeCount", label: "Employees" },
  ];

  const handleAddNew = () => {
    setFormData({ name: "", location: "", manager: "" });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (department: Department) => {
    setCurrentDepartment(department);
    setFormData({
      name: department.name,
      location: department.location,
      manager: department.manager,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (department: Department) => {
    setCurrentDepartment(department);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = () => {
    const newDepartment: Department = {
      id: departments.length > 0 ? Math.max(...departments.map(d => d.id)) + 1 : 1,
      name: formData.name,
      location: formData.location,
      manager: formData.manager,
      employeeCount: 0,
    };
    
    setDepartments([...departments, newDepartment]);
    setIsAddDialogOpen(false);
    toast({
      title: "Department Added",
      description: `${newDepartment.name} has been added successfully.`,
    });
  };

  const handleEditSubmit = () => {
    if (!currentDepartment) return;
    
    const updatedDepartments = departments.map(dep => 
      dep.id === currentDepartment.id 
        ? { 
            ...dep, 
            name: formData.name, 
            location: formData.location, 
            manager: formData.manager 
          } 
        : dep
    );
    
    setDepartments(updatedDepartments);
    setIsEditDialogOpen(false);
    toast({
      title: "Department Updated",
      description: `${formData.name} has been updated successfully.`,
    });
  };

  const handleDeleteSubmit = () => {
    if (!currentDepartment) return;
    
    const filteredDepartments = departments.filter(
      (dep) => dep.id !== currentDepartment.id
    );
    
    setDepartments(filteredDepartments);
    setIsDeleteDialogOpen(false);
    toast({
      title: "Department Deleted",
      description: `${currentDepartment.name} has been deleted successfully.`,
      variant: "destructive",
    });
  };

  const renderActions = (department: Department) => (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleEdit(department)}
      >
        <Pencil className="h-4 w-4 mr-1" /> Edit
      </Button>
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={() => handleDelete(department)}
      >
        <Trash className="h-4 w-4 mr-1" /> Delete
      </Button>
    </div>
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <EntityManager
          title="Departments"
          subtitle="Manage your company departments"
          columns={columns}
          data={departments}
          onAdd={handleAddNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
          renderActions={renderActions}
        />

        {/* Add Department Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Department</DialogTitle>
              <DialogDescription>
                Create a new department in the system.
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
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="manager" className="text-right">
                  Manager
                </Label>
                <Input
                  id="manager"
                  name="manager"
                  value={formData.manager}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSubmit}>Save Department</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Department Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Department</DialogTitle>
              <DialogDescription>
                Update the department details.
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
                <Label htmlFor="edit-location" className="text-right">
                  Location
                </Label>
                <Input
                  id="edit-location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-manager" className="text-right">
                  Manager
                </Label>
                <Input
                  id="edit-manager"
                  name="manager"
                  value={formData.manager}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditSubmit}>Update Department</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the department "{currentDepartment?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteSubmit}>
                Delete Department
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Departments;
