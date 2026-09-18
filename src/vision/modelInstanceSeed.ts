import {
  VISION_GATEWAYS,
  visionOrgIdForTenantSlug,
  visionProjectForOrg,
  type VisionGatewayId,
  type VisionOrgId,
} from './fleetWorld'

export type ModelInstanceLocationKind = 'on-cluster' | 'off-platform'

export type ModelInstanceSeedItem = {
  id: string
  displayName: string
  modelId: string
  /** MaaS model ref id (consume lists). Not a catalog item id. */
  maasModelRefId: string
  description: string
  locationKind: ModelInstanceLocationKind
  catalogSkuId: string | null
  catalogSkuName: string | null
  tenantId: VisionOrgId
  tenantLabel: string
  clusterId: string | null
  regionLabel: string
  size: string | null
  servedBy: string | null
  gatewayId: VisionGatewayId | null
  isMaas: boolean
  isAiAsset: boolean
  onUserSubscription: boolean
  projectName: string
  createdAtLabel: string
  useCase: string
  subscriptionCount: number
  policyCount: number
}

const nsb = {
  tenantId: 'nsb' as const,
  tenantLabel: 'North Summit Bank',
  projectName: visionProjectForOrg('nsb'),
}

const bluesolace = {
  tenantId: 'bluesolace' as const,
  tenantLabel: 'BlueSolace Financial Group',
  projectName: visionProjectForOrg('bluesolace'),
}

