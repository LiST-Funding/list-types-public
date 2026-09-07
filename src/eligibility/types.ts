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

/** The identifying values a caller holds. A field counts as supplied only when its value is
 *  a string that is non-empty after trimming. */
export type SearchFieldValues = Partial<Record<SearchField, string>>;

/** The provider key is not in AA's rules table, so no combination can be checked. Returned
 *  rather than thrown so a UI change handler never needs try/catch and every consumer has
 *  to face the case explicitly (Alaska, Arizona and Hawaii are in Workflow-Front's provider
 *  map but absent from AA's export). */
export interface UnknownProviderResolution {
  readonly status: 'unknownProvider';
  readonly providerKey: string;
}

export interface ResolvedSearchMethod {
  readonly status: 'resolved';
  readonly providerKey: string;
  /**
   * The first combination in AA's order whose every field is supplied, or null when none is.
   * Always a subset of what the caller supplied, which is the property that matters when
   * trimming a payload to the minimum necessary. Note that AA lists combinations which are
   * supersets of an earlier one in the same row (ten such pairs, in Arkansas, North Dakota
   * and Vermont), so supplying exactly one combination's fields can resolve to an earlier,
   * smaller one.
   */
  readonly satisfied: SearchCombination | null;
  /** Whether `chosen` matches one of the provider's combinations as a set: order-insensitive,
   *  duplicates collapsed. False whenever `chosen` was omitted. */
  readonly chosenValid: boolean;
  /** The fields of `chosen` that are not supplied, in `chosen`'s own order. Empty when
   *  `chosen` was omitted. Still populated when `chosenValid` is false, because helper text
   *  naming the gap is more useful than silence. */
  readonly missing: readonly SearchField[];
  /**
   * Every combination tied for the fewest missing fields, in AA's order, excluding one that
   * is set-equal to `chosen`. When the supplied data already satisfies something and `chosen`
   * was omitted, the fewest-missing count is zero, so this contains the combination
   * `satisfied` returned. A caller rendering "you could also search by" should filter
   * `satisfied` out, or pass `chosen` to have it excluded here.
   */
  readonly alternatives: readonly SearchCombination[];
}

export type SearchMethodResolution = UnknownProviderResolution | ResolvedSearchMethod;
