import React, { useCallback } from 'react';
import { Upload, Image, FileText } from 'lucide-react';

interface FileUploadZoneProps {
  accept: string;
  multiple?: boolean;
  onUpload: (files: File[]) => void;
  type: 'image' | 'document';
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  accept,
  multiple = false,
  onUpload,
  type,
}) => {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    onUpload(files);
  }, [onUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onUpload(files);
    }
  }, [onUpload]);

  return (
    <label
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={type === 'image' ? 'file-upload' : 'document-upload'}
    >
      <div className="flex flex-col items-center justify-center text-center">
        {type === 'image' ? (
          <Image className="h-8 w-8 text-secondary-400 mb-2" />
        ) : (
          <Upload className="h-8 w-8 text-secondary-400 mb-2" />
        )}
        <span className="text-sm text-secondary-600">
          {type === 'image' 
            ? 'Drop product images here or click to upload'
            : 'Drop documents here or click to upload'}
        </span>
        <span className="text-xs text-secondary-400 mt-1">
          {type === 'image'
            ? 'Supports: JPG, PNG, WebP (max 5MB)'
            : 'Supports: PDF, DOC, DOCX (max 10MB)'}
        </span>
      </div>
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />
    </label>
  );
};

export default FileUploadZone;