export const MODEL_INSTANCE_SEED: readonly ModelInstanceSeedItem[] = [
  {
    id: 'inst-granite-east',
    displayName: 'Granite 3B instruct',
    modelId: 'granite-3b',
    maasModelRefId: 'granite-3b-instruct',
    description: 'Instruction-tuned model for automated pipelines and scheduled workflows.',
    locationKind: 'on-cluster',
    catalogSkuId: 'cat-llm-instruct',
    catalogSkuName: 'llm-instruct',
    ...nsb,
    clusterId: 'ocp-us-east-1',
    regionLabel: 'US East',
    size: '2× · 1 GPU',
    servedBy: null,
    gatewayId: 'nsb-markets',
    isMaas: true,
    isAiAsset: true,
    onUserSubscription: true,
    createdAtLabel: '12 Aug 2026',
    useCase: 'General chat',
    subscriptionCount: 2,
    policyCount: 1,
  },
  {
    id: 'inst-granite-eu',
    displayName: 'Granite 3B instruct',
    modelId: 'granite-3b',
    maasModelRefId: 'granite-3b-instruct',
    description: 'Instruction-tuned model for automated pipelines and scheduled workflows.',
    locationKind: 'on-cluster',
    catalogSkuId: 'cat-llm-instruct',
    catalogSkuName: 'llm-instruct',
    ...nsb,
    clusterId: 'ocp-eu-west-1',
    regionLabel: 'EU West',
    size: '2× · 1 GPU',
    servedBy: null,
    gatewayId: 'nsb-retail',
    isMaas: true,
    isAiAsset: true,
    onUserSubscription: true,
    createdAtLabel: '18 Aug 2026',
    useCase: 'General chat',
    subscriptionCount: 2,
    policyCount: 1,
  },
  {
    id: 'inst-mistral-west',
    displayName: 'Mistral 7B',
    modelId: 'mistral-7b',
    maasModelRefId: 'mistral-7b',
    description: 'Small-footprint text generation, summarization, and classification.',
    locationKind: 'on-cluster',
    catalogSkuId: 'cat-llm-lightweight-text-gen',
    catalogSkuName: 'llm-lightweight-text-gen',
    ...nsb,
    clusterId: 'ocp-us-west-1',
    regionLabel: 'US West',
    size: '1× · 1 GPU',
    servedBy: null,
    gatewayId: 'nsb-west',
    isMaas: true,
    isAiAsset: true,
    onUserSubscription: true,
    createdAtLabel: '4 Sep 2026',
    useCase: 'General chat',
    subscriptionCount: 1,
    policyCount: 1,
  },
  {
    id: 'inst-mistral-east',
    displayName: 'Mistral 7B',
    modelId: 'mistral-7b',
    maasModelRefId: 'mistral-7b',
    description: 'Small-footprint text generation, summarization, and classification.',
    locationKind: 'on-cluster',
    catalogSkuId: 'cat-llm-lightweight-text-gen',
    catalogSkuName: 'llm-lightweight-text-gen',
    ...nsb,
    clusterId: 'ocp-us-east-1',
    regionLabel: 'US East',
    size: '1× · 1 GPU',
    servedBy: null,
    gatewayId: 'nsb-west',
    isMaas: true,
    isAiAsset: true,
    onUserSubscription: true,
    createdAtLabel: '6 Sep 2026',
    useCase: 'General chat',
    subscriptionCount: 1,
    policyCount: 1,
  },
  {
    id: 'inst-mistral-eu',
    displayName: 'Mistral 7B',
    modelId: 'mistral-7b',
    maasModelRefId: 'mistral-7b',
    description: 'Small-footprint text generation, summarization, and classification.',
    locationKind: 'on-cluster',
    catalogSkuId: 'cat-llm-lightweight-text-gen',
    catalogSkuName: 'llm-lightweight-text-gen',
    ...nsb,
    clusterId: 'ocp-eu-west-1',
    regionLabel: 'EU West',
    size: '1× · 1 GPU',
    servedBy: null,
    gatewayId: 'nsb-west',
    isMaas: true,
    isAiAsset: true,
    onUserSubscription: true,
    createdAtLabel: '8 Sep 2026',
    useCase: 'General chat',
    subscriptionCount: 1,
    policyCount: 1,
  },
  {
    id: 'inst-llama-central',
    displayName: 'Llama 4 Scout',
    modelId: 'llama-4-scout',
    maasModelRefId: 'llama-4-scout',
    description: 'High-capacity reasoning and extended-context analysis.',
    locationKind: 'on-cluster',
    catalogSkuId: 'cat-llm-high-capacity-reasoning',
    catalogSkuName: 'llm-high-capacity-reasoning',
    ...bluesolace,
    clusterId: 'ocp-us-central-1',
    regionLabel: 'US Central',
    size: '1× · 4 GPU',
    servedBy: null,
    gatewayId: 'bsfg-us',
    isMaas: true,
    isAiAsset: true,
    onUserSubscription: false,
    createdAtLabel: '22 Aug 2026',
    useCase: 'Reasoning',
    subscriptionCount: 1,
    policyCount: 0,
  },
  {
    id: 'inst-credit-risk-east',
    displayName: 'Credit-risk scorer',
    modelId: 'credit-risk-scorer',
    maasModelRefId: 'credit-risk-scorer',
    description: 'Tabular scoring for classification and regression (XGBoost / scikit-learn).',
    locationKind: 'on-cluster',
    catalogSkuId: 'cat-predictive',
    catalogSkuName: 'predictive',
    ...nsb,
    clusterId: 'ocp-us-east-1',
    regionLabel: 'US East',
    size: '1× · CPU',
    servedBy: null,
    gatewayId: null,
    isMaas: false,
    isAiAsset: true,
    onUserSubscription: false,
    createdAtLabel: '1 Sep 2026',
    useCase: 'Scoring',
    subscriptionCount: 0,
    policyCount: 0,
  },
  // Parked off-platform MaaS examples. Restore these objects into MODEL_INSTANCE_SEED
  // to put Titan (two front doors) and unassigned Claude back on MaaS governance.
  /*
  {
    id: 'ext-titan-markets',
    displayName: 'Titan Text Express',
    modelId: 'titan-express',
    maasModelRefId: 'titan-express',
    description: 'Amazon Bedrock text generation, published on the US East front door.',
    locationKind: 'off-platform',
    catalogSkuId: null,
    catalogSkuName: null,
    ...nsb,
    clusterId: null,
    regionLabel: 'Off-platform',
    size: null,
    servedBy: 'Amazon Bedrock',
    gatewayId: 'nsb-markets',
    isMaas: true,
    isAiAsset: true,
    onUserSubscription: true,
    createdAtLabel: '9 Aug 2026',
    useCase: 'General chat',
    subscriptionCount: 1,
    policyCount: 1,
  },
  {
    id: 'ext-titan-retail',
    displayName: 'Titan Text Express',
    modelId: 'titan-express',
    maasModelRefId: 'titan-express',
    description: 'Amazon Bedrock text generation, published on the EU West front door.',
    locationKind: 'off-platform',
    catalogSkuId: null,
    catalogSkuName: null,
    ...nsb,
    clusterId: null,
    regionLabel: 'Off-platform',
    size: null,
    servedBy: 'Amazon Bedrock',
    gatewayId: 'nsb-retail',
    isMaas: true,
    isAiAsset: true,
    onUserSubscription: true,
    createdAtLabel: '9 Aug 2026',
    useCase: 'General chat',
    subscriptionCount: 1,
    policyCount: 1,
  },
  {
    id: 'ext-claude-unassigned',
    displayName: 'Claude Sonnet 4',
    modelId: 'claude-sonnet-4',
    maasModelRefId: 'claude-sonnet-4',
    description: 'Anthropic chat and reasoning. MaaS model with no gateway yet.',
    locationKind: 'off-platform',
    catalogSkuId: null,
    catalogSkuName: null,
    ...nsb,
    clusterId: null,
    regionLabel: 'Off-platform',
    size: null,
    servedBy: 'Anthropic',
    gatewayId: null,
    isMaas: true,
    isAiAsset: false,
    onUserSubscription: false,
    createdAtLabel: '28 Aug 2026',
    useCase: 'General chat',
    subscriptionCount: 0,
    policyCount: 0,
  },
  */
  {
    id: 'ext-code-assist-ha',
    displayName: 'Code Assist (HA)',
    modelId: 'code-assist-ha',
    maasModelRefId: 'code-assist-ha',
    description:
      'High-availability code completion endpoint — 4-provider weighted split across OpenAI, Anthropic, Azure, and Bedrock for low-latency failover.',
    locationKind: 'off-platform',
    catalogSkuId: null,
    catalogSkuName: null,
    ...nsb,
    clusterId: null,
    regionLabel: 'Off-platform',
    size: null,
    servedBy: 'OpenAI',
    gatewayId: null,
    isMaas: true,
    isAiAsset: false,
    onUserSubscription: false,
    createdAtLabel: '2 Sep 2026',
    useCase: 'Code completion',
    subscriptionCount: 1,
    policyCount: 1,
  },
  {
    id: 'ext-gemini-pro',
    displayName: 'Gemini 2.5 Pro',
    modelId: 'gemini-pro',
    maasModelRefId: 'gemini-pro',
    description: 'Google Gemini 2.5 Pro via Vertex AI.',
    locationKind: 'off-platform',
    catalogSkuId: null,
    catalogSkuName: null,
    ...nsb,
    clusterId: null,
    regionLabel: 'Off-platform',
    size: null,
    servedBy: 'Google Vertex AI',
    gatewayId: null,
    isMaas: true,
    isAiAsset: false,
    onUserSubscription: false,
    createdAtLabel: '8 Sep 2026',
    useCase: 'General chat',
    subscriptionCount: 1,
    policyCount: 1,
  },
  {
    id: 'ext-embeddings-pool',
    displayName: 'Embeddings Pool',
    modelId: 'embeddings-pool',
    maasModelRefId: 'embeddings-pool',
    description:
      'Multi-provider embedding endpoint — distributes embedding workloads across OpenAI, Bedrock (east), and Vertex AI.',
    locationKind: 'off-platform',
    catalogSkuId: null,
    catalogSkuName: null,
    ...nsb,
    clusterId: null,
    regionLabel: 'Off-platform',
    size: null,
    servedBy: 'OpenAI',
    gatewayId: null,
    isMaas: true,
    isAiAsset: false,
    onUserSubscription: false,
    createdAtLabel: '10 Sep 2026',
    useCase: 'Embeddings',
    subscriptionCount: 1,
    policyCount: 0,
  },
  {
    id: 'ext-bsfg-research-ha',
    displayName: 'Research summarizer (HA)',
    modelId: 'bsfg-research-ha',
    maasModelRefId: 'bsfg-research-ha',
    description: 'BlueSolace research summarization with an OpenAI and Vertex split.',
    locationKind: 'off-platform',
    catalogSkuId: null,
    catalogSkuName: null,
    ...bluesolace,
    clusterId: null,
    regionLabel: 'Off-platform',
    size: null,
    servedBy: 'OpenAI',
    gatewayId: null,
    isMaas: true,
    isAiAsset: false,
    onUserSubscription: false,
    createdAtLabel: '11 Sep 2026',
    useCase: 'Summarization',
    subscriptionCount: 1,
    policyCount: 1,
  },
]

