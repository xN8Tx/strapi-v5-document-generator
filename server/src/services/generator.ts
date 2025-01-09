import type { Core } from '@strapi/strapi';
import type { ScenarioType } from '../types';

import { renderString } from 'nunjucks';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs/promises';

import { PLUGIN_ID } from '../constants';

const generator = ({ strapi }: { strapi: Core.Strapi }) => ({
  async generateTemplate(templateDocumentId: string) {
    const template = await strapi
      .documents(`plugin::${PLUGIN_ID}.${PLUGIN_ID}-template`)
      .findOne({ documentId: templateDocumentId });

    if (!template) {
      throw new Error(`Template with slug "${templateDocumentId}" not found.`);
    }

    const templateContent = template.content
      .replace(/(\n)/g, '') // Delete line breaks
      .replace(/<(\w+)(\s*[^>]*)>\s*<\/\1>/, ''); // Delete empty html tags

    const head = strapi.plugin(PLUGIN_ID).config('head') ?? '';
    const header = strapi.plugin(PLUGIN_ID).config('header') ?? '';
    const footer = strapi.plugin(PLUGIN_ID).config('footer') ?? '';

    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">${head}</head><body>${header}${templateContent}${footer}</body></html>`;
  },
  async generateHTML(template: string, content: any = {}) {
    return await new Promise((res, rej) => {
      renderString(template, content, (err, html) => {
        if (err) rej(err);
        res(html);
      });
    });
  },
  async generatePDF(html: string, filename: string) {
    const documentPath = path.join(strapi.dirs.static.public, PLUGIN_ID, filename);

    // Generate PDF from HTML string
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    await page.pdf({ path: documentPath, format: 'A4' });
    await browser.close();

    return documentPath;
  },
  async generate(scenarioId: number, extraData: any = {}) {
    const scenariosInstants = strapi.plugin(PLUGIN_ID).service('scenario').get();
    const scenarioInstant = scenariosInstants.find((s) => s.id === scenarioId) as
      | ScenarioType
      | undefined;

    if (!scenarioInstant) {
      throw new Error(`Scenario with id "${scenarioId}" not found.`);
    }

    const scenariosFromDB = await strapi
      .documents(`plugin::${PLUGIN_ID}.${PLUGIN_ID}-scenario`)
      .findMany({ filters: { id: scenarioId }, populate: ['template'] });
    const scenarioFromDB = scenariosFromDB[0];

    // Prepare content for template
    const content = await scenarioInstant.getContent(strapi, extraData);
    const templateDocumentId = scenarioFromDB.template.documentId;
    // Prepare filename for pdf file
    // TODO: Normal hash generator
    const filename = extraData.title + Date.now() + '.pdf';

    // Generate
    const template = (await this.generateTemplate(templateDocumentId)) as string;
    const html = (await this.generateHTML(template, content)) as string;
    const documentPath = (await this.generatePDF(html, filename)) as string;

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
  async delete(historyId: string) {
    const history = await strapi
      .documents(`plugin::${PLUGIN_ID}.${PLUGIN_ID}-history`)
      .findOne({ documentId: historyId, populate: ['file'] });

    await strapi
      .documents(`plugin::${PLUGIN_ID}.${PLUGIN_ID}-history`)
      .delete({ documentId: historyId, populate: ['file'] });

    // @ts-ignore
    const fileId = history.file.documentId;
    const file = await strapi.documents('plugin::upload.file').findOne({
      documentId: fileId,
    });
    await strapi.documents('plugin::upload.file').delete({ documentId: fileId });

    // @ts-ignore
    const documentPath = path.join(strapi.dirs.static.public, PLUGIN_ID, file.hash);
    await fs.unlink(documentPath);

    return history;
  },
});

export default generator;
