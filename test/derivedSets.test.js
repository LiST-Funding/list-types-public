'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  MATRIX_ENABLED_STATES,
  MEDICAID_PROVIDER_KEY_BY_STATE,
  MEDICAID_SEARCH_RULES,
  MEDICARE_PROVIDER_KEY,
  MEDICARE_SEARCH_RULE,
  SSN_NOT_ACCEPTED_STATES,
  STATE_BY_MEDICAID_PROVIDER_KEY,
} = require('../dist/eligibility');
const { ALL_SEARCH_FIELDS, setKey, providerEntries } = require('./helpers');

const sorted = values => [...values].sort();
const stateOf = providerKey => STATE_BY_MEDICAID_PROVIDER_KEY[providerKey];

test('every provider has at least one non-empty combination of known fields', () => {
  const entries = providerEntries();
  assert.equal(entries.length, 49);

  for (const [providerKey, combinations] of entries) {
    assert.ok(combinations.length >= 1, `${providerKey} has no combinations`);
    for (const combination of combinations) {
      assert.ok(combination.length >= 1, `${providerKey} has an empty combination`);
      for (const field of combination) {
        assert.ok(ALL_SEARCH_FIELDS.includes(field), `${providerKey} uses unknown field ${field}`);
      }
    }
  }
});

test('no provider lists the same field set twice', () => {
  for (const [providerKey, combinations] of providerEntries()) {
    const keys = combinations.map(setKey);
    assert.equal(new Set(keys).size, keys.length, `${providerKey} lists a duplicate field set`);
  }
});

test('the Medicare row is kept out of the Medicaid table and out of the state map', () => {
  assert.equal(
    Object.prototype.hasOwnProperty.call(MEDICAID_SEARCH_RULES, MEDICARE_PROVIDER_KEY),
    false
  );
  assert.deepEqual([...MEDICARE_SEARCH_RULE], [
    'FirstName',
    'LastName',
    'BirthDate',
    'MedicareNumber',
  ]);
  assert.equal(Object.values(MEDICAID_PROVIDER_KEY_BY_STATE).includes(MEDICARE_PROVIDER_KEY), false);
  for (const state of Object.keys(MEDICAID_PROVIDER_KEY_BY_STATE)) {
    assert.match(state, /^[A-Z]{2}$/, `${state} does not look like a state code`);
  }
});

test('SSN_NOT_ACCEPTED_STATES is exactly the states with no SSN path', () => {
  // Hand-listed in the table module; re-derived here from the rules so a stale list fails.
  assert.deepEqual(sorted(SSN_NOT_ACCEPTED_STATES), ['AR', 'CA', 'NE', 'PA', 'RI', 'TN', 'UT', 'VT']);

  const derivedFromTable = providerEntries()
    .filter(([, combinations]) => !combinations.some(c => c.includes('Ssn')))
    .map(([providerKey]) => stateOf(providerKey))
    .filter(state => state !== undefined);
  assert.deepEqual(sorted(SSN_NOT_ACCEPTED_STATES), sorted(derivedFromTable));
});

test('SSN_NOT_ACCEPTED_STATES holds no empty entries and no unmapped provider', () => {
  for (const state of SSN_NOT_ACCEPTED_STATES) {
    assert.equal(typeof state, 'string', 'an unmapped provider leaked into the derived list');
    assert.notEqual(state, '', 'the derived list must hold no empty entries');
    assert.ok(
      Object.prototype.hasOwnProperty.call(MEDICAID_PROVIDER_KEY_BY_STATE, state),
      `${state} is not a state AA publishes rules for`
    );
  }
  assert.equal(new Set(SSN_NOT_ACCEPTED_STATES).size, SSN_NOT_ACCEPTED_STATES.length);
});

test('exactly one provider has rules but no state code of its own', () => {
  // Texas LTC. This test fires when a future AA export adds another unmapped provider, which
  // is the case that would otherwise leak silently through any provider-to-state derivation.
  const unmapped = providerEntries()
    .map(([providerKey]) => providerKey)
    .filter(providerKey => stateOf(providerKey) === undefined);

  assert.deepEqual(unmapped, ['AA201065']);
});