export const firstByModelId = (
  items: readonly ModelInstanceSeedItem[],
): ModelInstanceSeedItem[] => {
  const seen = new Set<string>()
  return items.filter((item) => {
    if (seen.has(item.modelId)) {
      return false
    }
    seen.add(item.modelId)
    return true
  })
}

export const servicesModelInstances = (): ModelInstanceSeedItem[] =>
  MODEL_INSTANCE_SEED.filter((item) => item.locationKind === 'on-cluster')

export const maasGovernanceInstances = (): ModelInstanceSeedItem[] =>
  MODEL_INSTANCE_SEED.filter((item) => item.isMaas)

export type MaasGovernanceModelRow = {
  instanceId: string
  modelId: string
  displayName: string
  maasModelRefId: string
  description: string
  locationKind: ModelInstanceLocationKind
  tenantId: VisionOrgId
  tenantLabel: string
  projectName: string
  clusterLabel: string
  gatewayId: VisionGatewayId | null
  subscriptionCount: number
  policyCount: number
}

export const gatewayAssignmentLabel = (gatewayId: string | null): string => {
  if (!gatewayId) {
    return 'Unassigned'
  }
  const host = gatewayHostClusterId(gatewayId as VisionGatewayId) ?? '—'
  return `${host}: ${gatewayId}`
}

