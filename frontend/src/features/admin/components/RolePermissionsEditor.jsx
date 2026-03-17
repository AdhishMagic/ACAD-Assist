import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const PERMISSION_OPTIONS = [
  { id: "access_dashboard", label: "Access Dashboard" },
  { id: "access_notes", label: "Access Notes" },
  { id: "access_ai", label: "Access AI" },
  { id: "access_teacher_panel", label: "Access Teacher Panel" },
  { id: "access_hod_panel", label: "Access HOD Panel" },
  { id: "access_admin_panel", label: "Access Admin Panel" },
];

export const RolePermissionsEditor = ({ role, onSave, onCancel }) => {
  const [permissions, setPermissions] = useState(role?.permissions || []);

  const handleToggle = (permId) => {
    setPermissions((prev) => 
      prev.includes(permId) 
        ? prev.filter((p) => p !== permId)
        : [...prev, permId]
    );
  };

  return (
    <div className="space-y-4 py-4">
      <div className="grid gap-4 md:grid-cols-2">
        {PERMISSION_OPTIONS.map((perm) => (
          <div key={perm.id} className="flex items-center space-x-2">
            <Checkbox 
              id={perm.id} 
              checked={permissions.includes(perm.id)}
              onCheckedChange={() => handleToggle(perm.id)}
            />
            <Label htmlFor={perm.id} className="cursor-pointer">
              {perm.label}
            </Label>
          </div>
        ))}
      </div>
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSave(permissions)}>
          Save Permissions
        </Button>
      </div>
    </div>
  );
};

export default RolePermissionsEditor;
