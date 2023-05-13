import { NavLink } from 'react-router-dom';
import { NavLink as CompatNavLink } from 'react-router-dom-5-to-6-compat';

export function Foo() {
  return (
    <>
      <CompatNavLink activeClassName="active" />
      <NavLink end />
    </>
  );
}
