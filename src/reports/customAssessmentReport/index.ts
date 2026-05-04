// Shared types for the "custom assessment report" feature.
// Consumed by both WorkflowServer (Mongoose model) and Workflow-Front (form +
// wire adapters). Keep this file framework-agnostic — no mongoose, no Angular.
//
// Each side keeps a thin local layer:
//   - Server: Mongoose schemas + a `CustomAssessmentReport` shell with `Date`
//     timestamps.
//   - Frontend: `PatientFilterForm` + wire adapters + UI-only lookup types,
//     and a `CustomAssessmentReport` shell with `string` (JSON) timestamps.

export const PREDICATE_TYPES = ['census', 'medicationCategory', 'order', 'diagnosis', 'payer', 'pdpm'] as const;
export type PredicateType = typeof PREDICATE_TYPES[number];

// Backward-compatible aliases for the legacy "patient filter type" naming.
export const PATIENT_FILTER_TYPES = PREDICATE_TYPES;
export type PatientFilterType = PredicateType;

export const FILTER_OPERATORS = ['and', 'or'] as const;
export type FilterOperator = typeof FILTER_OPERATORS[number];

export const MONITORING_CHECK_TYPES = ['order', 'carePlan', 'assessment', 'assessmentResponse', 'pdpm', 'payer'] as const;
export type MonitoringCheckType = typeof MONITORING_CHECK_TYPES[number];

export const PAYER_RANKS = ['primary', 'secondary'] as const;
export type PayerRank = typeof PAYER_RANKS[number];

export const PAYER_CHECK_MODES = ['type', 'name'] as const;
export type PayerCheckMode = typeof PAYER_CHECK_MODES[number];

export const PERIOD_RESOLUTIONS = ['month', 'quarter'] as const;
export type PeriodResolution = typeof PERIOD_RESOLUTIONS[number];

export const VALIDITY_PERIODS = ['week', 'month'] as const;
export type ValidityPeriod = typeof VALIDITY_PERIODS[number];

export const PDPM_CATEGORIES = ['pt/ot', 'slp', 'nta', 'nursing', 'hipps'] as const;
export type PdpmCategory = typeof PDPM_CATEGORIES[number];

export const PDPM_CATEGORY_LABELS: Record<PdpmCategory, string> = {
  'pt/ot': 'PT/OT',
  'slp': 'SLP',
  'nursing': 'Nursing',
  'nta': 'NTA',
  'hipps': 'HIPPS',
};

export const ASSESSMENT_RESPONSE_OPERATORS = ['and', 'or'] as const;
export type AssessmentResponseOperator = typeof ASSESSMENT_RESPONSE_OPERATORS[number];

// ---------------------------------------------------------------------------
// Predicate atoms — shared between PatientFilter and MonitoringCheck.
// Each atom describes a per-patient predicate (e.g. "primary payer is type X");
// the filter side aggregates atoms to select patients, the check side pairs an
// atom with display semantics to render a per-cell result.
// ---------------------------------------------------------------------------

export interface OrderPredicate {
  descriptions: string[];
}

export interface PdpmPredicate {
  // Optional on the atom because the pdpm monitoring check allows display-only
  // (no category set => uncoloured cell). The filter side validates it at runtime.
  category?: PdpmCategory;
  groups: string[];
}

export interface PayerPredicate {
  rank: PayerRank;
  payerId?: number;
  payerType?: string;
}

// Backward-compatible aliases.
export type PayerFilterEntry = PayerPredicate;
export type PdpmFilterGroup = PdpmPredicate;

// ---------------------------------------------------------------------------
// Predicates with their discriminator added — used directly inside the filter's
// predicates[] array.
// ---------------------------------------------------------------------------

export interface CensusPredicate { type: 'census'; }
export interface MedicationCategoryPredicate {
  type: 'medicationCategory';
  categories: string[];
}
export interface DiagnosisPredicate {
  type: 'diagnosis';
  icdCodes: string[];
}
export interface OrderFilterPredicate extends OrderPredicate { type: 'order'; }
export interface PayerFilterPredicate extends PayerPredicate { type: 'payer'; }
export interface PdpmFilterPredicate extends PdpmPredicate { type: 'pdpm'; }

export type Predicate =
  | CensusPredicate
  | MedicationCategoryPredicate
  | DiagnosisPredicate
  | OrderFilterPredicate
  | PayerFilterPredicate
  | PdpmFilterPredicate;

export interface PatientFilter {
  predicates: Predicate[];
  /** Combination logic across predicates. Defaults to 'or'. AND is reserved for the future. */
  operator?: FilterOperator;
}

export interface AssessmentResponseQuestion {
  questionKey: string;
  questionNo: string;
  controlType: string;
  expectedValue: string;
  displayText?: string;
}

export interface MonitoringCheckBase {
  id: string;
  label: string;
}

export interface OrderMonitoringCheck extends MonitoringCheckBase, OrderPredicate {
  type: 'order';
}

export interface CarePlanMonitoringCheck extends MonitoringCheckBase {
  type: 'carePlan';
  description: string;
}

export interface AssessmentMonitoringCheck extends MonitoringCheckBase {
  type: 'assessment';
  descriptions: string[];
  resolution: PeriodResolution;
  periodCount: number;
}

export interface AssessmentResponseMonitoringCheck extends MonitoringCheckBase {
  type: 'assessmentResponse';
  description?: string;
  stdAssessId?: number;
  questions: AssessmentResponseQuestion[];
  operator: AssessmentResponseOperator;
  resolution: PeriodResolution;
  periodCount: number;
  validityPeriod?: ValidityPeriod;
}

export interface PdpmMonitoringCheck extends MonitoringCheckBase, PdpmPredicate {
  type: 'pdpm';
}

export interface PayerMonitoringCheck extends MonitoringCheckBase, PayerPredicate {
  type: 'payer';
  mode: PayerCheckMode;
}

export type MonitoringCheck =
  | OrderMonitoringCheck
  | CarePlanMonitoringCheck
  | AssessmentMonitoringCheck
  | AssessmentResponseMonitoringCheck
  | PdpmMonitoringCheck
  | PayerMonitoringCheck;
