import type { CatalogServiceId } from '../providerSetup/templateDemo'

export const DEMO_CATALOG_ITEM_IDS = {
  bareMetalGpuTraining: 'cat-bm-gpu-training',
  bareMetalDenseGpu: 'cat-bm-dense-gpu',
  clusterNodeSets: 'cat-node-sets-fc430',
  vmNetworkAttachments: 'cat-vm-net-attach',
} as const

/** User-facing guidance shown on catalog detail pages and demo catalog seeds. */
export const CATALOG_ITEM_DESCRIPTIONS_BY_ID: Readonly<Record<string, string>> = {
  [DEMO_CATALOG_ITEM_IDS.bareMetalGpuTraining]:
    'Use this server when you need dedicated compute for training or batch jobs.',
  [DEMO_CATALOG_ITEM_IDS.bareMetalDenseGpu]:
    'Use this GPU server for model training or inference workloads that need accelerators.',
  [DEMO_CATALOG_ITEM_IDS.clusterNodeSets]:
    'Use this offering to launch an OpenShift cluster.',
  [DEMO_CATALOG_ITEM_IDS.vmNetworkAttachments]:
    'Use this virtual machine for apps, testing, or development. You can adjust networking when you launch.',
  'cat-llm-lightweight-text-gen':
    'Low-latency runtime for small-footprint models (1B–7B). Fast, cost-effective text generation, basic summarization, and high-throughput classification.',
  'cat-llm-instruct':
    'Standardized endpoint for instruction-tuned models in automated backend processes, data pipelines, and scheduled workflows.',
  'cat-llm-tool-calling':
    'Agentic workflows, function calling, structured API parameter generation, and multi-step execution chains.',
  'cat-llm-high-capacity-reasoning':
    'Multi-GPU blueprint for large-scale models (70B+): complex reasoning, deep analysis, and extended context.',
  'cat-predictive':
    'Low-latency endpoint for classical tabular models (XGBoost, scikit-learn, LightGBM): real-time scoring, classification, and regression.',
}

export const CATALOG_ITEM_DESCRIPTIONS_BY_SERVICE: Readonly<Record<CatalogServiceId, string>> = {
  baremetal:
    'Use this bare metal server when you need dedicated hardware.',
  cluster:
    'Use this cluster offering to run containerized applications.',
  'virtual-machine':
    'Use this virtual machine for apps, testing, or development. Review the configuration below, then launch when you are ready.',
  models:
    'Use this model endpoint when you need managed AI inference. Review the details below, then launch when you are ready.',
}

export function getCatalogItemUserDescription(
  item: {
    catalogItemId: string
    serviceId?: CatalogServiceId | null
    description?: string
  },
  options?: { templateDescription?: string },
): string {
  const byCatalogItemId = CATALOG_ITEM_DESCRIPTIONS_BY_ID[item.catalogItemId]
  if (byCatalogItemId) {
    return byCatalogItemId
  }

  const customDescription = item.description?.trim()
  if (customDescription) {
    return customDescription
  }

  const templateDescription = options?.templateDescription?.trim()
  if (templateDescription) {
    return templateDescription
  }

  return CATALOG_ITEM_DESCRIPTIONS_BY_SERVICE[item.serviceId ?? 'baremetal']
}
