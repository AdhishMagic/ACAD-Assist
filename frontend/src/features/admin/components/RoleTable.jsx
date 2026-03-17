import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Users, Edit } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RoleBadge from "./RoleBadge";
import RolePermissionsEditor from "./RolePermissionsEditor";

export const RoleTable = ({ roles, onUpdatePermissions }) => {
  const [editingRole, setEditingRole] = useState(null);

  const handleSavePermissions = (newPermissions) => {
    if (editingRole) {
      onUpdatePermissions(editingRole.id, newPermissions);
      setEditingRole(null);
    }
  };

  return (
    <>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Name</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Number of Users</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No roles found.
                </TableCell>
              </TableRow>
            ) : (
              roles?.map((role, index) => (
                <motion.tr
                  key={role.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="group border-b transition-colors hover:bg-muted/50"
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                >
                  <TableCell className="font-medium">
                    <RoleBadge role={role.name} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[300px]">
                      {role.permissions.slice(0, 3).map((perm, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {perm.replace('access_', '').replace('_', ' ')}
                        </Badge>
                      ))}
                      {role.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.permissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{role.userCount.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {role.lastUpdated}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setEditingRole(role)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Permissions
                    </Button>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingRole} onOpenChange={(open) => !open && setEditingRole(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-indigo-500" />
              Edit {editingRole?.name} Permissions
            </DialogTitle>
            <DialogDescription>
              Select the modules and features this role can access.
            </DialogDescription>
          </DialogHeader>
          
          {editingRole && (
            <RolePermissionsEditor 
              role={editingRole} 
              onSave={handleSavePermissions}
              onCancel={() => setEditingRole(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RoleTable;
