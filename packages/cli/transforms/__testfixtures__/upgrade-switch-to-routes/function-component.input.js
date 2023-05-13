import { Switch, Route } from 'react-router-dom';

export function Foo() {
  return (
    <Switch>
      <Route path="/project/:id" component={Project} />
    </Switch>
  );
}
