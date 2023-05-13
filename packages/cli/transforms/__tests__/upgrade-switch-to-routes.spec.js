'use strict';

jest.autoMockOff();
const defineTest = require('jscodeshift/dist/testUtils').defineTest;

const tests = [
  'class-component',
  'function-component',
  'named-import-alias'
];

tests.forEach(test => {
  defineTest(
    __dirname,
    'upgrade-switch-to-routes',
    {
      quote: 'single'
    },
    `upgrade-switch-to-routes/${test}`
  );
});
