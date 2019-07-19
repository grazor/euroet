import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core/styles';
import PlainInputField from './PlainInputField';
import AutosuggestInputField from './AutosuggestInputField';

class CodeEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: props.value || '' };
  }

  getValue = () => ({ code: this.state.value });

  getInputNode = () =>
    ReactDOM.findDOMNode(this).getElementsByTagName('input')[0]; // eslint-disable-line react/no-find-dom-node

  disableContainerStyles = () => false;

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  renderPlainTextEditor = () => (
    <PlainInputField
      value={this.state.value}
      height={this.props.height}
      handleChange={this.handleChange}
    />
  );

  renderComponentEditor = () => (
    <AutosuggestInputField
      height={this.props.height}
      width={this.props.getPaperWidth() - 2 * this.props.column.left}
      getSuggestions={this.props.getSuggestions}
      addComponent={this.props.addComponent}
    />
  );

  render() {
    const { rowData } = this.props;
    if (rowData.group) {
      return this.renderPlainTextEditor();
    }
    return this.renderComponentEditor();
  }
}

CodeEditor.propTypes = {
  value: PropTypes.string,
  height: PropTypes.number.isRequired,
  getPaperWidth: PropTypes.func.isRequired,
  rowData: PropTypes.object,
  getSuggestions: PropTypes.func.isRequired,
  addComponent: PropTypes.func.isRequired,
  column: PropTypes.object,
};

export default CodeEditor;
