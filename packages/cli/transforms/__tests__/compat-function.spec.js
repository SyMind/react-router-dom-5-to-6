'use strict';

jest.autoMockOff();
const defineTest = require('jscodeshift/dist/testUtils').defineTest;

const tests = [
  'only-import-with-router',
  'import-with-router-and-others',
  'prevent-dup-import-compat-pkg',
  'nothing'
];

tests.forEach(test => {
  defineTest(
    __dirname,
    'compat-function',
    {
      quote: 'single'
    },
    `compat-function/${test}`
  );
});
