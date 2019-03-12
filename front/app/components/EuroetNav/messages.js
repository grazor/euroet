import { defineMessages } from 'react-intl';

export const scope = 'app.components.Header';

export default defineMessages({
  appname: {
    id: `${scope}.appname`,
    defaultMessage: 'Euroet',
  },
  loginbutton: {
    id: `${scope}.loginmessage`,
    defaultMessage: 'Login',
  },
  logoutbutton: {
    id: `${scope}.logoutmessage`,
    defaultMessage: 'Logout',
  },
});
