import { Navigate } from 'react-router-dom';

export function Foo() {
  return (
    <div>
      <Navigate to="about" replace />
      <Navigate to="home" />
    </div>
  );
}
