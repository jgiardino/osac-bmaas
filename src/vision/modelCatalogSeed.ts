import type {
  CatalogFieldPolicy,
  CatalogModelChoice,
  CatalogModelProperty,
} from '../catalog/catalogPublishConfig'
import type { CatalogSpecRow } from '../catalog/catalogSpecs'
import type { ProviderCatalogDraft } from '../providerSetup/storage'
import type { RateCard } from '../providerSetup/templateDemo'

export interface ModelCatalogSeedItem {
  id: string
  catalogItemId: string
  displayName: string
  description: string
  templateRefId: string
  templateName: string
  rateCard: RateCard
  modelChoice: CatalogModelChoice
  properties: readonly CatalogModelProperty[]
}

const LOCKED_BADGE: NonNullable<CatalogSpecRow['badge']> = { text: 'Locked', color: 'grey' }
const EDITABLE_BADGE: NonNullable<CatalogSpecRow['badge']> = { text: 'Editable', color: 'purple' }

const property = (
  label: string,
  value: string,
  mode: CatalogModelProperty['mode'],
): CatalogModelProperty => ({ label, value, mode })

export const MODEL_CATALOG_SEED: readonly ModelCatalogSeedItem[] = [
  {
    id: 'llm-lightweight-text-gen',
    catalogItemId: 'cat-llm-lightweight-text-gen',
    displayName: 'llm-lightweight-text-gen',
    description:
      'Low-latency runtime for small-footprint models (1B–7B). Fast, cost-effective text generation, basic summarization, and high-throughput classification.',
    templateRefId: 'maas-llm-lightweight-text-gen',
    templateName: 'llm-lightweight-text-gen',
    modelChoice: {
      mode: 'limited-catalog',
      summary:
        'At launch, choose between Llama-3.2-3B-Instruct and Qwen-2.5-3B-Instruct.',
      selectedModels: ['Llama-3.2-3B-Instruct', 'Qwen-2.5-3B-Instruct'],
    },
    rateCard: {
      hourlyRate: 2.4,
      monthlyRate: 1600,
      currency: 'USD',
      billingUnit: 'per-instance',
    },
    properties: [
      property('Serving engine', 'vLLM', 'locked'),
      property('CPU', '8 vCPU', 'editable'),
      property('RAM', '32 GB', 'editable'),
      property('GPU', '1× NVIDIA L4 (24 GB)', 'editable'),
      property('Max context', '8,192 tokens', 'editable'),
      property('Target latency', '< 50 ms', 'locked'),
    ],
  },
  {
    id: 'llm-instruct',
    catalogItemId: 'cat-llm-instruct',
    displayName: 'llm-instruct',
    description:
      'Standardized endpoint for instruction-tuned models in automated backend processes, data pipelines, and scheduled workflows.',
    templateRefId: 'maas-llm-instruct',
    templateName: 'llm-instruct',
    modelChoice: {
      mode: 'limited-catalog',
      summary:
        'At launch, choose from models selected by the administrator for instruction-tuned use, then provide the model source location and credentials. The OSAC Secret workflow still needs definition.',
      selectedModels: [
        'gemma-4-31B-it',
        'Qwen3-VL-30B-A3B-Instruct',
        'Devstral-Small-2-24B-Instruct-2512',
      ],
    },
    rateCard: {
      hourlyRate: 4.8,
      monthlyRate: 3200,
      currency: 'USD',
      billingUnit: 'per-instance',
    },
    properties: [
      property('Serving engine', 'vLLM / TGI', 'locked'),
      property('CPU', '16 vCPU', 'editable'),
      property('RAM', '64 GB', 'editable'),
      property('GPU', '1× NVIDIA A10G (24 GB)', 'editable'),
      property('Max context', '16,384 tokens', 'editable'),
      property('Target latency', '< 150 ms', 'locked'),
    ],
  },
  {
    id: 'llm-tool-calling',
    catalogItemId: 'cat-llm-tool-calling',
    displayName: 'llm-tool-calling',
    description:
      'Agentic workflows, function calling, structured API parameter generation, and multi-step execution chains.',
    templateRefId: 'maas-llm-tool-calling',
    templateName: 'llm-tool-calling',
    modelChoice: {
      mode: 'fixed-model',
      summary:
        'The administrator selects one model, supplies its source location and credentials, and configures its tool-calling runtime; no model choice is needed at launch. The OSAC Secret workflow still needs definition.',
      selectedModels: ['gemma-4-26B-A4B-it'],
    },
    rateCard: {
      hourlyRate: 8.5,
      monthlyRate: 5800,
      currency: 'USD',
      billingUnit: 'per-instance',
    },
    properties: [
      property('Serving engine', 'vLLM (function engine)', 'locked'),
      property('CPU', '32 vCPU', 'editable'),
      property('RAM', '128 GB', 'editable'),
      property('GPU', '1× NVIDIA A100 (80 GB)', 'editable'),
      property('Max context', '32,768 tokens', 'editable'),
      property('Target latency', '< 200 ms', 'locked'),
    ],
  },
  {
    id: 'llm-high-capacity-reasoning',
    catalogItemId: 'cat-llm-high-capacity-reasoning',
    displayName: 'llm-high-capacity-reasoning',
    description:
      'Multi-GPU blueprint for large-scale models (70B+): complex reasoning, deep analysis, and extended context.',
    templateRefId: 'maas-llm-high-capacity-reasoning',
    templateName: 'llm-high-capacity-reasoning',
    modelChoice: {
      mode: 'fixed-model',
      summary:
        'The administrator selects one model and supplies its source location and credentials. No model choice is needed at launch. The OSAC Secret workflow still needs definition.',
      selectedModels: ['DeepSeek-R1'],
    },
    rateCard: {
      hourlyRate: 24,
      monthlyRate: 16000,
      currency: 'USD',
      billingUnit: 'per-instance',
    },
    properties: [
      property('Serving engine', 'vLLM (tensor parallel)', 'locked'),
      property('CPU', '64 vCPU', 'editable'),
      property('RAM', '512 GB', 'editable'),
      property('GPU', '4× NVIDIA A100 (80 GB)', 'editable'),
      property('Max context', '128,000 tokens', 'editable'),
      property('Target latency', '< 500 ms', 'locked'),
    ],
  },
  {
    id: 'predictive',
    catalogItemId: 'cat-predictive',
    displayName: 'predictive',
    description:
      'Low-latency endpoint for classical tabular models (XGBoost, scikit-learn, LightGBM): real-time scoring, classification, and regression.',
    templateRefId: 'maas-predictive',
    templateName: 'predictive',
    modelChoice: {
      mode: 'byom',
      summary:
        'At launch, the user provides the model source location and credentials for a model they are developing. The OSAC Secret workflow still needs definition.',
    },
    rateCard: {
      hourlyRate: 0.85,
      monthlyRate: 580,
      currency: 'USD',
      billingUnit: 'per-instance',
    },
    properties: [
      property('Serving engine', 'Triton Inference Server', 'locked'),
      property('CPU', '4 vCPU', 'editable'),
      property('RAM', '16 GB', 'editable'),
      property('GPU', 'None (CPU optimized)', 'locked'),
      property('Max context', 'N/A (tabular features)', 'locked'),
      property('Target latency', '< 10 ms', 'locked'),
    ],
  },
]

