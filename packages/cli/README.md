# React Router DOM 5 to 6

尽最大努力将项目直接升级到 React Router DOM 6 的脚本，基于 [jscodeshift](https://github.com/facebook/jscodeshift) 构建。(受 [Ant Design 5 Codemod](https://github.com/ant-design/codemod-v5) 启发) ⚒️

## 使用

在运行 codemod 脚本前，请先提交你的本地代码修改。

```bash
npx react-router-dom-5-to-6 src
```

## 和 [react-router-v6-codemods](https://github.com/rajasegar/react-router-v6-codemods) 的区别

react-router-v6-codemods 脚本采用渐进式升级路线，在升级过程中依赖 react-router-dom-v5-compat，会长期处在 v5 版本。

本脚本则是选择直接升级到 v6 版本，以此能够更加迅速的尝试 v6 版本的新特性，分析其对目标项目性能的影响，如 LCP 指标。

## Codemod 脚本包括

#### `change-match-path-args-order`

更新 `matchPath` 方法的参数顺序。

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

#### `compat-function`

兼容 v5 中的 `withRouter`、`useHistory` 方法。

```diff
-import { withRouter, useHistory } from 'react-router-dom';
+import { withRouter, useHistory } from 'react-router-dom-5-to-6-compat';
```

#### `compat-nav-link-active-prop`

兼容 v5 中的 `<NavLink>` 组件的 `activeClassName`、`activeStyle` 属性。

```diff
-import { NavLink } from 'react-router-dom';
+import { NavLink } from 'react-router-dom-5-to-6-compat';

export function Foo() {
  return <NavLink activeClassName="active" />;
}
```

#### `rename-nav-link-prop`

更新 `<NavLink>` 组件的属性名。

```diff
import { NavLink } from 'react-router-dom';

export function App() {
- return <NavLink exact />;
+ return <NavLink end />;
}
```

#### `replace-redirect-to-navigate`

更新 `<Redirect>` 组件为 `<Navigate>`。

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

更新 `useRouteMatch` 方法为 `useMatch`。

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

更新 `<Route>` 组件的属性。

```diff
import { Route } from 'react-router-dom';
import { App } from './app';

export function Foo() {
- return <Route exact path="users" component={App} />;
+ return <Route path="users" component={<App />} />;
}
```

#### `upgrade-switch-to-routes`

更新所有的 `<Switch>` 组件为 `<Routes>` 组件。

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
