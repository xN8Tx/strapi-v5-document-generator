import { PLUGIN_ID } from '../constants';

export default {
  default: {
    head: '',
    header: '',
    footer: '',
  },
  validator: (config) => {
    if (typeof config.head !== 'string') {
      throw new Error(`Invalid "head" config for ${PLUGIN_ID}`);
    }

    if (typeof config.header !== 'string') {
      throw new Error(`Invalid "header" config for ${PLUGIN_ID}`);
    }

    if (typeof config.footer !== 'string') {
      throw new Error(`Invalid "footer" config for ${PLUGIN_ID}`);
    }
  },
};
