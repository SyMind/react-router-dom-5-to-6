import { Switch, Route } from 'react-router-dom';
import { RouteRender } from 'react-router-dom-5-to-6-compat';
import { Users } from './users';
import { Me } from './me'

export function Foo() {
  return (
    <Switch>
      <Route
        path="users"
        element={<RouteRender
          render={props => (
            <Users {...props} />
          )} />} />

      <Route path="me" element={<Me />} />
    </Switch>
  );
}
