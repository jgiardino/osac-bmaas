export type ModelChoicePolicy = 'specific-models' | 'configured-catalog' | 'open-choice'

export type DeployModelType =
  | 'Generative AI model (including LLMs and multimodal models)'
  | 'Predictive model'

export type ModelSettingId =
  | 'modelType'
  | 'modelFormat'
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

export const DEFAULT_MODEL_SETTING_MODES: ModelSettingModes = {
  modelType: 'locked',
  modelFormat: 'locked',
  servingMethod: 'locked',
  runtime: 'locked',
  cpu: 'editable',
  memory: 'editable',
  gpu: 'editable',
  capacity: 'editable',
  topology: 'locked',
  routing: 'locked',
  runtimeCustomization: 'locked',
  lifecycle: 'locked',
}

export const DEMO_APPROVED_MODELS = [
  'Small text-generation model A · 1.5B',
  'Small text-generation model B · 3B',
  'Small text-generation model C · 7B',
] as const

export const getModelChoicePolicyLabel = (policy: ModelChoicePolicy) => {
  switch (policy) {
    case 'specific-models':
      return 'One or more specified models'
    case 'configured-catalog':
      return 'Any model in the configured catalog'
    case 'open-choice':
      return 'Open choice for the user, including BYOM'
  }
}
