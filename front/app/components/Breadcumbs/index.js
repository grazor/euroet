/**
 *
 * Breadcumbs
 *
 */

import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import GearIcon from '@material-ui/icons/Settings';
import HomeIcon from '@material-ui/icons/Home';
import Link from '@material-ui/core/Link';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  paper: {
    paddingBottom: theme.spacing(2),
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
});

/* eslint-disable react/prefer-stateless-function */
class EtBreadcumbs extends React.Component {
  getBreadcumbs = () => {
    const pathnames = location.pathname
      .split('/')
      .filter(x => x); /* eslint-disable-line no-restricted-globals */
    const { projectName, productName } = this.props;
    const path = [
      {
        name: 'Home',
        href: '/',
        key: 'home',
        icon: HomeIcon,
      },
    ];
    if (pathnames[0] !== 'project' && pathnames[0] !== 'projects') {
      return path;
    }
    path.push({
      name: 'Projects',
      href: '/projects',
      key: 'projects',
      icon: GearIcon,
    });
    if (pathnames.length >= 2) {
      path.push({
        name: projectName || pathnames[1],
        href: `/project/${pathnames[1]}`,
        key: 'products',
        icon: null,
      });
    }
    if (pathnames.length >= 3) {
      path.push({
        name: productName || pathnames[2],
        href: `/project/${pathnames[1]}/${pathnames[2]}`,
        key: 'components',
        icon: null,
      });
    }
    return path;
  };

  render() {
    const { classes } = this.props;
    const paths = this.getBreadcumbs();
    const links = paths.slice(0, -1);
    const current = paths[paths.length - 1];

    return (
      <div className={classes.root}>
        <Paper elevation={0} className={classes.paper}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="Breadcrumb"
          >
            {links.map(path => (
              <Link color="inherit" href={path.href} key={path.key}>
                {path.icon ? <path.icon className={classes.icon} /> : null}
                {path.name}
              </Link>
            ))}
            <Typography color="textPrimary">
              {current.icon ? <current.icon className={classes.icon} /> : null}
              {current.name}
            </Typography>
          </Breadcrumbs>
        </Paper>
      </div>
    );
  }
}

EtBreadcumbs.propTypes = {
  classes: PropTypes.object.isRequired,
  projectName: PropTypes.string,
  productName: PropTypes.string,
};

export default withStyles(styles)(EtBreadcumbs);
