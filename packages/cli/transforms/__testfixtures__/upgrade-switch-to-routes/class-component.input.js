import { Switch, Route } from 'react-router-dom';

export class Foo {
  render() {
    return (
      <Switch>
        <Route path="/project/:id" component={Project} />
      </Switch>
    );
  }
}
