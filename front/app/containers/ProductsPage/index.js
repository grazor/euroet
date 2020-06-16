/**
 *
 * ProductsPage
 *
 */

import AddIcon from '@material-ui/icons/Add';
import EtBreadcumbs from 'components/Breadcumbs';
import Fab from '@material-ui/core/Fab';
import LoadingBar from 'components/LoadingBar';
import PropTypes from 'prop-types';
import React from 'react';
import ReportGrid from 'components/ReportGrid';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { find } from 'lodash';
import { withStyles } from '@material-ui/core/styles';

import ProductDialog from './ProductDialog';
import CopyDialog from './CopyDialog';
import ProductsTable from './ProductsTable';
import ProjectDetail from './ProjectDetail';
import reducer from './reducer';
import saga from './saga';
import {
  addProduct,
  copyProduct,
  createReport,
  deleteProduct,
  fetchProject,
  fetchSuggest,
  updateProduct,
} from './actions';
import {
  makeSelectIsLoading,
  makeSelectIsUpdating,
  makeSelectProducts,
  makeSelectProject,
  makeSelectReportStatus,
  makeSelectReports,
  makeSelectProjectSuggest,
} from './selectors';
import { makeSelectUser } from '../App/selectors';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  loadingRoot: {
    flexGrow: 1,
    marginTop: 72,
    height: 64,
    paddingTop: 32,
    paddingLeft: 16,
    paddingRight: 16,
  },
});

class ProductsPage extends React.Component {
  state = {
    showProductDialog: false,
    showCopyDialog: false,
    product: null,
  };

  componentDidMount() {
    const {
      match: {
        params: { slug },
      },
    } = this.props;
    this.props.fetchProject(slug);
    this.props.fetchSuggest();
  }

  openProductPage = slug => () => {
    const {
      match: {
        params: { slug: projectSlug },
      },
    } = this.props;
    this.props.history.push(`/project/${projectSlug}/${slug}`);
  };

  onToggleDialog = isOn => () => {
    this.setState({ showProductDialog: isOn, product: null });
  };

  onToggleCopyDialog = isOn => () => {
    this.setState({ showCopyDialog: isOn, product: null });
  };

  onSubmitAction = ({ originalSlug, ...rest }) => {
    const {
      project: { slug: projectSlug },
    } = this.props;
    this.setState({ showProductDialog: false, product: null });
    if (originalSlug == null) {
      this.props.addProduct({ projectSlug, ...rest });
    } else {
      this.props.updateProduct({ projectSlug, originalSlug, ...rest });
    }
  };

  onCopyAction = ({ slug, copySlug, originalSlug }) => {
    const {
      project: { slug: projectSlug },
    } = this.props;

    this.setState({ showCopyDialog: false, product: null });
    this.props.copyProduct({
      projectSlug,
      copySlug,
      productSlug: originalSlug,
      targetSlug: slug,
    });
  };

  onDeleteAction = slug => {
    const {
      project: { slug: projectSlug },
    } = this.props;
    this.setState({ showProductDialog: false, product: null });
    this.props.deleteProduct(projectSlug, slug);
  };

  editProduct = slug => () => {
    const product = find(this.props.products, ['slug', slug]);
    this.setState({ showProductDialog: true, product });
  };

  copyProduct = slug => () => {
    const product = find(this.props.products, ['slug', slug]);
    this.setState({ showCopyDialog: true, product });
  };

  render() {
    const {
      classes,
      user,
      products,
      project,
      isLoading,
      isUpdating,
      reports,
      projectSuggest,
      reportStatus,
      match: {
        params: { slug },
      },
      createReport: actionCreateReport,
    } = this.props;

    if (
      (isLoading && (!project || (project && project.slug !== slug))) ||
      isUpdating
    ) {
      return <LoadingBar />;
    }

    return (
      <React.Fragment>
        <ProductDialog
          product={this.state.product}
          open={this.state.showProductDialog}
          onCancel={this.onToggleDialog(false)}
          onSubmit={this.onSubmitAction}
          onDelete={this.onDeleteAction}
        />
        <CopyDialog
          product={this.state.product}
          open={this.state.showCopyDialog}
          onCancel={this.onToggleCopyDialog(false)}
          onSubmit={this.onCopyAction}
          projectSuggest={projectSuggest}
          currentProjectSlug={project.slug}
        />
        <EtBreadcumbs projectName={project.name} />
        <ProjectDetail project={project} />
        <ProductsTable
          products={products}
          openProductPage={this.openProductPage}
          editProduct={this.editProduct}
          copyProduct={this.copyProduct}
        />
        {user && user.can_manage_project_reports ? (
          <ReportGrid
            createReport={actionCreateReport.bind(null, project.slug)}
            reports={reports}
            reportStatus={reportStatus}
          />
        ) : null}
        <Fab
          color="primary"
          aria-label="Add"
          className={classes.fab}
          onClick={this.onToggleDialog(true)}
        >
          <AddIcon />
        </Fab>
      </React.Fragment>
    );
  }
}

ProductsPage.propTypes = {
  fetchProject: PropTypes.func.isRequired,
  fetchSuggest: PropTypes.func.isRequired,
  addProduct: PropTypes.func.isRequired,
  updateProduct: PropTypes.func.isRequired,
  copyProduct: PropTypes.func.isRequired,
  deleteProduct: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  products: PropTypes.array.isRequired,
  reports: PropTypes.array.isRequired,
  reportStatus: PropTypes.string.isRequired,
  createReport: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  projectSuggest: PropTypes.array.isRequired,
  user: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  project: makeSelectProject(),
  products: makeSelectProducts(),
  reports: makeSelectReports(),
  reportStatus: makeSelectReportStatus(),
  isLoading: makeSelectIsLoading(),
  isUpdating: makeSelectIsUpdating(),
  projectSuggest: makeSelectProjectSuggest(),
  user: makeSelectUser(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchProject,
      fetchSuggest,
      addProduct,
      copyProduct,
      updateProduct,
      deleteProduct,
      createReport,
    },
    dispatch,
  );

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'products', reducer });
const withSaga = injectSaga({ key: 'products', saga });
const withStyle = withStyles(styles);

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyle,
)(ProductsPage);
