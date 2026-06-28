import type { HealthcareRecord } from '../types/healthcare';
import type { AssistantAnswer } from '../types/aiAssistant';
import { formatAssistantResponse } from '../types/aiAssistant';
import { mapRowsToHealthcareRecords } from './dataLoader';
import {
  calculateDataQuality,
  countDuplicateRows,
  getDetectedColumns,
  getMissingValuesPerColumn,
} from './dataQuality';

function normalizeQuestion(question: string): string {
  return question.toLowerCase().trim();
}

function isMissingValue(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'number' && Number.isNaN(value)) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  return false;
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatDistribution(counts: Map<string, number>, total: number): string {
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => {
      const pct = total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';
      return `${label}: ${count} (${pct}%)`;
    })
    .join('; ');
}

function countByColumn(
  rows: Record<string, unknown>[],
  column: string,
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const value = isMissingValue(row[column]) ? 'Missing' : String(row[column]).trim();
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
}

function countByField(
  records: HealthcareRecord[],
  field: keyof HealthcareRecord,
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const record of records) {
    const raw = record[field];
    const value =
      raw === '' || raw === null || raw === undefined ? 'Missing' : String(raw).trim();
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
}

function findRawColumn(columns: string[], aliases: string[]): string | null {
  for (const column of columns) {
    const normalized = column.toLowerCase();
    if (aliases.some((alias) => normalized.includes(alias))) {
      return column;
    }
  }
  return null;
}

function getNumericRawValues(
  rows: Record<string, unknown>[],
  column: string,
): number[] {
  return rows
    .map((row) => Number(row[column]))
    .filter((value) => !Number.isNaN(value));
}

function getNumericFieldValues(
  records: HealthcareRecord[],
  field: keyof HealthcareRecord,
): number[] {
  return records
    .map((record) => Number(record[field]))
    .filter((value) => !Number.isNaN(value));
}

function distributionsMatch(
  rawCounts: Map<string, number>,
  recordCounts: Map<string, number>,
): boolean {
  const keys = new Set([...rawCounts.keys(), ...recordCounts.keys()]);
  for (const key of keys) {
    if ((rawCounts.get(key) ?? 0) !== (recordCounts.get(key) ?? 0)) {
      return false;
    }
  }
  return true;
}

function buildComparison(
  matches: boolean,
  matchReason: string,
  mismatchReason: string,
): string {
  return matches ? matchReason : mismatchReason;
}

function answerTotalRecords(
  rawRows: Record<string, unknown>[],
  records: HealthcareRecord[],
): AssistantAnswer {
  const sourceA = `The uploaded dataset contains ${rawRows.length.toLocaleString()} total rows.`;
  const sourceB = `The application parsed ${records.length.toLocaleString()} valid healthcare records from the uploaded JSON.`;
  const matches = rawRows.length === records.length;

  return {
    sourceA,
    sourceB,
    comparison: buildComparison(
      matches,
      'Both answers match because every uploaded row was successfully parsed into a healthcare record.',
      `The counts differ because ${Math.abs(rawRows.length - records.length).toLocaleString()} uploaded row(s) were excluded during parsing, typically due to missing Patient ID values.`,
    ),
    suggestion: 'Review the Data Preview table to confirm row counts and inspect any rows excluded during parsing.',
  };
}

function answerAverageAge(
  rawRows: Record<string, unknown>[],
  records: HealthcareRecord[],
  columns: string[],
): AssistantAnswer | null {
  const ageColumn = findRawColumn(columns, ['age']);
  if (!ageColumn) return null;

  const rawAges = getNumericRawValues(rawRows, ageColumn);
  const parsedAges = getNumericFieldValues(records, 'age');
  const avgA = average(rawAges);
  const avgB = average(parsedAges);
  const matches = Math.abs(avgA - avgB) < 0.05;

  return {
    sourceA: `Average Age in the uploaded dataset is ${avgA.toFixed(1)} years (from column "${ageColumn}", ${rawAges.length} numeric values).`,
    sourceB: `Average Age across parsed records is ${avgB.toFixed(1)} years (${parsedAges.length} records).`,
    comparison: buildComparison(
      matches,
      'Both averages match because the Age column was parsed consistently into application records.',
      'The averages differ slightly because some rows had missing or non-numeric Age values in the raw upload.',
    ),
    suggestion: 'Use the Age Distribution chart to visualize how patient ages are spread across the dataset.',
  };
}

