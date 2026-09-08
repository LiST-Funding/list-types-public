/**
 * Approved Admissions' per-provider eligibility search rules (SNF-598 / XC-8).
 *
 * DATA ONLY. This module carries the rules table AA publishes, the maps needed to read it
 * (state code <-> provider key) and the rollout allowlist. It holds no logic: which
 * combination a request satisfies, how a method is labelled and whether a state is enabled
 * are decided in each consumer, from this data:
 *
 *   NaviHealth      approvedAdmissions/v2/medicaidSearchRules.js
 *   Workflow-Front  manageb/job-info-v2/payer-eligibility/medicaid-search-rules.ts
 *
 * Canonical consumer import: `list-types-public/eligibility`.
 */
export * from './types';
export * from './medicaidSearchRules.generated';
export * from './matrixEnabledStates';
