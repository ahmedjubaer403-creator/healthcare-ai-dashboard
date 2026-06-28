import { AlertCircle, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import type { UploadState } from '../../types/upload';

interface UploadSummaryProps {
  upload: UploadState;
}

export function UploadSummary({ upload }: UploadSummaryProps) {
  if (!upload.fileName && !upload.error && !upload.isUploading) {
    return null;
  }

  return (
    <div className="upload-summary">
      {upload.error ? (
        <div className="upload-message upload-message-error">
          <AlertCircle size={18} />
          <span>{upload.error}</span>
        </div>
      ) : null}

      {upload.successMessage ? (
        <div className="upload-message upload-message-success">
          <CheckCircle2 size={18} />
          <span>{upload.successMessage}</span>
        </div>
      ) : null}

      {upload.fileName && !upload.error ? (
        <dl className="upload-meta">
          <div className="upload-meta-item">
            <dt>
              <FileSpreadsheet size={16} />
              File name
            </dt>
            <dd>{upload.fileName}</dd>
          </div>
          <div className="upload-meta-item">
            <dt>Rows</dt>
            <dd>{upload.rowCount.toLocaleString()}</dd>
          </div>
          <div className="upload-meta-item">
            <dt>Columns</dt>
            <dd>{upload.columnCount.toLocaleString()}</dd>
          </div>
        </dl>
      ) : null}
    </div>
  );
}
