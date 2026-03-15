import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, GraduationCap, Users, FileQuestion, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";

const getTypeStyles = (type) => {
  switch (type) {
    case "notes":
      return { icon: Book, color: "bg-blue-100 text-blue-700" };
    case "courses":
      return { icon: GraduationCap, color: "bg-green-100 text-green-700" };
    case "users":
      return { icon: Users, color: "bg-purple-100 text-purple-700" };
    case "tests":
      return { icon: FileQuestion, color: "bg-orange-100 text-orange-700" };
    default:
      return { icon: LinkIcon, color: "bg-gray-100 text-gray-700" };
  }
};

export const SearchResultItem = ({ result }) => {
  const { icon: Icon, color } = getTypeStyles(result.type);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.15 }}
    >
      <Link to={result.url}>
        <Card className="p-4 hover:border-primary/50 transition-colors cursor-pointer flex gap-4 items-center object-cover">
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{result.title}</h3>
            <p className="text-sm text-muted-foreground">{result.description}</p>
          </div>
          <Badge variant="outline" className="capitalize">{result.type}</Badge>
        </Card>
      </Link>
    </motion.div>
  );
};
