// Shared types for the report builder.
// Consumed by both WorkflowServer (Mongoose model) and Workflow-Front (form +
// wire adapters). Keep this file framework-agnostic — no mongoose, no Angular.
//
// Each side keeps a thin local layer:
//   - Server: Mongoose schemas + a `CustomAssessmentReport` shell with `Date`
//     timestamps.
//   - Frontend: `PatientFilterForm` + wire adapters + UI-only lookup types,
//     and a `CustomAssessmentReport` shell with `string` (JSON) timestamps.

// ---------------------------------------------------------------------------
// General
// ---------------------------------------------------------------------------

export const FILTER_OPERATORS = ['and', 'or'] as const;
export type FilterOperator = typeof FILTER_OPERATORS[number];

export const FILTER_TYPES = ['census', 'medicationCategory', 'order', 'diagnosis', 'payer', 'pdpm'] as const;
export type FilterType = typeof FILTER_TYPES[number];

export const MONITORING_CHECK_TYPES = ['order', 'diagnosis', 'payer', 'pdpm', 'carePlan', 'assessment', 'assessmentResponse'] as const;
export type MonitoringCheckType = typeof MONITORING_CHECK_TYPES[number];

interface PatientFilterBase {
  id: string;
}

interface MonitoringCheckBase {
  id: string;
  label: string;
}

// ---------------------------------------------------------------------------
// Census
// ---------------------------------------------------------------------------

export interface CensusFilter extends PatientFilterBase {
  type: 'census';
}

// ---------------------------------------------------------------------------
// Medication category
// ---------------------------------------------------------------------------

export interface MedicationCategoryFilter extends PatientFilterBase {
  type: 'medicationCategory';
  categories: string[];
}

// ---------------------------------------------------------------------------
// Order
// ---------------------------------------------------------------------------

export interface OrderFilter extends PatientFilterBase {
  type: 'order';
  descriptions: string[];
}

export interface OrderMonitoringCheck extends MonitoringCheckBase {
  type: 'order';
  descriptions: string[];
}

// ---------------------------------------------------------------------------
// Diagnosis
// ---------------------------------------------------------------------------

export interface DiagnosisFilter extends PatientFilterBase {
  type: 'diagnosis';
  icdCodes: string[];
}

export interface DiagnosisMonitoringCheck extends MonitoringCheckBase {
  type: 'diagnosis';
  icdCodes?: string[];
}

// ---------------------------------------------------------------------------
// Payer
// ---------------------------------------------------------------------------

export const PAYER_RANKS = ['primary', 'secondary'] as const;
export type PayerRank = typeof PAYER_RANKS[number];

export const PAYER_CHECK_MODES = ['type', 'name'] as const;
export type PayerCheckMode = typeof PAYER_CHECK_MODES[number];

export interface PayerEntry {
  rank: PayerRank;
  payerType: string;
  payerId?: number;
}

export interface PayerFilter extends PatientFilterBase {
  type: 'payer';
  entries: PayerEntry[];
}

export interface PayerMonitoringCheck extends MonitoringCheckBase {
  type: 'payer';
  mode: PayerCheckMode;
  entries?: PayerEntry[];
}

// ---------------------------------------------------------------------------
// PDPM
// ---------------------------------------------------------------------------

export const PDPM_CATEGORIES = ['pt/ot', 'slp', 'nta', 'nursing', 'hipps'] as const;
export type PdpmCategory = typeof PDPM_CATEGORIES[number];

export const PDPM_CATEGORY_LABELS: Record<PdpmCategory, string> = {
  'pt/ot': 'PT/OT',
  'slp': 'SLP',
  'nta': 'NTA',
  'nursing': 'Nursing',
  'hipps': 'HIPPS',
};

export interface PdpmEntry {
  category: PdpmCategory;
  group: string;
}

export interface PdpmFilter extends PatientFilterBase {
  type: 'pdpm';
  entries: PdpmEntry[];
}

export interface PdpmMonitoringCheck extends MonitoringCheckBase {
  type: 'pdpm';
  category: PdpmCategory;
  entries?: PdpmEntry[];
}

// ---------------------------------------------------------------------------
// Care plan
// ---------------------------------------------------------------------------

export interface CarePlanMonitoringCheck extends MonitoringCheckBase {
  type: 'carePlan';
  descriptions?: string[];
}

// ---------------------------------------------------------------------------
// Assessment
// ---------------------------------------------------------------------------

export const PERIOD_RESOLUTIONS = ['week', 'month', 'quarter', 'year'] as const;
export type PeriodResolution = typeof PERIOD_RESOLUTIONS[number];

// Yearly is not a "last N periods" resolution; it is one of two fixed windows.
// Only meaningful when resolution === 'year'; ignored otherwise.
export const YEAR_MODES = ['trailing12', 'ytd'] as const;
export type YearMode = typeof YEAR_MODES[number];

export interface AssessmentMonitoringCheck extends MonitoringCheckBase {
  type: 'assessment';
  descriptions: string[];
  resolution: PeriodResolution;
  periodCount: number;
  yearMode?: YearMode;
}

// ---------------------------------------------------------------------------
// Assessment response
// ---------------------------------------------------------------------------

export const VALIDITY_PERIODS = ['week', 'month', 'quarter', 'year'] as const;
export type ValidityPeriod = typeof VALIDITY_PERIODS[number];

export const ASSESSMENT_RESPONSE_OPERATORS = ['and', 'or'] as const;
export type AssessmentResponseOperator = typeof ASSESSMENT_RESPONSE_OPERATORS[number];

export interface AssessmentResponseQuestion {
  questionKey: string;
  questionNo: string;
  controlType: string;
  expectedValue: string;
  displayText?: string;
}

export interface AssessmentResponseMonitoringCheck extends MonitoringCheckBase {
  type: 'assessmentResponse';
  description?: string;
  stdAssessId?: number;
  questions: AssessmentResponseQuestion[];
  operator: AssessmentResponseOperator;
  resolution: PeriodResolution;
  periodCount: number;
  yearMode?: YearMode;
  validityPeriod?: ValidityPeriod;
}

// ---------------------------------------------------------------------------
// Unions and container
// ---------------------------------------------------------------------------

export type PatientFilter =
  | CensusFilter
  | MedicationCategoryFilter
  | OrderFilter
  | DiagnosisFilter
  | PayerFilter
  | PdpmFilter;

export type MonitoringCheck =
  | OrderMonitoringCheck
  | DiagnosisMonitoringCheck
  | PayerMonitoringCheck
  | PdpmMonitoringCheck
  | CarePlanMonitoringCheck
  | AssessmentMonitoringCheck
  | AssessmentResponseMonitoringCheck;

export interface PatientFilters {
  filters: PatientFilter[];
  /** Combination logic across filters. Defaults to 'or'. AND is reserved for the future. */
  operator?: FilterOperator;
}
