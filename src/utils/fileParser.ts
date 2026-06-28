import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import type { ParsedFileData } from '../types/upload';

const ACCEPTED_EXTENSIONS = ['.csv', '.xlsx', '.xls'];

function getFileExtension(fileName: string): string {
  const dotIndex = fileName.lastIndexOf('.');
  return dotIndex >= 0 ? fileName.slice(dotIndex).toLowerCase() : '';
}

function countColumns(rows: Record<string, unknown>[]): number {
  if (rows.length === 0) return 0;
  const keys = new Set<string>();
  for (const row of rows) {
    Object.keys(row).forEach((key) => keys.add(key));
  }
  return keys.size;
}

function validateRows(rows: Record<string, unknown>[], fileName: string): ParsedFileData {
  if (rows.length === 0) {
    throw new Error('The uploaded file contains no data rows.');
  }

  const columnCount = countColumns(rows);
  if (columnCount === 0) {
    throw new Error('The uploaded file has no readable columns.');
  }

  return {
    fileName,
    rows,
    rowCount: rows.length,
    columnCount,
  };
}

async function parseCsvFile(file: File): Promise<Record<string, unknown>[]> {
  const text = await file.text();
  const parsed = Papa.parse<Record<string, unknown>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  const fatalErrors = parsed.errors.filter((err) => err.type !== 'FieldMismatch');
  if (fatalErrors.length > 0) {
    throw new Error(
      fatalErrors[0]?.message ?? 'Unable to parse the CSV file. Please check the format.',
    );
  }

  return parsed.data;
}

async function parseExcelFile(file: File): Promise<Record<string, unknown>[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });

  if (workbook.SheetNames.length === 0) {
    throw new Error('The Excel file does not contain any worksheets.');
  }

  const sheetName =
    workbook.SheetNames.find((name) => name.toLowerCase().includes('healthcare')) ??
    workbook.SheetNames[0];

  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    throw new Error('Unable to read the selected Excel worksheet.');
  }

  return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: '',
    raw: false,
  });
}

export function isAcceptedHealthcareFile(file: File): boolean {
  return ACCEPTED_EXTENSIONS.includes(getFileExtension(file.name));
}

export async function parseHealthcareFile(file: File): Promise<ParsedFileData> {
  if (!isAcceptedHealthcareFile(file)) {
    throw new Error('Unsupported file type. Please upload a .csv or .xlsx file.');
  }

  const extension = getFileExtension(file.name);
  let rows: Record<string, unknown>[];

  try {
    rows = extension === '.csv' ? await parseCsvFile(file) : await parseExcelFile(file);
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('Failed to read the uploaded file. Please try again.');
  }

  return validateRows(rows, file.name);
}
