import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Mail } from "lucide-react";

export const ProfileHeader = ({ profile }) => {
  if (!profile) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-card p-6 rounded-xl shadow-sm border"
    >
      <motion.div whileHover={{ scale: 1.05 }}>
        {/* We can use a simple img if Avatar from shadcn is missing, but assuming it exists or we fall back */}
        <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-primary/20 bg-muted flex items-center justify-center text-4xl font-bold">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.name} className="h-full w-full object-cover" />
          ) : (
            profile.name.charAt(0)
          )}
        </div>
      </motion.div>

      <div className="flex-1 text-center md:text-left space-y-2">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <Badge variant="secondary" className="w-fit mx-auto md:mx-0">
            {profile.role}
          </Badge>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 text-muted-foreground text-sm mt-2">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Mail className="h-4 w-4" />
            {profile.email}
          </div>
          <div className="flex items-center justify-center md:justify-start gap-2">
            <CalendarDays className="h-4 w-4" />
            Joined {new Date(profile.joinDate).toLocaleDateString()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
