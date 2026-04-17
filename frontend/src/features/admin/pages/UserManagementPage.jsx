import { useMemo, useState } from "react";
import { PlusCircle } from "lucide-react";
import { useAdminUsers, useCreateUser } from "../hooks/useAdminData";
import UserFilters from "../components/UserFilters";
import UserTable from "../components/UserTable";
import UserActivityDialog from "../components/UserActivityDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const UserManagementPage = () => {
  const { data: users, isLoading, isError } = useAdminUsers();
  const createUserMutation = useCreateUser();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserFirstName, setNewUserFirstName] = useState("");
  const [newUserLastName, setNewUserLastName] = useState("");
  const [newUserRole, setNewUserRole] = useState("Student");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleCreateUser = (event) => {
    event.preventDefault();
    createUserMutation.mutate(
      {
        email: newUserEmail,
        first_name: newUserFirstName,
        last_name: newUserLastName,
        role: newUserRole,
        password: newUserPassword,
      },
      {
        onSuccess: (response) => {
          const payload = response?.data || {};
          setCreatedCredentials({
            email: payload.email || newUserEmail,
            password: payload.generatedPassword || newUserPassword,
          });
          setCreateOpen(false);
          setNewUserEmail("");
          setNewUserFirstName("");
          setNewUserLastName("");
          setNewUserRole("Student");
          setNewUserPassword("");
        },
      }
    );
  };

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    
    return users.filter((user) => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase();
      
      const matchesStatus = statusFilter === "all" || user.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        <div className="flex h-[400px] items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        Failed to load users data.
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage all platform users, roles, and account statuses.
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create User</DialogTitle>
              <DialogDescription>
                Create a new platform account and assign an initial role.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleCreateUser}>
              <Input
                type="email"
                placeholder="Email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                required
              />
              <Input
                type="text"
                placeholder="First name"
                value={newUserFirstName}
                onChange={(e) => setNewUserFirstName(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Last name"
                value={newUserLastName}
                onChange={(e) => setNewUserLastName(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Set login password (min 8 chars)"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                minLength={8}
                required
              />
              <Select value={newUserRole} onValueChange={setNewUserRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Teacher">Teacher</SelectItem>
                  <SelectItem value="HOD">HOD</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <DialogFooter>
                <Button type="submit" disabled={createUserMutation.isPending}>
                  {createUserMutation.isPending ? "Creating..." : "Create User"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {createdCredentials ? (
        <div className="rounded-md border border-emerald-600/30 bg-emerald-500/10 px-4 py-3 text-sm">
          <p className="font-medium">User created successfully.</p>
          <p className="text-muted-foreground">Login email: {createdCredentials.email}</p>
          <p className="text-muted-foreground">Password: {createdCredentials.password}</p>
        </div>
      ) : null}

      <UserFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <UserTable users={filteredUsers} onSelectUser={setSelectedUser} />

      <UserActivityDialog
        user={selectedUser}
        open={Boolean(selectedUser)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedUser(null);
          }
        }}
      />
    </div>
  );
};

export default UserManagementPage;
