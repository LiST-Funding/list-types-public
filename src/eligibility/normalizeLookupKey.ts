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
