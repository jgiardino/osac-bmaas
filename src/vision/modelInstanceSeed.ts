import {
  DEMO_TENANT_PROJECT_ID,
  DEMO_TENANT_PROJECT_NAME,
} from '../tenantAdmin/projects'
import type { TenantInstance } from '../tenantUser/instances'

interface ModelInstanceSeedItem {
  tenantSlug: 'northsummit' | 'evergreen'
  instance: TenantInstance
}

const modelInstance = (
  tenantSlug: ModelInstanceSeedItem['tenantSlug'],
  values: Pick<
    TenantInstance,
    | 'id'
    | 'name'
    | 'catalogItemDisplayName'
    | 'description'
    | 'hardwareProfile'
    | 'gpuLabel'
    | 'createdAt'
    | 'specRows'
  >,
): ModelInstanceSeedItem => ({
  tenantSlug,
  instance: {
    ...values,
    serviceId: 'models',
    osImage: '—',
    networkLabel: '—',
    projectIds: [DEMO_TENANT_PROJECT_ID],
    projectName: DEMO_TENANT_PROJECT_NAME,
    scopeKind: 'project',
    status: 'running',
    provisionedAt: values.createdAt,
  },
})

/** Confirmed on-cluster examples from the model-fleet inventory; external models are excluded. */
export const MODEL_SERVICE_INSTANCE_SEED: readonly ModelInstanceSeedItem[] = [
  modelInstance('northsummit', {
    id: 'inst-granite-east',
    name: 'granite-3b-instruct-us-east',
    catalogItemDisplayName: 'llm-instruct',
    description: 'Instruction-tuned model for automated pipelines and scheduled workflows.',
    hardwareProfile: '2 replicas · 1 GPU',
    gpuLabel: '1× NVIDIA A10G (24 GB)',
    createdAt: '2026-08-12T12:00:00.000Z',
    specRows: [
      { label: 'Model file', value: 'Granite 3B instruct' },
      { label: 'Model ID', value: 'granite-3b' },
      { label: 'Cluster', value: 'ocp-us-east-1' },
      { label: 'Region', value: 'US East' },
      { label: 'Size', value: '2 replicas · 1 GPU' },
      { label: 'Gateway', value: 'nsb-markets' },
      { label: 'MaaS', value: 'Published' },
      { label: 'AI asset', value: 'Available in Playground' },
    ],
  }),
  modelInstance('northsummit', {
    id: 'inst-granite-eu',
    name: 'granite-3b-instruct-eu-west',
    catalogItemDisplayName: 'llm-instruct',
    description: 'Instruction-tuned model for automated pipelines and scheduled workflows.',
    hardwareProfile: '2 replicas · 1 GPU',
    gpuLabel: '1× NVIDIA A10G (24 GB)',
    createdAt: '2026-08-18T12:00:00.000Z',
    specRows: [
      { label: 'Model file', value: 'Granite 3B instruct' },
      { label: 'Model ID', value: 'granite-3b' },
      { label: 'Cluster', value: 'ocp-eu-west-1' },
      { label: 'Region', value: 'EU West' },
      { label: 'Size', value: '2 replicas · 1 GPU' },
      { label: 'Gateway', value: 'nsb-retail' },
      { label: 'MaaS', value: 'Published' },
      { label: 'AI asset', value: 'Available in Playground' },
    ],
  }),
  modelInstance('northsummit', {
    id: 'inst-mistral-west',
    name: 'mistral-7b-us-west',
    catalogItemDisplayName: 'llm-lightweight-text-gen',
    description: 'Small-footprint text generation, summarization, and classification.',
    hardwareProfile: '1 replica · 1 GPU',
    gpuLabel: '1× NVIDIA L4 (24 GB)',
    createdAt: '2026-09-04T12:00:00.000Z',
    specRows: [
      { label: 'Model file', value: 'Mistral 7B' },
      { label: 'Model ID', value: 'mistral-7b' },
      { label: 'Cluster', value: 'ocp-us-west-1' },
      { label: 'Region', value: 'US West' },
      { label: 'Size', value: '1 replica · 1 GPU' },
      { label: 'Gateway', value: 'nsb-west' },
      { label: 'MaaS', value: 'Published' },
      { label: 'AI asset', value: 'Available in Playground' },
    ],
  }),
  modelInstance('northsummit', {
    id: 'inst-mistral-east',
    name: 'mistral-7b-us-east',
    catalogItemDisplayName: 'llm-lightweight-text-gen',
    description: 'Small-footprint text generation, summarization, and classification.',
    hardwareProfile: '1 replica · 1 GPU',
    gpuLabel: '1× NVIDIA L4 (24 GB)',
    createdAt: '2026-09-06T12:00:00.000Z',
    specRows: [
      { label: 'Model file', value: 'Mistral 7B' },
      { label: 'Model ID', value: 'mistral-7b' },
      { label: 'Cluster', value: 'ocp-us-east-1' },
      { label: 'Region', value: 'US East' },
      { label: 'Size', value: '1 replica · 1 GPU' },
      { label: 'Gateway', value: 'nsb-west' },
      { label: 'MaaS', value: 'Published' },
      { label: 'AI asset', value: 'Available in Playground' },
    ],
  }),
  modelInstance('northsummit', {
    id: 'inst-mistral-eu',
    name: 'mistral-7b-eu-west',
    catalogItemDisplayName: 'llm-lightweight-text-gen',
    description: 'Small-footprint text generation, summarization, and classification.',
    hardwareProfile: '1 replica · 1 GPU',
    gpuLabel: '1× NVIDIA L4 (24 GB)',
    createdAt: '2026-09-08T12:00:00.000Z',
    specRows: [
      { label: 'Model file', value: 'Mistral 7B' },
      { label: 'Model ID', value: 'mistral-7b' },
      { label: 'Cluster', value: 'ocp-eu-west-1' },
      { label: 'Region', value: 'EU West' },
      { label: 'Size', value: '1 replica · 1 GPU' },
      { label: 'Gateway', value: 'nsb-west' },
      { label: 'MaaS', value: 'Published' },
      { label: 'AI asset', value: 'Available in Playground' },
    ],
  }),
  modelInstance('evergreen', {
    id: 'inst-llama-central',
    name: 'llama-4-scout-us-central',
    catalogItemDisplayName: 'llm-high-capacity-reasoning',
    description: 'High-capacity reasoning and extended-context analysis.',
    hardwareProfile: '1 replica · 4 GPUs',
    gpuLabel: '4× NVIDIA A100 (80 GB)',
    createdAt: '2026-08-22T12:00:00.000Z',
    specRows: [
      { label: 'Model file', value: 'Llama 4 Scout' },
      { label: 'Model ID', value: 'llama-4-scout' },
      { label: 'Cluster', value: 'ocp-us-central-1' },
      { label: 'Region', value: 'US Central' },
      { label: 'Size', value: '1 replica · 4 GPUs' },
      { label: 'Gateway', value: 'bsfg-us' },
      { label: 'MaaS', value: 'Published' },
      { label: 'AI asset', value: 'Available in Playground' },
    ],
  }),
  modelInstance('northsummit', {
    id: 'inst-credit-risk-east',
    name: 'credit-risk-scorer-us-east',
    catalogItemDisplayName: 'predictive',
    description: 'Tabular scoring for classification and regression (XGBoost / scikit-learn).',
    hardwareProfile: '1 replica · CPU',
    gpuLabel: 'CPU optimized',
    createdAt: '2026-09-01T12:00:00.000Z',
    specRows: [
      { label: 'Model file', value: 'Credit-risk scorer' },
      { label: 'Model ID', value: 'credit-risk-scorer' },
      { label: 'Cluster', value: 'ocp-us-east-1' },
      { label: 'Region', value: 'US East' },
      { label: 'Size', value: '1 replica · CPU' },
      { label: 'Gateway', value: 'Unassigned' },
      { label: 'MaaS', value: 'Not published' },
      { label: 'AI asset', value: 'Available in Playground' },
    ],
  }),
]

export const getDemoTenantModelInstances = (tenantSlug: string): TenantInstance[] => {
  const canonicalSlug =
    tenantSlug === 'bluesolace' || tenantSlug === 'bluesolace-financial-group'
      ? 'evergreen'
      : tenantSlug

  return MODEL_SERVICE_INSTANCE_SEED.filter((item) => item.tenantSlug === canonicalSlug).map(
    ({ instance }) => instance,
  )
}
