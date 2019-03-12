/*
 * IndexPage Messages
 *
 * This contains all the text for the IndexPage container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.IndexPage';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Euroet engineering app',
  },
  text: {
    id: `${scope}.text`,
    defaultMessage: `
      There could be some news and broadasted messages for both authorized
      and unauthorized users.
    `,
  },
});
