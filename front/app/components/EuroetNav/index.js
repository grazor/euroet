import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/SwipeableDrawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Avatar from '@material-ui/core/Avatar';

import InboxIcon from '@material-ui/icons/MoveToInbox';
import HomeIcon from '@material-ui/icons/Home';
import MailIcon from '@material-ui/icons/Mail';
import GearIcon from '@material-ui/icons/Settings';
import AdminIcon from '@material-ui/icons/VerifiedUser';
import UsersIcon from '@material-ui/icons/People';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

import { logout } from 'containers/LoginPage/actions';

import {
  makeSelectUser,
  makeSelectIsAuthenticated,
  makeSelectLocation,
} from 'containers/App/selectors';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  grow: {
    flexGrow: 1,
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
});

class PersistentDrawerLeft extends React.Component {
  state = {
    open: false,
  };

  handleDrawerState = isOpened => () => {
    this.setState({ open: isOpened });
  };

  logoutUser = () => {
    this.props.dispatch(logout());
  };

  render() {
    const { classes, theme, isAuthenticated, user } = this.props;
    const { open } = this.state;

    return (
      <ClickAwayListener onClickAway={this.handleDrawerState(false)}>
        <div className={classes.root}>
          <CssBaseline />
          <AppBar
            position="fixed"
            className={classNames(classes.appBar, {
              [classes.appBarShift]: open,
            })}
          >
            <Toolbar disableGutters={!open}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerState(true)}
                className={classNames(classes.menuButton, open && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                color="inherit"
                className={classes.grow}
                noWrap
              >
                <FormattedMessage {...messages.appname} />
              </Typography>
              {isAuthenticated ? (
                <Button color="inherit" onClick={this.logoutUser}>
                  <FormattedMessage {...messages.logoutbutton} />
                </Button>
              ) : (
                <Button color="inherit" component={Link} to="/login">
                  <FormattedMessage {...messages.loginbutton} />
                </Button>
              )}
              {user ? (
                <Avatar style={{ backgroundColor: user.color }}>
                  {user.initials}
                </Avatar>
              ) : null}
            </Toolbar>
          </AppBar>
          <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            onOpen={this.handleDrawerState(true)}
            onClose={this.handleDrawerState(false)}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.drawerHeader}>
              <IconButton onClick={this.handleDrawerState(false)}>
                {theme.direction === 'ltr' ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </IconButton>
            </div>
            <Divider />
            <List>
              <ListItem button key="Home" component={Link} to="/">
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
              {isAuthenticated ? (
                <ListItem button key="Projects" component={Link} to="/projects">
                  <ListItemIcon>
                    <GearIcon />
                  </ListItemIcon>
                  <ListItemText primary="Projects" />
                </ListItem>
              ) : (
                <div />
              )}
              {isAuthenticated ? (
                ['Products', 'Components', 'Collections'].map((text, index) => (
                  <ListItem button disabled key={text}>
                    <ListItemIcon>
                      {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItem>
                ))
              ) : (
                <div />
              )}
            </List>
            {isAuthenticated ? <Divider /> : <div />}
            {isAuthenticated ? (
              <List>
                <ListItem button disabled key="users">
                  <ListItemIcon>
                    <UsersIcon />
                  </ListItemIcon>
                  <ListItemText primary="Users" />
                </ListItem>
                <ListItem
                  button
                  key="admin"
                  component={Link}
                  to="/admin"
                  target="_self"
                >
                  <ListItemIcon>
                    <AdminIcon />
                  </ListItemIcon>
                  <ListItemText primary="Admin" />
                </ListItem>
              </List>
            ) : (
              <div />
            )}
          </Drawer>
          <main
            className={classNames(classes.content, {
              [classes.contentShift]: open,
            })}
          >
            <div className={classes.drawerHeader} />
            {this.props.children}
          </main>
        </div>
      </ClickAwayListener>
    );
  }
}

PersistentDrawerLeft.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const withStyle = withStyles(styles, { withTheme: true });

export default compose(withStyle)(PersistentDrawerLeft);
