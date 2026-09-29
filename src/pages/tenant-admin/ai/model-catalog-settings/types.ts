export type CatalogSourceType = 'YAML file' | 'Hugging Face repository';

export type CatalogSourceValidationStatus = 'ready' | 'starting' | 'failed' | 'unknown' | 'none';

export interface CatalogSourceConfigRow {
  id: string;
  name: string;
  type: CatalogSourceType;
  enabled: boolean;
  isDefault: boolean;
  organization: string;
  visibility: 'All models' | 'Filtered';
  validationStatus: CatalogSourceValidationStatus;
  validationError?: string;
}
