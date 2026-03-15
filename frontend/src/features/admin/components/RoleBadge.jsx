import { Badge } from "@/components/ui/badge";

export const RoleBadge = ({ role }) => {
  switch (role?.toLowerCase()) {
    case 'admin':
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-none">Admin</Badge>;
    case 'hod':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-none">HOD</Badge>;
    case 'teacher':
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-none">Teacher</Badge>;
    case 'student':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none">Student</Badge>;
    default:
      return <Badge variant="outline">{role}</Badge>;
  }
};

export default RoleBadge;
