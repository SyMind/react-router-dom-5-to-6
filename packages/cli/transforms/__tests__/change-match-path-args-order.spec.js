'use strict';

jest.autoMockOff();
const defineTest = require('jscodeshift/dist/testUtils').defineTest;

const tests = [
  'basic',
  'named-import-alias',
];

tests.forEach(test => {
  defineTest(
    __dirname,
    'change-match-path-args-order',
    {
      quote: 'single'
    },
    `change-match-path-args-order/${test}`
  );
});
