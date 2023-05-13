import { matchPath } from 'react-router-dom';

const match = matchPath('/users/123', {
  path: '/users/:id',
  exact: true, // Optional, defaults to false
  strict: false, // Optional, defaults to false
});
