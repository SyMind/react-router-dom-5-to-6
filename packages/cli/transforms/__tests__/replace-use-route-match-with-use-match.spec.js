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
    'replace-use-route-match-with-use-match',
    {
      quote: 'single'
    },
    `replace-use-route-match-with-use-match/${test}`
  );
});
