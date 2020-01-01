import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';
import LoadingBar from 'components/LoadingBar';
import Moment from 'react-moment';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '10%',
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    flexGrow: 1,
  },
  notes: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
});

class ImportHistory extends React.Component {
  state = { expanded: 'panel1' };

  handleChange = panel => (event, isExpanded) => {
    this.setState({ expanded: isExpanded ? panel : false });
  };

  render() {
    const { imports, isLoading, classes } = this.props;
    const { expanded } = this.state;

    if (imports.length === 0) {
      if (isLoading) {
        return (
          <Paper elevation={3} className={classes.root}>
            <LoadingBar />
          </Paper>
        );
      }
      return null;
    }

    return (
      <Paper elevation={3} className={classes.root}>
        {imports.map(entry => (
          <ExpansionPanel
            expanded={expanded === entry.uuid}
            onChange={
              entry.errors && entry.errors.length > 0
                ? this.handleChange(entry.uuid)
                : null
            }
          >
            <ExpansionPanelSummary
              expandIcon={
                entry.errors && entry.errors.length > 0 ? (
                  <ExpandMoreIcon />
                ) : null
              }
              aria-controls={`${entry.uuid}-content`}
              id={`${entry.uuid}-header`}
            >
              <Typography className={classes.heading}>
                {entry.status}
              </Typography>
              <Typography className={classes.secondaryHeading}>
                {entry.created_at}
              </Typography>
              <Typography className={classes.notes}></Typography>
              <Tooltip
                title={
                  <Moment
                    date={entry.created_at}
                    locale="ru"
                    format="HH:mm DD.MM.YYYY"
                    unix
                  />
                }
              >
                <Moment date={entry.created_at} fromNow locale="ru" unix />
              </Tooltip>
            </ExpansionPanelSummary>
            {entry.errors && entry.errors.length > 0 ? (
              <ExpansionPanelDetails>
                <Typography>
                  Nulla facilisi. Phasellus sollicitudin nulla et quam mattis
                  feugiat. Aliquam eget maximus est, id dignissim quam.
                </Typography>
              </ExpansionPanelDetails>
            ) : null}
          </ExpansionPanel>
        ))}
      </Paper>
    );
  }
}

ImportHistory.propTypes = {
  classes: PropTypes.object.isRequired,
  imports: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

const withStyle = withStyles(styles);

export default compose(withStyle)(ImportHistory);
