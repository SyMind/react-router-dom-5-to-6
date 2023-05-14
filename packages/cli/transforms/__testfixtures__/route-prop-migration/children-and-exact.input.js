import { Route } from 'react-router-dom';
import { App } from './app';

export function Foo() {
  return (
    <Route exact path="users">
      <App />
    </Route>
  );
}