export const MODEL_CATALOG_ITEM_IDS = MODEL_CATALOG_SEED.map((item) => item.catalogItemId)

export const isVisionModelsCatalogItem = (item: { catalogItemId?: string }): boolean =>
  Boolean(item.catalogItemId && MODEL_CATALOG_ITEM_IDS.includes(item.catalogItemId))

export const getModelCatalogSeedItem = (
  catalogItemId: string | undefined,
): ModelCatalogSeedItem | undefined =>
  MODEL_CATALOG_SEED.find((item) => item.catalogItemId === catalogItemId)

const toFieldPolicies = (item: ModelCatalogSeedItem): CatalogFieldPolicy[] =>
  item.properties.map((entry, index) => ({
    id: `${item.id}-${index}`,
    key: entry.label,
    label: entry.label,
    category: 'template-param',
    defaultValue: entry.value,
    mode: entry.mode === 'locked' ? 'locked' : 'exposed',
  }))

export const toModelCatalogSpecRows = (item: ModelCatalogSeedItem): CatalogSpecRow[] =>
  item.properties.map((entry) => ({
    label: entry.label,
    value: entry.value,
    badge: entry.mode === 'locked' ? LOCKED_BADGE : EDITABLE_BADGE,
  }))

export const resolveModelCatalogSpecRows = (
  catalogItemId: string | undefined,
): CatalogSpecRow[] | null => {
  const seed = getModelCatalogSeedItem(catalogItemId)
  return seed ? toModelCatalogSpecRows(seed) : null
}

export const toModelCatalogDraft = (item: ModelCatalogSeedItem): ProviderCatalogDraft => ({
  catalogItemId: item.catalogItemId,
  templateRefId: item.templateRefId,
  templateName: item.templateName,
  displayName: item.displayName,
  description: item.description,
  scope: 'global-public',
  rateCard: item.rateCard,
  serviceId: 'models',
  status: 'live',
  createdAt: '2026-08-01T12:00:00.000Z',
  fieldPolicies: toFieldPolicies(item),
  modelChoice: item.modelChoice,
  modelProperties: [...item.properties],
})

export const createModelCatalogDrafts = (): ProviderCatalogDraft[] =>
  MODEL_CATALOG_SEED.map(toModelCatalogDraft)