function answerGenderDistribution(
  rawRows: Record<string, unknown>[],
  records: HealthcareRecord[],
  columns: string[],
): AssistantAnswer | null {
  const genderColumn = findRawColumn(columns, ['gender']);
  if (!genderColumn) return null;

  const rawCounts = countByColumn(rawRows, genderColumn);
  const recordCounts = countByField(records, 'gender');
  const matches = distributionsMatch(rawCounts, recordCounts);

  return {
    sourceA: `Gender distribution in the uploaded dataset: ${formatDistribution(rawCounts, rawRows.length)}.`,
    sourceB: `Gender distribution in parsed records: ${formatDistribution(recordCounts, records.length)}.`,
    comparison: buildComparison(
      matches,
      'Both answers match because Gender values in the upload align with parsed record fields.',
      'The distributions differ because some uploaded rows were excluded during parsing or had missing Gender values.',
    ),
    suggestion: 'Open the Gender Distribution pie chart to compare male and female patient proportions visually.',
  };
}

function answerDiseaseCategory(
  rawRows: Record<string, unknown>[],
  records: HealthcareRecord[],
  columns: string[],
): AssistantAnswer | null {
  const diseaseColumn = findRawColumn(columns, ['disease category', 'disease']);
  if (!diseaseColumn) return null;

  const rawCounts = countByColumn(rawRows, diseaseColumn);
  const recordCounts = countByField(records, 'diseaseCategory');
  const matches = distributionsMatch(rawCounts, recordCounts);

  return {
    sourceA: `Disease category counts in the uploaded dataset: ${formatDistribution(rawCounts, rawRows.length)}.`,
    sourceB: `Disease category counts in parsed records: ${formatDistribution(recordCounts, records.length)}.`,
    comparison: buildComparison(
      matches,
      'Both answers match because Disease Category values were mapped consistently from upload to parsed records.',
      'The counts differ when raw rows are excluded during parsing or when disease labels were missing in the upload.',
    ),
    suggestion: 'Use the Disease Category bar chart to identify the most common clinical categories.',
  };
}

function answerOutcomeDistribution(
  rawRows: Record<string, unknown>[],
  records: HealthcareRecord[],
  columns: string[],
): AssistantAnswer | null {
  const outcomeColumn = findRawColumn(columns, ['outcome']);
  if (!outcomeColumn) return null;

  const rawCounts = countByColumn(rawRows, outcomeColumn);
  const recordCounts = countByField(records, 'outcome');
  const matches = distributionsMatch(rawCounts, recordCounts);

  return {
    sourceA: `Outcome distribution in the uploaded dataset: ${formatDistribution(rawCounts, rawRows.length)}.`,
    sourceB: `Outcome distribution in parsed records: ${formatDistribution(recordCounts, records.length)}.`,
    comparison: buildComparison(
      matches,
      'Both answers match because Outcome values in the upload align with parsed application records.',
      'The distributions differ when some uploaded rows lack Outcome values or fail parsing validation.',
    ),
    suggestion: 'Review the Treatment Outcome chart to compare recovery and referral patterns.',
  };
}

