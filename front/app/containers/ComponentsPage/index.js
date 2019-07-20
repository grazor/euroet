/**
 *
 * ComponentsPage
 *
 */

import LoadingBar from 'components/LoadingBar';
import PropTypes from 'prop-types';
import React from 'react';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withStyles } from '@material-ui/core/styles';

import EtBreadcumbs from 'components/Breadcumbs';
import ComponentsGrid from './ComponentsGrid';
import ProductDetail from './ProductDetail';
import ProductReports from './ProductReports';
import reducer from './reducer';
import saga from './saga';
import {
  addComponent,
  newComponent,
  updateCustomComponent,
  addGroup,
  renameGroup,
  deleteGroup,
  bulkUpdateQty,
  deleteComponent,
  fetchProduct,
  getSuggestions,
  createReport,
} from './actions';
import {
  makeSelectComponents,
  makeSelectReports,
  makeSelectReportStatus,
  makeSelectIsLoading,
  makeSelectIsUpdating,
  makeSelectProduct,
  makeSelectTotalPrice,
} from './selectors';

const styles = () => ({});

/* eslint-disable react/prefer-stateless-function */
export class ComponentsPage extends React.Component {
  componentDidMount() {
    const {
      match: {
        params: { projectSlug, productSlug },
      },
    } = this.props;
    this.props.fetchProduct(projectSlug, productSlug);
  }

  render() {
    const {
      product,
      components,
      reports,
      reportStatus,
      isLoading,
      isUpdating,
      totalPrice,
      match: {
        params: { projectSlug, productSlug },
      },
      bulkUpdateQty: actionUpdateQty,
      getSuggestions: actionGetSuggestions,
      addComponent: actionAddComponent,
      newComponent: actionNewComponent,
      updateCustomComponent: actionUpdateCustomCommponent,
      addGroup: actionAddGroup,
      renameGroup: actionRenameGroup,
      deleteGroup: actionDeleteGroup,
      deleteComponent: actionDeleteComponent,
      createReport: actionCreateReport,
    } = this.props;

    if (
      (isLoading && (!product || (product && product.slug !== productSlug))) ||
      isUpdating
    ) {
      return <LoadingBar />;
    }

    return (
      <React.Fragment>
        <EtBreadcumbs
          projectName={product.project_name}
          productName={product.name}
        />
        <ProductDetail product={product} totalPrice={totalPrice} />
        <ComponentsGrid
          components={components}
          getSuggestions={actionGetSuggestions}
          bulkUpdateQty={actionUpdateQty.bind(null, projectSlug, productSlug)}
          addGroup={actionAddGroup.bind(null, projectSlug, productSlug)}
          renameGroup={actionRenameGroup.bind(null, projectSlug, productSlug)}
          deleteGroup={actionDeleteGroup.bind(null, projectSlug, productSlug)}
          addComponent={actionAddComponent.bind(null, projectSlug, productSlug)}
          newComponent={actionNewComponent.bind(null, projectSlug, productSlug)}
          updateCustomComponent={actionUpdateCustomCommponent.bind(
            null,
            projectSlug,
            productSlug,
          )}
          deleteComponent={actionDeleteComponent.bind(
            null,
            projectSlug,
            productSlug,
          )}
        />
        <ProductReports
          createReport={actionCreateReport.bind(null, projectSlug, productSlug)}
          reports={reports}
          reportStatus={reportStatus}
        />
      </React.Fragment>
    );
  }
}

ComponentsPage.propTypes = {
  fetchProduct: PropTypes.func.isRequired,
  bulkUpdateQty: PropTypes.func.isRequired,
  getSuggestions: PropTypes.func.isRequired,
  addComponent: PropTypes.func.isRequired,
  newComponent: PropTypes.func.isRequired,
  updateCustomComponent: PropTypes.func.isRequired,
  addGroup: PropTypes.func.isRequired,
  renameGroup: PropTypes.func.isRequired,
  deleteGroup: PropTypes.func.isRequired,
  deleteComponent: PropTypes.func.isRequired,
  createReport: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired,
  components: PropTypes.array.isRequired,
  reports: PropTypes.array.isRequired,
  reportStatus: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
  totalPrice: PropTypes.number.isRequired,
};

const mapStateToProps = createStructuredSelector({
  product: makeSelectProduct(),
  components: makeSelectComponents(),
  reports: makeSelectReports(),
  reportStatus: makeSelectReportStatus(),
  isLoading: makeSelectIsLoading(),
  isUpdating: makeSelectIsUpdating(),
  totalPrice: makeSelectTotalPrice(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchProduct,
      bulkUpdateQty,
      getSuggestions,
      addComponent,
      newComponent,
      updateCustomComponent,
      addGroup,
      renameGroup,
      deleteGroup,
      deleteComponent,
      createReport,
    },
    dispatch,
  );

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'components', reducer });
const withSaga = injectSaga({ key: 'componentsPage', saga });
const withStyle = withStyles(styles);

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyle,
)(ComponentsPage);
