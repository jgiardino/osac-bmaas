export type CatalogSourceType = 'yaml' | 'hf';

export type CatalogSourceValidationStatus = 'ready' | 'starting' | 'failed' | 'unknown' | 'none';

export interface CatalogSourceConfigRow {
  id: string;
  name: string;
  type: CatalogSourceType;
  enabled: boolean;
  isDefault?: boolean;
  allowedOrganization?: string;
  includedModels?: string[];
  excludedModels?: string[];
  validationStatus: CatalogSourceValidationStatus;
  validationError?: string;
}
