
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

interface Defect {
  id: number;
  product: string;
  report_date: string;
  description: string;
  reported_by: string;
  status: string;
  severity: string;
  created_at?: string;
}

const Defects = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentDefect, setCurrentDefect] = useState<Defect | null>(null);
  const [formData, setFormData] = useState({
    product: "",
    description: "",
    reported_by: "",
    report_date: new Date().toISOString().split('T')[0],
    status: "Open",
    severity: "Medium",
  });

  const columns = [
    { key: "product", label: "Product" },
    { key: "reported_by", label: "Reported By" },
    { key: "report_date", label: "Report Date" },
    { key: "status", label: "Status" },
    { key: "severity", label: "Severity" },
  ];

  // Fetch defects
  const { data: defects = [], isLoading } = useQuery({
    queryKey: ['defects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('defects')
        .select('*')
        .order('report_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching defects:', error);
        toast({
          title: "Error fetching defects",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      
      return data as Defect[];
    },
  });

  // Add defect mutation
  const addDefectMutation = useMutation({
    mutationFn: async (newDefect: Omit<Defect, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('defects')
        .insert(newDefect)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['defects'] });
      setIsAddDialogOpen(false);
      toast({
        title: "Defect Reported",
        description: `Defect for ${formData.product} has been reported successfully.`,
      });
    },
    onError: (error: any) => {
      console.error('Error adding defect:', error);
      toast({
        title: "Error reporting defect",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update defect mutation
  const updateDefectMutation = useMutation({
    mutationFn: async (defect: Partial<Defect>) => {
      const { data, error } = await supabase
        .from('defects')
        .update(defect)
        .eq('id', currentDefect?.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['defects'] });
      setIsEditDialogOpen(false);
      toast({
        title: "Defect Updated",
        description: `Defect for ${formData.product} has been updated successfully.`,
      });
    },
    onError: (error: any) => {
      console.error('Error updating defect:', error);
      toast({
        title: "Error updating defect",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete defect mutation
  const deleteDefectMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('defects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['defects'] });
      setIsDeleteDialogOpen(false);
      toast({
        title: "Defect Deleted",
        description: `Defect for ${currentDefect?.product} has been deleted successfully.`,
        variant: "destructive",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting defect:', error);
      toast({
        title: "Error deleting defect",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Set up real-time listener
  useEffect(() => {
    const channel = supabase
      .channel('defects-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'defects' }, 
        (payload) => {
          console.log('Real-time update:', payload);
          queryClient.invalidateQueries({ queryKey: ['defects'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleAddNew = () => {
    setFormData({
      product: "",
      description: "",
      reported_by: "",
      report_date: new Date().toISOString().split('T')[0],
      status: "Open",
      severity: "Medium",
    });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (defect: Defect) => {
    setCurrentDefect(defect);
    setFormData({
      product: defect.product,
      description: defect.description,
      reported_by: defect.reported_by,
      report_date: defect.report_date,
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
    addDefectMutation.mutate(formData);
  };

  const handleEditSubmit = () => {
    if (!currentDefect) return;
    updateDefectMutation.mutate(formData);
  };

  const handleDeleteSubmit = () => {
    if (!currentDefect) return;
    deleteDefectMutation.mutate(currentDefect.id);
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
          isLoading={isLoading}
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
                <Label htmlFor="reported_by" className="text-right">
                  Reported By
                </Label>
                <Input
                  id="reported_by"
                  name="reported_by"
                  value={formData.reported_by}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="report_date" className="text-right">
                  Report Date
                </Label>
                <Input
                  id="report_date"
                  name="report_date"
                  type="date"
                  value={formData.report_date}
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
                <Label htmlFor="edit-reported_by" className="text-right">
                  Reported By
                </Label>
                <Input
                  id="edit-reported_by"
                  name="reported_by"
                  value={formData.reported_by}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-report_date" className="text-right">
                  Report Date
                </Label>
                <Input
                  id="edit-report_date"
                  name="report_date"
                  type="date"
                  value={formData.report_date}
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
