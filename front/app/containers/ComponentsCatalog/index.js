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
import LoadingBar from 'components/LoadingBar';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { makeSelectIsLoading, makeSelectCatalog } from './selectors';
import reducer from './reducer';
import saga from './saga';

import { loadComponents } from './actions';

import CatalogGrid from './CatalogGrid';

/* eslint-disable react/prefer-stateless-function */
export class ComponentsCatalog extends React.Component {
  componentDidMount() {
    this.props.loadComponents();
  }

  render() {
    const { isLoading, catalog } = this.props;
    return (
      <React.Fragment>
        <EtBreadcumbs />
        {isLoading ? <LoadingBar /> : <CatalogGrid components={catalog} />}
      </React.Fragment>
    );
  }
}

ComponentsCatalog.propTypes = {
  loadComponents: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  catalog: PropTypes.array.isRequired,
};

const mapStateToProps = createStructuredSelector({
  isLoading: makeSelectIsLoading(),
  catalog: makeSelectCatalog(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ loadComponents }, dispatch);

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
