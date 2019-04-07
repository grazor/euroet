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

import ComponentsGrid from './ComponentsGrid';
import ProductDetail from './ProductDetail';
import reducer from './reducer';
import saga from './saga';
import { fetchProduct } from './actions';
import {
  makeSelectComponents,
  makeSelectIsLoading,
  makeSelectIsUpdating,
  makeSelectProduct,
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
      isLoading,
      isUpdating,
      match: {
        params: { productSlug },
      },
    } = this.props;

    if (
      (isLoading && (!product || (product && product.slug !== productSlug))) ||
      isUpdating
    ) {
      return <LoadingBar />;
    }

    return (
      <React.Fragment>
        <ProductDetail product={product} />
        <ComponentsGrid components={components} />
      </React.Fragment>
    );
  }
}

ComponentsPage.propTypes = {
  fetchProduct: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired,
  components: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  product: makeSelectProduct(),
  components: makeSelectComponents(),
  isLoading: makeSelectIsLoading(),
  isUpdating: makeSelectIsUpdating(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ fetchProduct }, dispatch);

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
