import { jsPDF } from 'jspdf';

const sanitizeFilename = (value = 'note') => {
  return String(value)
    .trim()
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s+/g, ' ')
    .slice(0, 120);
};

const stripMarkdown = (markdown = '') => {
  let text = String(markdown);

  // Remove fenced code blocks
  text = text.replace(/```[\s\S]*?```/g, '');
  // Inline code
  text = text.replace(/`([^`]+)`/g, '$1');
  // Images
  text = text.replace(/!\[[^\]]*\]\(([^)]+)\)/g, '$1');
  // Links: [text](url) -> text (url)
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)');
  // Headings / emphasis markers
  text = text.replace(/^\s{0,3}#{1,6}\s+/gm, '');
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  text = text.replace(/\*([^*]+)\*/g, '$1');
  text = text.replace(/_([^_]+)_/g, '$1');
  // Blockquotes
  text = text.replace(/^\s{0,3}>\s?/gm, '');
  // Lists
  text = text.replace(/^\s*[-*+]\s+/gm, '• ');
  text = text.replace(/^\s*\d+\.\s+/gm, '• ');
  // Tables pipes
  text = text.replace(/\|/g, ' ');

  // Collapse whitespace
  text = text.replace(/\n{3,}/g, '\n\n').trim();
  return text;
};

export const downloadNoteAsPdf = (note) => {
  if (!note) return;

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 48;
  const maxWidth = pageWidth - margin * 2;

  const title = note?.title || 'Note';
  const subject = note?.subject ? `Subject: ${note.subject}` : '';
  const author = note?.author ? `Author: ${note.author}` : '';
  const createdAt = note?.createdAt ? `Date: ${new Date(note.createdAt).toLocaleDateString()}` : '';
  const metaLine = [subject, author, createdAt].filter(Boolean).join('   •   ');

  let cursorY = margin;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  const titleLines = doc.splitTextToSize(title, maxWidth);
  doc.text(titleLines, margin, cursorY);
  cursorY += titleLines.length * 22;

  if (metaLine) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(90);
    const metaLines = doc.splitTextToSize(metaLine, maxWidth);
    doc.text(metaLines, margin, cursorY);
    cursorY += metaLines.length * 14 + 10;
    doc.setTextColor(0);
  } else {
    cursorY += 10;
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);

  const body = stripMarkdown(note?.content || note?.excerpt || '');
  const lines = doc.splitTextToSize(body, maxWidth);
  const lineHeight = 16;

  for (const line of lines) {
    if (cursorY + lineHeight > pageHeight - margin) {
      doc.addPage();
      cursorY = margin;
    }
    doc.text(line, margin, cursorY);
    cursorY += lineHeight;
  }

  const filename = sanitizeFilename(`${title}.pdf`);
  doc.save(filename);
};

export const printNote = (note) => {
  if (!note) return;

  const title = note?.title || 'Note';
  const subject = note?.subject || '';
  const author = note?.author || '';
  const createdAt = note?.createdAt ? new Date(note.createdAt).toLocaleDateString() : '';

  const body = stripMarkdown(note?.content || note?.excerpt || '');
  const safeTitle = String(title).replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeBody = body
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const printWindow = window.open('', '_blank', 'noopener,noreferrer');
  if (!printWindow) return;

  printWindow.document.open();
  printWindow.document.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${safeTitle}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 32px; color: #111; }
      h1 { font-size: 22px; margin: 0 0 8px; }
      .meta { font-size: 12px; color: #555; margin-bottom: 18px; }
      .rule { height: 1px; background: #e5e7eb; margin: 18px 0; }
      pre { white-space: pre-wrap; word-wrap: break-word; font-family: inherit; font-size: 13px; line-height: 1.5; }
      @media print { body { padding: 0; } }
    </style>
  </head>
  <body>
    <h1>${safeTitle}</h1>
    <div class="meta">
      ${[subject && `Subject: ${subject}`, author && `Author: ${author}`, createdAt && `Date: ${createdAt}`].filter(Boolean).join(' &nbsp; • &nbsp; ')}
    </div>
    <div class="rule"></div>
    <pre>${safeBody}</pre>
    <script>
      window.onload = function() {
        window.focus();
        window.print();
        window.close();
      };
    </script>
  </body>
</html>`);
  printWindow.document.close();
};
