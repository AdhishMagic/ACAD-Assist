import { useState } from "react";
import { motion } from "framer-motion";
import { MoreHorizontal, ShieldAlert, ShieldCheck, Key, UserCog, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RoleBadge from "./RoleBadge";
import { useToggleUserStatus, useUpdateUserRole, useResetUserPassword } from "../hooks/useAdminData";

export const UserTable = ({ users }) => {
  const toggleStatusMutation = useToggleUserStatus();
  const updateRoleMutation = useUpdateUserRole();
  const resetPasswordMutation = useResetUserPassword();

  const handleToggleStatus = (userId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    toggleStatusMutation.mutate({ userId, status: newStatus });
  };

  const handleChangeRole = (userId, newRole) => {
    updateRoleMutation.mutate({ userId, newRole });
  };

  const handleResetPassword = (userId) => {
    resetPasswordMutation.mutate(userId);
  };

  const roles = ["Student", "Teacher", "HOD", "Admin"];

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user, index) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="group border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
              >
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <RoleBadge role={user.role} />
                </TableCell>
                <TableCell>
                  <Badge variant={user.status === 'Active' ? 'default' : 'destructive'} className="font-normal border-none">
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{user.joinDate}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{user.lastLogin}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem className="cursor-pointer">
                        <Eye className="mr-2 h-4 w-4" />
                        View profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="cursor-pointer"
                        onClick={() => handleResetPassword(user.id)}
                      >
                        <Key className="mr-2 h-4 w-4" />
                        Reset password
                      </DropdownMenuItem>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="cursor-pointer">
                          <UserCog className="mr-2 h-4 w-4" />
                          Change role
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            {roles.map((role) => (
                              <DropdownMenuItem 
                                key={role}
                                onClick={() => handleChangeRole(user.id, role)}
                                disabled={user.role === role}
                              >
                                {role} 
                                {user.role === role && <span className="ml-auto text-muted-foreground text-xs">(Current)</span>}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className={`cursor-pointer ${user.status === 'Active' ? 'text-red-600 focus:text-red-600' : 'text-green-600 focus:text-green-600'}`}
                        onClick={() => handleToggleStatus(user.id, user.status)}
                      >
                        {user.status === 'Active' ? (
                          <><ShieldAlert className="mr-2 h-4 w-4" /> Suspend account</>
                        ) : (
                          <><ShieldCheck className="mr-2 h-4 w-4" /> Activate account</>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
