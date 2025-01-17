import { PLUGIN_ID } from '../constants';

import template from './template';
import scenario from './scenario';
import history from './history';

export default {
  [`${PLUGIN_ID}-template`]: { schema: template },
  [`${PLUGIN_ID}-scenario`]: { schema: scenario },
  [`${PLUGIN_ID}-history`]: { schema: history },
};