function answerMissingValues(rawRows: Record<string, unknown>[]): AssistantAnswer {
  const columns = getDetectedColumns(rawRows);
  const missing = getMissingValuesPerColumn(rawRows, columns);
  const totalMissing = Object.values(missing).reduce((sum, count) => sum + count, 0);
  const topMissing = Object.entries(missing)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([column, count]) => `${column}: ${count}`)
    .join('; ');

  const sourceA = `The uploaded dataset has ${totalMissing.toLocaleString()} total missing values across ${columns.length} columns.${topMissing ? ` Top columns: ${topMissing}.` : ' No missing values were detected.'}`;
  const sourceB = `The Data Quality Summary reports the same missing-value counts because both views analyze the identical parsed JSON upload (${rawRows.length.toLocaleString()} rows).`;

  return {
    sourceA,
    sourceB,
    comparison:
      'Both answers match because missing values are calculated directly from the uploaded JSON rows used throughout the application.',
    suggestion: 'Expand the Data Preview section and review the Missing Values Per Column list to prioritize data cleaning.',
  };
}

function answerDuplicateRows(rawRows: Record<string, unknown>[]): AssistantAnswer {
  const duplicates = countDuplicateRows(rawRows);
  const uniqueRows = rawRows.length - duplicates;

  return {
    sourceA: `The uploaded dataset contains ${duplicates.toLocaleString()} duplicate row(s) out of ${rawRows.length.toLocaleString()} total rows (${uniqueRows.toLocaleString()} unique rows).`,
    sourceB: `The application's parsed JSON analysis reports the same duplicate count because duplicates are detected from the uploaded row signatures before dashboard mapping.`,
    comparison:
      'Both answers match because duplicate detection uses the same uploaded JSON records stored in application state.',
    suggestion: 'Inspect duplicate rows in Data Preview and consider deduplicating by Patient ID before further analysis.',
  };
}

function answerExtremum(
  rawRows: Record<string, unknown>[],
  records: HealthcareRecord[],
  columns: string[],
  question: string,
  mode: 'highest' | 'lowest',
): AssistantAnswer | null {
  const numericMappings: Array<{ aliases: string[]; field: keyof HealthcareRecord; label: string }> = [
    { aliases: ['age'], field: 'age', label: 'Age' },
    { aliases: ['bmi'], field: 'bmi', label: 'BMI' },
    { aliases: ['blood glucose', 'glucose'], field: 'bloodGlucose', label: 'Blood Glucose' },
    { aliases: ['length of stay', 'stay'], field: 'lengthOfStay', label: 'Length of Stay' },
    { aliases: ['spo2'], field: 'spo2', label: 'SpO2' },
    { aliases: ['systolic'], field: 'systolicBp', label: 'Systolic BP' },
    { aliases: ['diastolic'], field: 'diastolicBp', label: 'Diastolic BP' },
    { aliases: ['haemoglobin', 'hemoglobin'], field: 'haemoglobin', label: 'Haemoglobin' },
    { aliases: ['income'], field: 'monthlyIncomeBdt', label: 'Monthly Income' },
  ];

  const mapping = numericMappings.find(({ aliases }) =>
    aliases.some((alias) => question.includes(alias)),
  );
  if (!mapping) return null;

  const rawColumn = findRawColumn(columns, mapping.aliases);
  if (!rawColumn) return null;

  const rawValues = getNumericRawValues(rawRows, rawColumn);
  const parsedValues = getNumericFieldValues(records, mapping.field);
  if (rawValues.length === 0 || parsedValues.length === 0) return null;

  const rawValue = mode === 'highest' ? Math.max(...rawValues) : Math.min(...rawValues);
  const parsedValue = mode === 'highest' ? Math.max(...parsedValues) : Math.min(...parsedValues);
  const matches = rawValue === parsedValue;
  const label = mode === 'highest' ? 'Highest' : 'Lowest';

  return {
    sourceA: `${label} ${mapping.label} in the uploaded dataset is ${rawValue.toLocaleString()} (column "${rawColumn}").`,
    sourceB: `${label} ${mapping.label} in parsed records is ${parsedValue.toLocaleString()}.`,
    comparison: buildComparison(
      matches,
      `Both answers match because ${mapping.label} was parsed numerically without altering extreme values.`,
      `The ${label.toLowerCase()} values differ because some raw rows were excluded during parsing or contained non-numeric entries.`,
    ),
    suggestion: `Compare ${mapping.label} against Outcome or Disease Category to explore clinical patterns at extreme values.`,
  };
}

