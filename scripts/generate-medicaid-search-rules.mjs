import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Generates src/eligibility/medicaidSearchRules.generated.ts from
 * data/aa-medicaid-search-rules.tsv (Approved Admissions' SearchOptions export).
 *
 * Run with: npm run generate:medicaid-rules
 *
 * Refreshing the table when AA sends a new export:
 *   1. replace data/aa-medicaid-search-rules.tsv
 *   2. run this script
 *   3. run `npm test` — test/generatedTableMatchesSource.test.js re-parses the TSV
 *      independently and fails if the generated constant drifted from it.
 *
 * The script refuses to write a partial or malformed file: an unknown state label,
 * an unknown field name, a provider with no combinations, a duplicate provider key
 * or an empty combination each abort the run with a non-zero exit.
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..');

// Both paths may be overridden on the command line, so the generator's failure branches can
// be exercised against fixture files without writing over the real generated module:
//   node scripts/generate-medicaid-search-rules.mjs <sourceTsv> <outputTs>
const [sourceArg, outputArg] = process.argv.slice(2);
const SOURCE_TSV = sourceArg || path.join(ROOT_DIR, 'data', 'aa-medicaid-search-rules.tsv');
const OUTPUT_TS = outputArg || path.join(ROOT_DIR, 'src', 'eligibility', 'medicaidSearchRules.generated.ts');

/** AA's Medicare provider group. Routed by KEY, never by the state-column text, which
 *  literally reads "Medicare" and would otherwise be mapped as if it were a state. */
const MEDICARE_PROVIDER_KEY = 'AA201001';

/** AA lists Texas twice: AA201064 "Texas" and AA201065 "Texas LTC". A state-keyed record
 *  cannot hold both, so Texas LTC keeps its rules under its provider key and is not offered
 *  as a state. TX maps to AA201064, matching what Workflow-Front already sends today. */
const PROVIDER_KEYS_WITHOUT_STATE_CODE = new Set(['AA201065']);

/** AA's provider keys are the literal AA followed by digits. Validated because a mangled key
 *  can still be a legal TypeScript identifier — a byte-order mark on the first row would
 *  otherwise produce a key nothing can ever look up, with every gate still green. */
const PROVIDER_KEY_PATTERN = /^AA\d+$/;

const SEARCH_FIELDS = [
  'MedicaidNumber',
  'FirstName',
  'LastName',
  'BirthDate',
  'Ssn',
  'Sex',
  'MedicareNumber',
];

/** AA's state label -> two-letter code. The 48 jurisdictions in AA's table: 47 states plus
 *  DC. Alaska, Arizona and Hawaii have no rows in AA's export and so have no code here. */
const STATE_CODE_BY_AA_LABEL = {
  Alabama: 'AL',
  Arkansas: 'AR',
  California: 'CA',
  Colorado: 'CO',
  Connecticut: 'CT',
  DC: 'DC',
  Delaware: 'DE',
  Florida: 'FL',
  Georgia: 'GA',
  Idaho: 'ID',
  Illinois: 'IL',
  Indiana: 'IN',
  Iowa: 'IA',
  Kansas: 'KS',
  Kentucky: 'KY',
  Louisiana: 'LA',
  Maine: 'ME',
  Maryland: 'MD',
  Massachusetts: 'MA',
  Michigan: 'MI',
  Minnesota: 'MN',
  Mississippi: 'MS',
  Missouri: 'MO',
  Montana: 'MT',
  Nebraska: 'NE',
  Nevada: 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  Ohio: 'OH',
  Oklahoma: 'OK',
  Oregon: 'OR',
  Pennsylvania: 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  Tennessee: 'TN',
  Texas: 'TX',
  Utah: 'UT',
  Vermont: 'VT',
  Virginia: 'VA',
  Washington: 'WA',
  'West Virginia': 'WV',
  Wisconsin: 'WI',
  Wyoming: 'WY',
};

function fail(message) {
  process.stderr.write(`generate-medicaid-search-rules: ${message}\n`);
  process.exit(1);
}

function parseSourceRows() {
  // Excel's "Save As UTF-8" prepends a byte-order mark. Left in place it becomes part of the
  // first row's provider key, which stays a legal identifier, so the file compiles, the drift
  // test re-parses the same mark and agrees, and only the lookup silently fails.
  const raw = fs.readFileSync(SOURCE_TSV, 'utf-8').replace(/^\uFEFF/, '');
  const lines = raw.split('\n').filter(line => line.trim() !== '');

  return lines.map((line, index) => {
    const rowNumber = index + 1;
    const columns = line.split('\t');
    if (columns.length !== 3) {
      fail(`row ${rowNumber} has ${columns.length} tab-separated columns, expected 3`);
    }

    const providerKey = columns[0].trim();
    const label = columns[1];
    const combinationsJson = columns[2];

    if (!PROVIDER_KEY_PATTERN.test(providerKey)) {
      fail(`row ${rowNumber} has provider key "${providerKey}", which is not of the form AA<digits>`);
    }
    let combinations;
    try {
      combinations = JSON.parse(combinationsJson);
    } catch (error) {
      fail(`row ${rowNumber} (${providerKey}): third column is not valid JSON — ${error.message}`);
    }

    if (!Array.isArray(combinations) || combinations.length === 0) {
      fail(`row ${rowNumber} (${providerKey}) has no search combinations`);
    }

    for (const combination of combinations) {
      if (!Array.isArray(combination) || combination.length === 0) {
        fail(`row ${rowNumber} (${providerKey}) contains an empty combination`);
      }
      for (const field of combination) {
        if (!SEARCH_FIELDS.includes(field)) {
          fail(`row ${rowNumber} (${providerKey}) uses unknown search field "${field}"`);
        }
      }
    }

    return { providerKey, label: label.trim(), combinations, rowNumber };
  });
}

function partitionRows(rows) {
  // AA201001 is routed to the Medicare rule by KEY, before the state-label map is
  // consulted, so the literal word "Medicare" in its state column never reaches
  // STATE_CODE_BY_AA_LABEL and no state named "Medicare" can be invented.
  const medicareRows = rows.filter(row => row.providerKey === MEDICARE_PROVIDER_KEY);
  const medicaidRows = rows.filter(row => row.providerKey !== MEDICARE_PROVIDER_KEY);

  if (medicareRows.length !== 1) {
    fail(`expected exactly 1 row for Medicare key ${MEDICARE_PROVIDER_KEY}, found ${medicareRows.length}`);
  }
  if (medicareRows[0].combinations.length !== 1) {
    fail(`expected exactly 1 Medicare search combination, found ${medicareRows[0].combinations.length}`);
  }

  const seen = new Set();
  for (const row of medicaidRows) {
    if (seen.has(row.providerKey)) {
      fail(`duplicate provider key ${row.providerKey} at row ${row.rowNumber}`);
    }
    seen.add(row.providerKey);
  }

  return { medicareRow: medicareRows[0], medicaidRows };
}

function buildStateMap(medicaidRows) {
  const providerKeyByState = {};

  for (const row of medicaidRows) {
    if (PROVIDER_KEYS_WITHOUT_STATE_CODE.has(row.providerKey)) continue;

    const stateCode = STATE_CODE_BY_AA_LABEL[row.label];
    if (stateCode === undefined) {
      fail(
        `row ${row.rowNumber} (${row.providerKey}) has state label "${row.label}", which is not in ` +
          `STATE_CODE_BY_AA_LABEL. Add it, or add the provider key to PROVIDER_KEYS_WITHOUT_STATE_CODE.`
      );
    }
    if (providerKeyByState[stateCode] !== undefined) {
      fail(`state ${stateCode} is claimed by both ${providerKeyByState[stateCode]} and ${row.providerKey}`);
    }
    providerKeyByState[stateCode] = row.providerKey;
  }

  return providerKeyByState;
}

/** JSON.stringify rather than wrapping in quotes by hand: a value carrying a quote or a
 *  backslash would otherwise emit source that does not mean what the table says. */
const quote = value => JSON.stringify(value);
const renderCombination = combination => `[${combination.map(quote).join(', ')}]`;

function renderStateCodeUnion(stateCodes) {
  return stateCodes.map(code => `  | ${quote(code)}`).join('\n');
}

function renderRules(medicaidRows) {
  return medicaidRows
    .map(row => {
      const combinations = row.combinations.map(renderCombination).join(', ');
      return `  // ${row.label}\n  ${row.providerKey}: [${combinations}],`;
    })
    .join('\n');
}

function renderRecord(entries) {
  return entries.map(([key, value]) => `  ${key}: ${quote(value)},`).join('\n');
}

function buildFileContents(medicareRow, medicaidRows, providerKeyByState) {
  const stateCodes = Object.keys(providerKeyByState).sort();
  const stateEntries = stateCodes.map(code => [code, providerKeyByState[code]]);
  const inverseEntries = stateCodes.map(code => [providerKeyByState[code], code]);
  const totalCombinations = medicaidRows.reduce((sum, row) => sum + row.combinations.length, 0);

  return `/**
 * GENERATED FILE — DO NOT EDIT BY HAND.
 *
 * Written by scripts/generate-medicaid-search-rules.mjs from
 * data/aa-medicaid-search-rules.tsv (Approved Admissions' SearchOptions export).
 * Regenerate with \`npm run generate:medicaid-rules\`; \`npm test\` fails if this file
 * has drifted from the TSV.
 *
 * Canonical consumer import: \`list-types-public/eligibility\`.
 *
 * Contents: ${medicaidRows.length} Medicaid provider groups holding ${totalCombinations} search
 * combinations, and ${stateCodes.length} state codes — every jurisdiction AA publishes Medicaid
 * rules for. A state absent from AA's export has no code here. AA's combination order is
 * preserved verbatim, because resolveSearchMethod resolves to the first satisfied
 * combination in that order.
 */
import { freezeSearchRules } from './freezeSearchRules';
import type { MedicaidSearchRules, SearchCombination } from './types';

/** The two-letter codes AA publishes Medicaid rules for. Texas LTC (AA201065) is a second
 *  Texas program and has no code of its own; its rules are reachable by provider key. */
export type MedicaidStateCode =
${renderStateCodeUnion(stateCodes)};

/** AA's Medicare provider group. Its rules live in MEDICARE_SEARCH_RULE, never in
 *  MEDICAID_SEARCH_RULES. */
export const MEDICARE_PROVIDER_KEY = ${quote(medicareRow.providerKey)};

/** AA accepts exactly one combination for Medicare, which is what we already send. */
export const MEDICARE_SEARCH_RULE: SearchCombination = Object.freeze(${renderCombination(
    medicareRow.combinations[0]
  )});

/** Every Medicaid provider group's accepted search combinations, in AA's own order.
 *  Frozen at load: \`Readonly\` is compile-time only and NaviHealth consumes this from
 *  plain JavaScript, where nothing else would stop a caller mutating the shared table. */
export const MEDICAID_SEARCH_RULES: MedicaidSearchRules = freezeSearchRules({
${renderRules(medicaidRows)}
});

/** State code -> AA provider key. TX maps to AA201064, matching what Workflow-Front
 *  already sends; Texas LTC is deliberately absent. */
export const MEDICAID_PROVIDER_KEY_BY_STATE: Readonly<Record<MedicaidStateCode, string>> = Object.freeze({
${renderRecord(stateEntries)}
});

/** The inverse of MEDICAID_PROVIDER_KEY_BY_STATE. Generated rather than derived at load
 *  so that neither direction can be built with an unchecked key cast. */
export const STATE_BY_MEDICAID_PROVIDER_KEY: Readonly<Record<string, MedicaidStateCode>> = Object.freeze({
${renderRecord(inverseEntries)}
});
`;
}

function main() {
  const rows = parseSourceRows();
  const { medicareRow, medicaidRows } = partitionRows(rows);
  const providerKeyByState = buildStateMap(medicaidRows);

  fs.writeFileSync(OUTPUT_TS, buildFileContents(medicareRow, medicaidRows, providerKeyByState));

  const totalCombinations = medicaidRows.reduce((sum, row) => sum + row.combinations.length, 0);
  process.stdout.write(
    `Wrote ${path.relative(ROOT_DIR, OUTPUT_TS)}: ${medicaidRows.length} Medicaid providers, ` +
      `${totalCombinations} combinations, ${Object.keys(providerKeyByState).length} state codes.\n`
  );
}

main();
