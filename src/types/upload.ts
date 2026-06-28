export interface ParsedFileData {
  fileName: string;
  rows: Record<string, unknown>[];
  rowCount: number;
  columnCount: number;
}

export interface UploadState {
  fileName: string | null;
  rowCount: number;
  columnCount: number;
  parsedJson: Record<string, unknown>[] | null;
  successMessage: string | null;
  error: string | null;
  isUploading: boolean;
}

export const INITIAL_UPLOAD_STATE: UploadState = {
  fileName: null,
  rowCount: 0,
  columnCount: 0,
  parsedJson: null,
  successMessage: null,
  error: null,
  isUploading: false,
};
