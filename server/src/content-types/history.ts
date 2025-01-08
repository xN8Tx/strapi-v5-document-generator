import { PLUGIN_ID } from '../constants';

export default {
  kind: 'collectionType',
  collectionName: `${PLUGIN_ID}-history`,
  info: {
    singularName: `${PLUGIN_ID}-history`,
    pluralName: `${PLUGIN_ID}-histories`,
    displayName: 'History for Strapi Document Generator',
    description: 'Create your document histories here.',
  },
  pluginOptions: {
    'content-manager': {
      visible: false,
    },
    'content-type-builder': {
      visible: false,
    },
  },
  attributes: {
    title: {
      type: 'string',
      required: true,
    },
    file: {
      type: 'media',
      multiple: false,
      allowedTypes: ['files'],
      required: true,
    },
    template: {
      type: 'relation',
      relation: 'oneToOne',
      target: `plugin::${PLUGIN_ID}.${PLUGIN_ID}-template`,
      required: true,
    },
    scenario: {
      type: 'relation',
      relation: 'oneToOne',
      target: `plugin::${PLUGIN_ID}.${PLUGIN_ID}-scenario`,
      required: true,
    },
  },
};
