/**
 * Types for Approved Admissions' per-provider Medicaid search rules.
 *
 * Canonical consumer import: `list-types-public/eligibility`.
 */

/** The identifying fields AA accepts in a search combination. */
export type SearchField =
  | 'MedicaidNumber'
  | 'FirstName'
  | 'LastName'
  | 'BirthDate'
  | 'Ssn'
  | 'Sex'
  | 'MedicareNumber';

/** One accepted way to identify a patient. A request satisfies a provider's rules when it
 *  carries every field of at least one of that provider's combinations. */
export type SearchCombination = readonly SearchField[];

/** The two-letter codes AA publishes Medicaid rules for: 47 states + DC. Alaska, Arizona and
 *  Hawaii have no rows in AA's export and so have no code here. */
export type MedicaidStateCode =
  | "AL"
  | "AR"
  | "CA"
  | "CO"
  | "CT"
  | "DC"
  | "DE"
  | "FL"
  | "GA"
  | "IA"
  | "ID"
  | "IL"
  | "IN"
  | "KS"
  | "KY"
  | "LA"
  | "MA"
  | "MD"
  | "ME"
  | "MI"
  | "MN"
  | "MO"
  | "MS"
  | "MT"
  | "NC"
  | "ND"
  | "NE"
  | "NH"
  | "NJ"
  | "NM"
  | "NV"
  | "NY"
  | "OH"
  | "OK"
  | "OR"
  | "PA"
  | "RI"
  | "SC"
  | "SD"
  | "TN"
  | "TX"
  | "UT"
  | "VA"
  | "VT"
  | "WA"
  | "WI"
  | "WV"
  | "WY";

/** One AA Medicaid provider group. `state` is null for a program with no state code of its
 *  own (Texas LTC, AA201065 — a second Texas program; TX itself maps to AA201064). */
export interface MedicaidProviderRules {
  readonly state: MedicaidStateCode | null;
  /** AA's label for the program, for humans only. */
  readonly name: string;
  /** Accepted search combinations in AA's own order. */
  readonly combinations: readonly SearchCombination[];
}

/** The AA provider keys (VerificationProviderGroupId) that have Medicaid rules — exactly the
 *  keys of MEDICAID_SEARCH_RULES. The Medicare group (AA201001) and the three states AA has no
 *  rows for (AK AA201022, AZ AA201023, HI AA201032) are deliberately not here. */
export type MedicaidProviderKey =
  | 'AA201021'
  | 'AA201024'
  | 'AA201025'
  | 'AA201026'
  | 'AA201027'
  | 'AA201028'
  | 'AA201029'
  | 'AA201030'
  | 'AA201031'
  | 'AA201033'
  | 'AA201034'
  | 'AA201035'
  | 'AA201036'
  | 'AA201037'
  | 'AA201038'
  | 'AA201039'
  | 'AA201040'
  | 'AA201041'
  | 'AA201042'
  | 'AA201043'
  | 'AA201044'
  | 'AA201045'
  | 'AA201046'
  | 'AA201047'
  | 'AA201048'
  | 'AA201049'
  | 'AA201050'
  | 'AA201051'
  | 'AA201052'
  | 'AA201053'
  | 'AA201054'
  | 'AA201055'
  | 'AA201056'
  | 'AA201057'
  | 'AA201058'
  | 'AA201059'
  | 'AA201060'
  | 'AA201061'
  | 'AA201062'
  | 'AA201063'
  | 'AA201064'
  | 'AA201065'
  | 'AA201066'
  | 'AA201067'
  | 'AA201068'
  | 'AA201069'
  | 'AA201070'
  | 'AA201071'
  | 'AA201072';

/** Provider key -> that provider's rules. Keyed by the literal union rather than `string`, so
 *  a lookup with an arbitrary key is a compile error: consumers narrow first (own-property
 *  check against a `Record<string, MedicaidProviderRules | undefined>` view) instead of
 *  dereferencing a runtime `undefined`. */
export type MedicaidSearchRules = Readonly<Record<MedicaidProviderKey, MedicaidProviderRules>>;
