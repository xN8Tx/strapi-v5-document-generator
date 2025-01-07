import type { Core } from '@strapi/strapi';
import { ScenarioType } from '../types';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  _scenarios: [],
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

      if (this._scenarios.find((s) => s.id === scenario.id)) {
        throw new Error(`Scenario with id "${scenario.id}" already exists.`);
      }

      this._scenarios.push(scenario);
    });
  },
  get() {
    return this._scenarios;
  },
});
