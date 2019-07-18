import PropTypes from 'prop-types';
import React from 'react';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';

import ComponentSearch from './ComponentsGridComponentSearch';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    padding: theme.spacing(2),
    flexGrow: 1,
  },
});

const GridToolbar = props => {
  const { classes, suggestions, getSuggestions, addComponent } = props;
  return (
    <div className={classes.root}>
      <ComponentSearch
        suggestions={suggestions}
        getSuggestions={getSuggestions}
        addComponent={addComponent}
      />
    </div>
  );
};

GridToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  suggestions: PropTypes.array.isRequired,
  getSuggestions: PropTypes.func.isRequired,
  addComponent: PropTypes.func.isRequired,
};

const withStyle = withStyles(styles);

export default compose(withStyle)(GridToolbar);
