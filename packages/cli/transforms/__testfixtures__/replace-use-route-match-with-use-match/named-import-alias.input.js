import { useRouteMatch as routerUseRouteMatch } from 'react-router-dom';

export function App() {
  routerUseRouteMatch({ strict: true });
  routerUseRouteMatch({ sensitive: true });

  return null;
}
