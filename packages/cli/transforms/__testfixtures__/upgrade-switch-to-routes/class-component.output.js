import { Routes, Route } from 'react-router-dom';

export class Foo {
  render() {
    return (
      <Routes>
        <Route path="/project/:id" component={Project} />
      </Routes>
    );
  }
}
