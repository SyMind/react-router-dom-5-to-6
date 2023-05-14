'use strict';

jest.autoMockOff();
const defineTest = require('jscodeshift/dist/testUtils').defineTest;

const tests = [
  'basic',
];

tests.forEach(test => {
  defineTest(
    __dirname,
    'repalce-react-router-with-react-router-dom',
    {
      quote: 'single'
    },
    `repalce-react-router-with-react-router-dom/${test}`
  );
});
