import { Core } from '@strapi/strapi';

const htmlGenerator = ({ strapi }: { strapi: Core.Strapi }) => ({
  async getSourceHTML() {},
  async generateHTML() {},
});

export default htmlGenerator;
