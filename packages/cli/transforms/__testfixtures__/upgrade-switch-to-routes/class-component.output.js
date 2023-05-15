import { Route } from 'react-router-dom';

import { Routes } from 'react-router-dom-5-to-6-compat';

export class Foo {
  render() {
    return (
      <Routes>
        <Route path="/project/:id" component={Project} />
      </Routes>
    );
  }
}
