import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import PlainInputField from './PlainInputField';

class NameEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: props.value || '' };
  }

  getValue = () => ({ name: this.state.value });

  getInputNode = () =>
    ReactDOM.findDOMNode(this).getElementsByTagName('input')[0]; // eslint-disable-line react/no-find-dom-node

  disableContainerStyles = () => false;

  handleChange = event => {
    this.setState({ value: event.target.value || '' });
  };

  render() {
    const { value } = this.state;
    const { height } = this.props;
    return (
      <PlainInputField
        value={value}
        height={height}
        handleChange={this.handleChange}
      />
    );
  }
}

NameEditor.propTypes = {
  value: PropTypes.any,
  height: PropTypes.number.isRequired,
};

export default NameEditor;
