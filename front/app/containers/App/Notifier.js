/* eslint-disable react/prop-types */
/* eslint-disable import/no-unresolved */
import { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withSnackbar } from 'notistack';

import { makeSelectNotifications } from './selectors';
import { notifyRemove } from './actions';

class Notifier extends Component {
  displayed = [];

  storeDisplayed = id => {
    this.displayed = [...this.displayed, id];
  };

  shouldComponentUpdate({ notifications: newSnacks = [] }) {
    const { notifications: currentSnacks } = this.props;
    let notExists = false;
    for (let i = 0; i < newSnacks.length; i += 1) {
      notExists =
        notExists ||
        !currentSnacks.filter(({ key }) => newSnacks[i].key === key).length;
      if (notExists) {
        break;
      }
    }
    return notExists;
  }

  componentDidUpdate() {
    const { notifications } = this.props;

    notifications.forEach(notification => {
      // Do nothing if snackbar is already displayed
      if (this.displayed.includes(notification.key)) return;
      // Display snackbar using notistack
      this.props.enqueueSnackbar(notification.message, notification.options);
      // Keep track of snackbars that we've displayed
      this.storeDisplayed(notification.key);
      // Dispatch action to remove snackbar from redux store
      this.props.notifyRemove(notification.key);
    });
  }

  render() {
    return null;
  }
}

const mapStateToProps = createStructuredSelector({
  notifications: makeSelectNotifications(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ notifyRemove }, dispatch);

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withSnackbar,
)(Notifier);
