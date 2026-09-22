// Shared types for the RiskAI Incident Log report. Consumed by WorkflowServer
// (Mongoose model + engine) and Workflow-Front (form + wire adapters). Keep
// this file framework-agnostic: no mongoose, no Angular.
//
// One row per INCIDENT (PCC Risk Management `inc_*`), not per patient, so the
// column set is fixed rather than user-composed. Each side keeps a thin local
// shell adding id/regionId/name and timestamps (Date on the server, string on
// the frontend).

import { EventTimeWindow } from '../eventReport';

// The incident-date window reuses the event report's relative window, so a
// saved report keeps working over time and both features share one resolver.
export type RiskTimeWindow = EventTimeWindow;

// ---------------------------------------------------------------------------
// Columns
// ---------------------------------------------------------------------------

// Fixed and declared, unlike the report builder's user-chosen checks. Three
// columns from the mockup are deliberately absent:
//   sentinelEventCall - 1 of 514 incidents and 0 of 344 falls on both clients.
//   idtNote           - 0% on every incident measured; the source is unconfirmed.
//   therapyReferral   - the order-type match is unpinned and over-counts.
// A column whose source cannot be resolved must render 'unavailable', never
// 'no': a false 'no' reads as a compliance failure the facility did not commit.
export const RISK_COLUMN_KEYS = [
  'facility',
  'room',
  'resident',
  'incidentNumber',
  'incidentDate',
  'eventType',
  'eventReport',
  'md',
  'poa',
  'fall',
  'braden',
  'pain',
  'cpUpdate',
  'cc',
  'investigation',
  'closeDate',
  'hours24',
  'hours48',
  'hours72',
] as const;
export type RiskColumnKey = typeof RISK_COLUMN_KEYS[number];

export interface RiskOutputColumn {
  key: RiskColumnKey;
  label?: string;
  hidden: boolean;
  // Authoritative over array position (the engine sorts by it); unique per report.
  order: number;
}

// ---------------------------------------------------------------------------
// Cell shape
// ---------------------------------------------------------------------------

// Every status column emits a status + a detail. `status` colours the grid cell;
// `detail` carries the date, name list, count or narrative the drawer shows.
//
// 'unavailable' is NOT 'no'. It means the source could not be resolved for this
// client, so the column must not assert that the thing did not happen.
// 'notYetDue' covers a follow-up whose deadline has not passed: an incident
// from yesterday cannot have missed its 72-hour check.
export const RISK_STATUSES = ['yes', 'no', 'notYetDue', 'unavailable'] as const;
export type RiskStatus = typeof RISK_STATUSES[number];

// Four states, not three: the incident lifecycle really does have a
// closed-but-unsigned state, and a signed-but-open one.
export const INVESTIGATION_STATES = ['complete', 'open', 'closedNotSigned', 'signedNotClosed'] as const;
export type InvestigationState = typeof INVESTIGATION_STATES[number];

// A notified party. Kept structured rather than joined into one string:
// inc_notified.name stores 'Last, First', so a ', ' separator collides with
// the data ('NP (Dillman, Andrea)' parses as two entries).
export interface NotifiedParty {
  // The pick-list-11 label, e.g. 'Physician', 'POA Care'.
  role: string;
  name: string | null;
  notifiedAt: string | null;
}

export interface RiskStatusCell {
  status: RiskStatus;
  // Free-form per column: an ISO date, a count, a decoded label, a narrative.
  detail?: string | null;
  parties?: NotifiedParty[];
}

// ---------------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------------

// Event types are filtered by TRIMMED LABEL, never by type_id: the catalog
// carries one row per facility, so one label maps to several ids across a
// region, and labels can carry leading or trailing spaces.
export interface RiskReportFilters {
  eventTypeLabels?: string[];
  // Restrict to incidents whose event type reads as a fall.
  fallsOnly?: boolean;
  // Per status column: keep rows whose cell status is any of these.
  statuses?: Partial<Record<RiskColumnKey, RiskStatus[]>>;
}
