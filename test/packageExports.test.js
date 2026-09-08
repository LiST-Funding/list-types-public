'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

/**
 * Wiring evidence for the two entry points.
 *
 * The subpath `list-types-public/eligibility` is the canonical consumer import. The package
 * root re-exports the module as the `eligibility` namespace as a convenience. Both are
 * asserted here so a forgotten hand-edit of src/index.ts fails the suite instead of shipping
 * a dead export — the export generator writes package.json's subpath map, but never the root
 * barrel.
 *
 * The dynamic imports matter because NaviHealth is an ECMAScript-modules package consuming
 * this CommonJS build. Named imports out of CommonJS depend on Node statically detecting the
 * exports through the re-export chain, which a require() test would not exercise.
 */

/**
 * The exact public surface: data only. Asserted as a closed list, not a subset, because a
 * helper reaching the barrel is invisible otherwise: `export *` re-exports whatever a module
 * happens to export, so one added `export` keyword silently widens what consumers may depend
 * on. Logic lives in the consumers; a function appearing here is a regression.
 */
const PUBLIC_NAMES = [
  'MATRIX_ENABLED_STATES',
  'MEDICAID_PROVIDER_KEY_BY_STATE',
  'MEDICAID_SEARCH_RULES',
  'MEDICARE_PROVIDER_KEY',
  'MEDICARE_SEARCH_RULE',
  'SSN_NOT_ACCEPTED_STATES',
  'STATE_BY_MEDICAID_PROVIDER_KEY',
];

const distUrl = relative => pathToFileURL(path.join(__dirname, '..', 'dist', relative)).href;

test('the subpath entry point exposes exactly the public surface, no more', () => {
  const subpath = require('../dist/eligibility');
  for (const name of PUBLIC_NAMES) {
    assert.notEqual(subpath[name], undefined, `${name} is missing from the eligibility subpath`);
  }

  const actual = Object.keys(subpath).filter(name => name !== '__esModule').sort();
  assert.deepEqual(
    actual,
    [...PUBLIC_NAMES].sort(),
    'the export surface changed — add the name to PUBLIC_NAMES deliberately, or keep the helper internal'
  );
});

test('the package root re-exports the module as a namespace', () => {
  const root = require('../dist');
  assert.notEqual(root.eligibility, undefined, 'src/index.ts is missing its eligibility export');
  for (const name of PUBLIC_NAMES) {
    assert.notEqual(root.eligibility[name], undefined, `${name} is missing from the root namespace`);
  }
});

test('ECMAScript-modules consumers can name-import from the subpath', async () => {
  const subpath = await import(distUrl('eligibility/index.js'));
  for (const name of PUBLIC_NAMES) {
    assert.ok(
      Object.prototype.hasOwnProperty.call(subpath, name),
      `${name} is not statically detected as a named export`
    );
  }
  assert.equal(typeof subpath.MEDICAID_SEARCH_RULES, 'object');
});

test('ECMAScript-modules consumers can name-import the namespace from the root', async () => {
  const root = await import(distUrl('index.js'));
  assert.ok(Object.prototype.hasOwnProperty.call(root, 'eligibility'));
  assert.equal(typeof root.eligibility.MEDICAID_SEARCH_RULES, 'object');
});
