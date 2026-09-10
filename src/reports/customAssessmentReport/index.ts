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

export const FILTER_TYPES = ['census', 'medicationCategory', 'order', 'diagnosis', 'payer', 'pdpm', 'assessmentResponse'] as const;
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

// Only used when resolution === 'year' (periodCount is ignored for year). Two fixed windows:
// 'ytd' = start of calendar year to now; 'trailing12' (the default when absent) = rolling last 12 months.
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

export const ASSESSMENT_RESPONSE_CONDITION_OPERATORS = [
  'eq', 'neq',                    // pick list / checkbox
  'lt', 'lte', 'gt', 'gte',       // numeric
  'contains', 'notContains',      // free text, and multi-select token match
] as const;
export type AssessmentResponseConditionOperator = typeof ASSESSMENT_RESPONSE_CONDITION_OPERATORS[number];

// The aggregate compares a numeric total, so the text operators never apply.
export const ASSESSMENT_RESPONSE_AGGREGATE_OPERATORS = ['eq', 'neq', 'lt', 'lte', 'gt', 'gte'] as const;
export type AssessmentResponseAggregateOperator = typeof ASSESSMENT_RESPONSE_AGGREGATE_OPERATORS[number];
// Control types with no number to add, so a sum cannot include them.
export const ASSESSMENT_RESPONSE_NON_SUMMABLE_CONTROL_TYPES = ['txt', 'mtxt', 'bdy', 'gbdy'] as const;

// How far back an assessment may be and still answer a condition. Absent means
// no limit, which in practice is the mirror's own 12-month window.
export const ASSESSMENT_RESPONSE_LOOKBACK_UNITS = ['day', 'week', 'month'] as const;
export type AssessmentResponseLookbackUnit = typeof ASSESSMENT_RESPONSE_LOOKBACK_UNITS[number];
// Caps `lookback.value` per unit, so the longest window any unit can express is one year.
export const ASSESSMENT_RESPONSE_LOOKBACK_MAX_BY_UNIT: Record<AssessmentResponseLookbackUnit, number> =
  { day: 365, week: 52, month: 12 };

export interface AssessmentResponseLookback {
  value: number; // whole number of `unit`s, at least 1
  unit: AssessmentResponseLookbackUnit;
}

// Input ceilings the editor and the server both enforce.
export const ASSESSMENT_RESPONSE_MAX_ASSESSMENT_NAMES = 25;
export const ASSESSMENT_RESPONSE_MAX_CONDITIONS = 25;
export const ASSESSMENT_RESPONSE_MAX_ANSWERS = 25;

export interface AssessmentResponseCondition {
  questionKey: string;
  questionNo: string;
  controlType: string;
  displayText?: string;
  assessmentName: string; // one of the filter's `assessmentNames`; named, not keyed by std_assess_id, since one name spans several
  operator?: AssessmentResponseConditionOperator; // required unless the filter sets `aggregate`
  value?: string;
  values?: string[]; // OR-ed, then the whole OR negated under `neq`/`notContains`; wins over `value`
}

// The total is always a sum, so there is nothing to name.
export interface AssessmentResponseAggregate {
  operator: AssessmentResponseAggregateOperator;
  value: number;
}

export interface AssessmentResponseFilter extends PatientFilterBase {
  type: 'assessmentResponse';
  assessmentNames: string[]; // PCC picker names, mirrored in `dr_as_std_assessment.description`
  conditions: AssessmentResponseCondition[];
  operator: AssessmentResponseOperator; // across conditions; ignored when `aggregate` is set
  aggregate?: AssessmentResponseAggregate; // sum mode: conditions carry only questions, the total is compared
  completedOnly?: boolean; // only assessments with status Complete
  lookback?: AssessmentResponseLookback; // absent means no limit
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
  | PdpmFilter
  | AssessmentResponseFilter;

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
  operator?: FilterOperator; // defaults to 'or'; AND is reserved for the future
}
