import AddIcon from '@material-ui/icons/Add';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CircularProgress from '@material-ui/core/CircularProgress';
import DownloadIcon from '@material-ui/icons/CloudDownloadRounded';
import Grid from '@material-ui/core/Grid';
import Moment from 'react-moment';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import UserAvatar from 'components/UserAvatar';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(4),
  },
  grid: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  card: { minWidth: 250, height: 140 },
  button: { margin: 0 },
  leftIcon: { marginRight: theme.spacing(1) },
  addButton: {
    margin: 0,
    padding: '0 !important',
    width: '100%',
    height: '100%',
  },
  progressRoot: {
    paddingTop: 50,
    paddingLeft: 105,
  },
  progress: {},
});

const ReportCard = ({ report, classes }) => (
  <Card className={classes.card}>
    <CardHeader
      avatar={
        report.author ? <UserAvatar user={report.author} /> : <Avatar>?</Avatar>
      }
      title={<Moment date={report.created_at} fromNow locale="ru" unix />}
      subheader={
        <Moment
          date={report.created_at}
          format="HH:mm DD.MM.YYYY"
          locale="ru"
          unix
        />
      }
    />
    <CardContent>
      <Button
        variant="outlined"
        color="secondary"
        className={classes.button}
        fullWidth
        component={Link}
        to={report.download_url}
        download
      >
        <DownloadIcon className={classes.leftIcon} />
        Download
      </Button>
    </CardContent>
  </Card>
);

ReportCard.propTypes = {
  report: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

const ProductDetail = props => {
  const { classes, reports, createReport, reportStatus } = props;

  return (
    <div>
      <Paper className={classes.root} elevation={4}>
        <Typography variant="h5" component="h3">
          Reports
        </Typography>
        <Grid container spacing={8} className={classes.grid}>
          {reportStatus !== 'denied' ? (
            <Grid item key="add">
              <Card className={classes.card} style={{ margin: 0, padding: 0 }}>
                <CardContent className={classes.addButton}>
                  {reportStatus === 'allowed' ? (
                    <Button
                      color="secondary"
                      className={classes.addButton}
                      onClick={createReport}
                      fullWidth
                    >
                      <AddIcon />
                    </Button>
                  ) : (
                    <div className={classes.progressRoot}>
                      <CircularProgress />
                    </div>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ) : null}
          {reports.map(report => (
            <Grid item key={report.uuid}>
              <ReportCard classes={classes} report={report} />
            </Grid>
          ))}
        </Grid>
      </Paper>
    </div>
  );
};

ProductDetail.propTypes = {
  classes: PropTypes.object.isRequired,
  reports: PropTypes.array.isRequired,
  reportStatus: PropTypes.string.isRequired,
  createReport: PropTypes.func.isRequired,
};

const withStyle = withStyles(styles);

export default compose(withStyle)(ProductDetail);
