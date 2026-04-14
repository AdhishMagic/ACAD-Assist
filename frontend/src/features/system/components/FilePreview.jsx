import React from 'react';
import { FileText, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getFileUrl } from '@/shared/lib/http/fileUrl';

export const FilePreview = ({ file }) => {
  if (!file) return null;

  const normalizedUrl = (() => {
    return getFileUrl(file.file_url || file.url || file.file || '') || '';
  })();

  const normalizedType = String(file.file_type || file.type || '').toLowerCase();
  const normalizedName = String(file.original_name || file.name || '').toLowerCase();
  const isImage =
    normalizedType.startsWith('image/') ||
    /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(normalizedUrl) ||
    /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(normalizedName);
  const isPdf =
    normalizedType === 'application/pdf' ||
    /\.pdf($|[?#])/i.test(normalizedUrl) ||
    normalizedName.endsWith('.pdf');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2 overflow-hidden bg-gray-50 border-gray-200">
        <CardContent className="p-0 h-[600px] flex items-center justify-center relative">
          {isImage ? (
            <img src={normalizedUrl} alt={file.original_name || file.name || 'File preview'} className="max-w-full max-h-full object-contain" />
          ) : isPdf ? (
            <embed src={normalizedUrl} type="application/pdf" className="w-full h-full" />
          ) : (
            <div className="text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Preview not available for this file type.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 break-words">{file.original_name || file.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{file.file_type || file.type}</p>
          </div>

          <div className="space-y-3 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Size</span>
              <span className="font-medium text-gray-900">{((file.size_bytes || file.size || 0) / 1024 / 1024).toFixed(2)} MB</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Uploaded</span>
              <span className="font-medium text-gray-900">
                {file.created_at || file.createdAt ? new Date(file.created_at || file.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>

          <Button className="w-full" variant="outline" onClick={() => window.open(normalizedUrl, '_blank')}>
            <Download className="h-4 w-4 mr-2" />
            Download File
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
