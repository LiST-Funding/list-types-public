/**
 * Compile-only contract check. Run with `npm run check:referralsSummaryClinical`.
 * Each @ts-expect-error must stay an error: if a shape loosens, tsc fails on the unused directive.
 * Synthetic vocabulary keys only.
 */
import {
  CLINICAL_OPERATORS_BY_TYPE,
  ClinicalCatalog,
  ClinicalCondition,
  ClinicalFilter,
  ClinicalOperator,
  ClinicalRowMatch,
} from '../index';

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
const assertType = <T extends true>(): T | undefined => undefined;

assertType<Equal<ClinicalOperator, 'includes' | 'excludes' | 'is' | 'isNot' | 'gt' | 'lt' | 'between'>>();
assertType<Equal<keyof typeof CLINICAL_OPERATORS_BY_TYPE, 'list' | 'choice' | 'number'>>();

export const validFilter: ClinicalFilter = {
  match: 'all',
  conditions: [
    { field: 'behaviors', operator: 'includes', values: ['agitation', 'delirium'] },
    { field: 'behaviors', operator: 'excludes', values: ['aggressive'] },
    { field: 'lives_with', operator: 'isNot', values: ['alone'] },
    { field: 'bmi', operator: 'gt', min: 30 },
    { field: 'bmi', operator: 'lt', max: 18.5 },
    { field: 'bmi', operator: 'between', min: 25, max: 30 },
  ],
};

export const invalidConditions: ClinicalCondition[] = [
  // @ts-expect-error gt needs min
  { field: 'bmi', operator: 'gt' },
  // @ts-expect-error gt takes min, not max
  { field: 'bmi', operator: 'gt', min: 30, max: 40 },
  // @ts-expect-error lt needs max
  { field: 'bmi', operator: 'lt' },
  // @ts-expect-error list and choice conditions need values
  { field: 'behaviors', operator: 'includes' },
  // @ts-expect-error between needs both bounds
  { field: 'bmi', operator: 'between', min: 25 },
  // @ts-expect-error a list operator carries values, not bounds
  { field: 'behaviors', operator: 'includes', min: 1 },
  // @ts-expect-error unknown operator
  { field: 'behaviors', operator: 'contains', values: ['agitation'] },
];

// @ts-expect-error match is 'all' | 'any', not the UI label
export const invalidMatch: ClinicalFilter = { match: 'And', conditions: [] };

export const catalog: ClinicalCatalog = {
  fields: [
    {
      id: 'behaviors',
      label: 'Behaviors',
      section: 'findings',
      type: 'list',
      options: [{ value: 'agitation', label: 'Agitation' }],
    },
    { id: 'bmi', label: 'BMI', section: 'patientDetails', type: 'number', min: 0, max: 100, step: 0.1 },
  ],
};

export const rowMatch: ClinicalRowMatch = { field: 'behaviors', value: 'agitation', label: 'Agitation' };
