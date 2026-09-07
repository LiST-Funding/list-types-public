'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  MEDICAID_PROVIDER_KEY_BY_STATE,
  MEDICAID_SEARCH_RULES,
  isMatrixEnabled,
  resolveSearchMethod,
} = require('../dist/eligibility');
const { setKey, supply } = require('./helpers');

const FLORIDA = MEDICAID_PROVIDER_KEY_BY_STATE.FL;
const CALIFORNIA = MEDICAID_PROVIDER_KEY_BY_STATE.CA;
const DELAWARE = MEDICAID_PROVIDER_KEY_BY_STATE.DE;
const ARKANSAS = MEDICAID_PROVIDER_KEY_BY_STATE.AR;

test('an unknown provider key is reported, not thrown', () => {
  for (const unknown of ['AA201022', 'AA201023', 'AA201032', 'not-a-key', '']) {
    const result = resolveSearchMethod(unknown, supply(['MedicaidNumber']));
    assert.deepEqual(result, { status: 'unknownProvider', providerKey: unknown });
  }
});

test('Texas LTC resolves by provider key even though it is not offered as a state', () => {
  const result = resolveSearchMethod('AA201065', supply(['MedicaidNumber']));

  assert.equal(result.status, 'resolved');
  assert.deepEqual([...result.satisfied], ['MedicaidNumber']);
  assert.equal(isMatrixEnabled('AA201065'), false, 'it has no state code, so it takes the legacy path');
});

test('Alaska, Arizona and Hawaii are absent from the table entirely', () => {
  for (const absent of ['AA201022', 'AA201023', 'AA201032']) {
    assert.equal(
      Object.prototype.hasOwnProperty.call(MEDICAID_SEARCH_RULES, absent),
      false,
      `${absent} must not be in the rules table`
    );
  }
});

test('an empty fields object satisfies nothing and offers the shortest combinations', () => {
  const result = resolveSearchMethod(FLORIDA, {});

  assert.equal(result.status, 'resolved');
  assert.equal(result.satisfied, null);
  assert.equal(result.chosenValid, false);
  assert.deepEqual([...result.missing], []);

  const shortest = Math.min(...MEDICAID_SEARCH_RULES[FLORIDA].map(c => c.length));
  assert.ok(result.alternatives.length > 0);
  for (const alternative of result.alternatives) {
    assert.equal(alternative.length, shortest);
  }
});

test('Florida: SSN and date of birth identify a patient with no Medicaid ID', () => {
  const result = resolveSearchMethod(FLORIDA, supply(['Ssn', 'BirthDate']));

  assert.equal(result.status, 'resolved');
  assert.deepEqual([...result.satisfied], ['Ssn', 'BirthDate']);
});

test('California accepts one method only, so an ID alone is not enough', () => {
  const result = resolveSearchMethod(CALIFORNIA, supply(['MedicaidNumber']));

  assert.equal(result.status, 'resolved');
  assert.equal(result.satisfied, null);
  assert.deepEqual(
    result.alternatives.map(alternative => [...alternative]),
    [['MedicaidNumber', 'BirthDate']]
  );
});

test('Delaware: an ID alone resolves to the bare-ID method listed after four longer ones', () => {
  const result = resolveSearchMethod(DELAWARE, supply(['MedicaidNumber']));

  assert.equal(result.status, 'resolved');
  assert.deepEqual([...result.satisfied], ['MedicaidNumber']);
});

test('Arkansas: a shadowed combination resolves to the earlier, smaller one', () => {
  const result = resolveSearchMethod(
    ARKANSAS,
    supply(['MedicaidNumber', 'BirthDate', 'LastName', 'FirstName'])
  );

  assert.equal(result.status, 'resolved');
  assert.deepEqual([...result.satisfied], ['MedicaidNumber', 'BirthDate']);
});

test('alternatives are the fewest-missing combinations, in AA order, excluding chosen', () => {
  const chosen = ['MedicaidNumber'];
  const result = resolveSearchMethod(FLORIDA, supply(['Ssn']), chosen);

  const combinations = MEDICAID_SEARCH_RULES[FLORIDA];
  const missingCount = combination => combination.filter(field => field !== 'Ssn').length;
  const fewest = Math.min(...combinations.map(missingCount));
  const expected = combinations.filter(
    combination => missingCount(combination) === fewest && setKey(combination) !== setKey(chosen)
  );

  assert.deepEqual(
    result.alternatives.map(alternative => [...alternative]),
    expected.map(alternative => [...alternative])
  );
  assert.ok(
    result.alternatives.every(alternative => setKey(alternative) !== setKey(chosen)),
    'the chosen method must not be offered back as an alternative'
  );
});

test('missing is populated even when the chosen method is not one the provider accepts', () => {
  const result = resolveSearchMethod(CALIFORNIA, supply(['Ssn']), ['Ssn', 'BirthDate']);

  assert.equal(result.status, 'resolved');
  assert.equal(result.chosenValid, false);
  assert.deepEqual([...result.missing], ['BirthDate']);
});

test('a chosen method with a repeated field is still set-equal to the listed one', () => {
  const result = resolveSearchMethod(FLORIDA, supply(['Ssn', 'BirthDate']), [
    'Ssn',
    'Ssn',
    'BirthDate',
  ]);

  assert.equal(result.chosenValid, true);
  assert.deepEqual([...result.missing], []);
});

test('an empty chosen array is not a valid method', () => {
  const result = resolveSearchMethod(FLORIDA, supply(['MedicaidNumber']), []);

  assert.equal(result.status, 'resolved');
  assert.equal(result.chosenValid, false);
  assert.deepEqual([...result.missing], []);
  assert.deepEqual([...result.satisfied], ['MedicaidNumber']);
});

test('fields the provider never uses are ignored rather than penalised', () => {
  const withExtras = supply(['MedicaidNumber', 'FirstName', 'LastName', 'BirthDate', 'Sex']);
  const result = resolveSearchMethod(FLORIDA, withExtras);

  assert.equal(result.status, 'resolved');
  assert.deepEqual([...result.satisfied], ['MedicaidNumber']);
});

test('null and undefined values count as missing', () => {
  const result = resolveSearchMethod(FLORIDA, {
    MedicaidNumber: undefined,
    Ssn: 'Ssn-value',
    BirthDate: 'BirthDate-value',
  });

  assert.equal(result.status, 'resolved');
  assert.deepEqual([...result.satisfied], ['Ssn', 'BirthDate']);
});

test('the rules table cannot be mutated by a consumer', () => {
  assert.throws(() => {
    MEDICAID_SEARCH_RULES[FLORIDA][0].push('Ssn');
  }, TypeError);
  assert.throws(() => {
    MEDICAID_SEARCH_RULES.AA209999 = [['Ssn']];
  }, TypeError);
});
