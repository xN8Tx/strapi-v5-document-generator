import type { Core } from '@strapi/strapi';
import type { ScenarioType } from '../types';

import { renderString } from 'nunjucks';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs/promises';

import { PLUGIN_ID } from '../constants';

const generator = ({ strapi }: { strapi: Core.Strapi }) => ({
  async generateTemplate(scenarioId: number) {
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

    const head = strapi.plugin(PLUGIN_ID).config('head') ?? '';
    const header = strapi.plugin(PLUGIN_ID).config('header') ?? '';
    const footer = strapi.plugin(PLUGIN_ID).config('footer') ?? '';

    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">${head}</head><body>${header}${templateContent}${footer}</body></html>`;
  },
  async generateHTML(scenarioId: number, extraData: any = {}) {
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
  async generatePDF(scenarioId: number, extraData: any = {}) {
    // TODO: Normal hash generator
    const filename = extraData.title + Date.now() + '.pdf';

    const htmlContent = (await this.generateHTML(scenarioId, extraData)) as string;
    const documentPath = path.join(strapi.dirs.static.public, PLUGIN_ID, filename);

    // Generate PDF from HTML string
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    await page.pdf({ path: documentPath, format: 'A4' });
    await browser.close();

    // Save PDF to upload folder
    const stats = await fs.stat(documentPath);
    const file = await strapi.documents('plugin::upload.file').create({
      data: {
        name: extraData.title + '.pdf',
        url: '/' + PLUGIN_ID + '/' + filename,
        hash: filename,
        size: stats.size ?? 0,
        ext: '.pdf',
        provider: 'local',
        mime: 'application/pdf',
        folderPath: '/' + PLUGIN_ID,
      },
    });

    // Get scenario
    const scenario = await strapi.documents(`plugin::${PLUGIN_ID}.${PLUGIN_ID}-scenario`).findMany({
      populate: ['template'],
    });

    // Write pdf to history
    const history = await strapi.documents(`plugin::${PLUGIN_ID}.${PLUGIN_ID}-history`).create({
      data: {
        title: extraData.title,
        file: file,
        scenario: scenario[0],
        template: scenario[0].template,
      },
    });

    return history;
  },
});

export default generator;
