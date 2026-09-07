'use strict';

const { MEDICAID_SEARCH_RULES } = require('../dist/eligibility');

const ALL_SEARCH_FIELDS = [
  'MedicaidNumber',
  'FirstName',
  'LastName',
  'BirthDate',
  'Ssn',
  'Sex',
  'MedicareNumber',
];

/**
 * Set identity computed independently of the module under test — plain lexicographic sort,
 * not the module's canonical field order — so a bug in the module's own canonicalisation
 * cannot make these tests agree with it.
 */
const setKey = combination => [...new Set(combination)].sort().join('|');

/** Synthetic values. Only presence is under test, so nothing here resembles patient data. */
const supply = fields =>
  fields.reduce((values, field) => ({ ...values, [field]: `${field}-value` }), {});

const supplyBlank = fields =>
  fields.reduce((values, field) => ({ ...values, [field]: '   ' }), {});

const isSubsetOf = (combination, supplied) => combination.every(field => supplied.includes(field));

const providerEntries = () => Object.entries(MEDICAID_SEARCH_RULES);

const everyCombination = () =>
  providerEntries().flatMap(([providerKey, combinations]) =>
    combinations.map((combination, index) => ({ providerKey, combination, index, combinations }))
  );

module.exports = {
  ALL_SEARCH_FIELDS,
  setKey,
  supply,
  supplyBlank,
  isSubsetOf,
  providerEntries,
  everyCombination,
};
