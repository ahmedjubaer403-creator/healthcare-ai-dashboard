import { FileUpload } from './FileUpload';
import { UploadSummary } from './UploadSummary';
import type { UploadState } from '../../types/upload';

interface FileUploadPanelProps {
  upload: UploadState;
  onFileSelect: (file: File) => void;
  onClearDataset?: () => void;
}

export function FileUploadPanel({ upload, onFileSelect, onClearDataset }: FileUploadPanelProps) {
  const hasDataset = Boolean(upload.parsedJson?.length);

  return (
    <section className="upload-panel">
      <div className="upload-panel-header">
        <h2>Data Upload</h2>
        <p>Upload a healthcare dataset (.csv or .xlsx) to begin dashboard analytics.</p>
      </div>
      <div className="upload-panel-actions">
        <FileUpload
          onFileSelect={onFileSelect}
          isUploading={upload.isUploading}
        />
        {hasDataset && onClearDataset ? (
          <button type="button" className="clear-dataset-button" onClick={onClearDataset}>
            Remove Dataset
          </button>
        ) : null}
      </div>
      <UploadSummary upload={upload} />
    </section>
  );
}
