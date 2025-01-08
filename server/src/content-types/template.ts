import { PLUGIN_ID } from '../constants';

export default {
  kind: 'collectionType',
  collectionName: `${PLUGIN_ID}-template`,
  info: {
    singularName: `${PLUGIN_ID}-template`,
    pluralName: `${PLUGIN_ID}-templates`,
    displayName: 'Templates for Strapi Document Generator',
    description: 'Create your document templates here.',
  },
  options: {
    draftAndPublish: true,
  },
  pluginOptions: {},
  attributes: {
    title: {
      type: 'string',
      required: true,
      minLength: 1,
      configurable: false,
    },
    description: {
      type: 'text',
      configurable: false,
    },
    slug: {
      type: 'uid',
      targetField: 'title',
      required: true,
      minLength: 1,
      configurable: false,
    },
    content: {
      type: 'customField',
      customField: 'plugin::tinymce.tinymce',
      required: true,
      minLength: 1,
      configurable: false,
    },
  },
};
