import { useState } from "react";
import { motion } from "framer-motion";
import { SearchBar } from "../components/SearchBar";
import { SearchResultItem } from "../components/SearchResultItem";
import { useGlobalSearch } from "../hooks/useGlobalSearch";
import { Loader2, SearchX } from "lucide-react";

export default function GlobalSearchPage() {
  const [query, setQuery] = useState("");
  const { data, isLoading } = useGlobalSearch(query);

  const results = data?.results || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto p-4 md:p-8 max-w-4xl"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Global Search</h1>
        <SearchBar value={query} onChange={setQuery} />
      </div>

      <div className="mt-8 relative min-h-[300px]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && query && results.length === 0 && (
          <div className="text-center mt-20 text-muted-foreground animate-in fade-in zoom-in duration-300">
            <SearchX className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-semibold">No results found</h3>
            <p>Try adjusting your search terms.</p>
          </div>
        )}

        {!isLoading && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Found {results.length} result{results.length !== 1 ? "s" : ""}
            </p>
            {results.map((result) => (
              <SearchResultItem key={result.id} result={result} />
            ))}
          </motion.div>
        )}

        {!query && (
          <div className="text-center mt-20 text-muted-foreground">
            <p>Start typing to search across all courses, notes, and users.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
