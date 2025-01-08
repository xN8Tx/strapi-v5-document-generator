import type { Core } from '@strapi/strapi';
import { PLUGIN_ID } from './constants';

const bootstrap = async ({ strapi }: { strapi: Core.Strapi }) => {
  // Create folders
  const folderGenerator = strapi.plugin(PLUGIN_ID).service('folderGenerator');

  await folderGenerator.generatePluginFolder();
  await folderGenerator.generateDocumentsFolder();
  await folderGenerator.generateUploadPluginFolder();

  // Save scenarios to DB
  const scenario = strapi.plugin(PLUGIN_ID).service('scenario');
  await scenario.check();
};

export default bootstrap;
