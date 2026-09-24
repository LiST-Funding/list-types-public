/**
 * Types for Approved Admissions' per-provider Medicaid search rules.
 *
 * Canonical consumer import: `list-types-public/eligibility`.
 */

/** The identifying fields AA accepts across its search combinations. This is AA's full request
 *  vocabulary and is wider than the routes this table ships: `Sex` and `MedicareNumber` occur
 *  only in combinations the two-route model does not carry, so no route here names them. Both
 *  consumers label all seven, so they stay. */
export type SearchField =
  | 'MedicaidNumber'
  | 'FirstName'
  | 'LastName'
  | 'BirthDate'
  | 'Ssn'
  | 'Sex'
  | 'MedicareNumber';

/** One way to identify a patient: the fields a request must all carry. Field order is AA's
 *  own and consumers compare combinations as sets — but the worker also persists a route's array
 *  verbatim into the task record, so re-ordering an EXISTING route is a breaking data change even
 *  though no comparison depends on it. `readonly` is compile-time only: at runtime these are
 *  plain shared arrays, so copy before sorting. */
export type SearchCombination = readonly SearchField[];

/** A route anchored on the Medicaid ID: it leads with the ID and never names the SSN. */
export type IdRouteCombination = readonly ['MedicaidNumber', ...Exclude<SearchField, 'Ssn' | 'MedicaidNumber'>[]];

/** A route anchored on the SSN: it never names the Medicaid ID. Presence of `Ssn` is asserted
 *  in medicaidSearchRules.ts, because AA does not always write the SSN first (Delaware, Louisiana). */
export type SsnRouteCombination = readonly Exclude<SearchField, 'MedicaidNumber'>[];

/** The two-letter codes AA publishes Medicaid rules for: 47 states + DC. Alaska, Arizona and
 *  Hawaii have no rows in the export we received and so have no code here; whether that export
 *  is complete or AA has those programs disabled is unconfirmed with AA. Every member must have a
 *  row in MEDICAID_SEARCH_RULES (asserted there). */
export type MedicaidStateCode =
  | 'AL'
  | 'AR'
  | 'CA'
  | 'CO'
  | 'CT'
  | 'DC'
  | 'DE'
  | 'FL'
  | 'GA'
  | 'IA'
  | 'ID'
  | 'IL'
  | 'IN'
  | 'KS'
  | 'KY'
  | 'LA'
  | 'MA'
  | 'MD'
  | 'ME'
  | 'MI'
  | 'MN'
  | 'MO'
  | 'MS'
  | 'MT'
  | 'NC'
  | 'ND'
  | 'NE'
  | 'NH'
  | 'NJ'
  | 'NM'
  | 'NV'
  | 'NY'
  | 'OH'
  | 'OK'
  | 'OR'
  | 'PA'
  | 'RI'
  | 'SC'
  | 'SD'
  | 'TN'
  | 'TX'
  | 'UT'
  | 'VA'
  | 'VT'
  | 'WA'
  | 'WI'
  | 'WV'
  | 'WY';

/** One AA Medicaid provider group. `state` is null for a program with no state code of its
 *  own (Texas LTC, AA201065 — a second Texas program; TX itself maps to AA201064). Consumers
 *  resolve a state to ONE provider key, so the rule is: every non-null state code appears on
 *  exactly one entry, and when AA lists a second program for a state that is already mapped the
 *  later one carries null, as Texas LTC does. A null-state program is not reachable from a state
 *  and is therefore parked, not routable. Uniqueness is asserted in medicaidSearchRules.ts. */
export interface MedicaidProviderRules {
  readonly state: MedicaidStateCode | null;
  /** AA's label for the program, for humans only. */
  readonly name: string;
  /** The search anchored on the Medicaid ID: the ID alone in most programs, the ID plus a date
   *  of birth (and in Utah the name) where the program demands it. Every program has one. */
  readonly idRoute: IdRouteCombination;
  /** The search anchored on the SSN, or null where the program accepts no SSN search. Always
   *  the SSN plus whatever the program wants beside it: date of birth, name, or nothing. */
  readonly ssnRoute: SsnRouteCombination | null;
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

/** Provider key -> that provider's rules. Keyed by the literal union rather than `string` so the
 *  key set is closed and documented. That is not a guard: indexing with an arbitrary string is a
 *  compile error only under `noImplicitAny`, which not every consumer enables. Consumers must
 *  narrow through MedicaidSearchRulesByKey with an own-property check instead of indexing the
 *  map directly. */
export type MedicaidSearchRules = Readonly<Record<MedicaidProviderKey, MedicaidProviderRules>>;

/** The same table keyed by a plain string, for a consumer holding a key it has not narrowed. The
 *  `| undefined` is the point: a key that is not in the table reads as undefined. */
export type MedicaidSearchRulesByKey = Readonly<Record<string, MedicaidProviderRules | undefined>>;
