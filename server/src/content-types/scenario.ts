import { PLUGIN_ID } from '../constants';

export default {
  kind: 'collectionType',
  collectionName: `${PLUGIN_ID}-scenario`,
  info: {
    singularName: `${PLUGIN_ID}-scenario`,
    pluralName: `${PLUGIN_ID}-scenarios`,
    displayName: 'Scenarios for Strapi Document Generator',
    description: 'Save your document scenarios here.',
  },
  options: {
    draftAndPublish: true,
  },
  pluginOptions: {
    'content-type-builder': {
      visible: false,
    },
    'content-manager': {
      visible: false,
    },
  },
  attributes: {
    title: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'text',
    },
    template: {
      type: 'relation',
      relation: 'oneToOne',
      target: `plugin::${PLUGIN_ID}.${PLUGIN_ID}-template`,
      required: true,
    },
  },
};