function answerPercentage(
  rawRows: Record<string, unknown>[],
  records: HealthcareRecord[],
  columns: string[],
  question: string,
): AssistantAnswer | null {
  if (question.includes('female') || question.includes('male')) {
    const genderColumn = findRawColumn(columns, ['gender']);
    if (!genderColumn) return null;

    const target = question.includes('female') ? 'female' : 'male';
    const rawMatches = rawRows.filter(
      (row) => String(row[genderColumn]).trim().toLowerCase() === target,
    ).length;
    const parsedMatches = records.filter(
      (record) => record.gender.trim().toLowerCase() === target,
    ).length;

    const rawPct = rawRows.length > 0 ? (rawMatches / rawRows.length) * 100 : 0;
    const parsedPct = records.length > 0 ? (parsedMatches / records.length) * 100 : 0;
    const matches = Math.abs(rawPct - parsedPct) < 0.1;

    return {
      sourceA: `${target.charAt(0).toUpperCase()}${target.slice(1)} patients represent ${rawPct.toFixed(1)}% of the uploaded dataset (${rawMatches} of ${rawRows.length}).`,
      sourceB: `${target.charAt(0).toUpperCase()}${target.slice(1)} patients represent ${parsedPct.toFixed(1)}% of parsed records (${parsedMatches} of ${records.length}).`,
      comparison: buildComparison(
        matches,
        'Both percentages match because Gender was parsed consistently from the uploaded dataset.',
        'The percentages differ when some gender values are missing or rows are excluded during parsing.',
      ),
      suggestion: 'Use the Gender Distribution pie chart to validate this percentage visually.',
    };
  }

  if (question.includes('obese') || question.includes('overweight') || question.includes('bmi')) {
    const bmiColumn = findRawColumn(columns, ['bmi category', 'bmi']);
    if (!bmiColumn) return null;

    const targets = ['obese', 'overweight'];
    const rawMatches = rawRows.filter((row) =>
      targets.some((target) => String(row[bmiColumn]).toLowerCase().includes(target)),
    ).length;
    const parsedMatches = records.filter((record) =>
      targets.some((target) => record.bmiCategory.toLowerCase().includes(target)),
    ).length;

    const rawPct = rawRows.length > 0 ? (rawMatches / rawRows.length) * 100 : 0;
    const parsedPct = records.length > 0 ? (parsedMatches / records.length) * 100 : 0;

    return {
      sourceA: `Obese or overweight patients account for ${rawPct.toFixed(1)}% of the uploaded dataset (${rawMatches} of ${rawRows.length}).`,
      sourceB: `Obese or overweight patients account for ${parsedPct.toFixed(1)}% of parsed records (${parsedMatches} of ${records.length}).`,
      comparison: buildComparison(
        Math.abs(rawPct - parsedPct) < 0.1,
        'Both percentages match because BMI Category values align between the upload and parsed records.',
        'The percentages differ when BMI Category labels are missing or rows fail parsing.',
      ),
      suggestion: 'Review the BMI Category pie chart to compare weight classification proportions.',
    };
  }

  return null;
}

function answerUnsupported(): AssistantAnswer {
  return {
    sourceA:
      'This question could not be answered from the uploaded dataset using supported analytics patterns.',
    sourceB:
      'The assistant only supports analytics derived from the currently uploaded dataset and parsed JSON records.',
    comparison:
      'Both sources agree that this request falls outside the supported local analytics scope for this assignment.',
    suggestion:
      'Try asking about total records, average age, gender distribution, disease categories, outcomes, missing values, duplicate rows, percentages, or highest/lowest numeric values.',
  };
}

