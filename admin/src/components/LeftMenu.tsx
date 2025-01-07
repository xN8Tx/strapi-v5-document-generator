import { NavLink } from 'react-router-dom';
import {
  SubNavHeader,
  SubNavLink,
  SubNavSection,
  SubNavSections,
  SubNav,
} from '@strapi/design-system';
import { BulletList, Clock } from '@strapi/icons';
import { styled } from 'styled-components';
import { useIntl } from 'react-intl';
import { getTranslation } from '../utils/getTranslation';

const routes = [
  {
    to: {
      pathname: 'scenarios',
      search: '',
    },
    icon: <BulletList />,
    label: {
      id: getTranslation('scenarios.title'),
      defaultMessage: 'Scenarios',
    },
  },
  {
    to: {
      pathname: 'history',
      search: '',
    },
    icon: <Clock />,
    label: {
      id: getTranslation('history.title'),
      defaultMessage: 'History',
    },
  },
];

const SubNavLinkCustom = styled(SubNavLink)`
  div {
    display: flex;
    align-items: center;
    gap: 3px;
  }
`;

export const LeftMenu = () => {
  const { formatMessage } = useIntl();

  return (
    <SubNav>
      <SubNavHeader
        label={formatMessage({
          id: getTranslation('plugin.name'),
          defaultMessage: 'Document Generator',
        })}
      />
      <SubNavSections>
        <SubNavSection
          label={formatMessage({
            id: getTranslation('base.main'),
            defaultMessage: 'Main',
          })}
        >
          {routes.map((route) => (
            <SubNavLinkCustom
              key={route.label.id}
              tag={NavLink}
              icon={route.icon}
              to={route.to}
              width="100%"
            >
              {formatMessage(route.label)}
            </SubNavLinkCustom>
          ))}
        </SubNavSection>
      </SubNavSections>
    </SubNav>
  );
};
