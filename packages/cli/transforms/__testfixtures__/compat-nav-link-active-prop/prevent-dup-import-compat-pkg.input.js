import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom-5-to-6-compat';

class Foo {
  render() {
    <NavLink activeClassName="active" />;
  }
}

export default withRouter(Foo);
