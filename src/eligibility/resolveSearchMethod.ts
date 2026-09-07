import { areSameCombination } from './combinationSet';
import { getSearchCombinations } from './searchRulesLookup';
import type {
  SearchCombination,
  SearchField,
  SearchFieldValues,
  SearchMethodResolution,
} from './types';

/**
 * Is this field supplied? Only a string that is non-empty after trimming counts, so an
 * untouched form control and one holding only spaces are both missing.
 *
 * Typed to accept `unknown` and written defensively because the callers that matter are
 * plain JavaScript — NaviHealth and Workflow-Front — where `fields` arrives from a Mongo
 * document or a JSON body and can be null, or anything else. The documented contract is a
 * throw-free path to a result, so a bad shape has to read as "nothing supplied" rather than
 * crash the worker's validation.
 *
 * Read through a property descriptor, which resolves own properties only. A direct index
 * would let a polluted `Object.prototype` make an empty object report a supplied field.
 */
function isSupplied(fields: unknown, field: SearchField): boolean {
  if (typeof fields !== 'object' || fields === null) return false;

  const descriptor = Object.getOwnPropertyDescriptor(fields, field);
  const value: unknown = descriptor === undefined ? undefined : descriptor.value;
  return typeof value === 'string' && value.trim() !== '';
}

const missingFields = (
  combination: SearchCombination,
  fields: SearchFieldValues
): readonly SearchField[] => combination.filter(field => !isSupplied(fields, field));

/** The fields of `chosen` that are not supplied, in the order `chosen` gave them, with
 *  repeats collapsed — set equality already treats a repeated field as one, so leaving
 *  duplicates in the gap list would contradict it. */
function missingFromChosen(
  chosen: SearchCombination,
  fields: SearchFieldValues
): readonly SearchField[] {
  const seen = new Set<SearchField>();

  return chosen.filter(field => {
    if (seen.has(field) || isSupplied(fields, field)) return false;
    seen.add(field);
    return true;
  });
}

/**
 * Checks the identifying fields a caller holds against one AA provider group's rules.
 *
 * @param providerKey AA's VerificationProviderGroupId, e.g. `AA201030` for Florida Medicaid.
 *                    Trimmed and upper-cased before lookup, so the same spelling works here
 *                    and in isMatrixEnabled.
 * @param fields      The identifying values the caller holds. Empty and whitespace-only
 *                    values count as missing, and so does a `fields` that is not an object.
 * @param chosen      The search method the user picked, when there is one. Matched against
 *                    the provider's combinations as a SET, so field order does not matter
 *                    and a repeated field is collapsed. Anything that is not an array —
 *                    including null, a number and a string — reads as no choice at all:
 *                    `chosenValid` false and `missing` empty.
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

  const chosenCombination: SearchCombination | null = Array.isArray(chosen) ? chosen : null;

  const satisfied =
    combinations.find(combination => combination.every(field => isSupplied(fields, field))) ?? null;

  const chosenValid =
    chosenCombination !== null &&
    combinations.some(combination => areSameCombination(combination, chosenCombination));

  const missing = chosenCombination === null ? [] : missingFromChosen(chosenCombination, fields);

  let fewestMissing = Number.POSITIVE_INFINITY;
  for (const combination of combinations) {
    const count = missingFields(combination, fields).length;
    if (count < fewestMissing) fewestMissing = count;
  }

  const alternatives = combinations.filter(
    combination =>
      missingFields(combination, fields).length === fewestMissing &&
      !(chosenCombination !== null && areSameCombination(combination, chosenCombination))
  );

  return { status: 'resolved', providerKey, satisfied, chosenValid, missing, alternatives };
}
