'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { MEDICAID_SEARCH_RULES } = require('../dist/eligibility');
const { ALL_SEARCH_FIELDS, setKey, providerEntries } = require('./helpers');

const sorted = values => [...values].sort();
const hasOwn = (record, key) => Object.prototype.hasOwnProperty.call(record, key);
const withState = () => providerEntries().filter(([, rules]) => rules.state !== null);

test('every provider has a name and at least one non-empty combination of known fields', () => {
  const entries = providerEntries();
  assert.equal(entries.length, 49);

  for (const [providerKey, rules] of entries) {
    assert.match(providerKey, /^AA\d+$/, `${providerKey} is not an AA provider key`);
    assert.ok(typeof rules.name === 'string' && rules.name.trim() !== '', `${providerKey} has no name`);
    assert.ok(rules.combinations.length >= 1, `${providerKey} has no combinations`);
    for (const combination of rules.combinations) {
      assert.ok(combination.length >= 1, `${providerKey} has an empty combination`);
      for (const field of combination) {
        assert.ok(ALL_SEARCH_FIELDS.includes(field), `${providerKey} uses unknown field ${field}`);
      }
    }
  }
});

test('no provider lists the same field set twice', () => {
  for (const [providerKey, rules] of providerEntries()) {
    const keys = rules.combinations.map(setKey);
    assert.equal(new Set(keys).size, keys.length, `${providerKey} lists a duplicate field set`);
  }
});

test('the Medicare group is not in the Medicaid table', () => {
  assert.equal(hasOwn(MEDICAID_SEARCH_RULES, 'AA201001'), false);
});

test('48 jurisdictions carry a state code, each exactly once; Texas LTC is the one without', () => {
  const states = withState().map(([, rules]) => rules.state);
  assert.equal(states.length, 48, '47 states plus DC; Alaska, Arizona and Hawaii have no AA rules');
  assert.equal(new Set(states).size, states.length, 'a state is claimed by two providers');
  for (const state of states) assert.match(state, /^[A-Z]{2}$/, `${state} does not look like a state code`);
  for (const missing of ['AK', 'AZ', 'HI']) assert.equal(states.includes(missing), false, `${missing} must not be a state code`);

  const unmapped = providerEntries().filter(([, rules]) => rules.state === null).map(([key]) => key);
  assert.deepEqual(unmapped, ['AA201065']);
  assert.equal(MEDICAID_SEARCH_RULES.AA201065.name, 'Texas LTC');

  assert.equal(MEDICAID_SEARCH_RULES.AA201030.state, 'FL');
  assert.equal(MEDICAID_SEARCH_RULES.AA201053.state, 'NY');
  assert.equal(MEDICAID_SEARCH_RULES.AA201064.state, 'TX');
  assert.equal(MEDICAID_SEARCH_RULES.AA201025.state, 'CA');
});

test('exactly eight states have no SSN path', () => {
  const noSsn = withState()
    .filter(([, rules]) => !rules.combinations.some(c => c.includes('Ssn')))
    .map(([, rules]) => rules.state);
  assert.deepEqual(sorted(noSsn), ['AR', 'CA', 'NE', 'PA', 'RI', 'TN', 'UT', 'VT']);
});

test('sex is part of a name path in exactly seven states', () => {
  const withSex = withState()
    .filter(([, rules]) => rules.combinations.some(c => c.includes('Sex')))
    .map(([, rules]) => rules.state);
  assert.deepEqual(sorted(withSex), ['FL', 'GA', 'ME', 'MI', 'OH', 'WI', 'WY']);
});

test('the table is plain data: a single object export, nothing callable, nothing frozen', () => {
  const surface = require('../dist/eligibility');
  const names = Object.keys(surface).filter(name => name !== '__esModule');
  assert.deepEqual(names, ['MEDICAID_SEARCH_RULES']);
  assert.equal(Object.getPrototypeOf(MEDICAID_SEARCH_RULES), Object.prototype);
  assert.equal(Object.isFrozen(MEDICAID_SEARCH_RULES), false);
  assert.ok(Array.isArray(MEDICAID_SEARCH_RULES.AA201030.combinations[0]));
});
