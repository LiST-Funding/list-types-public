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
  describeSearchMethod,
  isMatrixEnabled,
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

test('isMatrixEnabled accepts a state code or a provider key', () => {
  assert.equal(isMatrixEnabled('FL'), true);
  assert.equal(isMatrixEnabled('fl'), true);
  assert.equal(isMatrixEnabled('  FL  '), true);
  assert.equal(isMatrixEnabled('AA201030'), true);

  for (const notEnabled of ['AK', 'AZ', 'HI', 'AA201022', 'AA201065', 'TX-LTC', '', 'nonsense']) {
    assert.equal(isMatrixEnabled(notEnabled), false, `${notEnabled} must not be enabled`);
  }
});

test('describeSearchMethod labels the shapes the form has to render', () => {
  assert.equal(describeSearchMethod(['MedicaidNumber']), 'Medicaid ID');
  assert.equal(describeSearchMethod(['Ssn', 'BirthDate']), 'SSN + date of birth');
  assert.equal(describeSearchMethod(['BirthDate', 'Ssn']), 'SSN + date of birth');
  assert.equal(
    describeSearchMethod(['LastName', 'FirstName', 'BirthDate', 'Sex']),
    'Name + date of birth + sex'
  );
  assert.equal(
    describeSearchMethod(['FirstName', 'LastName', 'BirthDate', 'Sex']),
    'Name + date of birth + sex'
  );
  assert.equal(describeSearchMethod(['Ssn', 'LastName']), 'SSN + last name');
  assert.equal(describeSearchMethod(['MedicaidNumber', 'LastName']), 'Medicaid ID + last name');
  assert.equal(describeSearchMethod(['MedicaidNumber', 'Ssn']), 'Medicaid ID + SSN');
  assert.equal(describeSearchMethod(['MedicareNumber']), 'Medicare number');
  assert.equal(describeSearchMethod([]), '');
});

test('describeSearchMethod ignores a token naming an inherited member', () => {
  // Without an own-property lookup this rendered the source of Object's constructor into the
  // label, and an unknown token printed as an empty slot: "Medicaid ID + ".
  assert.equal(describeSearchMethod(['constructor']), '');
  assert.equal(describeSearchMethod(['toString', 'valueOf']), '');
  assert.equal(describeSearchMethod(['MedicaidNumber', 'constructor']), 'Medicaid ID');
  assert.equal(describeSearchMethod(['Ssn', '__proto__']), 'SSN');
});

test('labels are keyed by field set, so AA writing one set two ways reads the same', () => {
  const combinations = providerEntries().flatMap(([, providerCombinations]) => providerCombinations);
  const labelsByFieldSet = new Map();

  for (const combination of combinations) {
    const key = setKey(combination);
    const label = describeSearchMethod(combination);
    const seen = labelsByFieldSet.get(key);
    if (seen !== undefined) {
      assert.equal(label, seen, `${key} renders as both "${seen}" and "${label}"`);
    }
    labelsByFieldSet.set(key, label);
  }

  const distinctArrays = new Set(combinations.map(c => c.join('|')));
  const distinctLabels = new Set(labelsByFieldSet.values());
  assert.ok(
    distinctLabels.size < distinctArrays.size,
    'labelling by field set must collapse the orderings AA writes the same set in'
  );
  assert.equal(distinctLabels.size, labelsByFieldSet.size, 'each field set needs its own label');
});
