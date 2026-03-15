import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownViewer = ({ content }) => {
  if (!content) return null;

  return (
    <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none 
                    prose-headings:text-foreground prose-a:text-primary 
                    prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                    prose-pre:bg-muted prose-pre:text-foreground prose-pre:border prose-pre:border-border prose-pre:rounded-xl
                    prose-img:rounded-xl prose-img:border prose-img:border-border prose-img:shadow-sm
                    prose-table:border prose-table:border-border prose-th:bg-muted/50 prose-th:p-2 prose-td:p-2 prose-td:border-t prose-td:border-border
                    prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                    w-full">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownViewer;
