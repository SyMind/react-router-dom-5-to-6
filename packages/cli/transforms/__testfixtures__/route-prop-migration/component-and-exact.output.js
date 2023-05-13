import { Route } from 'react-router-dom';
import { App } from './app';

export function Foo() {
  return <Route path="users" element={<App />} />;
}
