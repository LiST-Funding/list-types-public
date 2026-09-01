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

export const RESPONSE_CONDITION_OPERATORS = [
  'eq', 'neq',                    // pick list / checkbox
  'lt', 'lte', 'gt', 'gte',       // numeric
  'contains', 'notContains',      // free text, and multi-select token match
] as const;
export type ResponseConditionOperator = typeof RESPONSE_CONDITION_OPERATORS[number];

// The aggregate compares a numeric total, so the text operators never apply.
export const RESPONSE_AGGREGATE_OPERATORS = ['eq', 'neq', 'lt', 'lte', 'gt', 'gte'] as const;
export type ResponseAggregateOperator = typeof RESPONSE_AGGREGATE_OPERATORS[number];

// How far back an assessment may be and still answer a condition. Absent means
// no limit, which in practice is the mirror's own 12-month window.
export const RESPONSE_LOOKBACK_MONTHS = [3, 6, 12] as const;
export type ResponseLookbackMonths = typeof RESPONSE_LOOKBACK_MONTHS[number];

export const RESPONSE_AGGREGATE_FUNCTIONS = ['sum'] as const;
export type ResponseAggregateFunction = typeof RESPONSE_AGGREGATE_FUNCTIONS[number];

export interface AssessmentResponseCondition {
  questionKey: string;
  questionNo: string;
  controlType: string;
  displayText?: string;
  /** Required in per-question mode; unused when the filter's aggregate is set. */
  operator?: ResponseConditionOperator;
  value?: string;
}

export interface ResponseAggregate {
  fn: ResponseAggregateFunction;
  operator: ResponseAggregateOperator;
  value: number;
}

export interface AssessmentResponseFilter extends PatientFilterBase {
  type: 'assessmentResponse';
  /** Assessment templates to match, by description (versions ship as new descriptions). */
  descriptions: string[];
  conditions: AssessmentResponseCondition[];
  /** Combination across conditions. Ignored when aggregate is set. */
  operator: AssessmentResponseOperator;
  /** Sum mode: conditions carry only questions; the comparison happens on the total. */
  aggregate?: ResponseAggregate;
  /** Restrict to assessments whose status is Complete. Default off. */
  completedOnly?: boolean;
  /** Ignore assessments older than this many months. Absent means no limit. */
  lookbackMonths?: ResponseLookbackMonths;
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
  /** Combination logic across filters. Defaults to 'or'. AND is reserved for the future. */
  operator?: FilterOperator;
}
