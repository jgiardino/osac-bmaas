export type ModelChoicePolicy =
  | 'byom'
  | 'specified-models'
  | 'configured-catalog'

export type ServiceWizardVariation =
  | 'predictive'
  | 'llm-instruct'
  | 'llm-tool-calling'
  | 'llm-lightweight-text-gen'
  | 'llm-high-capacity-reasoning'

const SERVICE_WIZARD_VARIATION_BY_CATALOG_ITEM_ID: Readonly<
  Record<string, ServiceWizardVariation>
> = {
  'cat-predictive': 'predictive',
  'cat-llm-instruct': 'llm-instruct',
  'cat-llm-tool-calling': 'llm-tool-calling',
  'cat-llm-lightweight-text-gen': 'llm-lightweight-text-gen',
  'cat-llm-high-capacity-reasoning': 'llm-high-capacity-reasoning',
}

export const getServiceWizardVariation = (
  catalogItemId: string,
): ServiceWizardVariation | null =>
  SERVICE_WIZARD_VARIATION_BY_CATALOG_ITEM_ID[catalogItemId] ?? null

export type SpecifiedModelSource = 'catalog' | 'connection'

export type DeployModelType =
  | 'Generative AI model (including LLMs and multimodal models)'
  | 'Predictive model'

export type ModelSettingId =
  | 'servingMethod'
  | 'runtime'
  | 'cpu'
  | 'memory'
  | 'gpu'
  | 'capacity'
  | 'topology'
  | 'routing'
  | 'runtimeCustomization'
  | 'lifecycle'

export type ModelSettingMode = 'locked' | 'editable'

export type ModelSettingModes = Record<ModelSettingId, ModelSettingMode>

export type ModelCatalogChoice = 'all' | 'specific'

export type ModelTenantAccessOption = 'catalog' | 'connection'

export type ModelCatalogSourceSettings = {
  tenantAccessOptions: ModelTenantAccessOption[]
  catalogChoices: Record<string, ModelCatalogChoice>
  specificModels: Record<string, string>
}

export type ModelCatalogClusterAvailability = {
  accessMode: ModelSettingMode
  eligibleClusterIds: string[]
}

export const DEFAULT_MODEL_SETTING_MODES: ModelSettingModes = {
  servingMethod: 'editable',
  runtime: 'editable',
  cpu: 'editable',
  memory: 'editable',
  gpu: 'editable',
  capacity: 'editable',
  topology: 'editable',
  routing: 'editable',
  runtimeCustomization: 'editable',
  lifecycle: 'editable',
}

export const DEFAULT_MODEL_CATALOG_SOURCE_SETTINGS: ModelCatalogSourceSettings = {
  tenantAccessOptions: ['catalog', 'connection'],
  catalogChoices: {},
  specificModels: {},
}

export const DEFAULT_MODEL_CLUSTER_AVAILABILITY: ModelCatalogClusterAvailability = {
  accessMode: 'locked',
  eligibleClusterIds: [],
}

export const DEMO_APPROVED_MODELS = [
  'gemma-4-31B-it',
  'Qwen3-VL-30B-A3B-Instruct',
  'Devstral-Small-2-24B-Instruct-2512',
] as const

export const getModelChoicePolicyLabel = (policy: ModelChoicePolicy) => {
  switch (policy) {
    case 'byom':
      return 'Bring your own model (BYOM)'
    case 'specified-models':
      return 'Choose one or more specified models'
    case 'configured-catalog':
      return 'Any model in the configured catalog'
  }
}
