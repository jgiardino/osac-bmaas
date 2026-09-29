import type { CatalogSourceConfigRow } from './types';

/** Mirrored from RHOAI's ODH model catalog settings page. */
export const MOCK_CATALOG_SOURCE_CONFIGS: CatalogSourceConfigRow[] = [
  {
    id: 'other',
    name: 'Other',
    type: 'YAML file',
    enabled: true,
    isDefault: true,
    organization: '',
    visibility: 'All models',
    validationStatus: 'none',
  },
  {
    id: 'redhat-ai',
    name: 'Red Hat AI',
    type: 'YAML file',
    enabled: true,
    isDefault: true,
    organization: '',
    visibility: 'All models',
    validationStatus: 'none',
  },
  {
    id: 'redhat-ai-validated',
    name: 'Red Hat AI validated',
    type: 'YAML file',
    enabled: true,
    isDefault: true,
    organization: '',
    visibility: 'All models',
    validationStatus: 'none',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    type: 'Hugging Face repository',
    enabled: true,
    isDefault: false,
    organization: 'openai',
    visibility: 'Filtered',
    validationStatus: 'ready',
  },
];