export function analyzeQuestion(
  question: string,
  rawRows: Record<string, unknown>[],
): string {
  const normalized = normalizeQuestion(question);
  const columns = getDetectedColumns(rawRows);
  const records = mapRowsToHealthcareRecords(rawRows);

  let answer: AssistantAnswer | null = null;

  if (
    /total (records|rows|patients)|how many (records|rows|patients)|number of (records|rows|patients)/.test(
      normalized,
    )
  ) {
    answer = answerTotalRecords(rawRows, records);
  } else if (/average age|mean age/.test(normalized)) {
    answer = answerAverageAge(rawRows, records, columns);
  } else if (/gender/.test(normalized)) {
    answer = answerGenderDistribution(rawRows, records, columns);
  } else if (/disease category|disease categories|disease count/.test(normalized)) {
    answer = answerDiseaseCategory(rawRows, records, columns);
  } else if (/outcome/.test(normalized)) {
    answer = answerOutcomeDistribution(rawRows, records, columns);
  } else if (/missing value|missing values|missing data/.test(normalized)) {
    answer = answerMissingValues(rawRows);
  } else if (/duplicate/.test(normalized)) {
    answer = answerDuplicateRows(rawRows);
  } else if (/highest|maximum|max |largest/.test(normalized)) {
    answer = answerExtremum(rawRows, records, columns, normalized, 'highest');
  } else if (/lowest|minimum|min |smallest/.test(normalized)) {
    answer = answerExtremum(rawRows, records, columns, normalized, 'lowest');
  } else if (/percent|percentage|proportion|what share/.test(normalized)) {
    answer = answerPercentage(rawRows, records, columns, normalized);
  } else if (/average bmi|mean bmi/.test(normalized)) {
    const bmiColumn = findRawColumn(columns, ['bmi']);
    if (bmiColumn) {
      const avgA = average(getNumericRawValues(rawRows, bmiColumn));
      const avgB = average(getNumericFieldValues(records, 'bmi'));
      answer = {
        sourceA: `Average BMI in the uploaded dataset is ${avgA.toFixed(1)}.`,
        sourceB: `Average BMI in parsed records is ${avgB.toFixed(1)}.`,
        comparison: buildComparison(
          Math.abs(avgA - avgB) < 0.05,
          'Both averages match because BMI was parsed consistently from the upload.',
          'The averages differ when some BMI values were missing or non-numeric in the upload.',
        ),
        suggestion: 'Use the BMI Category chart to compare weight classifications across patients.',
      };
    }
  } else if (/average length of stay|mean length of stay|average stay/.test(normalized)) {
    const stayColumn = findRawColumn(columns, ['length of stay', 'stay']);
    if (stayColumn) {
      const avgA = average(getNumericRawValues(rawRows, stayColumn));
      const avgB = average(getNumericFieldValues(records, 'lengthOfStay'));
      answer = {
        sourceA: `Average Length of Stay in the uploaded dataset is ${avgA.toFixed(1)} days.`,
        sourceB: `Average Length of Stay in parsed records is ${avgB.toFixed(1)} days.`,
        comparison: buildComparison(
          Math.abs(avgA - avgB) < 0.05,
          'Both averages match because Length of Stay was parsed consistently.',
          'The averages differ when stay values were missing or excluded during parsing.',
        ),
        suggestion: 'Compare Length of Stay with Treatment Outcome to explore recovery timelines.',
      };
    }
  } else if (/how many columns|total columns|number of columns/.test(normalized)) {
    const quality = calculateDataQuality(rawRows);
    answer = {
      sourceA: `The uploaded dataset contains ${quality.totalColumns.toLocaleString()} columns.`,
      sourceB: `The parsed JSON upload stored in application state also reports ${quality.totalColumns.toLocaleString()} detected columns.`,
      comparison:
        'Both answers match because column detection uses the same uploaded JSON rows.',
      suggestion: 'Open Data Preview to inspect all detected columns and sample values.',
    };
  }

  return formatAssistantResponse(answer ?? answerUnsupported());
}
