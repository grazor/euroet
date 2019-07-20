import Input from '@material-ui/core/Input';
import PropTypes from 'prop-types';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
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
      autoComplete="off"
      placeholder="Group name"
      value={value}
      onChange={handleChange}
      classes={{
        input: classes.input,
      }}
      fullWidth
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
