/**
 * Types for Approved Admissions' per-provider eligibility search rules.
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

/** AA provider key -> that provider's accepted combinations, in AA's own order. */
export type MedicaidSearchRules = Readonly<Record<string, readonly SearchCombination[]>>;
