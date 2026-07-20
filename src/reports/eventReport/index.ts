// Shared types for the event-based report builder (first use case: RTH).
// Consumed by both WorkflowServer (Mongoose model + engine) and Workflow-Front
// (form + wire adapters). Keep this file framework-agnostic: no mongoose, no
// Angular.
//
// An event report asks "which events happened inside a rolling time window,
// plus extra filtering" and renders one row per event. This differs from the
// customAssessmentReport, which is a current-census snapshot (one row per
// patient). Each side keeps a thin local shell adding id/regionId/name and
// timestamps (Date on the server, string on the frontend).

// ---------------------------------------------------------------------------
// Time window
// ---------------------------------------------------------------------------

// The window is always relative so a saved report keeps working over time.
// 'last' = last N units up to now; 'current' = start of the current
// week/month/quarter/year to now; 'previous' = the last complete one.
export const WINDOW_MODES = ['last', 'current', 'previous'] as const;
export type WindowMode = typeof WINDOW_MODES[number];

// No 'hours': the whole feature is date-based. A window/gap is measured in whole
// calendar days, never by time of day (see the engine's day-truncation).
export const ROLLING_UNITS = ['days', 'weeks', 'months'] as const;
export type RollingUnit = typeof ROLLING_UNITS[number];

export const PERIOD_UNITS = ['week', 'month', 'quarter', 'year'] as const;
export type PeriodUnit = typeof PERIOD_UNITS[number];

export interface RollingWindow {
  // Positive whole number of `unit`. Bounds (>0, integer, max span) enforced server-side.
  amount: number;
  unit: RollingUnit;
}

export interface PeriodWindow {
  unit: PeriodUnit;
}

// Discriminated on `mode`: the 'last' arm carries a RollingWindow; the
// 'current'/'previous' arms carry a PeriodWindow.
export interface RollingTimeWindow {
  mode: 'last';
  rolling: RollingWindow;
}

export interface PeriodTimeWindow {
  mode: 'current' | 'previous';
  period: PeriodWindow;
}

export type EventTimeWindow = RollingTimeWindow | PeriodTimeWindow;

// ---------------------------------------------------------------------------
// Trigger event (What happened + optional Destination)
// ---------------------------------------------------------------------------

// Destination is resolved from the census To/From fields. Categories are the
// coarse phofac groups (Hospital/Home/...); types are the concrete To/From
// item ids. Both are region-resolved ids. A row qualifies only when the action
// code AND the destination both match (AND semantics).
export interface EventDestination {
  categoryItemIds?: number[];
  typeItemIds?: number[];
}

export interface EventTrigger {
  // Region-resolved census action code ids ("What happened").
  actionCodeIds: number[];
  destination?: EventDestination;
}

// ---------------------------------------------------------------------------
// Additional conditions.
// previousEvent and admissionSource: repeatable, all AND-combined.
// payer and destinationHospital: at-most-one each (the engine applies only the
// first; enforced by the server validator).
// ---------------------------------------------------------------------------

export const CONDITION_TYPES = ['previousEvent', 'payer', 'destinationHospital', 'admissionSource'] as const;
export type ConditionType = typeof CONDITION_TYPES[number];

// 'between' uses amount as the lower bound and amountMax as the upper (both
// inclusive). All measured in whole calendar days (never time of day).
export const GAP_OPERATORS = ['lessThan', 'moreThan', 'between'] as const;
export type GapOperator = typeof GAP_OPERATORS[number];

export const GAP_UNITS = ['days', 'weeks', 'months'] as const;
export type GapUnit = typeof GAP_UNITS[number];

interface ConditionBase {
  id: string;
}

// Whole-day gap between the trigger event and the most recent prior event whose
// action code is one of actionCodeIds (region-resolved, same picker as the
// trigger). E.g. RTH is "admission codes -> this transfer, less than 30 days".
// Discriminated on `operator`: the 'between' arm requires amountMax (the upper
// bound); the 'lessThan'/'moreThan' arms omit it.
interface PreviousEventConditionCommon extends ConditionBase {
  type: 'previousEvent';
  actionCodeIds: number[];
  // Positive whole number of `unit` (amountMax > amount for 'between'). Enforced server-side.
  amount: number;
  unit: GapUnit;
}

export interface PreviousEventBetweenCondition extends PreviousEventConditionCommon {
  operator: 'between';
  amountMax: number;
}

export interface PreviousEventSimpleCondition extends PreviousEventConditionCommon {
  operator: 'lessThan' | 'moreThan';
}

export type PreviousEventCondition =
  | PreviousEventBetweenCondition
  | PreviousEventSimpleCondition;

// "is any of" the given payer types (region text, matches buildEventMatchStage).
export interface PayerCondition extends ConditionBase {
  type: 'payer';
  payerTypes: string[];
}

// "is any of" the given destination facilities (dr_emc_ext_facilities ids).
export interface DestinationHospitalCondition extends ConditionBase {
  type: 'destinationHospital';
  extFacIds: number[];
}

// "was admitted from any of" the given To/From locations. Resolved from the
// patient's admission event's adt_tofrom (same catalog as the trigger
// destination): categories are phofac groups, types are concrete To/From ids.
export interface AdmissionSourceCondition extends ConditionBase {
  type: 'admissionSource';
  categoryItemIds?: number[];
  typeItemIds?: number[];
}

export type EventCondition =
  | PreviousEventCondition
  | PayerCondition
  | DestinationHospitalCondition
  | AdmissionSourceCondition;

// ---------------------------------------------------------------------------
// Output columns (drag-to-reorder + show/hide)
// ---------------------------------------------------------------------------

export const EVENT_COLUMN_KEYS = [
  'patient',
  'facility',
  'admissionDate',
  'eventDate',
  'daysToEvent',
  'locationType',
  'location',
  'primaryPayerType',
  'primaryPayerName',
] as const;
export type EventColumnKey = typeof EVENT_COLUMN_KEYS[number];

// Each key has a fixed generic default label (derived on the consumer side).
// `label` is an optional per-report override; when absent the default is used.
export interface EventOutputColumn {
  key: EventColumnKey;
  label?: string;
  hidden: boolean;
  // Authoritative over array position (the engine sorts by it); unique per report.
  order: number;
}
