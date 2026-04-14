import React, { useEffect, useMemo, useRef } from 'react';
import { Bold, Italic, List, ListOrdered, RotateCcw, Underline } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const TOOLBAR_ACTIONS = [
  { command: 'bold', icon: Bold, label: 'Bold' },
  { command: 'italic', icon: Italic, label: 'Italic' },
  { command: 'underline', icon: Underline, label: 'Underline' },
  { command: 'insertUnorderedList', icon: List, label: 'Bullet list' },
  { command: 'insertOrderedList', icon: ListOrdered, label: 'Numbered list' },
  { command: 'removeFormat', icon: RotateCcw, label: 'Clear formatting' },
];

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function textToHtml(value) {
  const text = String(value || '').trim();
  if (!text) {
    return '<p></p>';
  }

  return text
    .split(/\n{2,}/)
    .map((block) => `<p>${block.split('\n').map((line) => escapeHtml(line)).join('<br />')}</p>`)
    .join('');
}

export function RichTextEditor({ value, onChange, placeholder = 'Start editing the extracted content...', className }) {
  const editorRef = useRef(null);
  const lastHtmlRef = useRef('');

  const initialHtml = useMemo(() => textToHtml(value), [value]);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    if (lastHtmlRef.current === initialHtml) {
      return;
    }

    editorRef.current.innerHTML = initialHtml;
    lastHtmlRef.current = initialHtml;
  }, [initialHtml]);

  const handleInput = () => {
    if (!editorRef.current) {
      return;
    }

    const html = editorRef.current.innerHTML;
    lastHtmlRef.current = html;
    onChange(html);
  };

  const runCommand = (command) => {
    if (typeof document === 'undefined') {
      return;
    }

    editorRef.current?.focus();
    document.execCommand(command, false, undefined);
    handleInput();
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex flex-wrap gap-2 rounded-lg border bg-muted/30 p-2">
        {TOOLBAR_ACTIONS.map(({ command, icon: Icon, label }) => (
          <Button key={command} type="button" variant="ghost" size="sm" onClick={() => runCommand(command)} className="h-9 px-3">
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </Button>
        ))}
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={handleInput}
        className={cn(
          'min-h-[320px] rounded-lg border bg-background p-4 text-sm leading-6 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'prose prose-sm max-w-none dark:prose-invert',
        )}
        data-placeholder={placeholder}
      />
    </div>
  );
}