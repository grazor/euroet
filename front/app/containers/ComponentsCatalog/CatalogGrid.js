import PropTypes from 'prop-types';
import React from 'react';
import Paper from '@material-ui/core/Paper';
import { compose } from 'redux';
import LoadingBar from 'components/LoadingBar';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import EuroetTable from 'components/EuroetTable';
import { debounce } from 'lodash';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import copy from 'clipboard-copy';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
});

export class CatalogGrid extends React.Component {
  columns = () => [
    {
      label: 'Code',
      name: 'code',
      options: {
        customBodyRender: value => (
          <Chip
            label={value.code}
            color={value.matchCode ? 'primary' : 'secondary'}
            variant={value.matchCode ? 'default' : 'outlined'}
            onClick={event => {
              const code = event.target.innerText;
              copy(code);
              this.props.notifySuccess(`Copied: ${code}`);
            }}
            style={{ minWidth: 240, fontSize: 14 }}
          />
        ),
      },
    },
    { label: 'Name', name: 'name' },
    { label: 'Price', name: 'price' },
    { label: 'Collection', name: 'collection' },
    { label: 'Manufacturer', name: 'manufacturer' },
    { name: 'matchCode', options: { display: 'false', viewColumns: false } },
    {
      name: 'edit',
      options: {
        display: this.props.canEdit ? 'true' : 'false',
        viewColumns: false,
        customBodyRender: ({ id }) => (
          <IconButton
            aria-label="Open"
            component={Link}
            href={`/admin/pm/component/${id}/change`}
          >
            <EditIcon color="secondary" />
          </IconButton>
        ),
      },
    },
  ];

  constructor(props) {
    super(props);

    this.debouncedLoad = debounce(this.debouncedLoad, 300);
  }

  mapComponentsToTableData() {
    const { components } = this.props;
    return components.map(
      ({
        id,
        code,
        name,
        price,
        collection,
        manufacturer,
        match_code: matchCode,
      }) => ({
        code: { code, matchCode },
        name,
        price,
        collection: collection && collection.name,
        manufacturer: manufacturer && manufacturer.name,
        edit: { id },
      }),
    );
  }

  debouncedLoad = query => {
    this.props.loadComponents(0, query);
  };

  onTableChange = () => (action, tableState) => {
    switch (action) {
      case 'changePage':
        this.props.loadComponents(tableState.page, '');
        break;
      default:
    }
  };

  onSearchChange = event => {
    const { value } = event.target;
    if (value === '' || value.length > 2) {
      this.debouncedLoad(value);
    }
  };

  render() {
    const { count, page, classes, isLoading } = this.props;
    const components = this.mapComponentsToTableData();
    const options = {
      onTableChange: this.onTableChange(),
      count,
      serverSide: true,
      page: components.length > 0 && page > 0 ? page - 1 : 0,
      rowsPerPage: 50,
      rowsPerPageOptions: [50],
      search: false,
    };

    return (
      <div>
        <Paper className={classes.root} elevation={3}>
          <TextField
            margin="dense"
            id="search"
            label="Search"
            onChange={this.onSearchChange}
            fullWidth
          />
        </Paper>

        {isLoading ? (
          <LoadingBar />
        ) : (
          <EuroetTable
            title="Components"
            columns={this.columns()}
            data={components}
            onTableChange={this.onTableChange()}
            options={options}
          />
        )}
      </div>
    );
  }
}

CatalogGrid.propTypes = {
  components: PropTypes.array.isRequired,
  count: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  loadComponents: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  canEdit: PropTypes.bool.isRequired,
  notifySuccess: PropTypes.func.isRequired,
};

const withStyle = withStyles(styles);

export default compose(withStyle)(CatalogGrid);
