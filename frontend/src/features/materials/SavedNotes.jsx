import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit3, FileText, RefreshCw } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getMyMaterials } from "@/features/materials/api";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMaterials = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMyMaterials();
      setMaterials(Array.isArray(data) ? data : []);
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

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Saved Notes</h1>
          <p className="text-sm text-gray-500 mt-1">Draft and published notes created by you.</p>
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
          {!loading && materials.length === 0 ? <p className="text-sm text-gray-500">No notes saved yet.</p> : null}
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
    </div>
  );
}
