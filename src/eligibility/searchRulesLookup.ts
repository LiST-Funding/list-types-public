import {
  MEDICAID_PROVIDER_KEY_BY_STATE,
  MEDICAID_SEARCH_RULES,
  STATE_BY_MEDICAID_PROVIDER_KEY,
} from './medicaidSearchRules.generated';
import type { MedicaidStateCode } from './medicaidSearchRules.generated';
import type { SearchCombination } from './types';

/**
 * Lookups that return `undefined` for a key the table does not hold.
 *
 * This file exists because the package compiles without `noUncheckedIndexedAccess`, so
 * indexing the generated records directly is typed as always-defined and would hand callers
 * a runtime `undefined` under a non-optional type. Widening each record to a
 * `Record<K, V | undefined>`-typed local is a legal assignment, so the honest type is
 * reached without a cast.
 *
 * Every lookup goes through `hasOwn` rather than reading the key directly. The provider key
 * reaching these functions is client-supplied — Workflow-Front derives it from a state
 * dropdown and WorkflowServer stores task data verbatim — so a key naming an inherited
 * member (`constructor`, `toString`, `__proto__`) would otherwise return a function or
 * Object.prototype as if it were table data, and callers would crash on it instead of
 * taking the readable unknown-provider path.
 */

const hasOwn = (record: object, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(record, key);

/**
 * The single normalization for every key this module and the allowlist look up: trimmed and
 * upper-cased. Both AA's provider keys and the state codes are upper-case, so a form that
 * hands over `fl` or a padded `  AA201030 ` resolves the same way everywhere. Having one
 * helper is the point: isMatrixEnabled and these lookups disagreeing about the spelling of a
 * key would enable a state on one path and not the other.
 *
 * Accepts `unknown` because plain-JavaScript consumers can pass anything; a non-string
 * normalizes to the empty string, which no table holds.
 */
export function normalizeLookupKey(key: unknown): string {
  return typeof key === 'string' ? key.trim().toUpperCase() : '';
}

/** The provider's accepted combinations in AA's order, or undefined when AA publishes no
 *  rules for that key (Alaska, Arizona and Hawaii, or anything unrecognised). */
export function getSearchCombinations(providerKey: string): readonly SearchCombination[] | undefined {
  const rules: Readonly<Record<string, readonly SearchCombination[] | undefined>> = MEDICAID_SEARCH_RULES;
  const key = normalizeLookupKey(providerKey);
  return hasOwn(rules, key) ? rules[key] : undefined;
}

/** The AA provider key for a state code, or undefined when the state has no rules. */
export function getProviderKeyByState(state: string): string | undefined {
  const byState: Readonly<Record<string, string | undefined>> = MEDICAID_PROVIDER_KEY_BY_STATE;
  const key = normalizeLookupKey(state);
  return hasOwn(byState, key) ? byState[key] : undefined;
}

/** The state a provider key belongs to, or undefined for an unknown key and for Texas LTC,
 *  which has rules but no state code of its own. */
export function getStateByProviderKey(providerKey: string): MedicaidStateCode | undefined {
  const byKey: Readonly<Record<string, MedicaidStateCode | undefined>> = STATE_BY_MEDICAID_PROVIDER_KEY;
  const key = normalizeLookupKey(providerKey);
  return hasOwn(byKey, key) ? byKey[key] : undefined;
}
