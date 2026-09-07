/**
 * Approved Admissions' per-provider eligibility search rules (SNF-598 / XC-8).
 *
 * CANONICAL CONSUMER IMPORT — use the subpath:
 *
 *   import { resolveSearchMethod } from 'list-types-public/eligibility';
 *
 * The package root also re-exports this module as the `eligibility` namespace, but the
 * subpath is the supported entry point: it is the pattern already proven in production for
 * NaviHealth, which consumes this CommonJS build from ECMAScript modules.
 *
 * AA identifies a patient per provider group, and each state Medicaid program publishes its
 * own list of accepted field combinations. A request must satisfy at least one of them.
 * Encoding the table once here is what keeps Workflow-Front, NaviHealth and WorkflowServer
 * from disagreeing about what a given state will accept.
 */
export * from './types';
export * from './medicaidSearchRules.generated';
export * from './combinationSet';
export * from './searchRulesLookup';
export * from './matrixEnabledStates';
export * from './resolveSearchMethod';
export * from './describeSearchMethod';
export * from './ssnNotAcceptedStates';
