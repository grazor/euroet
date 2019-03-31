/**
 *
 * Asynchronously loads the component for ComponentsPage
 *
 */

import loadable from 'loadable-components';

export default loadable(() => import('./index'));
