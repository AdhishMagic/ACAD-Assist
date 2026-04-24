import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export const UserFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  roleFilter, 
  setRoleFilter, 
  statusFilter, 
  setStatusFilter 
}) => {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="teacher">Teacher</SelectItem>
            <SelectItem value="hod">HOD</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>

        {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all') && (
          <Button 
            variant="ghost" 
            onClick={() => {
              setSearchTerm('');
              setRoleFilter('all');
              setStatusFilter('all');
            }}
            className="px-2 sm:px-4"
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserFilters;
