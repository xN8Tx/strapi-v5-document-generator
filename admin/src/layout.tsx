import { Main } from '@strapi/design-system';
import { Layouts } from '@strapi/strapi/admin';
import { Outlet } from 'react-router-dom';

import { LeftMenu } from './components/LeftMenu';

export const Layout = () => {
  return (
    <Layouts.Root sideNav={<LeftMenu />}>
      <Layouts.Content>
        <Main>
          <Outlet />
        </Main>
      </Layouts.Content>
    </Layouts.Root>
  );
};
