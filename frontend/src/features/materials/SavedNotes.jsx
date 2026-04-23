import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, Edit3, FileText, RefreshCw } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getMyMaterials, listBookmarkedMaterials, unbookmarkMaterial } from "@/features/materials/api";
import { ROUTE_PATHS } from "@/app/routes/routePaths";

function statusClasses(status) {
  if (status === "published") {
    return "bg-emerald-100 text-emerald-700";
  }
  return "bg-amber-100 text-amber-700";
}

export default function SavedNotes() {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [bookmarkedNotes, setBookmarkedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [workingBookmarkId, setWorkingBookmarkId] = useState("");

  const loadMaterials = async () => {
    setLoading(true);
    setError("");
    try {
      const [ownNotesResult, bookmarksResult] = await Promise.allSettled([
        getMyMaterials(),
        listBookmarkedMaterials(),
      ]);

      const ownNotes = ownNotesResult.status === "fulfilled" ? ownNotesResult.value : [];
      const bookmarks = bookmarksResult.status === "fulfilled" ? bookmarksResult.value : [];

      const savedOnly = (Array.isArray(ownNotes) ? ownNotes : []).filter(
        (item) => !(item?.is_published || item?.isPublished || item?.status === "published")
      );
      setMaterials(savedOnly);
      setBookmarkedNotes(Array.isArray(bookmarks) ? bookmarks : []);

      if (ownNotesResult.status === "rejected" && bookmarksResult.status === "rejected") {
        throw ownNotesResult.reason || bookmarksResult.reason;
      }
    } catch (requestError) {
      setError(requestError?.response?.data?.detail || "Failed to load saved notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const openForEdit = (id) => {
    navigate(ROUTE_PATHS.TEACHER_NOTES_STUDIO, { state: { materialId: id } });
  };

  const handleRemoveBookmark = async (id) => {
    setWorkingBookmarkId(id);
    try {
      await unbookmarkMaterial(id);
      await loadMaterials();
    } catch (requestError) {
      setError(requestError?.response?.data?.detail || "Failed to update bookmarked notes.");
    } finally {
      setWorkingBookmarkId("");
    }
  };

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Saved Notes</h1>
          <p className="text-sm text-gray-500 mt-1">Draft notes created by you and notes you bookmarked from the library.</p>
        </div>
        <Button type="button" variant="outline" onClick={loadMaterials} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}

      <Card className="border-gray-200 dark:border-gray-800">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">My Saved Notes</h2>
        </div>
        <CardContent className="p-3 space-y-2">
          {!loading && materials.length === 0 ? <p className="text-sm text-gray-500">No saved draft notes yet.</p> : null}
          {materials.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => openForEdit(item.id)}
              className="w-full text-left rounded-lg border border-gray-200 dark:border-gray-800 p-3 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(item.created_at).toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.subject || 'General'} | {item.note_type || 'Lecture'}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded font-medium capitalize ${statusClasses(item.status)}`}>
                  {item.status}
                </span>
              </div>
              <div className="mt-2 text-xs text-emerald-600 inline-flex items-center gap-1">
                <Edit3 className="w-3 h-3" />
                Click to edit
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      <Card className="border-gray-200 dark:border-gray-800">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">Bookmarked Notes</h2>
        </div>
        <CardContent className="p-3 space-y-2">
          {!loading && bookmarkedNotes.length === 0 ? <p className="text-sm text-gray-500">No bookmarked notes yet.</p> : null}
          {bookmarkedNotes.map((item) => (
            <div
              key={item.id}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-800 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(item.created_at).toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.subject || "General"} | {item.note_type || "Lecture"}</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveBookmark(item.id)}
                  disabled={workingBookmarkId === item.id}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
