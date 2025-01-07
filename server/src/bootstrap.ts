import type { Core } from '@strapi/strapi';
import { PLUGIN_ID } from './constants';

const bootstrap = async ({ strapi }: { strapi: Core.Strapi }) => {
  // Create folders
  const folderGenerator = strapi.plugin(PLUGIN_ID).service('folderGenerator');

  await folderGenerator.generatePluginFolder();
  await folderGenerator.generateDocumentsFolder();
};

export default bootstrap;
