import React, { useEffect, useState } from "react";
import { Bookmark, ExternalLink, FileText, RefreshCw } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  bookmarkMaterial,
  listBookmarkedMaterials,
  listMaterials,
  listMaterialsLibrary,
  unbookmarkMaterial,
} from "@/features/materials/api";

function prettyDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleString();
}

function MaterialItem({ item, actionLabel, onAction, actionDisabled }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.title}</p>
          <p className="text-xs text-gray-500 mt-1">By {item.uploaded_by_email || "Unknown"}</p>
          <p className="text-xs text-gray-500">{prettyDate(item.created_at)}</p>
        </div>
        <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-700 font-medium uppercase">{item.file_type || "txt"}</span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        {item.file_url ? (
          <a
            href={item.file_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            Open file <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-xs text-gray-500">Text-only note</span>
        )}

        {onAction ? (
          <Button type="button" variant="outline" size="sm" onClick={() => onAction(item.id)} disabled={actionDisabled}>
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default function SavedNotesPage() {
  const [ownMaterials, setOwnMaterials] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [discover, setDiscover] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [workingId, setWorkingId] = useState("");

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [own, marked, library] = await Promise.all([
        listMaterials(),
        listBookmarkedMaterials(),
        listMaterialsLibrary(),
      ]);

      setOwnMaterials(Array.isArray(own) ? own : []);
      setBookmarks(Array.isArray(marked) ? marked : []);

      const markedIds = new Set((Array.isArray(marked) ? marked : []).map((item) => item.id));
      const libraryItems = Array.isArray(library) ? library : [];
      setDiscover(libraryItems.filter((item) => !markedIds.has(item.id)));
    } catch (requestError) {
      setError(requestError?.response?.data?.detail || "Failed to load saved notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleBookmark = async (id) => {
    setWorkingId(id);
    try {
      await bookmarkMaterial(id);
      await loadAll();
    } finally {
      setWorkingId("");
    }
  };

  const handleUnbookmark = async (id) => {
    setWorkingId(id);
    try {
      await unbookmarkMaterial(id);
      await loadAll();
    } finally {
      setWorkingId("");
    }
  };

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Saved Notes</h1>
          <p className="text-sm text-gray-500 mt-1">Your own notes and bookmarked docs from other uploads.</p>
        </div>
        <Button type="button" variant="outline" onClick={loadAll} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <Card className="xl:col-span-4 border-gray-200 dark:border-gray-800">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">My Notes</h2>
          </div>
          <CardContent className="p-3 space-y-2 max-h-[70vh] overflow-y-auto">
            {!loading && ownMaterials.length === 0 ? <p className="text-sm text-gray-500">No notes created yet.</p> : null}
            {ownMaterials.map((item) => (
              <MaterialItem key={item.id} item={item} />
            ))}
          </CardContent>
        </Card>

        <Card className="xl:col-span-4 border-gray-200 dark:border-gray-800">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-emerald-500" />
            <h2 className="font-semibold">Bookmarked Docs</h2>
          </div>
          <CardContent className="p-3 space-y-2 max-h-[70vh] overflow-y-auto">
            {!loading && bookmarks.length === 0 ? <p className="text-sm text-gray-500">No bookmarked docs yet.</p> : null}
            {bookmarks.map((item) => (
              <MaterialItem
                key={item.id}
                item={item}
                actionLabel="Remove"
                onAction={handleUnbookmark}
                actionDisabled={workingId === item.id}
              />
            ))}
          </CardContent>
        </Card>

        <Card className="xl:col-span-4 border-gray-200 dark:border-gray-800">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-500" />
            <h2 className="font-semibold">Discover Uploads</h2>
          </div>
          <CardContent className="p-3 space-y-2 max-h-[70vh] overflow-y-auto">
            {!loading && discover.length === 0 ? <p className="text-sm text-gray-500">No other uploads to bookmark.</p> : null}
            {discover.map((item) => (
              <MaterialItem
                key={item.id}
                item={item}
                actionLabel="Bookmark"
                onAction={handleBookmark}
                actionDisabled={workingId === item.id}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
