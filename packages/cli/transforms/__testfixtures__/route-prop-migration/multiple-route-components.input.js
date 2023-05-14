import { Switch, Route } from 'react-router-dom';
import { Users } from './users';
import { Me } from './me'

export function Foo() {
  return (
    <Switch>
      <Route
        exact
        path="users"
        render={props => (
          <Users {...props} />
        )} />

      <Route exact path="me">
        <Me />
      </Route>
    </Switch>
  );
}
