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
import reducer from './reducer';
import saga from './saga';
import {
  addComponent,
  bulkUpdateQty,
  deleteComponent,
  fetchProduct,
  getSuggestions,
} from './actions';
import {
  makeSelectComponents,
  makeSelectIsLoading,
  makeSelectIsUpdating,
  makeSelectProduct,
  makeSelectSuggestions,
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
      suggestions,
      isLoading,
      isUpdating,
      match: {
        params: { projectSlug, productSlug },
      },
      bulkUpdateQty: actionUpdateQty,
      getSuggestions: actionGetSuggestions,
      addComponent: actionAddComponent,
      deleteComponent: actionDeleteComponent,
    } = this.props;

    if (
      (isLoading && (!product || (product && product.slug !== productSlug))) ||
      isUpdating
    ) {
      return <LoadingBar />;
    }

    const boundedUpdateQty = (codes, qty) =>
      actionUpdateQty(projectSlug, productSlug, codes, qty);
    const boundedGetSuggestions = query =>
      actionGetSuggestions(projectSlug, productSlug, query);
    const boundedAddComponent = (component, qty) =>
      actionAddComponent(projectSlug, productSlug, component, qty);
    const boundedDeleteComponent = code =>
      actionDeleteComponent(projectSlug, productSlug, code);

    return (
      <React.Fragment>
        <EtBreadcumbs
          projectName={product.project_name}
          productName={product.name}
        />
        <ProductDetail product={product} />
        <ComponentsGrid
          components={components}
          bulkUpdateQty={boundedUpdateQty}
          suggestions={suggestions}
          getSuggestions={boundedGetSuggestions}
          addComponent={boundedAddComponent}
          deleteComponent={boundedDeleteComponent}
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
  deleteComponent: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired,
  components: PropTypes.array.isRequired,
  suggestions: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  product: makeSelectProduct(),
  components: makeSelectComponents(),
  suggestions: makeSelectSuggestions(),
  isLoading: makeSelectIsLoading(),
  isUpdating: makeSelectIsUpdating(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchProduct,
      bulkUpdateQty,
      getSuggestions,
      addComponent,
      deleteComponent,
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
