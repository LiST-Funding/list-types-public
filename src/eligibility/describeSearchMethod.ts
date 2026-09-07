import { toCanonicalSet } from './combinationSet';
import type { SearchCombination, SearchField } from './types';

const FIELD_LABELS: Readonly<Record<SearchField, string>> = Object.freeze({
  MedicaidNumber: 'Medicaid ID',
  MedicareNumber: 'Medicare number',
  Ssn: 'SSN',
  FirstName: 'first name',
  LastName: 'last name',
  BirthDate: 'date of birth',
  Sex: 'sex',
});

const capitalize = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);

/** Own-property lookup, so a token naming an inherited member — `constructor`, `toString` —
 *  yields nothing instead of rendering a function body into the label. Unknown tokens are
 *  dropped rather than printed as an empty slot. */
function labelFor(field: SearchField): string | undefined {
  return Object.prototype.hasOwnProperty.call(FIELD_LABELS, field) ? FIELD_LABELS[field] : undefined;
}

/**
 * A plain-English label for a search method, for the "Search by" selector and the
 * "Searched by ..." line: `Medicaid ID`, `SSN + date of birth`, `Name + date of birth + sex`.
 *
 * Built from the combination's field SET, not the array as written, so the same logical
 * method reads identically wherever AA happens to list its fields in a different order.
 * First name and last name together collapse to one `name` token; a combination carrying
 * only one of them says which. An empty combination returns an empty string rather than
 * throwing, because this is called from a render path.
 */
export function describeSearchMethod(combination: SearchCombination): string {
  const canonical = toCanonicalSet(combination);
  if (canonical.length === 0) return '';

  const hasBothNameParts = canonical.includes('FirstName') && canonical.includes('LastName');
  const tokens: string[] = [];

  for (const field of canonical) {
    if (hasBothNameParts && field === 'LastName') continue;
    if (hasBothNameParts && field === 'FirstName') {
      tokens.push('name');
      continue;
    }
    const label = labelFor(field);
    if (label !== undefined) tokens.push(label);
  }

  if (tokens.length === 0) return '';

  return capitalize(tokens.join(' + '));
}
