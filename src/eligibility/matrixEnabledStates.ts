import type { MedicaidStateCode } from './medicaidSearchRules';

/**
 * The states whose eligibility search is driven by AA's rules table rather than by the fixed
 * five-field rule the worker and the form apply today.
 *
 * HAND-WRITTEN on purpose, so a state can be disabled by deleting one line without touching
 * any logic. Currently every state in AA's table, per the owner decision of 2026-09-07.
 * Alaska, Arizona and Hawaii are absent because AA's export has no rows for them, and Texas
 * LTC is absent because it is a second Texas program with no state code of its own.
 *
 * Both Workflow-Front and NaviHealth read this list, so neither can disagree about which
 * states are on the new path.
 */
export const MATRIX_ENABLED_STATES: readonly MedicaidStateCode[] = [
  'AL',
  'AR',
  'CA',
  'CO',
  'CT',
  'DC',
  'DE',
  'FL',
  'GA',
  'IA',
  'ID',
  'IL',
  'IN',
  'KS',
  'KY',
  'LA',
  'MA',
  'MD',
  'ME',
  'MI',
  'MN',
  'MO',
  'MS',
  'MT',
  'NC',
  'ND',
  'NE',
  'NH',
  'NJ',
  'NM',
  'NV',
  'NY',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VA',
  'VT',
  'WA',
  'WI',
  'WV',
  'WY',
];
