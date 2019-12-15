import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import React from 'react';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import EuroetTable from 'components/EuroetTable';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
});

export class CatalogGrid extends React.Component {
  columns = ['Code', 'Name', 'Price', 'Collection', 'Manufacturer'];

  mapComponentsToTableData() {
    const { components } = this.props;
    return components.map(component => [
      component.code,
      component.name,
      component.price,
      component.collection && component.collection.name,
      component.manufacturer && component.manufacturer.name,
    ]);
  }

  render() {
    const { classes } = this.props;
    const components = this.mapComponentsToTableData();
    return (
      <div>
        <Paper className={classes.root} elevation={3}>
          <Input id="lookup" placeholder="Lookup string" fullWidth />
        </Paper>
        <EuroetTable
          title="Components"
          columns={this.columns}
          data={components}
        />
      </div>
    );
  }
}

CatalogGrid.propTypes = {
  classes: PropTypes.object.isRequired,
  components: PropTypes.array.isRequired,
};

const withStyle = withStyles(styles);

export default compose(withStyle)(CatalogGrid);
