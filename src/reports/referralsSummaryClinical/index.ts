// Clinical filters on Referrals Summary: the wire contract shared by WorkflowServer and
// Workflow-Front. Field ids and values are vocabulary keys from the server's catalog; the client
// never sends query paths, tokens or regex.

// The single source for field types and the conditions each allows; the unions below derive from it.
export const CLINICAL_OPERATORS_BY_TYPE = {
  list: ['includes', 'excludes'],
  choice: ['is', 'isNot'],
  number: ['gt', 'lt', 'between'],
} as const;

export type ClinicalFieldType = keyof typeof CLINICAL_OPERATORS_BY_TYPE;
export type ClinicalOperatorOf<T extends ClinicalFieldType> = (typeof CLINICAL_OPERATORS_BY_TYPE)[T][number];
export type ClinicalListOperator = ClinicalOperatorOf<'list'>;
export type ClinicalChoiceOperator = ClinicalOperatorOf<'choice'>;
export type ClinicalNumberOperator = ClinicalOperatorOf<'number'>;
export type ClinicalOperator = ClinicalOperatorOf<ClinicalFieldType>;

export const MAX_CLINICAL_CONDITIONS = 10;
export const MAX_CLINICAL_VALUES = 50;
export const MAX_CLINICAL_VALUE_LENGTH = 64;

export const CLINICAL_MATCH_COLUMN_LABEL = 'Clinical match';

// --- Request ---

// List and choice fields. Several values are OR within the row: includes/is = any of them,
// excludes/isNot = none of them.
export interface ClinicalValuesCondition {
  field: string;
  operator: ClinicalListOperator | ClinicalChoiceOperator;
  values: string[];
}

// Bounds are exclusive for gt/lt and inclusive for between.
export type ClinicalNumberCondition =
  | { field: string; operator: 'gt'; min: number }
  | { field: string; operator: 'lt'; max: number }
  | { field: string; operator: 'between'; min: number; max: number };

export type ClinicalCondition = ClinicalValuesCondition | ClinicalNumberCondition;

// UI "And" / "Or" across rows.
export type ClinicalMatch = 'all' | 'any';

// A tree so nested groups can be added without breaking the contract; V1 is one level only.
export interface ClinicalFilterGroup {
  match: ClinicalMatch;
  conditions: ClinicalCondition[];
}

export type ClinicalFilter = ClinicalFilterGroup;

// --- Catalog ---

export type ClinicalFieldSection = 'findings' | 'patientDetails';

export interface ClinicalFieldOption {
  value: string;
  label: string;
  // Secondary text under the label, e.g. a high-cost generic's brands.
  description?: string;
}

export interface ClinicalCatalogField {
  id: string;
  label: string;
  section: ClinicalFieldSection;
  type: ClinicalFieldType;
  // list and choice fields
  options?: ClinicalFieldOption[];
  // number fields
  min?: number;
  max?: number;
  step?: number;
}

// Live fields in display order; empty = the feature is hidden.
export interface ClinicalCatalog {
  fields: ClinicalCatalogField[];
}

// --- Response ---

// Why a row matched: positive matches only (includes, is, number), in condition order.
export interface ClinicalRowMatch {
  field: string;
  value: string;
  label: string;
}
