import { MEDICAID_SEARCH_RULES } from './medicaidSearchRules.generated';
import type { MedicaidStateCode } from './medicaidSearchRules.generated';
import { getStateByProviderKey } from './searchRulesLookup';

function deriveSsnNotAcceptedStates(): readonly MedicaidStateCode[] {
  const states: MedicaidStateCode[] = [];

  for (const [providerKey, combinations] of Object.entries(MEDICAID_SEARCH_RULES)) {
    if (combinations.some(combination => combination.includes('Ssn'))) continue;

    // Providers with no state code are dropped deliberately. Texas LTC is the only one
    // today and it accepts an SSN, so it never reaches here — but that is a fact about the
    // current export, not a property of this code. Without the guard, the next export that
    // adds an unmapped provider with no SSN path would push undefined into an array that
    // consumers read as state codes.
    const state = getStateByProviderKey(providerKey);
    if (state === undefined) continue;

    states.push(state);
  }

  return Object.freeze(states);
}

/**
 * The states with no combination that accepts an SSN, derived from the table rather than
 * listed by hand so it cannot fall out of step with AA's rules.
 *
 * Sending an SSN to these states is pure downside: extra protected data on the wire and in
 * logs, with no way for it to improve a match.
 */
export const SSN_NOT_ACCEPTED_STATES: readonly MedicaidStateCode[] = deriveSsnNotAcceptedStates();
