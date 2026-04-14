import React, { useEffect, useState } from "react";
import { ExternalLink, Globe, RefreshCw } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPublicMaterials } from "@/features/materials/api";

function contentPreview(text) {
  if (!text) return "";
  if (text.length <= 180) return text;
  return `${text.slice(0, 180)}...`;
}

export default function ExploreNotes() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPublic = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getPublicMaterials();
      setMaterials(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setError(requestError?.response?.data?.detail || "Failed to load public notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPublic();
  }, []);

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Explore Notes</h1>
          <p className="text-sm text-gray-500 mt-1">Public, read-only notes shared by users.</p>
        </div>
        <Button type="button" variant="outline" onClick={loadPublic} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      {!loading && materials.length === 0 ? <p className="text-sm text-gray-500">No public notes yet.</p> : null}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {materials.map((item) => (
          <Card key={item.id} className="border-gray-200 dark:border-gray-800">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
              <h2 className="font-semibold text-gray-900 dark:text-white truncate">{item.title}</h2>
              <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-emerald-100 text-emerald-700">
                <Globe className="w-3 h-3" /> Public
              </span>
            </div>
            <CardContent className="p-4 space-y-3">
              <p className="text-xs text-gray-500">By {item.author_name || item.uploaded_by_email || "Unknown"}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{contentPreview(item.content)}</p>

              {item.file_url ? (
                <a
                  href={item.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  Open attachment <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <p className="text-xs text-gray-500">No attachment</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
