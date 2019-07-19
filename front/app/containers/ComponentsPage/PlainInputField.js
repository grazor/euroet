import Input from '@material-ui/core/Input';
import PropTypes from 'prop-types';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  root: {
    width: '100%',
  },
  input: {
    margin: 0,
    paddging: 0,
    paddingLeft: 4,
    backgroundColor: '#fff',
    textAlign: 'left',
  },
});

const PlainInputField = props => {
  const { value, height, handleChange, classes } = props;
  return (
    <Input
      id="code-input-custom"
      placeholder="Group name"
      value={value}
      onChange={handleChange}
      className={classes.root}
      classes={{
        input: classes.input,
      }}
      style={{ height }}
    />
  );
};

PlainInputField.propTypes = {
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  height: PropTypes.number.isRequired,
};

export default withStyles(styles)(PlainInputField);
