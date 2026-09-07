'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { resolveSearchMethod } = require('../dist/eligibility');
const {
  ALL_SEARCH_FIELDS,
  setKey,
  supply,
  supplyBlank,
  isSubsetOf,
  everyCombination,
} = require('./helpers');

/**
 * The acceptance suite: every Approved Admissions provider group crossed with every one of
 * its combinations. The cases are generated from the table, so the suite grows by itself
 * when AA's export changes and nothing here hardcodes a provider or a total.
 */

const findUnlistedSuperset = (combination, combinations) => {
  const listed = new Set(combinations.map(setKey));
  for (const extra of ALL_SEARCH_FIELDS) {
    if (combination.includes(extra)) continue;
    const candidate = [...combination, extra];
    if (!listed.has(setKey(candidate))) return candidate;
  }
  return null;
};

for (const { providerKey, combination, index, combinations } of everyCombination()) {
  const label = `${providerKey} combination #${index} [${combination.join('+')}]`;

  test(`${label}: exactly its fields resolve to it or to an earlier subset`, () => {
    const result = resolveSearchMethod(providerKey, supply(combination));

    assert.equal(result.status, 'resolved');
    assert.notEqual(result.satisfied, null, 'a combination whose fields are all supplied must resolve');
    // AA lists combinations that are supersets of an earlier one in the same row, so the
    // resolved method can be an earlier, smaller combination. What must always hold is that
    // it is satisfiable from what was supplied and that it does not come later in AA's order.
    assert.ok(
      isSubsetOf(result.satisfied, combination),
      `resolved ${result.satisfied.join('+')} is not satisfiable from ${combination.join('+')}`
    );
    assert.ok(
      combinations.findIndex(candidate => candidate === result.satisfied) <= index,
      'resolved combination must not come after the one under test in AA order'
    );
  });

  test(`${label}: dropping any one field leaves it unsatisfiable`, () => {
    for (const dropped of combination) {
      const remaining = combination.filter(field => field !== dropped);
      const result = resolveSearchMethod(providerKey, supply(remaining), combination);

      assert.equal(result.status, 'resolved');
      assert.deepEqual(result.missing, [dropped], `expected only ${dropped} to be missing`);
      if (result.satisfied !== null) {
        assert.notEqual(
          setKey(result.satisfied),
          setKey(combination),
          `${combination.join('+')} must not resolve without ${dropped}`
        );
      }
    }
  });

  test(`${label}: whitespace-only values count as missing`, () => {
    const result = resolveSearchMethod(providerKey, supplyBlank(combination), combination);

    assert.equal(result.status, 'resolved');
    assert.equal(result.satisfied, null, 'whitespace must not satisfy anything');
    assert.deepEqual([...result.missing], [...combination]);
  });

  test(`${label}: a set-equal chosen method is valid whatever the order`, () => {
    const reversed = [...combination].reverse();
    const result = resolveSearchMethod(providerKey, supply(combination), reversed);

    assert.equal(result.status, 'resolved');
    assert.equal(result.chosenValid, true);
    assert.deepEqual([...result.missing], []);
  });

  test(`${label}: a chosen method the provider does not list is invalid`, () => {
    const unlisted = findUnlistedSuperset(combination, combinations);
    assert.notEqual(unlisted, null, `every superset of ${combination.join('+')} is itself listed`);

    const result = resolveSearchMethod(providerKey, supply(combination), unlisted);

    assert.equal(result.status, 'resolved');
    assert.equal(result.chosenValid, false);
  });
}