/** Equal split across n deployments, matching external-provider weight copy. */
export const formatEqualSplitWeight = (count: number, index: number): string => {
  if (count <= 0 || index < 0 || index >= count) {
    return '—'
  }
  return `1 (${Math.round(100 / count)}%)`
}

/** One row per serving instance. MaaS governance groups these by model. */
export const maasGovernanceModelRows = (): MaasGovernanceModelRow[] =>
  maasGovernanceInstances().map((item) => ({
    instanceId: item.id,
    modelId: item.modelId,
    displayName: item.displayName,
    maasModelRefId: item.maasModelRefId,
    description: item.description,
    locationKind: item.locationKind,
    tenantId: item.tenantId,
    tenantLabel: item.tenantLabel,
    projectName: item.projectName,
    clusterLabel:
      item.clusterId ??
      (item.gatewayId ? (gatewayHostClusterId(item.gatewayId) ?? '—') : '—'),
    gatewayId: item.gatewayId,
    subscriptionCount: item.subscriptionCount,
    policyCount: item.policyCount,
  }))

export const servicesModelsForOrg = (
  orgId: VisionOrgId | 'all',
): ModelInstanceSeedItem[] => {
  const rows = servicesModelInstances()
  if (orgId === 'all') {
    return [...rows]
  }
  return rows.filter((item) => item.tenantId === orgId)
}

