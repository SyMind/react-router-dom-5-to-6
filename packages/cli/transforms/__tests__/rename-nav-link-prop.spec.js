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
    'rename-nav-link-prop',
    {
      quote: 'single'
    },
    `rename-nav-link-prop/${test}`
  );
});
