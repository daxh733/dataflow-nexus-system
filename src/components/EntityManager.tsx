
import { useState } from "react";
import { PlusCircle, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface Column {
  key: string;
  label: string;
}

export interface EntityManagerProps {
  title: string;
  subtitle?: string;
  columns: Column[];
  data: any[];
  onAdd: () => void;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  renderActions?: (item: any) => React.ReactNode;
  isLoading?: boolean;
}

export function EntityManager({
  title,
  subtitle,
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  renderActions,
  isLoading = false
}: EntityManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = data.filter(item => {
    return columns.some(column => {
      const value = item[column.key];
      return value && value.toString().toLowerCase().includes(searchQuery.toLowerCase());
    });
  });

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 w-full md:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={onAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add {title.slice(0, -1)}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key}>{column.label}</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" /> 
                      Loading...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item, i) => (
                  <TableRow key={i}>
                    {columns.map((column) => (
                      <TableCell key={column.key}>
                        {item[column.key]}
                      </TableCell>
                    ))}
                    <TableCell>
                      {renderActions ? (
                        renderActions(item)
                      ) : (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => onEdit(item)}>
                            Edit
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => onDelete(item)}>
                            Delete
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
