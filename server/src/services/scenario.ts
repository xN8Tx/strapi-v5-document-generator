import type { Core } from '@strapi/strapi';
import { ScenarioType } from '../types';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  _scenarios: [],
  push(scenarioOrArray: ScenarioType | ScenarioType[]) {
    const scenarios = Array.isArray(scenarioOrArray) ? scenarioOrArray : [scenarioOrArray];

    scenarios.forEach((scenario) => {
      if (!scenario.title || !scenario.templateSlug || typeof scenario.getContent !== 'function') {
        throw new Error(
          'Invalid scenario: "title", "templateSlug", and "getContent" are required.'
        );
      }
      this._scenarios.push(scenario);
    });
  },
  get() {
    return this._scenarios;
  },
});
