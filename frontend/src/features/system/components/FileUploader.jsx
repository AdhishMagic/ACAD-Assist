import React, { useRef, useState } from 'react';

export const FileUploader = ({ onUpload, progress, isUploading }) => {
  const inputRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState('');

  const handleSelectClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setSelectedFileName(file.name);
    if (onUpload) {
      onUpload(file);
    }

    event.target.value = '';
  };

  return (
    <div className="w-full rounded-lg border border-gray-200 p-6">
      <input ref={inputRef} type="file" className="hidden" onChange={handleFileChange} />

      <button
        type="button"
        onClick={handleSelectClick}
        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Select File
      </button>

      <div className="mt-3 text-sm text-gray-600">
        {selectedFileName ? <p>Selected: {selectedFileName}</p> : <p>No file selected.</p>}
      </div>

      {isUploading ? (
        <div className="mt-3 text-sm text-gray-600">Uploading... {progress}%</div>
      ) : null}
    </div>
  );
};
