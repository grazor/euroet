/**
 *
 * ComponentImportPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { makeSelectIsLoading, makeSelectImports } from './selectors';
import reducer from './reducer';
import saga from './saga';

import ImportArea from './ImportArea';
import ImportHistory from './ImportHistory';
import { loadImportsHistory, importFile } from './actions';

/* eslint-disable react/prefer-stateless-function */
export class ComponentImportPage extends React.Component {
  componentDidMount() {
    this.props.loadImportsHistory();
  }

  render() {
    const { isLoading, imports, importFile: importFileRequest } = this.props;
    return (
      <div>
        <ImportArea importFile={importFileRequest} />
        <ImportHistory imports={imports} isLoading={isLoading} />
      </div>
    );
  }
}

ComponentImportPage.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  imports: PropTypes.array.isRequired,
  loadImportsHistory: PropTypes.func.isRequired,
  importFile: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  isLoading: makeSelectIsLoading(),
  imports: makeSelectImports(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ loadImportsHistory, importFile }, dispatch);

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'componentImportPage', reducer });
const withSaga = injectSaga({ key: 'componentImportPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ComponentImportPage);
