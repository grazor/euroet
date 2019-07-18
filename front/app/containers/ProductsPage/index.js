/**
 *
 * ProductsPage
 *
 */

import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import LoadingBar from 'components/LoadingBar';
import PropTypes from 'prop-types';
import React from 'react';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { find } from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import EtBreadcumbs from 'components/Breadcumbs';

import ProductDialog from './ProductDialog';
import ProductsTable from './ProductsTable';
import ProjectDetail from './ProjectDetail';
import reducer from './reducer';
import saga from './saga';
import {
  addProduct,
  deleteProduct,
  fetchProject,
  updateProduct,
} from './actions';
import {
  makeSelectIsLoading,
  makeSelectIsUpdating,
  makeSelectProducts,
  makeSelectProject,
} from './selectors';

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
    product: null,
  };

  componentDidMount() {
    const {
      match: {
        params: { slug },
      },
    } = this.props;
    this.props.fetchProject(slug);
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

  render() {
    const {
      classes,
      products,
      project,
      isLoading,
      isUpdating,
      match: {
        params: { slug },
      },
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
        <EtBreadcumbs projectName={project.name} />
        <ProjectDetail project={project} />
        <ProductsTable
          products={products}
          openProductPage={this.openProductPage}
          editProduct={this.editProduct}
        />
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
  addProduct: PropTypes.func.isRequired,
  updateProduct: PropTypes.func.isRequired,
  deleteProduct: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  products: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  project: makeSelectProject(),
  products: makeSelectProducts(),
  isLoading: makeSelectIsLoading(),
  isUpdating: makeSelectIsUpdating(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchProject,
      addProduct,
      updateProduct,
      deleteProduct,
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
