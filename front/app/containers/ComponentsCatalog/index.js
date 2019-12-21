/**
 *
 * ComponentsCatalog
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';

import EtBreadcumbs from 'components/Breadcumbs';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import {
  makeSelectIsLoading,
  makeSelectCatalog,
  makeSelectCount,
  makeSelectPage,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import { makeSelectUser } from 'containers/App/selectors';

import { loadComponents } from './actions';
import { notifySuccess } from 'containers/App/actions';

import CatalogGrid from './CatalogGrid';

/* eslint-disable react/prefer-stateless-function */
export class ComponentsCatalog extends React.Component {
  componentDidMount() {
    this.props.loadComponents();
  }

  render() {
    const {
      isLoading,
      catalog,
      loadComponents: load,
      notifySuccess: success,
      count,
      page,
      user,
    } = this.props;
    return (
      <React.Fragment>
        <EtBreadcumbs />
        <CatalogGrid
          components={catalog}
          loadComponents={load}
          count={count}
          page={page}
          isLoading={isLoading}
          notifySuccess={success}
          canEdit={user ? user.can_edit_components : false}
        />
      </React.Fragment>
    );
  }
}

ComponentsCatalog.propTypes = {
  loadComponents: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  catalog: PropTypes.array.isRequired,
  count: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  user: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  isLoading: makeSelectIsLoading(),
  catalog: makeSelectCatalog(),
  count: makeSelectCount(),
  page: makeSelectPage(),
  user: makeSelectUser(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ loadComponents, notifySuccess }, dispatch);

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'componentsCatalog', reducer });
const withSaga = injectSaga({ key: 'componentsCatalog', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ComponentsCatalog);
