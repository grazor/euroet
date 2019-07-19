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

let QtyField = props => {
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
        inputProps={{ min: 0 }}
      />
    </div>
  );
};

QtyField.propTypes = {
  value: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  height: PropTypes.number.isRequired,
};

QtyField = withStyles(styles)(QtyField);

class QtyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: props.value || 0 };
  }

  getValue = () => ({ qty: this.state.value });

  getInputNode = () =>
    ReactDOM.findDOMNode(this).getElementsByTagName('input')[0]; // eslint-disable-line react/no-find-dom-node

  disableContainerStyles = () => false;

  handleChange = event => {
    this.setState({ value: parseInt(event.target.value, 10) || 0 });
  };

  render() {
    const { value } = this.state;
    const { height } = this.props;
    return (
      <QtyField
        value={value}
        height={height}
        handleChange={this.handleChange}
      />
    );
  }
}

QtyEditor.propTypes = {
  value: PropTypes.any,
  height: PropTypes.number.isRequired,
};

export default QtyEditor;
