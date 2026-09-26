import type { CatalogFieldPolicy } from '../catalog/catalogPublishConfig'
import type { CatalogSpecRow } from '../catalog/catalogSpecs'
import type { ProviderCatalogDraft } from '../providerSetup/storage'
import type { RateCard } from '../providerSetup/templateDemo'

export type ModelCatalogPropertyMode = 'locked' | 'editable'

export type ModelCatalogProperty = {
  label: string
  value: string
  mode: ModelCatalogPropertyMode
}

export type ModelCatalogSeedItem = {
  id: string
  catalogItemId: string
  displayName: string
  description: string
  templateRefId: string
  templateName: string
  rateCard: RateCard
  properties: readonly ModelCatalogProperty[]
}

const LOCKED_BADGE: NonNullable<CatalogSpecRow['badge']> = { text: 'Locked', color: 'grey' }
const EDITABLE_BADGE: NonNullable<CatalogSpecRow['badge']> = { text: 'Editable', color: 'purple' }

const property = (
  label: string,
  value: string,
  mode: ModelCatalogPropertyMode,
): ModelCatalogProperty => ({ label, value, mode })

export const MODEL_CATALOG_SEED: readonly ModelCatalogSeedItem[] = [
  {
    id: 'llm-lightweight-text-gen',
    catalogItemId: 'cat-llm-lightweight-text-gen',
    displayName: 'llm-lightweight-text-gen',
    description:
      'Low-latency runtime for small-footprint models (1B–7B). Fast, cost-effective text generation, basic summarization, and high-throughput classification.',
    templateRefId: 'maas-llm-lightweight-text-gen',
    templateName: 'llm-lightweight-text-gen',
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
})

export const createModelCatalogDrafts = (): ProviderCatalogDraft[] =>
  MODEL_CATALOG_SEED.map(toModelCatalogDraft)
