import type { CatalogSourceConfigRow } from './types';

/** Seeded from odh-dashboard `mockCatalogSourceConfigList` + status variants. */
export const MOCK_CATALOG_SOURCE_CONFIGS: CatalogSourceConfigRow[] = [
  {
    id: 'sample_source_1',
    name: 'Sample source 1',
    type: 'yaml',
    enabled: true,
    isDefault: true,
    includedModels: [],
    excludedModels: [],
    validationStatus: 'none',
  },
  {
    id: 'source_2',
    name: 'Source 2',
    type: 'yaml',
    enabled: false,
    includedModels: ['model1', 'model2'],
    excludedModels: ['model3'],
    validationStatus: 'none',
  },
  {
    id: 'huggingface_source_3',
    name: 'Huggingface source 3',
    type: 'hf',
    enabled: true,
    allowedOrganization: 'org1',
    includedModels: [],
    excludedModels: [],
    validationStatus: 'ready',
  },
  {
    id: 'sample_source_4',
    name: 'Sample source 4',
    type: 'yaml',
    enabled: true,
    includedModels: ['model1', 'model2'],
    excludedModels: ['model3'],
    validationStatus: 'starting',
  },
  {
    id: 'huggingface_source_5',
    name: 'Meta Llama org',
    type: 'hf',
    enabled: true,
    allowedOrganization: 'meta-llama',
    includedModels: ['Llama*'],
    excludedModels: [],
    validationStatus: 'failed',
    validationError: 'Unable to authenticate with the provided access token.',
  },
];
