'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const {
  MEDICAID_SEARCH_RULES,
  MEDICARE_PROVIDER_KEY,
  MEDICARE_SEARCH_RULE,
} = require('../dist/eligibility');

/**
 * Drift guard between the generated module and Approved Admissions' export.
 *
 * The parser below is deliberately its own eight lines rather than an import of
 * scripts/generate-medicaid-search-rules.mjs: a test that reuses the generator would mirror
 * a generator bug instead of catching it.
 *
 * Refreshing the table when AA sends a new export: replace the TSV, run
 * `npm run generate:medicaid-rules`, run `npm test`.
 */

const SOURCE_TSV = path.join(__dirname, '..', 'data', 'aa-medicaid-search-rules.tsv');

const parseSource = () =>
  fs
    .readFileSync(SOURCE_TSV, 'utf-8')
    .split('\n')
    .filter(line => line.trim() !== '')
    .map(line => {
      const [providerKey, label, combinationsJson] = line.split('\t');
      return { providerKey, label: label.trim(), combinations: JSON.parse(combinationsJson) };
    });

test('the generated Medicaid table matches the checked-in AA export exactly', () => {
  const medicaidRows = parseSource().filter(row => row.providerKey !== MEDICARE_PROVIDER_KEY);

  const fromSource = medicaidRows.reduce(
    (table, row) => ({ ...table, [row.providerKey]: row.combinations }),
    {}
  );
  const fromModule = Object.entries(MEDICAID_SEARCH_RULES).reduce(
    (table, [providerKey, combinations]) => ({
      ...table,
      [providerKey]: combinations.map(combination => [...combination]),
    }),
    {}
  );

  // deepStrictEqual on ordered arrays, because AA's combination order decides which method
  // resolveSearchMethod picks first.
  assert.deepStrictEqual(fromModule, fromSource);
  assert.deepStrictEqual(
    Object.keys(MEDICAID_SEARCH_RULES),
    medicaidRows.map(row => row.providerKey),
    'provider order must follow the export'
  );
});

test('the generated Medicare rule matches the checked-in AA export', () => {
  const medicareRows = parseSource().filter(row => row.providerKey === MEDICARE_PROVIDER_KEY);

  assert.equal(medicareRows.length, 1);
  assert.equal(medicareRows[0].combinations.length, 1);
  assert.deepStrictEqual([...MEDICARE_SEARCH_RULE], medicareRows[0].combinations[0]);
});

test('the export still holds the row and combination counts the module was built against', () => {
  const rows = parseSource();
  const medicaidRows = rows.filter(row => row.providerKey !== MEDICARE_PROVIDER_KEY);
  const totalCombinations = medicaidRows.reduce((sum, row) => sum + row.combinations.length, 0);

  assert.equal(rows.length, 50, '49 Medicaid rows plus one Medicare row');
  assert.equal(medicaidRows.length, Object.keys(MEDICAID_SEARCH_RULES).length);
  assert.equal(
    Object.values(MEDICAID_SEARCH_RULES).reduce((sum, combinations) => sum + combinations.length, 0),
    totalCombinations
  );
});
