import { Redirect } from 'react-router-dom';

export function Foo() {
  return (
    <div>
      <Redirect to="about" />
      <Redirect to="home" push />
    </div>
  );
}
