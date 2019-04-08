import Autosuggest from 'react-autosuggest';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { compose } from 'redux';
import { debounce } from 'lodash';
import { withStyles } from '@material-ui/core/styles';

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
});

function renderInputComponent(inputProps) {
  const { inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
      }}
      {...other}
    />
  );
}

renderInputComponent.propTypes = {
  inputRef: PropTypes.func,
  ref: PropTypes.object.isRequired,
};

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const code = suggestion.code != null ? suggestion.code : '';
  const desc =
    suggestion.description != null ? `: ${suggestion.description}` : '';
  const value = `${code} ${desc}`;
  const matches = match(value, query);
  const parts = parse(value, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map(
          (part, index) =>
            part.highlight ? (
              <span key={String(index)} style={{ fontWeight: 500 }}>
                {part.text}
              </span>
            ) : (
              <strong key={String(index)} style={{ fontWeight: 300 }}>
                {part.text}
              </strong>
            ),
        )}
      </div>
    </MenuItem>
  );
}

function getSuggestionValue() {
  return '';
}

class ComponentSearch extends React.Component {
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
    this.props.getSuggestions('');
  };

  handleSuggestionSelected = (event, { suggestion }) => {
    this.props.addComponent(suggestion);
  };

  handleChange = () => (event, { newValue }) => {
    this.setState({ value: newValue });
  };

  render() {
    const { classes, suggestions } = this.props;

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
      label: 'Component',
      margin: 'normal',
      onChange: this.handleChange(),
      inputRef: node => {
        this.popperNode = node;
      },
      value: this.state.value,
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
            <Popper anchorEl={this.popperNode} open={Boolean(options.children)}>
              <Paper
                square
                elevation={24}
                {...options.containerProps}
                style={{
                  width: this.popperNode ? this.popperNode.clientWidth : null,
                }}
              >
                {options.children}
              </Paper>
            </Popper>
          )}
        />
      </div>
    );
  }
}

ComponentSearch.propTypes = {
  classes: PropTypes.object.isRequired,
  suggestions: PropTypes.array.isRequired,
  getSuggestions: PropTypes.func.isRequired,
  addComponent: PropTypes.func.isRequired,
};

const withStyle = withStyles(styles);

export default compose(withStyle)(ComponentSearch);
