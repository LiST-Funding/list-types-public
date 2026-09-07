'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  MEDICAID_PROVIDER_KEY_BY_STATE,
  MEDICAID_SEARCH_RULES,
  getProviderKeyByState,
  getSearchCombinations,
  getStateByProviderKey,
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

test('a provider key naming an inherited member is unknown, not table data', () => {
  // The provider key is client-supplied: Workflow-Front derives it from a state dropdown and
  // WorkflowServer stores task data verbatim. Reading the table without an own-property check
  // returns Object.prototype members as if they were rules, which crashes the caller.
  for (const inherited of ['constructor', 'toString', 'hasOwnProperty', '__proto__', 'valueOf']) {
    const result = resolveSearchMethod(inherited, supply(['MedicaidNumber']));
    assert.deepEqual(result, { status: 'unknownProvider', providerKey: inherited });

    assert.equal(getSearchCombinations(inherited), undefined);
    assert.equal(getStateByProviderKey(inherited), undefined);
    assert.equal(getProviderKeyByState(inherited), undefined);
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

test('null, undefined and non-string values all count as missing', () => {
  // Mongo returns null for a cleared field and a JSON body can carry a number, so these are
  // the shapes the JavaScript consumers actually hand in, not hypotheticals.
  const result = resolveSearchMethod(FLORIDA, {
    MedicaidNumber: undefined,
    FirstName: null,
    LastName: 12345,
    Sex: false,
    Ssn: 'Ssn-value',
    BirthDate: 'BirthDate-value',
  });

  assert.equal(result.status, 'resolved');
  assert.deepEqual([...result.satisfied], ['Ssn', 'BirthDate']);

  const nameMethod = resolveSearchMethod(
    FLORIDA,
    { FirstName: null, LastName: 12345, BirthDate: 'BirthDate-value', Sex: false },
    ['LastName', 'FirstName', 'BirthDate', 'Sex']
  );
  assert.equal(nameMethod.satisfied, null, 'a number is not a supplied name');
  assert.deepEqual([...nameMethod.missing], ['LastName', 'FirstName', 'Sex']);
});

test('a fields object that is not an object reads as nothing supplied, never a throw', () => {
  // NaviHealth and Workflow-Front are plain JavaScript, and these values arrive from Mongo
  // documents and JSON bodies. The documented contract is a result, not an exception.
  for (const badFields of [null, undefined, 'MedicaidNumber', 42, true]) {
    const result = resolveSearchMethod(FLORIDA, badFields);

    assert.equal(result.status, 'resolved');
    assert.equal(result.satisfied, null);
    assert.equal(result.chosenValid, false);
    assert.deepEqual([...result.missing], []);
    assert.ok(result.alternatives.length > 0);
  }
});

test('a chosen method that is not an array reads as no choice, never a throw', () => {
  for (const badChosen of [null, 5, 'Ssn', {}, true]) {
    const result = resolveSearchMethod(FLORIDA, supply(['MedicaidNumber']), badChosen);

    assert.equal(result.status, 'resolved');
    assert.equal(result.chosenValid, false);
    assert.deepEqual([...result.missing], []);
    assert.deepEqual([...result.satisfied], ['MedicaidNumber']);
  }
});

test('an inherited property on the fields object does not count as supplied', () => {
  // A polluted Object.prototype must not make an empty object look like a filled form.
  Object.prototype.MedicaidNumber = 'polluted';
  try {
    const result = resolveSearchMethod(FLORIDA, {});

    assert.equal(result.satisfied, null, 'an empty object supplies nothing');
  } finally {
    delete Object.prototype.MedicaidNumber;
  }
});

test('missing collapses a repeated field, as set equality already does', () => {
  const result = resolveSearchMethod(FLORIDA, {}, ['Ssn', 'Ssn', 'BirthDate']);

  assert.equal(result.chosenValid, true, 'the repeat is collapsed for equality');
  assert.deepEqual([...result.missing], ['Ssn', 'BirthDate'], 'and for the gap list too');
});

test('a provider key resolves the same however it is spelled', () => {
  // isMatrixEnabled already trimmed and upper-cased; these lookups did not, so a lower-case
  // key was enabled on one path and unknown on the other.
  for (const spelling of ['AA201030', 'aa201030', '  AA201030  ', 'aA201030']) {
    const result = resolveSearchMethod(spelling, supply(['MedicaidNumber']));

    assert.equal(result.status, 'resolved', `${spelling} must resolve`);
    assert.equal(isMatrixEnabled(spelling), true, `${spelling} must be enabled`);
  }

  assert.equal(getProviderKeyByState('fl'), 'AA201030');
  assert.equal(getStateByProviderKey('  aa201030 '), 'FL');
  assert.equal(isMatrixEnabled('fl'), true);
});

test('the resolved branch echoes the normalized key, the unknown branch the raw one', () => {
  // A consumer persists this. Echoing the caller's spelling would record ' aa201030 ' as the
  // provider a set of combinations came from.
  const resolved = resolveSearchMethod('  aa201030  ', supply(['MedicaidNumber']));
  assert.equal(resolved.status, 'resolved');
  assert.equal(resolved.providerKey, 'AA201030');

  // The unknown result exists to show what was sent, so it keeps the raw value.
  const unknown = resolveSearchMethod('  aa999999  ', {});
  assert.deepEqual(unknown, { status: 'unknownProvider', providerKey: '  aa999999  ' });
});

test('the rules table cannot be mutated by a consumer', () => {
  assert.throws(() => {
    MEDICAID_SEARCH_RULES[FLORIDA][0].push('Ssn');
  }, TypeError);
  assert.throws(() => {
    MEDICAID_SEARCH_RULES.AA209999 = [['Ssn']];
  }, TypeError);
});
