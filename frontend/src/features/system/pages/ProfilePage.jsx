import { motion } from "framer-motion";
import { ProfileHeader } from "../components/ProfileHeader";
import { ProfileTabs } from "../components/ProfileTabs";
import { useProfile } from "../hooks/useProfile";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto p-4 md:p-8 max-w-5xl"
    >
      <ProfileHeader profile={profile} />
      <ProfileTabs profile={profile} />
    </motion.div>
  );
}
