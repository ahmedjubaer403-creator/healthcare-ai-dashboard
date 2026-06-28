import { useRef } from 'react';
import type { ChangeEvent } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
  disabled?: boolean;
}

export function FileUpload({ onFileSelect, isUploading, disabled = false }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    event.target.value = '';
  }

  return (
    <div className="file-upload">
      <input
        ref={inputRef}
        id="healthcare-file-upload"
        type="file"
        accept=".csv,.xlsx,.xls"
        className="file-upload-input"
        onChange={handleChange}
        disabled={disabled || isUploading}
      />
      <label
        htmlFor="healthcare-file-upload"
        className={`file-upload-label${disabled || isUploading ? ' is-disabled' : ''}`}
      >
        <Upload size={18} />
        {isUploading ? 'Parsing file…' : 'Choose CSV or Excel file'}
      </label>
      <p className="file-upload-hint">Supported formats: .csv, .xlsx</p>
    </div>
  );
}
