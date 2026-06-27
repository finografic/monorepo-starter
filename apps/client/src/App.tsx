import { RouterProvider } from 'react-router-dom';
import type React from 'react';

import { StyleSmokeTest } from './components/StyleSmokeTest';
import { router } from './router';

export function App(): React.JSX.Element {
  return (
    <>
      <StyleSmokeTest />
      <RouterProvider router={router} />
    </>
  );
}
