# React Router DOM 5 to 6

A collection of codemod scripts that help direct upgrade React Router DOM 6 using [jscodeshift](https://github.com/facebook/jscodeshift). Inspired by [Ant Design v5 Codemod](https://github.com/ant-design/codemod-v5).

## Usage

Before run codemod scripts, you'd better make sure to commit your local git changes firstly.

```bash
npx react-router-dom-5-to-6 src
```

## Compared with [react-router-v6-codemods](https://github.com/rajasegar/react-router-v6-codemods)

react-router-v6-codemods script adopts a progressive upgrade scheme using react-router-dom-v5-compat, and will be in the v5 version for a long time.

This script adopts a direct upgrade scheme, in order to quickly try out the new features of the v6 version and analyze their impact on the performance of the target project, such as LCP indicators.

## Codemod scripts introduction

#### `change-match-path-args-order`

Upgrade parameters order of the `matchPath` method.

```diff
import { matchPath } from 'react-router-dom';

const match = matchPath(
- '/users/123',
  {
    path: '/users/:id',
    exact: true, // Optional, defaults to false
    strict: false, // Optional, defaults to false
  },
+ '/users/123',
);
```

#### `compat-function-and-type`

Compatible with the `withRouter` and `useHistory` methods in v5.

```diff
-import { withRouter, useHistory } from 'react-router-dom';
+import { withRouter, useHistory } from 'react-router-dom-5-to-6-compat';
```

#### `compat-nav-link-active-prop`

Compatible with the `activeClassName` and `activeStyle` properties of `<NavLink>` component.

```diff
-import { NavLink } from 'react-router-dom';
+import { NavLink } from 'react-router-dom-5-to-6-compat';

export function Foo() {
  return <NavLink activeClassName="active" />;
}
```

#### `rename-nav-link-prop`

Upgrade the property name of the `<NavLink>` component.

```diff
import { NavLink } from 'react-router-dom';

export function App() {
- return <NavLink exact />;
+ return <NavLink end />;
}
```

#### `repalce-react-router-with-react-router-dom`

Replace `react-router` with `react-router-dom`.

```diff

```diff
-import { useHistory } from 'react-router';
+import { useHistory } from 'react-router-dom';
```

#### `replace-redirect-to-navigate`

Replace `<Redirect>` component with `<Navigate>` component.

```diff
-import { Redirect } from 'react-router-dom';
+import { Navigate } from 'react-router-dom';

export function App() {
  return (
    <div>
-     <Redirect to="about" />
+     <Navigate to="about" replace />
-     <Redirect to="home" push />
+     <Navigate to="home" />
    </div>
  );
}
```

#### `replace-use-route-match-with-use-match`

Replace `useRouteMatch` method with `useMatch`.

```diff
import { useRouteMatch } from 'react-router-dom';

export function App() {
- useRouteMatch({ strict: true });
+ useMatch({ end: true });
- useRouteMatch({ sensitive: true });
+ useMatch({ caseSensitive: true });

  return null;
}
```

#### `route-prop-migration`

Migrate the properties of `<Route>` component.

```diff
import { Route } from 'react-router-dom';
import { App } from './app';

export function Foo() {
- return <Route exact path="users" component={App} />;
+ return <Route path="users" component={<App />} />;
}
```

#### `upgrade-switch-to-routes`

Upgrade `<Switch>` component to `<Routes>` component.

```diff
- import { Switch, Route } from 'react-router-dom';
+ import { Routes, Route } from 'react-router-dom';

export function App() {
  return (
-   <Switch>
+   <Routes>
      <Route path="/project/:id" component={Project} />
-   </Switch>
+   </Routes>
  );
}
```

## License

MIT
