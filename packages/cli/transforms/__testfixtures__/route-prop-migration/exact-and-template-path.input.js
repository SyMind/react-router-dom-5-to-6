import { Route, useRouteMatch } from 'react-router-dom';

export function Foo() {
  const match = useRouteMatch()

  return <Route exact path={`${match}/me`} />;
}
