'use strict';

jest.autoMockOff();
const defineTest = require('jscodeshift/dist/testUtils').defineTest;

const tests = [
  'only-import-with-router',
  'import-with-router-and-others',
];

tests.forEach(test => {
  defineTest(
    __dirname,
    'compat',
    {
      quote: 'single'
    },
    `compat/${test}`
  );
});
