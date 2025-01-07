import { Core } from '@strapi/strapi';

export type ExtraFields = {
  required?: boolean;
  relation?: string; // ContentType
  label: string;
  name: string;
};

export type ScenarioType = {
  title: string;
  description?: string;
  templateSlug: string;
  extraFields?: ExtraFields[];
  getContent: (strapi: Core.Strapi, data: any) => Promise<any>;
};
