import { Switch as RouterSwitch, Route } from 'react-router-dom';

export function Foo() {
  return (
    <RouterSwitch>
      <Route path="/project/:id" component={Project} />
    </RouterSwitch>
  );
}
