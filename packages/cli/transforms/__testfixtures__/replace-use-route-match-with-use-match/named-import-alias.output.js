import { useMatch } from 'react-router-dom';

export function App() {
  useMatch({ end: true });
  useMatch({ caseSensitive: true });

  return null;
}
