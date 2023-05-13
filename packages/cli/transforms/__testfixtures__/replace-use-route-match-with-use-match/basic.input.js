import { useRouteMatch } from 'react-router-dom';

export function App() {
  useRouteMatch({ strict: true });
  useRouteMatch({ sensitive: true });

  return null;
}
