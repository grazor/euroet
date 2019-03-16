import React from 'react';
import PropTypes from 'prop-types';
import MUIDataTable from 'mui-datatables';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Moment from 'react-moment';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import EditIcon from '@material-ui/icons/Edit';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

const styles = theme => ({
  dateColumn: {
    minWidth: 80,
  },
  actionsColumn: {
    minWidth: 100,
  },
});

class ProjectsTable extends React.Component {
  columns = [
    { name: 'Name', options: { filter: false, sort: true } },
    { name: 'Description', options: { filter: false, sort: true } },
    { name: 'Owner', options: { filter: true, sort: true } },
    { name: 'Last update', options: { filter: false, sort: true } },
    { name: '', options: { filter: false, sort: false } },
  ];

  sortTable = (data, colIndex, order) => {
    const getKey = item =>
      item.type && item.type == 'div' ? item.props.sortKey : item;

    return data.sort(
      (a, b) =>
        (getKey(a.data[colIndex]) < getKey(b.data[colIndex]) ? -1 : 1) *
        (order == 'desc' ? 1 : -1),
    );
  };

  options = {
    selectableRows: false,
    rowsPerPage: 30,
    rowsPerPageOptions: [10, 30, 50],
    print: false,
    download: false,
    responsive: 'scroll',
    fixedHeader: false,
    customSort: this.sortTable,
  };

  mapProjectsToTableData() {
    const { projects, toggleStar, openProjectPage, classes } = this.props;
    return projects.map(p => [
      p.name,
      p.description,
      p.owner ? (
        <div sortKey={`${p.owner.last_name} ${p.owner.first_name}`}>
          <Tooltip title={`${p.owner.last_name} ${p.owner.first_name}`}>
            <Avatar style={{ backgroundColor: p.owner.color }}>
              {p.owner.initials}
            </Avatar>
          </Tooltip>
        </div>
      ) : null,
      <div className={classes.dateColumn} sortKey={+new Date(p.last_update_at)}>
        <Tooltip
          title={
            <Moment
              date={p.last_update_at}
              locale="ru"
              format="hh:mm DD.MM.YYYY"
            />
          }
        >
          <Moment date={p.last_update_at} fromNow locale="ru" />
        </Tooltip>
      </div>,
      <div className={classes.actionsColumn}>
        <IconButton aria-label="Favorite" onClick={toggleStar(p.slug)}>
          {p.is_starred ? (
            <FavoriteIcon color="primary" />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>
        <IconButton aria-label="Edit" onClick={openProjectPage(p.slug)}>
          <EditIcon color="inherit" />
        </IconButton>
      </div>,
    ]);
  }

  render() {
    const data = this.mapProjectsToTableData();

    return (
      <MUIDataTable
        title="Projects"
        columns={this.columns}
        options={this.options}
        data={data}
      />
    );
  }
}

const withStyle = withStyles(styles);

export default compose(withStyle)(ProjectsTable);
