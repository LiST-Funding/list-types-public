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
 */

/** The provider's accepted combinations in AA's order, or undefined when AA publishes no
 *  rules for that key (Alaska, Arizona and Hawaii, or anything unrecognised). */
export function getSearchCombinations(providerKey: string): readonly SearchCombination[] | undefined {
  const rules: Readonly<Record<string, readonly SearchCombination[] | undefined>> = MEDICAID_SEARCH_RULES;
  return rules[providerKey];
}

/** The AA provider key for a state code, or undefined when the state has no rules. */
export function getProviderKeyByState(state: string): string | undefined {
  const byState: Readonly<Record<string, string | undefined>> = MEDICAID_PROVIDER_KEY_BY_STATE;
  return byState[state];
}

/** The state a provider key belongs to, or undefined for an unknown key and for Texas LTC,
 *  which has rules but no state code of its own. */
export function getStateByProviderKey(providerKey: string): MedicaidStateCode | undefined {
  const byKey: Readonly<Record<string, MedicaidStateCode | undefined>> = STATE_BY_MEDICAID_PROVIDER_KEY;
  return byKey[providerKey];
}
