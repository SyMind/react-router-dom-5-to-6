'use strict';

jest.autoMockOff();
const defineTest = require('jscodeshift/dist/testUtils').defineTest;

const tests = [
  'exact-and-string-path',
  'no-exact-and-string-path',
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
