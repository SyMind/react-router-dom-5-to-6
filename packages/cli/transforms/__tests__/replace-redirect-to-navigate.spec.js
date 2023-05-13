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
    'replace-redirect-to-navigate',
    {
      quote: 'single'
    },
    `replace-redirect-to-navigate/${test}`
  );
});
