import { matchPath as routerMatchPath } from 'react-router-dom';

const match = routerMatchPath({
  path: '/users/:id',
  caseSensitive: false, // Optional, defaults to false
  end: true, // Optional, defaults to false
}, '/users/123');
