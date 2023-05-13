import { matchPath as routerMatchPath } from 'react-router-dom';

const match = routerMatchPath('/users/123', {
  path: '/users/:id',
  exact: true, // Optional, defaults to false
  strict: false, // Optional, defaults to false
});
