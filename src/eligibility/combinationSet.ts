import type { SearchCombination, SearchField } from './types';

/**
 * The order fields are compared and rendered in, which is deliberately NOT the order AA
 * writes them. AA writes the same field set in different orders across states — Alabama's
 * `Ssn, BirthDate` against another state's `BirthDate, Ssn`, and three separate orderings of
 * the name / date-of-birth / sex set. Across AA's 49 Medicaid rows there are 27 distinct
 * combination arrays but only 18 distinct field sets, so comparing or labelling by array
 * would treat one logical search method as several and let the variants drift apart.
 *
 * AA's array order is still authoritative for one thing only: which combination
 * resolveSearchMethod picks first.
 */
export const CANONICAL_FIELD_ORDER: readonly SearchField[] = Object.freeze([
  'MedicaidNumber',
  'MedicareNumber',
  'Ssn',
  'FirstName',
  'LastName',
  'BirthDate',
  'Sex',
]);

const rank = (field: SearchField): number => {
  const index = CANONICAL_FIELD_ORDER.indexOf(field);
  return index === -1 ? CANONICAL_FIELD_ORDER.length : index;
};

/** A combination reduced to its field set: duplicates removed, canonically ordered. */
export function toCanonicalSet(combination: SearchCombination): readonly SearchField[] {
  const unique = Array.from(new Set(combination));
  return unique.sort((left, right) => rank(left) - rank(right));
}

/** A stable string identity for a field set, for use as a map key. */
export function canonicalKey(combination: SearchCombination): string {
  return toCanonicalSet(combination).join('|');
}

/** Set equality: order-insensitive, duplicates collapsed. */
export function areSameCombination(left: SearchCombination, right: SearchCombination): boolean {
  return canonicalKey(left) === canonicalKey(right);
}
