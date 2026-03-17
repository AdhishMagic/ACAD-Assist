import { motion } from "framer-motion";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useAdminRoles, useUpdateRolePermissions } from "../hooks/useAdminData";
import RoleTable from "../components/RoleTable";

export const RoleManagementPage = () => {
  const { data: roles, isLoading, isError } = useAdminRoles();
  const updatePermissionsMutation = useUpdateRolePermissions();

  const handleUpdatePermissions = (roleId, permissions) => {
    updatePermissionsMutation.mutate({ roleId, permissions });
  };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Role Management</h2>
        <div className="flex h-[400px] items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        Failed to load roles data.
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Role Management</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Configure permissions and access levels for platform roles.
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <RoleTable 
          roles={roles} 
          onUpdatePermissions={handleUpdatePermissions} 
        />
      </motion.div>
    </div>
  );
};

export default RoleManagementPage;
