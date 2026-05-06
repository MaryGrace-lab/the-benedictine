"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, AlertCircle, FileCheck, RefreshCw, Trash2, FileText, Image } from 'lucide-react';
import { UploadedFile } from '../_types/admission';

// --- HELPERS (unchanged) ---
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (fileType: string) => {
  if (fileType.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
  if (fileType.includes('image')) return <Image className="w-5 h-5 text-blue-500" />;
  return <FileText className="w-5 h-5 text-gray-500" />;
};

interface FileUploadFieldProps {
  label: string;
  required?: boolean;
  acceptedTypes?: string[];
  maxSize?: number;
  maxFiles?: number;
  value: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  onFileUpload?: (file: File) => Promise<string>;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  required = false,
  acceptedTypes = ['.jpg', '.jpeg', '.png', '.pdf'],
  maxSize = 5,
  maxFiles = 1,
  value,
  onChange,
  onFileUpload,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  // 🔧 Fix: Keep a mutable ref to the latest value to avoid stale closures
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const validateFile = (file: File): string | null => {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      return `File type not supported. Please upload ${acceptedTypes.join(', ')}`;
    }
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSize) {
      return `File size too large. Maximum size is ${maxSize}MB`;
    }
    return null;
  };

  const processFile = async (file: File): Promise<UploadedFile> => {
    const validationError = validateFile(file);
    let preview = undefined;
    if (file.type.startsWith('image/')) {
      preview = URL.createObjectURL(file);
    }
    return {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: validationError ? 'error' : 'pending',
      preview,
      error: validationError || undefined,
    };
  };

  const uploadFile = async (fileObj: UploadedFile) => {
    if (!onFileUpload) return;
    setUploadingFiles(prev => new Set(prev).add(fileObj.id));

    // Use the ref to get the latest state, not the stale prop
    const currentFiles = valueRef.current;

    // Start uploading
    onChange(currentFiles.map(f =>
      f.id === fileObj.id ? { ...f, status: 'uploading' as const, progress: 0 } : f
    ));

    try {
      // Simulate progress (optional)
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        onChange(
          valueRef.current.map(f =>
            f.id === fileObj.id ? { ...f, progress } : f
          )
        );
      }
      // Actually upload and get URL
      const url = await onFileUpload(fileObj.file);
      onChange(
        valueRef.current.map(f =>
          f.id === fileObj.id ? { ...f, status: 'success' as const, progress: 100, url } : f
        )
      );
    } catch (err) {
      onChange(
        valueRef.current.map(f =>
          f.id === fileObj.id ? { ...f, status: 'error' as const, error: 'Upload failed. Please try again.' } : f
        )
      );
    } finally {
      setUploadingFiles(prev => {
        const next = new Set(prev);
        next.delete(fileObj.id);
        return next;
      });
    }
  };

  const handleFiles = async (files: FileList | File[]) => {
    setError(null);
    const fileArray = Array.from(files);
    const remainingSlots = maxFiles - value.length;
    if (fileArray.length > remainingSlots) {
      setError(`You can only upload ${maxFiles} file(s) total. ${remainingSlots} slot(s) remaining.`);
      return;
    }

    const newFiles = await Promise.all(fileArray.map(processFile));
    const invalidFiles = newFiles.filter(f => f.status === 'error');
    if (invalidFiles.length > 0) {
      setError(invalidFiles[0].error || 'Invalid file');
      return;
    }

    // Build the new array (including old ones)
    const updatedFiles = [...value, ...newFiles.filter(f => f.status !== 'error')];
    // Update the ref immediately so uploadFile sees the new files
    valueRef.current = updatedFiles;
    onChange(updatedFiles);

    // Start uploading the new files
    if (onFileUpload) {
      for (const fileObj of newFiles.filter(f => f.status !== 'error')) {
        await uploadFile(fileObj);
      }
    }
  };

  const removeFile = (id: string) => {
    const removedFile = value.find(f => f.id === id);
    if (removedFile?.preview) URL.revokeObjectURL(removedFile.preview);
    onChange(value.filter(f => f.id !== id));
  };

  const replaceFile = async (id: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = acceptedTypes.join(',');
    input.onchange = async (e) => {
      const newFile = (e.target as HTMLInputElement).files?.[0];
      if (!newFile) return;
      const validationError = validateFile(newFile);
      if (validationError) {
        setError(validationError);
        return;
      }
      let preview = undefined;
      if (newFile.type.startsWith('image/')) preview = URL.createObjectURL(newFile);
      const updatedFiles = value.map(f =>
        f.id === id
          ? {
              ...f,
              file: newFile,
              name: newFile.name,
              size: newFile.size,
              type: newFile.type,
              preview,
              status: 'pending' as const,
              error: undefined,
            }
          : f
      );
      const oldFile = value.find(f => f.id === id);
      if (oldFile?.preview) URL.revokeObjectURL(oldFile.preview);
      onChange(updatedFiles);
      if (onFileUpload) {
        const newFileObj = updatedFiles.find(f => f.id === id);
        if (newFileObj) await uploadFile(newFileObj);
      }
    };
    input.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
  };

  const labelClass = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <div className="space-y-3">
      <label className={labelClass}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}
          ${value.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => {
          if (value.length < maxFiles) {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = acceptedTypes.join(',');
            input.multiple = maxFiles > 1;
            input.onchange = (e) => {
              const files = (e.target as HTMLInputElement).files;
              if (files) handleFiles(files);
            };
            input.click();
          }
        }}
      >
        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
        {isDragging ? (
          <p className="text-blue-600">Drop your files here...</p>
        ) : (
          <>
            <p className="text-slate-600">
              Drag & drop or <span className="text-blue-600 font-medium">browse</span>
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Supported: {acceptedTypes.join(', ')} • Max size: {maxSize}MB
            </p>
          </>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <AnimatePresence>
        {value.map((file) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-slate-50 rounded-lg p-3 border border-slate-200"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {file.preview ? (
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border border-slate-200 flex-shrink-0">
                    <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="flex-shrink-0">{getFileIcon(file.type)}</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>{formatFileSize(file.size)}</span>
                    {file.status === 'uploading' && (
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                        <span>{file.progress}%</span>
                      </div>
                    )}
                    {file.status === 'success' && (
                      <span className="flex items-center gap-1 text-green-600">
                        <FileCheck className="w-3 h-3" /> Uploaded
                      </span>
                    )}
                    {file.status === 'error' && (
                      <span className="text-red-600">{file.error}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {file.status === 'error' && (
                  <button
                    onClick={() => uploadFile(file)}
                    disabled={uploadingFiles.has(file.id)}
                    className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                    title="Retry upload"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${uploadingFiles.has(file.id) ? 'animate-spin' : ''}`}
                    />
                  </button>
                )}
                <button
                  onClick={() => replaceFile(file.id)}
                  className="p-1.5 text-slate-600 hover:bg-slate-200 rounded transition-colors"
                  title="Replace file"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FileUploadField;