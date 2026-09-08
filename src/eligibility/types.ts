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

/** AA provider key (VerificationProviderGroupId) -> that provider's rules. */
export type MedicaidSearchRules = Readonly<Record<string, MedicaidProviderRules>>;
