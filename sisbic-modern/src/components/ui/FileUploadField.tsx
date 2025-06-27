import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import InputField from './InputField';
import Button from './Button';

interface FileUploadFieldProps {
  label: string;
  buttonLabel?: string;
  fileName?: string;
  onFileNameChange?: (fileName: string) => void;
  onFileSelect?: (file: File | null) => void;
  accept?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  className?: string;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  buttonLabel = "Escolher Arquivo",
  fileName,
  onFileNameChange,
  onFileSelect,
  accept = "*",
  disabled = false,
  error,
  required = false,
  className = ''
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    
    if (file && onFileNameChange) {
      onFileNameChange(file.name);
    }
    
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onFileNameChange) {
      onFileNameChange(e.target.value);
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-neutral-600 dark:text-slate-300 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <InputField
          label="Nome do Arquivo"
          type="text"
          value={fileName || ''}
          onChange={handleFileNameChange}
          placeholder="Ex: EDITAL PRPPG/UFBA 003/2025"
          disabled={disabled}
          error={error}
        />
        
        <div className="flex items-center gap-4">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
            accept={accept}
            disabled={disabled}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Button 
              variant="secondary" 
              type="button"
              disabled={disabled}
              className="inline-flex items-center gap-2"
            >
              <UploadCloud size={16} />
              {buttonLabel}
            </Button>
          </label>
          {selectedFile && (
            <span className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
              {selectedFile.name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploadField; 