
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
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/lib/supabase";

// Define a type that matches our component's expected structure 
// (with camelCase property names)
type Department = {
  id: number;
  name: string;
  location: string;
  manager: string;
  employeeCount: number;
  created_at?: string;
};

const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  // Fetch departments from Supabase
  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        throw error;
      }

      if (data) {
        // Convert database field names to component's expected format (employee_count → employeeCount)
        const formattedDepartments = data.map(dept => ({
          id: dept.id,
          name: dept.name,
          location: dept.location,
          manager: dept.manager,
          employeeCount: dept.employee_count || 0,
          created_at: dept.created_at
        }));
        setDepartments(formattedDepartments);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch departments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('departments-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'departments' }, () => {
        fetchDepartments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

  const handleAddSubmit = async () => {
    try {
      const newDepartment = {
        name: formData.name,
        location: formData.location,
        manager: formData.manager,
        employee_count: 0,
      };
      
      const { data, error } = await supabase
        .from('departments')
        .insert([newDepartment])
        .select();

      if (error) {
        throw error;
      }

      setIsAddDialogOpen(false);
      toast({
        title: "Department Added",
        description: `${formData.name} has been added successfully.`,
      });
      fetchDepartments();
    } catch (error) {
      console.error('Error adding department:', error);
      toast({
        title: "Error",
        description: "Failed to add department",
        variant: "destructive",
      });
    }
  };

  const handleEditSubmit = async () => {
    if (!currentDepartment) return;
    
    try {
      const updatedDepartment = {
        name: formData.name,
        location: formData.location,
        manager: formData.manager,
      };
      
      const { error } = await supabase
        .from('departments')
        .update(updatedDepartment)
        .eq('id', currentDepartment.id);

      if (error) {
        throw error;
      }

      setIsEditDialogOpen(false);
      toast({
        title: "Department Updated",
        description: `${formData.name} has been updated successfully.`,
      });
      fetchDepartments();
    } catch (error) {
      console.error('Error updating department:', error);
      toast({
        title: "Error",
        description: "Failed to update department",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSubmit = async () => {
    if (!currentDepartment) return;
    
    try {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', currentDepartment.id);

      if (error) {
        throw error;
      }

      setIsDeleteDialogOpen(false);
      toast({
        title: "Department Deleted",
        description: `${currentDepartment.name} has been deleted successfully.`,
        variant: "destructive",
      });
      fetchDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
      toast({
        title: "Error",
        description: "Failed to delete department",
        variant: "destructive",
      });
    }
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
          isLoading={isLoading}
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
