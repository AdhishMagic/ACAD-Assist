import { useState } from "react";
import { motion } from "framer-motion";
import { ProfileCard } from "./ProfileCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Book, CheckSquare, GraduationCap } from "lucide-react";

export const ProfileTabs = ({ profile }) => {
  const [activeTab, setActiveTab] = useState("info");

  const tabs = [
    { id: "info", label: "Profile Info" },
    { id: "activity", label: "Activity" },
    { id: "saved", label: "Saved Notes" },
    { id: "settings", label: "Settings" }
  ];

  return (
    <div className="mt-8">
      {/* Custom Animated Tabs */}
      <div className="flex space-x-1 border-b mb-6 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabBadge"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === "info" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ProfileCard title="Courses Enrolled" delay={0.1}>
              <div className="flex items-center gap-4">
                <div className="p-4 bg-primary/10 rounded-full text-primary">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{profile?.stats?.coursesEnrolled || 0}</p>
                  <p className="text-muted-foreground">Active Courses</p>
                </div>
              </div>
            </ProfileCard>
            <ProfileCard title="Saved Notes" delay={0.2}>
              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-100 text-blue-600 rounded-full">
                  <Book className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{profile?.stats?.notesSaved || 0}</p>
                  <p className="text-muted-foreground">Documents</p>
                </div>
              </div>
            </ProfileCard>
            <ProfileCard title="Tests Taken" delay={0.3}>
              <div className="flex items-center gap-4">
                <div className="p-4 bg-green-100 text-green-600 rounded-full">
                  <CheckSquare className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{profile?.stats?.testsTaken || 0}</p>
                  <p className="text-muted-foreground">Completed</p>
                </div>
              </div>
            </ProfileCard>
          </div>
        )}

        {activeTab === "activity" && (
          <ProfileCard title="Recent Activity">
            <p className="text-muted-foreground">No recent activity to show.</p>
          </ProfileCard>
        )}

        {activeTab === "saved" && (
          <ProfileCard title="Saved Notes">
            <p className="text-muted-foreground">Your saved notes and study materials will appear here.</p>
          </ProfileCard>
        )}

        {activeTab === "settings" && (
          <ProfileCard title="Account Settings">
            <div className="space-y-6 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={profile?.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" defaultValue={profile?.email} disabled />
                <p className="text-xs text-muted-foreground">Email cannot be changed directly.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
              <div className="pt-4 flex gap-4">
                <Button>Save Changes</Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </div>
          </ProfileCard>
        )}
      </motion.div>
    </div>
  );
};
