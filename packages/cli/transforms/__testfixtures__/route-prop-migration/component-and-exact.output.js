import { Route } from 'react-router-dom';
import { RouteComponent } from 'react-router-dom-5-to-6-compat';
import { App } from './app';

export function Foo() {
  return <Route path="users" element={<RouteComponent component={App} />} />;
}
