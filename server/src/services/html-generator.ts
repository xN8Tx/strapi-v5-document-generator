import { Core } from '@strapi/strapi';
import { PLUGIN_ID } from '../constants';
import { ScenarioType } from 'src/types';

import { renderString } from 'nunjucks';

// TODO: Create config
const head = ``;
const header = '';
const footer = '';

const htmlGenerator = ({ strapi }: { strapi: Core.Strapi }) => ({
  async generateTemplate(scenarioId: string) {
    const scenarios = strapi.plugin(PLUGIN_ID).service('scenario').get();
    const scenario = scenarios.find((s) => s.id === scenarioId) as ScenarioType | undefined;

    if (!scenario) {
      throw new Error(`Scenario with id "${scenarioId}" not found.`);
    }

    const templates = await strapi
      .documents(`plugin::${PLUGIN_ID}.${PLUGIN_ID}-template`)
      .findMany({ filters: { slug: scenario.templateSlug } });

    if (templates.length === 0) {
      throw new Error(`Template with slug "${scenario.templateSlug}" not found.`);
    }

    const template = templates[0];
    const templateContent = template.content
      .replace(/(\n)/g, '') // Delete line breaks
      .replace(/<(\w+)(\s*[^>]*)>\s*<\/\1>/, ''); // Delete empty html tags

    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">${head}</head><body>${header}${templateContent}${footer}</body></html>`;
  },
  async generateHTML(scenarioId: string, extraData: any = {}) {
    const scenarios = strapi.plugin(PLUGIN_ID).service('scenario').get();
    const scenario = scenarios.find((s) => s.id === scenarioId) as ScenarioType | undefined;

    if (!scenario) {
      throw new Error(`Scenario with id "${scenarioId}" not found.`);
    }

    const template = await this.generateTemplate(scenarioId);
    const content = await scenario.getContent(strapi, extraData);

    const html = await new Promise((res, rej) => {
      renderString(template, content, (err, html) => {
        if (err) rej(err);
        res(html);
      });
    });

    return html;
  },
});

export default htmlGenerator;
