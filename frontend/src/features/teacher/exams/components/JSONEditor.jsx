import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Code } from 'lucide-react';

export const JSONEditor = ({ initialValue, onChange }) => {
  const [jsonText, setJsonText] = useState(
    typeof initialValue === 'string' ? initialValue : JSON.stringify(initialValue, null, 2)
  );
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (initialValue) {
      setJsonText(typeof initialValue === 'string' ? initialValue : JSON.stringify(initialValue, null, 2));
    }
  }, [initialValue]);

  const handleValidate = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setError(null);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
      if (onChange) {
        onChange(parsed);
      }
    } catch (err) {
      setError(err.message);
      setIsSuccess(false);
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (err) {
      setError("Cannot format invalid JSON: " + err.message);
    }
  };

  return (
    <Card className="border shadow-sm flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between bg-muted/50 border-b space-y-0">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Code className="w-4 h-4" />
          JSON Editor Source
        </CardTitle>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={handleFormat} className="h-8">Format</Button>
          <Button size="sm" onClick={handleValidate} className="h-8">Validate & Apply</Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 relative flex flex-col">
        {error && (
          <div className="absolute top-2 right-4 left-4 bg-destructive text-destructive-foreground p-2 rounded-md text-xs flex items-center gap-2 shadow-md z-10 animate-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4" />
            <span className="flex-1 truncate">{error}</span>
            <Button variant="ghost" size="icon" className="h-4 w-4 text-destructive-foreground hover:bg-destructive/90" onClick={() => setError(null)}>×</Button>
          </div>
        )}
        {isSuccess && (
          <div className="absolute top-2 right-4 left-4 bg-green-500 text-white p-2 rounded-md text-xs flex items-center gap-2 shadow-md z-10 animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>JSON is valid! Applied successfully.</span>
          </div>
        )}
        <textarea
          className="flex-1 w-full p-4 font-mono text-sm resize-none bg-transparent outline-none focus:ring-0 text-slate-800 dark:text-slate-300 min-h-[400px]"
          value={jsonText}
          onChange={(e) => {
            setJsonText(e.target.value);
            setError(null);
            setIsSuccess(false);
          }}
          spellCheck={false}
        />
      </CardContent>
    </Card>
  );
};

export default JSONEditor;
