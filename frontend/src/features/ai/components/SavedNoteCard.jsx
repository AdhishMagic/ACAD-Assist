import { Link } from "react-router-dom";
import { BookOpen, Calendar, ChevronRight, MoreVertical, Trash2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function SavedNoteCard({ note, onDelete }) {
  const formattedDate = new Date(note.dateSaved).toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric", 
    year: "numeric" 
  });

  return (
    <Card className="flex flex-col h-full hover:shadow-md hover:border-primary/30 transition-all duration-300 group">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1 pr-4">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 mb-2">
            {note.topic}
          </Badge>
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {note.title}
          </h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 -mr-2 shrink-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer" onClick={() => onDelete(note.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {note.preview}
        </p>
        <div className="flex items-center text-xs text-muted-foreground mt-4 gap-2 font-medium">
          <Calendar className="w-3.5 h-3.5 opacity-70" />
          {formattedDate}
        </div>
      </CardContent>
      <CardFooter className="pt-4 border-t bg-muted/20">
        <Button asChild variant="ghost" className="w-full justify-between hover:bg-primary hover:text-primary-foreground group/btn transition-colors">
          <Link to={`/student/notes/view/${note.id}`}>
            <span className="flex items-center">
              <BookOpen className="w-4 h-4 mr-2 text-primary group-hover/btn:text-primary-foreground transition-colors" />
              Open Note
            </span>
            <ChevronRight className="w-4 h-4 opacity-50 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