export type ModelInstanceGroup = {
  modelId: string
  representative: ModelInstanceSeedItem
  instances: ModelInstanceSeedItem[]
  clusterLabel: string
  gatewayLabel: string
  clusterIds: string[]
}

const clusterIdsForInstance = (item: ModelInstanceSeedItem): string[] => {
  if (item.clusterId) {
    return [item.clusterId]
  }
  if (item.gatewayId) {
    const host = gatewayHostClusterId(item.gatewayId)
    return host ? [host] : []
  }
  return []
}

/** Collapse serving instances of the same model into one list entry. */
export const groupModelInstancesByModelId = (
  items: ModelInstanceSeedItem[],
): ModelInstanceGroup[] => {
  const order: string[] = []
  const map = new Map<string, ModelInstanceSeedItem[]>()
  items.forEach((item) => {
    const existing = map.get(item.modelId)
    if (!existing) {
      order.push(item.modelId)
      map.set(item.modelId, [item])
      return
    }
    existing.push(item)
  })
  return order.map((modelId) => {
    const instances = map.get(modelId) ?? []
    const clusterIds = [...new Set(instances.flatMap(clusterIdsForInstance))]
    const gatewayLabels = [
      ...new Set(instances.map((item) => gatewayAssignmentLabel(item.gatewayId))),
    ]
    return {
      modelId,
      representative: instances[0],
      instances,
      clusterLabel: clusterIds.length > 0 ? clusterIds.join(', ') : '—',
      gatewayLabel: gatewayLabels.join(', '),
      clusterIds,
    }
  })
}

/** True when a MaaS model is published on a gateway. Consumer lists no longer require this. */
export const isAssignedMaas = (item: ModelInstanceSeedItem): boolean =>
  item.isMaas && Boolean(item.gatewayId)

export const visionOrgFilterFromPathname = (pathname: string): VisionOrgId | 'all' => {
  if (pathname.startsWith('/provider')) {
    return 'all'
  }
  const slug = pathname.match(/\/tenant-(?:admin|user)\/([^/]+)/)?.[1]
  return visionOrgIdForTenantSlug(slug ?? 'northsummit')
}

const forOrg = (
  items: ModelInstanceSeedItem[],
  orgId: VisionOrgId | 'all',
): ModelInstanceSeedItem[] =>
  orgId === 'all' ? [...items] : items.filter((item) => item.tenantId === orgId)

/** Unique MaaS models, same set as MaaS governance (grouped by model identity). */
export const maasGovernanceIdentities = (
  orgId: VisionOrgId | 'all' = 'all',
): ModelInstanceSeedItem[] => forOrg(firstByModelId(maasGovernanceInstances()), orgId)

export const apiKeyModelIdentities = (
  orgId: VisionOrgId | 'all' = 'all',
): ModelInstanceSeedItem[] => maasGovernanceIdentities(orgId)

export const aiAssetModelIdentities = (
  orgId: VisionOrgId | 'all' = 'all',
): ModelInstanceSeedItem[] =>
  forOrg(
    firstByModelId([
      ...maasGovernanceInstances(),
      ...MODEL_INSTANCE_SEED.filter((item) => !item.isMaas && item.isAiAsset),
    ]),
    orgId,
  )

export const gatewayHostClusterId = (gatewayId: VisionGatewayId): string | undefined =>
  VISION_GATEWAYS.find((gateway) => gateway.id === gatewayId)?.clusterId

export const modelsOnCluster = (clusterId: string): ModelInstanceSeedItem[] =>
  MODEL_INSTANCE_SEED.filter((item) => {
    if (item.clusterId === clusterId) {
      return true
    }
    return Boolean(
      item.locationKind === 'off-platform' &&
        item.gatewayId &&
        gatewayHostClusterId(item.gatewayId) === clusterId,
    )
  })

export const modelsOnGateway = (gatewayId: VisionGatewayId): ModelInstanceSeedItem[] =>
  MODEL_INSTANCE_SEED.filter((item) => item.gatewayId === gatewayId)
