import type { Core } from '@strapi/strapi';
import { PLUGIN_ID } from '../constants';
import { ScenarioType } from '../types';

export default ({ strapi }: { strapi: Core.Strapi }) => {
  const _scenarios: ScenarioType[] = [];

  return {
    push(scenarioOrArray: ScenarioType | ScenarioType[]) {
      const scenarios = Array.isArray(scenarioOrArray) ? scenarioOrArray : [scenarioOrArray];

      scenarios.forEach((scenario) => {
        if (
          !scenario.id ||
          !scenario.title ||
          !scenario.templateSlug ||
          typeof scenario.getContent !== 'function'
        ) {
          throw new Error(
            'Invalid scenario: "id", "title", "templateSlug", and "getContent" are required.'
          );
        }

        if (_scenarios.find((s) => s.id === scenario.id)) {
          throw new Error(`Scenario with id "${scenario.id}" already exists.`);
        }

        _scenarios.push(scenario);
      });
    },
    get() {
      return _scenarios;
    },
    async check() {
      const scenariosFromDB = await strapi
        .documents(`plugin::${PLUGIN_ID}.${PLUGIN_ID}-scenario`)
        .findMany({
          limit: 999,
        });

      // Delete old scenarios
      const deleteFn = scenariosFromDB.map(async (scenario) => {
        if (!_scenarios.find((s) => s.id === scenario.id)) {
          await strapi.db
            .query(`plugin::${PLUGIN_ID}.${PLUGIN_ID}-scenario`)
            .delete({ where: { id: scenario.id } });

          strapi.log.info(`${PLUGIN_ID}: Delete scenario with id "${scenario.id}".`);
        }
      });

      await Promise.all(deleteFn);

      // Save new scenarios
      const createFn = _scenarios.map(async (scenario) => {
        if (!scenariosFromDB.find((s) => s.id === scenario.id)) {
          const templates = await strapi
            .documents(`plugin::${PLUGIN_ID}.${PLUGIN_ID}-template`)
            .findMany({
              filters: { slug: scenario.templateSlug },
            });

          if (templates.length === 0) {
            strapi.stopWithError(
              `${PLUGIN_ID}: Template with slug "${scenario.templateSlug}" not found.`
            );
          }

          await strapi.documents(`plugin::${PLUGIN_ID}.${PLUGIN_ID}-scenario`).create({
            data: {
              title: scenario.title,
              id: scenario.id,
              description: scenario.description,
              template: templates[0].documentId,
            },
          });

          strapi.log.info(`${PLUGIN_ID}: Save new scenario with id "${scenario.id}".`);
        }
      });

      await Promise.all(createFn);
    },
  };
};
