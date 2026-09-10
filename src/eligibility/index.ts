/**
 * Approved Admissions' per-provider Medicaid search rules (SNF-598 / XC-8). DATA ONLY: one
 * object, MEDICAID_SEARCH_RULES, plus its types. The logic that reads it lives in each
 * consumer (NaviHealth approvedAdmissions/v2/medicaidSearchRules.js, Workflow-Front
 * payer-eligibility/medicaid-search-rules.ts).
 *
 * Canonical consumer import: `list-types-public/eligibility`.
 */
export * from './types';
export * from './medicaidSearchRules';