test('sex is part of a name path in exactly seven states', () => {
  const withSex = providerEntries()
    .filter(([, combinations]) => combinations.some(c => c.includes('Sex')))
    .map(([providerKey]) => stateOf(providerKey));

  assert.deepEqual(sorted(withSex), ['FL', 'GA', 'ME', 'MI', 'OH', 'WI', 'WY']);
});

test('the state map holds 48 jurisdictions and excludes Texas LTC', () => {
  const states = Object.keys(MEDICAID_PROVIDER_KEY_BY_STATE);
  assert.equal(states.length, 48, '47 states plus DC; Alaska, Arizona and Hawaii have no AA rules');

  const providerKeys = Object.values(MEDICAID_PROVIDER_KEY_BY_STATE);
  assert.equal(new Set(providerKeys).size, providerKeys.length, 'a provider key is mapped twice');
  for (const providerKey of providerKeys) {
    assert.ok(
      Object.prototype.hasOwnProperty.call(MEDICAID_SEARCH_RULES, providerKey),
      `${providerKey} is mapped from a state but has no rules`
    );
  }

  for (const missing of ['AK', 'AZ', 'HI', 'TX-LTC']) {
    assert.equal(states.includes(missing), false, `${missing} must not be a state code`);
  }
  // Texas LTC keeps its rules, reachable by provider key only.
  assert.ok(Object.prototype.hasOwnProperty.call(MEDICAID_SEARCH_RULES, 'AA201065'));
  assert.equal(providerKeys.includes('AA201065'), false);

  assert.equal(MEDICAID_PROVIDER_KEY_BY_STATE.FL, 'AA201030');
  assert.equal(MEDICAID_PROVIDER_KEY_BY_STATE.NY, 'AA201053');
  assert.equal(MEDICAID_PROVIDER_KEY_BY_STATE.TX, 'AA201064');
  assert.equal(MEDICAID_PROVIDER_KEY_BY_STATE.CA, 'AA201025');
});

test('the rules and maps are plain data: objects and arrays, nothing callable', () => {
  const surface = require('../dist/eligibility');
  for (const [name, value] of Object.entries(surface)) {
    if (name === '__esModule') continue;
    assert.notEqual(typeof value, 'function', `${name} is a function — logic belongs in the consumers`);
  }
  assert.equal(Object.getPrototypeOf(MEDICAID_SEARCH_RULES), Object.prototype);
  assert.ok(Array.isArray(MEDICAID_SEARCH_RULES.AA201030[0]));
});

test('the state map and its inverse round-trip', () => {
  for (const [state, providerKey] of Object.entries(MEDICAID_PROVIDER_KEY_BY_STATE)) {
    assert.equal(STATE_BY_MEDICAID_PROVIDER_KEY[providerKey], state);
  }
  assert.equal(
    Object.keys(STATE_BY_MEDICAID_PROVIDER_KEY).length,
    Object.keys(MEDICAID_PROVIDER_KEY_BY_STATE).length
  );
});

test('the allowlist holds only real state codes and no duplicates', () => {
  assert.equal(new Set(MATRIX_ENABLED_STATES).size, MATRIX_ENABLED_STATES.length);
  for (const state of MATRIX_ENABLED_STATES) {
    assert.ok(
      Object.prototype.hasOwnProperty.call(MEDICAID_PROVIDER_KEY_BY_STATE, state),
      `${state} is enabled but has no AA rules`
    );
  }
});

test('the allowlist currently enables every state AA publishes rules for', () => {
  // Owner decision of 2026-09-07. This is the line to change when product narrows the
  // rollout; MATRIX_ENABLED_STATES stays hand-written so that is a one-line edit.
  assert.deepEqual(sorted(MATRIX_ENABLED_STATES), sorted(Object.keys(MEDICAID_PROVIDER_KEY_BY_STATE)));
});
