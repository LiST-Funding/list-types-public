import type { MedicaidSearchRules, SearchCombination } from './types';

/**
 * Freezes the rules table, every provider's list of combinations, and every combination.
 *
 * `Readonly` is erased at compile time and NaviHealth consumes this package from plain
 * JavaScript, so freezing is the only thing that stops a consumer mutating the shared table
 * for every other caller in the process.
 */
export function freezeSearchRules(
  rules: Record<string, readonly SearchCombination[]>
): MedicaidSearchRules {
  for (const combinations of Object.values(rules)) {
    for (const combination of combinations) {
      Object.freeze(combination);
    }
    Object.freeze(combinations);
  }
  return Object.freeze(rules);
}
