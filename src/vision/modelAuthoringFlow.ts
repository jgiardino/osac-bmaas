export type ModelChoicePolicy =
  | 'byom'
  | 'specified-models'
  | 'configured-catalog'

export type ServiceWizardVariation = 'predictive' | 'llm-instruct' | 'llm-tool-calling'

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
  'Granite 3B instruct',
  'Mistral 7B',
  'Llama 4 Scout',
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
