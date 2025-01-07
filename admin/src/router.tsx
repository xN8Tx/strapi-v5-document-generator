import type { PathRouteProps } from 'react-router-dom';
import { lazy } from 'react';

const HomePage = lazy(() =>
  import('./pages/home/HomePage').then((module) => ({ default: module.HomePage }))
);

export const routes: PathRouteProps[] = [
  {
    path: '',
    Component: HomePage,
  },
];
