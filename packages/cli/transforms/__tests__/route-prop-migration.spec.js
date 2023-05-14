'use strict';

jest.autoMockOff();
const defineTest = require('jscodeshift/dist/testUtils').defineTest;

const tests = [
  'children-and-exact',
  'children-prop-and-exact',
  'component-and-exact',
  'exact-and-string-path',
  'exact-and-template-path',
  'no-exact-and-string-path',
  'no-exact-and-template-path',
  'nothing'
];

tests.forEach(test => {
  defineTest(
    __dirname,
    'route-prop-migration',
    {
      quote: 'single'
    },
    `route-prop-migration/${test}`
  );
});
