import { useCallback, useState } from 'react';
import type { UploadState } from '../types/upload';
import { INITIAL_UPLOAD_STATE } from '../types/upload';
import { parseHealthcareFile } from '../utils/fileParser';
import { mapRowsToHealthcareRecords } from '../utils/dataLoader';
import type { HealthcareRecord } from '../types/healthcare';

interface UseFileUploadOptions {
  onDataLoaded: (records: HealthcareRecord[]) => void;
  onDataCleared?: () => void;
}

export function useFileUpload({ onDataLoaded, onDataCleared }: UseFileUploadOptions) {
  const [upload, setUpload] = useState<UploadState>(INITIAL_UPLOAD_STATE);

  const uploadFile = useCallback(
    async (file: File) => {
      setUpload((prev) => ({
        ...prev,
        isUploading: true,
        error: null,
        successMessage: null,
      }));

      try {
        const parsed = await parseHealthcareFile(file);
        const records = mapRowsToHealthcareRecords(parsed.rows);

        if (records.length === 0) {
          throw new Error(
            'No valid patient records found. Ensure the file includes a "Patient ID" column.',
          );
        }

        onDataLoaded(records);

        setUpload({
          fileName: parsed.fileName,
          rowCount: parsed.rowCount,
          columnCount: parsed.columnCount,
          parsedJson: parsed.rows,
          successMessage: `Successfully loaded ${parsed.fileName}.`,
          error: null,
          isUploading: false,
        });
      } catch (error) {
        setUpload((prev) => ({
          ...prev,
          isUploading: false,
          successMessage: null,
          error:
            error instanceof Error
              ? error.message
              : 'Something went wrong while parsing the file.',
        }));
      }
    },
    [onDataLoaded],
  );

  const clearUpload = useCallback(() => {
    setUpload(INITIAL_UPLOAD_STATE);
    onDataCleared?.();
  }, [onDataCleared]);

  return {
    upload,
    uploadFile,
    clearUpload,
    hasUploadedDataset: Boolean(upload.parsedJson?.length),
  };
}
