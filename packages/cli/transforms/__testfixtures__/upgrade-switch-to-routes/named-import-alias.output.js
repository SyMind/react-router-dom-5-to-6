import { Routes, Route } from 'react-router-dom';

export function Foo() {
  return (
    <Routes>
      <Route path="/project/:id" component={Project} />
    </Routes>
  );
}
