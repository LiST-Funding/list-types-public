'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

/**
 * The generator's refusals, exercised by running the real script as a child process against
 * fixture exports in a temporary directory.
 *
 * A child process rather than an import, because the whole contract under test is "abort with
 * a non-zero exit and write nothing" — a generator that half-wrote a file and returned would
 * pass any in-process assertion about its return value.
 */

const REPO_ROOT = path.join(__dirname, '..');
const GENERATOR = path.join(REPO_ROOT, 'scripts', 'generate-medicaid-search-rules.mjs');
const REAL_TSV = path.join(REPO_ROOT, 'data', 'aa-medicaid-search-rules.tsv');
const COMMITTED_OUTPUT = path.join(REPO_ROOT, 'src', 'eligibility', 'medicaidSearchRules.generated.ts');

const MEDICARE_ROW = 'AA201001\tMedicare\t[["FirstName","LastName","BirthDate","MedicareNumber"]]';
const ALABAMA_ROW = 'AA201021\tAlabama\t[["MedicaidNumber"]]';

/**
 * Runs the generator against a fixture, in a directory of its own so the committed module is
 * never the target.
 */
function generate(tsvContents) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'aa-rules-'));
  const source = path.join(directory, 'source.tsv');
  const output = path.join(directory, 'out.ts');
  fs.writeFileSync(source, tsvContents);

  const result = spawnSync(process.execPath, [GENERATOR, source, output], { encoding: 'utf-8' });

  return {
    status: result.status,
    stderr: result.stderr,
    wroteOutput: fs.existsSync(output),
    output: fs.existsSync(output) ? fs.readFileSync(output, 'utf-8') : null,
    cleanup: () => fs.rmSync(directory, { recursive: true, force: true }),
  };
}

/**
 * @param {string} tsv
 * @param {string} expectedMessage
 */
function assertRefused(tsv, expectedMessage) {
  const result = generate(tsv);
  try {
    assert.notEqual(result.status, 0, 'the generator must exit non-zero');
    assert.match(result.stderr, new RegExp(expectedMessage));
    assert.equal(result.wroteOutput, false, 'no file may be written when the export is rejected');
  } finally {
    result.cleanup();
  }
}

test('a byte-order mark on the export cannot corrupt the first provider key', () => {
  // Excel's "Save As UTF-8" adds one. Left in place it lands on Alabama's key, which stays a
  // legal identifier, so the module compiles and the drift test re-reads the same mark and
  // agrees — while every lookup of AA201021 silently fails.
  const withMark = `﻿${fs.readFileSync(REAL_TSV, 'utf-8')}`;
  const result = generate(withMark);

  try {
    assert.equal(result.status, 0, result.stderr);
    assert.equal(
      result.output,
      fs.readFileSync(COMMITTED_OUTPUT, 'utf-8'),
      'a marked export must produce byte-identical output to the committed module'
    );
  } finally {
    result.cleanup();
  }
});

test('the real export regenerates byte-identically', () => {
  const result = generate(fs.readFileSync(REAL_TSV, 'utf-8'));

  try {
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.output, fs.readFileSync(COMMITTED_OUTPUT, 'utf-8'));
  } finally {
    result.cleanup();
  }
});

test('a provider key that is not AA followed by digits is refused', () => {
  assertRefused(`${MEDICARE_ROW}\nXX201021\tAlabama\t[["MedicaidNumber"]]`, 'not of the form');
});

test('a header row is refused', () => {
  assertRefused(`ProviderKey\tState\tCombinations\n${MEDICARE_ROW}`, 'not of the form');
});

test('a row with the wrong number of columns is refused', () => {
  assertRefused(`${MEDICARE_ROW}\nAA201021\tAlabama`, 'expected 3');
});

test('an Excel-quoted JSON column is refused', () => {
  assertRefused(
    `${MEDICARE_ROW}\nAA201021\tAlabama\t"[[""MedicaidNumber""]]"`,
    'not valid JSON'
  );
});

test('a provider with no combinations is refused', () => {
  assertRefused(`${MEDICARE_ROW}\nAA201021\tAlabama\t[]`, 'no search combinations');
});

test('an empty combination is refused', () => {
  assertRefused(`${MEDICARE_ROW}\nAA201021\tAlabama\t[[]]`, 'empty combination');
});

test('an unknown search field is refused', () => {
  assertRefused(`${MEDICARE_ROW}\nAA201021\tAlabama\t[["MothersMaidenName"]]`, 'unknown search field');
});

test('an unknown state label is refused', () => {
  assertRefused(`${MEDICARE_ROW}\nAA201099\tAtlantis\t[["MedicaidNumber"]]`, 'STATE_CODE_BY_AA_LABEL');
});

test('a duplicate provider key is refused', () => {
  assertRefused(`${MEDICARE_ROW}\n${ALABAMA_ROW}\n${ALABAMA_ROW}`, 'duplicate provider key');
});

test('two providers claiming one state are refused', () => {
  assertRefused(
    `${MEDICARE_ROW}\n${ALABAMA_ROW}\nAA201099\tAlabama\t[["MedicaidNumber"]]`,
    'claimed by both'
  );
});

test('a missing Medicare row is refused', () => {
  assertRefused(ALABAMA_ROW, 'expected exactly 1 row for Medicare');
});

test('more than one Medicare combination is refused', () => {
  assertRefused(
    'AA201001\tMedicare\t[["MedicareNumber"],["FirstName"]]',
    'expected exactly 1 Medicare search combination'
  );
});
