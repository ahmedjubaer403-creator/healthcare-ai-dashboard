import { useMemo } from 'react';
import { TableProperties } from 'lucide-react';
import type { UploadState } from '../../types/upload';
import { buildDataPreviewModel } from '../../utils/dataQuality';
import { CollapsibleSection } from './CollapsibleSection';
import { DataQualitySummary, EMPTY_DATA_QUALITY } from './DataQualitySummary';
import { DataPreviewTable } from './DataPreviewTable';

interface DataPreviewSectionProps {
  upload: UploadState;
}

export function DataPreviewSection({ upload }: DataPreviewSectionProps) {
  const previewModel = useMemo(() => {
    if (!upload.parsedJson?.length) return null;
    return buildDataPreviewModel(upload.parsedJson);
  }, [upload.parsedJson]);

  const hasData = previewModel !== null;

  return (
    <CollapsibleSection title="Data Preview">
      <div className="data-preview-body">
        <DataQualitySummary
          quality={previewModel?.quality ?? EMPTY_DATA_QUALITY}
          isEmpty={!hasData}
        />
        {hasData ? (
          <DataPreviewTable
            columns={previewModel.columns}
            rows={previewModel.previewRows}
            totalRows={previewModel.quality.totalRows}
          />
        ) : (
          <div className="data-preview-placeholder">
            <TableProperties size={28} />
            <p>No preview rows available yet.</p>
          </div>
        )}
      </div>
    </CollapsibleSection>
  );
}
