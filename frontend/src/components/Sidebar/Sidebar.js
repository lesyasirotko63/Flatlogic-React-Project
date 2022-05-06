import React, { useState, useEffect } from 'react';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { useTheme } from '@material-ui/styles';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';

import {
  Home as HomeIcon,
  Apps as CoreIcon,
  Description as DocumentationIcon,
  AccountCircle as ProfileIcon,
} from '@material-ui/icons';

// styles
import useStyles from './styles';
import useStyles2 from './components/SidebarLink/styles';

// components
import SidebarLink from './components/SidebarLink/SidebarLink';

// context
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from '../../context/LayoutContext';

function Sidebar({ location, structure }) {
  let classes = useStyles();
  let classes2 = useStyles2();
  let theme = useTheme();

  const toggleDrawer = (value) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    if (value && !isPermanent) toggleSidebar(layoutDispatch);
  };

  // global
  let { isSidebarOpened } = useLayoutState();
  let layoutDispatch = useLayoutDispatch();

  // local
  let [isPermanent, setPermanent] = useState(true);

  useEffect(function () {
    window.addEventListener('resize', handleWindowWidthChange);
    handleWindowWidthChange();
    return function cleanup() {
      window.removeEventListener('resize', handleWindowWidthChange);
    };
  });

  return (
    <Drawer
      variant={isPermanent ? 'permanent' : 'temporary'}
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: !isPermanent ? !isSidebarOpened : isSidebarOpened,
        [classes.drawerClose]: !isPermanent
          ? isSidebarOpened
          : !isSidebarOpened,
      })}
      classes={{
        paper: classNames({
          [classes.drawerOpen]: !isPermanent
            ? !isSidebarOpened
            : isSidebarOpened,
          [classes.drawerClose]: !isPermanent
            ? isSidebarOpened
            : !isSidebarOpened,
        }),
      }}
      open={!isPermanent ? !isSidebarOpened : isSidebarOpened}
      onClose={toggleDrawer(true)}
    >
      <div className={classes.toolbar} />
      <div className={classes.mobileBackButton}>
        <IconButton onClick={() => toggleSidebar(layoutDispatch)}>
          <ArrowBackIcon
            classes={{
              root: classNames(classes.headerIcon, classes.headerIconCollapse),
            }}
          />
        </IconButton>
      </div>
      <List
        className={classes.sidebarList}
        classes={{ padding: classes.padding }}
      >
        <SidebarLink
          label='Dashboard'
          link='/admin/dashboard'
          location={location}
          isSidebarOpened={!isPermanent ? !isSidebarOpened : isSidebarOpened}
          icon={<HomeIcon />}
          toggleDrawer={toggleDrawer(true)}
        />

        <SidebarLink
          label='Edit User'
          link='/admin/user/edit'
          location={location}
          isSidebarOpened={!isPermanent ? !isSidebarOpened : isSidebarOpened}
          icon={<ProfileIcon />}
          toggleDrawer={toggleDrawer(true)}
        />

        <SidebarLink
          label='Users'
          link='/admin/users'
          location={location}
          isSidebarOpened={!isPermanent ? !isSidebarOpened : isSidebarOpened}
          icon={<CoreIcon />}
          toggleDrawer={toggleDrawer(true)}
        />

        <SidebarLink
          label='Tags'
          link='/admin/tags'
          location={location}
          isSidebarOpened={!isPermanent ? !isSidebarOpened : isSidebarOpened}
          icon={<CoreIcon />}
          toggleDrawer={toggleDrawer(true)}
        />

        <SidebarLink
          label='Articles'
          link='/admin/articles'
          location={location}
          isSidebarOpened={!isPermanent ? !isSidebarOpened : isSidebarOpened}
          icon={<CoreIcon />}
          toggleDrawer={toggleDrawer(true)}
        />

        <SidebarLink
          label='Categories'
          link='/admin/categories'
          location={location}
          isSidebarOpened={!isPermanent ? !isSidebarOpened : isSidebarOpened}
          icon={<CoreIcon />}
          toggleDrawer={toggleDrawer(true)}
        />

        <SidebarLink
          label='Comments'
          link='/admin/comments'
          location={location}
          isSidebarOpened={!isPermanent ? !isSidebarOpened : isSidebarOpened}
          icon={<CoreIcon />}
          toggleDrawer={toggleDrawer(true)}
        />

        <SidebarLink
          label='Documentation'
          link='/documentation'
          location={location}
          isSidebarOpened={!isPermanent ? !isSidebarOpened : isSidebarOpened}
          icon={<DocumentationIcon />}
          toggleDrawer={toggleDrawer(true)}
          children={[
            {
              label: 'Getting Started',
              link: '/documentation/getting-started',
              children: [
                {
                  label: 'Overview',
                  link: '/documentation/getting-started/overview',
                },
                {
                  label: 'Licences',
                  link: '/documentation/getting-started/licences',
                },
                {
                  label: 'Quick start',
                  link: '/documentation/getting-started/quick-start',
                },
              ],
            },
            {
              label: 'Pages',
              link: '/documentation/pages',
            },
            {
              label: 'Components',
              link: '/documentation/components',
              children: [
                {
                  label: 'Typography',
                  link: '/documentation/components/typography',
                },
                {
                  label: 'Widget',
                  link: '/documentation/components/widget',
                },
                {
                  label: 'Header',
                  link: '/documentation/components/header',
                },
                {
                  label: 'Sidebar',
                  link: '/documentation/components/sidebar',
                },
                {
                  label: 'Buttons',
                  link: '/documentation/components/buttons',
                },
              ],
            },
            {
              label: 'Libs',
              link: '/documentation/libs',
            },
          ]}
        />

        <ListItem
          button
          className={classes2.link}
          component={'a'}
          href={
            process.env.NODE_ENV === 'production'
              ? window.location.origin + '/api-docs'
              : 'http://localhost:8080/api-docs'
          }
          target={'_blank'}
        >
          <ListItemIcon className={classNames(classes2.linkIcon)}>
            <DocumentationIcon />
          </ListItemIcon>
          <ListItemText
            classes={{
              primary: classNames(classes2.linkText),
            }}
            primary={'API docs'}
          />
        </ListItem>
      </List>
    </Drawer>
  );

  // ##################################################################
  function handleWindowWidthChange() {
    let windowWidth = window.innerWidth;
    let breakpointWidth = theme.breakpoints.values.md;
    let isSmallScreen = windowWidth < breakpointWidth;

    if (isSmallScreen && isPermanent) {
      setPermanent(false);
    } else if (!isSmallScreen && !isPermanent) {
      setPermanent(true);
    }
  }
}

export default withRouter(Sidebar);
