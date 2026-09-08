'use strict';

const { MEDICAID_SEARCH_RULES } = require('../dist/eligibility');

const ALL_SEARCH_FIELDS = ['MedicaidNumber', 'FirstName', 'LastName', 'BirthDate', 'Ssn', 'Sex', 'MedicareNumber'];

/** Set identity computed independently of any consumer's canonical order. */
const setKey = combination => [...new Set(combination)].sort().join('|');

const providerEntries = () => Object.entries(MEDICAID_SEARCH_RULES);

module.exports = { ALL_SEARCH_FIELDS, setKey, providerEntries };
