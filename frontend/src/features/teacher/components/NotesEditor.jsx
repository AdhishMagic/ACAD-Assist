import React, { useCallback, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';

const NotesEditor = ({ content, setContent }) => {
  const textareaRef = useRef(null);

  const applyTransform = useCallback(
    (transformer) => {
      const el = textareaRef.current;
      if (!el) return;

      const start = el.selectionStart ?? 0;
      const end = el.selectionEnd ?? 0;

      const result = transformer({
        value: content,
        start,
        end,
        selected: content.slice(start, end),
      });

      setContent(result.value);

      requestAnimationFrame(() => {
        const current = textareaRef.current;
        if (!current) return;
        current.focus();
        current.setSelectionRange(result.selectionStart, result.selectionEnd);
      });
    },
    [content, setContent]
  );

  const toggleWrap = useCallback(
    (prefix, suffix, { placeholder = '' } = {}) => {
      applyTransform(({ value, start, end, selected }) => {
        const hasSelection = end > start;

        // Case 1: selection includes wrappers inside it
        if (
          hasSelection &&
          selected.startsWith(prefix) &&
          selected.endsWith(suffix) &&
          selected.length >= prefix.length + suffix.length
        ) {
          const inner = selected.slice(prefix.length, selected.length - suffix.length);
          const nextValue = value.slice(0, start) + inner + value.slice(end);
          return { value: nextValue, selectionStart: start, selectionEnd: start + inner.length };
        }

        // Case 2: wrappers are immediately around the selection (outside)
        if (
          value.slice(Math.max(0, start - prefix.length), start) === prefix &&
          value.slice(end, end + suffix.length) === suffix
        ) {
          const beforeStart = start - prefix.length;
          const afterEnd = end + suffix.length;
          const nextValue = value.slice(0, beforeStart) + value.slice(start, end) + value.slice(afterEnd);
          return { value: nextValue, selectionStart: beforeStart, selectionEnd: beforeStart + (end - start) };
        }

        // Case 3: no selection, cursor is between wrappers -> remove them
        if (!hasSelection) {
          const cursor = start;
          const before = value.slice(Math.max(0, cursor - prefix.length), cursor);
          const after = value.slice(cursor, cursor + suffix.length);
          if (before === prefix && after === suffix) {
            const beforeStart = cursor - prefix.length;
            const afterEnd = cursor + suffix.length;
            const nextValue = value.slice(0, beforeStart) + value.slice(cursor, cursor) + value.slice(afterEnd);
            return { value: nextValue, selectionStart: beforeStart, selectionEnd: beforeStart };
          }
        }

        // Default: apply wrappers
        const insertText = hasSelection ? selected : placeholder;
        const nextValue = value.slice(0, start) + prefix + insertText + suffix + value.slice(end);
        const selectionStart = start + prefix.length;
        const selectionEnd = selectionStart + insertText.length;
        return { value: nextValue, selectionStart, selectionEnd };
      });
    },
    [applyTransform]
  );

  const handleBold = () => toggleWrap('**', '**', { placeholder: 'bold text' });
  const handleItalic = () => toggleWrap('*', '*', { placeholder: 'italic text' });
  const handleUnderline = () => toggleWrap('<u>', '</u>', { placeholder: 'underlined text' });

  const handleCode = () => {
    applyTransform(({ value, start, end, selected }) => {
      const hasSelection = end > start;
      const text = hasSelection ? selected : 'code';
      const isMultiline = text.includes('\n');

      const prefix = isMultiline ? '```\n' : '`';
      const suffix = isMultiline ? '\n```' : '`';

      // Toggle: selection includes wrappers
      if (
        hasSelection &&
        selected.startsWith(prefix) &&
        selected.endsWith(suffix) &&
        selected.length >= prefix.length + suffix.length
      ) {
        const inner = selected.slice(prefix.length, selected.length - suffix.length);
        const nextValue = value.slice(0, start) + inner + value.slice(end);
        return { value: nextValue, selectionStart: start, selectionEnd: start + inner.length };
      }

      // Toggle: wrappers immediately around the selection
      if (
        value.slice(Math.max(0, start - prefix.length), start) === prefix &&
        value.slice(end, end + suffix.length) === suffix
      ) {
        const beforeStart = start - prefix.length;
        const afterEnd = end + suffix.length;
        const nextValue = value.slice(0, beforeStart) + value.slice(start, end) + value.slice(afterEnd);
        return { value: nextValue, selectionStart: beforeStart, selectionEnd: beforeStart + (end - start) };
      }

      const nextValue = value.slice(0, start) + prefix + text + suffix + value.slice(end);
      const selectionStart = start + prefix.length;
      const selectionEnd = selectionStart + text.length;
      return { value: nextValue, selectionStart, selectionEnd };
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="h-10 px-3 bg-gray-100 dark:bg-gray-800/50 flex items-center gap-1.5 border-b border-gray-200 dark:border-gray-800">
        {/* Simple markdown toolbar mock */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleBold}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300 font-bold"
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleItalic}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300 italic"
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleUnderline}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300 underline"
          title="Underline"
        >
          U
        </button>
        <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-1"></div>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleCode}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300 font-mono text-sm"
          title="Code"
        >
          {'</>'}
        </button>
      </div>
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing your notes here..."
        className="flex-1 resize-none border-0 focus-visible:ring-0 bg-transparent p-4 font-mono text-sm rounded-none rounded-b-lg shadow-none"
      />
    </div>
  );
};

export default NotesEditor;
