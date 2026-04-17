import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAdminUserActivity } from "../hooks/useAdminData";

const formatTimestamp = (timestamp) => {
  if (!timestamp) return "Unknown time";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "Unknown time";
  return date.toLocaleString();
};

const humanizeAction = (action) => {
  if (!action) return "Activity";
  return action
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const UserActivityDialog = ({ user, open, onOpenChange }) => {
  const { data, isLoading, isError } = useAdminUserActivity(user?.id, 500);

  const activities = data?.activities || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{user?.name || "User"} Activity Timeline</DialogTitle>
          <DialogDescription>
            Full actions and activities for {user?.email || "this user"}.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 h-[60vh] overflow-y-auto rounded-md border">
          {isLoading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="rounded-md border p-3">
                  <div className="h-4 w-36 animate-pulse rounded bg-muted" />
                  <div className="mt-2 h-3 w-3/4 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : null}

          {isError ? (
            <div className="p-4 text-sm text-red-500">
              Failed to load user activity.
            </div>
          ) : null}

          {!isLoading && !isError && activities.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">
              No activity found for this user yet.
            </div>
          ) : null}

          {!isLoading && !isError && activities.length > 0 ? (
            <div className="divide-y">
              {activities.map((item, index) => (
                <div key={`${item.timestamp}-${item.entityType}-${item.entityId || index}`} className="p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="font-normal">
                      {humanizeAction(item.action)}
                    </Badge>
                    <Badge variant="secondary" className="font-normal">
                      {item.entityType || "activity"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(item.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{item.description || "No description"}</p>
                  {item.metadata && Object.keys(item.metadata).length > 0 ? (
                    <pre className="mt-2 overflow-x-auto rounded bg-muted/50 p-2 text-xs text-muted-foreground">
                      {JSON.stringify(item.metadata, null, 2)}
                    </pre>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserActivityDialog;
