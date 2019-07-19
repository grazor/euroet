import Autosuggest from 'react-autosuggest';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import Input from '@material-ui/core/Input';
import { debounce } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { withStyles } from '@material-ui/core/styles';
import { makeSelectSuggestions } from './selectors';

const styles = () => ({
  root: {
    flexGrow: 1,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  inputRoot: {
    width: '100%',
  },
  input: {
    margin: 0,
    padding: 0,
    paddingLeft: 4,
    backgroundColor: '#fff',
    textAlign: 'left',
  },
});

const renderInputComponent = props => (
  <Input id="suggest-input-custom" {...props} />
);

renderInputComponent.propTypes = {
  inputRef: PropTypes.func,
  ref: PropTypes.object.isRequired,
};

function renderSuggestion(suggestion, { isHighlighted }) {
  const code = suggestion.code != null ? suggestion.code : '';
  const desc = suggestion.name || '';
  const matchCode = suggestion.match_code || false;

  const style = {
    minWidth: 400,
    marginRight: 24,
    fontSize: 16,
  };

  return (
    <MenuItem selected={isHighlighted} component="div">
      <Chip
        label={code}
        color={matchCode ? 'primary' : 'default'}
        style={style}
      />
      <div>{desc}</div>
    </MenuItem>
  );
}

function getSuggestionValue() {
  return '';
}

class AutosuggestInputField extends React.Component {
  state = {
    value: '',
  };

  debouncedFetchSuggestions = ({ value }) => {
    if (value && value.length > 2) {
      this.props.getSuggestions(value);
    }
  };

  handleSuggestionsFetchRequested = debounce(
    this.debouncedFetchSuggestions,
    300,
  );

  handleSuggestionsClearRequested = () => {
    //this.props.getSuggestions('');
  };

  handleSuggestionSelected = (event, { suggestion }) => {
    this.props.addComponent(suggestion);
  };

  handleChange = () => (event, { newValue }) => {
    this.setState({ value: newValue });
  };

  render() {
    const { classes, suggestions, width } = this.props;

    const autosuggestProps = {
      renderInputComponent,
      suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      onSuggestionSelected: this.handleSuggestionSelected,
      getSuggestionValue,
      renderSuggestion,
    };

    const inputProps = {
      placeholder: 'Code or name',
      onChange: this.handleChange(),
      value: this.state.value,
      style: { height: this.props.height },
      className: classes.inputRoot,
      classes: { input: classes.input },
    };

    return (
      <div className={classes.root}>
        <Autosuggest
          {...autosuggestProps}
          inputProps={inputProps}
          theme={{
            suggestionsList: classes.suggestionsList,
            suggestion: classes.suggestion,
          }}
          renderSuggestionsContainer={options => (
            <Paper {...options.containerProps} square style={{ width }}>
              {options.children}
            </Paper>
          )}
        />
      </div>
    );
  }
}

AutosuggestInputField.propTypes = {
  classes: PropTypes.object.isRequired,
  suggestions: PropTypes.array.isRequired,
  getSuggestions: PropTypes.func.isRequired,
  addComponent: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

const mapStateToProps = createStructuredSelector({
  suggestions: makeSelectSuggestions(),
});

const withStyle = withStyles(styles);
const withConnect = connect(mapStateToProps);

export default compose(
  withStyle,
  withConnect,
)(AutosuggestInputField);
