import { createMuiTheme } from '@material-ui/core/styles';
import * as Colors from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: Colors.deepOrange,
  },
  overrides: {
    MUIDataTable: {
      responsiveScroll: {
        maxHeight: 'none',
      },
    },
  },
});

export default theme;
