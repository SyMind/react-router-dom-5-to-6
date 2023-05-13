import { Redirect as RouterRedirect } from 'react-router-dom';

export function Foo() {
  return (
    <div>
      <RouterRedirect to="about" />
      <RouterRedirect to="home" push />
    </div>
  );
}
