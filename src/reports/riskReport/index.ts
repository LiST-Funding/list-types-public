// Shared types for the RiskAI Risk Management Report. Consumed by
// WorkflowServer (engine) and Workflow-Front (grid + drawer). Keep this file
// framework-agnostic: no mongoose, no Angular.
//
// One row per INCIDENT (PCC Risk Management `inc_*`), not per patient. The
// report is FIXED: no saved definition and no user-composed column set.
//
// The server returns whole rows rather than rendered cells, because the same
// row feeds two views: the grid shows one status word per column, the drawer
// shows the date, name, count or narrative behind it (D19).

// ---------------------------------------------------------------------------
// Status vocabulary
// ---------------------------------------------------------------------------

// The exact words the grid prints. Each column uses the pair that reads
// naturally for it, so a nurse sees 'Not notified', never a bare 'No'.
//
// 'Not available' is NOT 'No'. It means the source could not be resolved for
// this client, so the column must not assert that the thing did not happen.
// 'Not due' covers a follow-up whose deadline has not passed: an incident from
// yesterday cannot have missed its 72-hour check.
export const RISK_STATUS_VALUES = [
  'Filed', 'Not filed',
  'Notified', 'Not notified',
  'Referred',
  'Yes', 'No',
  'Missing',
  'Complete', 'Open', 'Closed, not signed', 'Signed, not closed',
  'No change', 'Change', 'Unable to assess',
  'Not due',
  'Not available',
] as const;
export type RiskStatusValue = typeof RISK_STATUS_VALUES[number];

// Cell tone. 'na' is the absence of a claim, so it gets no fill.
export type RiskTone = 'ok' | 'warn' | 'bad' | 'na';

export const RISK_TONES: Record<string, RiskTone> = {
  'Complete': 'ok', 'Yes': 'ok', 'Notified': 'ok', 'Referred': 'ok', 'Filed': 'ok', 'No change': 'ok',
  'Open': 'warn', 'Closed, not signed': 'warn', 'Signed, not closed': 'warn', 'Change': 'warn',
  'Missing': 'bad', 'Not filed': 'bad', 'Not notified': 'bad',
  'No': 'na', 'Not due': 'na', 'Unable to assess': 'na', 'Not available': 'na',
};

// ---------------------------------------------------------------------------
// Columns
// ---------------------------------------------------------------------------

// Order and grouping are the report. Room and Name are frozen, in that order,
// so the boundary falls after the resident's name.
export const RISK_COLUMN_KEYS = [
  'room', 'name',
  'type', 'report',
  'sentinel', 'sbar', 'md', 'poa',
  'therapy', 'fall', 'braden', 'pain',
  'idt', 'cpUpdate', 'cc',
  'investigation',
  'hours24', 'hours48', 'hours72',
] as const;
export type RiskColumnKey = typeof RISK_COLUMN_KEYS[number];

export interface RiskColumn {
  key: RiskColumnKey;
  header: string;
  group: string;
  // A status column is tone-filled and offers a filter; Room, Name and Type are plain text.
  status: boolean;
}

export const RISK_COLUMNS: RiskColumn[] = [
  { key: 'room', header: 'Room', group: 'Resident', status: false },
  { key: 'name', header: 'Name', group: 'Resident', status: false },
  { key: 'type', header: 'Type of Event', group: 'Incident', status: false },
  { key: 'report', header: 'Event/Incident Report', group: 'Incident', status: true },
  { key: 'sentinel', header: 'Sentinel Event Call', group: 'Notification', status: true },
  { key: 'sbar', header: 'SBAR', group: 'Notification', status: true },
  { key: 'md', header: 'MD', group: 'Notification', status: true },
  { key: 'poa', header: 'POA', group: 'Notification', status: true },
  { key: 'therapy', header: 'Therapy Referral', group: 'Assessment', status: true },
  { key: 'fall', header: 'Fall', group: 'Assessment', status: true },
  { key: 'braden', header: 'Braden', group: 'Assessment', status: true },
  { key: 'pain', header: 'Pain', group: 'Assessment', status: true },
  { key: 'idt', header: 'IDT Note', group: 'Care planning', status: true },
  { key: 'cpUpdate', header: 'CP Update Made', group: 'Care planning', status: true },
  { key: 'cc', header: 'CC', group: 'Care planning', status: true },
  { key: 'investigation', header: 'Investigation', group: 'Closure', status: true },
  { key: 'hours24', header: '24H', group: 'Timeliness', status: true },
  { key: 'hours48', header: '48H', group: 'Timeliness', status: true },
  { key: 'hours72', header: '72H', group: 'Timeliness', status: true },
];

// ---------------------------------------------------------------------------
// A row
// ---------------------------------------------------------------------------

// A notified party. Kept structured rather than joined into one string:
// inc_notified.name stores 'Last, First', so a ', ' separator collides with
// the data ('NP (Dillman, Andrea)' parses as two entries).
export interface NotifiedParty {
  role: string;
  name: string | null;
  notifiedAt: string | null;
}

export interface RiskIncidentRow {
  // Identity. incidentNumber is facility-scoped, so incId is the row key.
  incId: number;
  incidentNumber: number | null;
  // PCC's own client id, which is also the key its patient profile URL takes.
  clientId: number;
  facilityId: number;
  facility: string;
  incidentDate: string | null;
  closeDate: string | null;
  daysToClose: number | null;
  closedBy: string | null;

  // Grid columns.
  room: string;
  name: string;
  type: string;
  report: RiskStatusValue;
  sentinel: RiskStatusValue;
  sbar: RiskStatusValue;
  md: RiskStatusValue;
  poa: RiskStatusValue;
  therapy: RiskStatusValue;
  fall: RiskStatusValue;
  braden: RiskStatusValue;
  pain: RiskStatusValue;
  idt: RiskStatusValue;
  cpUpdate: RiskStatusValue;
  cc: RiskStatusValue;
  investigation: RiskStatusValue;
  hours24: RiskStatusValue;
  hours48: RiskStatusValue;
  hours72: RiskStatusValue;

  // Drawer detail behind those statuses.
  narrative: string | null;
  actionTaken: string | null;
  mdParties: NotifiedParty[];
  poaParties: NotifiedParty[];
  sentinelParties: NotifiedParty[];
  sbarDate: string | null;
  therapyDate: string | null;
  bradenDate: string | null;
  painDetail: string | null;
  idtDate: string | null;
  cpItemCount: number | null;
}

// ---------------------------------------------------------------------------
// Request / response
// ---------------------------------------------------------------------------

// Only the constraints that must run in Mongo. The search box and the
// per-column status filters run on the returned set, as the mockup does.
export interface RiskReportFilters {
  // ISO dates (YYYY-MM-DD): `from` inclusive, `to` inclusive. Clamped to the
  // region's data_floor server-side, whatever the client asks for.
  from?: string;
  to?: string;
  // Empty means every facility the caller may see.
  facilityIds?: number[];
  // Trimmed labels, never type_ids: the catalog carries one row per facility.
  eventTypeLabels?: string[];
}

export interface RiskReportResult {
  rows: RiskIncidentRow[];
  // The window actually used.
  from: string;
  to: string;
  truncated: boolean;
}

export interface RiskEventTypeOption {
  label: string;
  isFall: boolean;
}

export interface RiskReportOptions {
  eventTypes: RiskEventTypeOption[];
  facilities: { facilityId: number; name: string }[];
}
