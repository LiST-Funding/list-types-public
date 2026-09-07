import { areSameCombination } from './combinationSet';
import { getSearchCombinations } from './searchRulesLookup';
import type {
  SearchCombination,
  SearchField,
  SearchFieldValues,
  SearchMethodResolution,
} from './types';

/** A field counts as supplied only when its value is a string that is non-empty after
 *  trimming, so an untouched form control and a control holding only spaces both count as
 *  missing. */
function isSupplied(fields: SearchFieldValues, field: SearchField): boolean {
  const value = fields[field];
  return typeof value === 'string' && value.trim() !== '';
}

const missingFields = (
  combination: SearchCombination,
  fields: SearchFieldValues
): readonly SearchField[] => combination.filter(field => !isSupplied(fields, field));

/**
 * Checks the identifying fields a caller holds against one AA provider group's rules.
 *
 * @param providerKey AA's VerificationProviderGroupId, e.g. `AA201030` for Florida Medicaid.
 * @param fields      The identifying values the caller holds. Empty and whitespace-only
 *                    values count as missing.
 * @param chosen      The search method the user picked, when there is one. Matched against
 *                    the provider's combinations as a SET, so field order does not matter
 *                    and a repeated field is collapsed.
 *
 * Returns the `unknownProvider` variant when AA publishes no rules for the key, rather than
 * throwing, so a UI change handler needs no try/catch and every consumer has to handle the
 * case. See the field documentation on ResolvedSearchMethod for the exact meaning of
 * `satisfied`, `missing` and `alternatives`.
 */
export function resolveSearchMethod(
  providerKey: string,
  fields: SearchFieldValues,
  chosen?: SearchCombination
): SearchMethodResolution {
  const combinations = getSearchCombinations(providerKey);
  if (combinations === undefined) {
    return { status: 'unknownProvider', providerKey };
  }

  const satisfied =
    combinations.find(combination => combination.every(field => isSupplied(fields, field))) ?? null;

  const chosenValid =
    chosen !== undefined &&
    combinations.some(combination => areSameCombination(combination, chosen));

  const missing = chosen === undefined ? [] : missingFields(chosen, fields);

  let fewestMissing = Number.POSITIVE_INFINITY;
  for (const combination of combinations) {
    const count = missingFields(combination, fields).length;
    if (count < fewestMissing) fewestMissing = count;
  }

  const alternatives = combinations.filter(
    combination =>
      missingFields(combination, fields).length === fewestMissing &&
      !(chosen !== undefined && areSameCombination(combination, chosen))
  );

  return { status: 'resolved', providerKey, satisfied, chosenValid, missing, alternatives };
}
