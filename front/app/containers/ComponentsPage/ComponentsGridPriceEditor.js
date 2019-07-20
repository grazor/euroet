import Input from '@material-ui/core/Input';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  root: {
    margin: 0,
    paddging: 0,
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  input: {
    margin: 0,
    padding: 0,
  },
});

let PriceField = props => {
  const { value, handleChange, classes, height } = props;
  return (
    <div className={classes.root}>
      <Input
        id="qty-input-custom"
        value={value}
        onChange={handleChange}
        type="number"
        classes={{
          input: classes.root,
        }}
        style={{ height }}
        inputProps={{ min: 0, step: 1.0 }}
        fullWidth
      />
    </div>
  );
};

PriceField.propTypes = {
  value: PropTypes.any,
  handleChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  height: PropTypes.number.isRequired,
};

PriceField = withStyles(styles)(PriceField);

class PriceEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: parseFloat(props.value).toFixed(2) || 0.0 };
  }

  getValue = () => ({ price: this.state.value });

  getInputNode = () =>
    ReactDOM.findDOMNode(this).getElementsByTagName('input')[0]; // eslint-disable-line react/no-find-dom-node

  disableContainerStyles = () => false;

  handleChange = event => {
    this.setState({ value: event.target.value || 0.0 });
  };

  render() {
    const { value } = this.state;
    const { height } = this.props;
    return (
      <PriceField
        value={value}
        height={height}
        handleChange={this.handleChange}
      />
    );
  }
}

PriceEditor.propTypes = {
  value: PropTypes.any,
  height: PropTypes.number.isRequired,
};

export default PriceEditor;
