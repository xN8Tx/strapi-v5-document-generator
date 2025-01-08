import type { Core } from '@strapi/strapi';

import fs from 'fs/promises';
import path from 'path';

import { PLUGIN_ID } from '../constants';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async generatePluginFolder() {
    const folderPath = path.join(strapi.dirs.app.extensions, PLUGIN_ID);
    try {
      await fs.access(folderPath);
    } catch {
      await fs.mkdir(folderPath);
    }
  },
  async generateDocumentsFolder() {
    const folderPath = path.join(strapi.dirs.static.public, PLUGIN_ID);
    try {
      await fs.access(folderPath);
    } catch {
      await fs.mkdir(folderPath);
    }
  },
  async generateUploadPluginFolder() {
    const currentFolders = await strapi.documents('plugin::upload.folder').findMany({
      sort: { pathId: 'asc' },
    });

    if (currentFolders.find((f) => f.name === PLUGIN_ID)) {
      return;
    }

    let pathId = 1;
    if (currentFolders.length > 0) {
      pathId = currentFolders[currentFolders.length - 1].pathId + 1;
    }

    await strapi.documents('plugin::upload.folder').create({
      data: {
        name: PLUGIN_ID,
        path: '/' + PLUGIN_ID,
        pathId,
      },
    });
  },
});
