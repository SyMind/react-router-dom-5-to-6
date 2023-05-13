'use strict';

jest.autoMockOff();
const defineTest = require('jscodeshift/dist/testUtils').defineTest;

const tests = [
  'all-nav-link-used-active-prop',
  'prevent-dup-import-compat-pkg',
];

tests.forEach(test => {
  defineTest(
    __dirname,
    'compat-nav-link-active-prop',
    {
      quote: 'single'
    },
    `compat-nav-link-active-prop/${test}`
  );
});
