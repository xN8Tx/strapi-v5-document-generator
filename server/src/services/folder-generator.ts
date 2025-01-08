import { PLUGIN_ID } from '../constants';

import fs from 'fs/promises';
import path from 'path';

export default () => ({
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
});
