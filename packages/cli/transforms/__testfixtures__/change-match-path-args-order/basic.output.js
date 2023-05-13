import { matchPath } from 'react-router-dom';

const match = matchPath({
  path: '/users/:id',
  caseSensitive: false, // Optional, defaults to false
  end: true, // Optional, defaults to false
}, '/users/123');
