import { visionProjectForOrg, type VisionOrgId } from './fleetWorld'

export type ExternalAuthMechanism = 'apikey' | 'sigv4' | 'oauth2'
export type ExternalModelPhase = 'Ready' | 'Failed' | 'Pending'

export interface ExternalProviderRef {
  providerName: string
  displayName: string
  endpointUrl: string
  path: string
  authMechanism: ExternalAuthMechanism
  credentialSecretRef: string
  apiFormat: string
  targetModel: string
  weight: number
  phase: ExternalModelPhase
}

export interface ExternalModelSeed {
  name: string
  displayName: string
  description: string
  orgId: VisionOrgId
  projectName: string
  phase: ExternalModelPhase
  providerRefs: ExternalProviderRef[]
}

const nsbProject = visionProjectForOrg('nsb')
const bsfgProject = visionProjectForOrg('bluesolace')

const openai = (
  extras: Partial<ExternalProviderRef> & Pick<ExternalProviderRef, 'providerName' | 'targetModel'>,
): ExternalProviderRef => ({
  displayName: 'OpenAI',
  endpointUrl: 'https://api.openai.com',
  path: '—',
  authMechanism: 'apikey',
  credentialSecretRef: 'openai-api-key',
  apiFormat: 'openai-chat',
  weight: 1,
  phase: 'Ready',
  ...extras,
})

const anthropic = (
  extras: Partial<ExternalProviderRef> & Pick<ExternalProviderRef, 'providerName' | 'targetModel'>,
): ExternalProviderRef => ({
  displayName: 'Anthropic',
  endpointUrl: 'https://api.anthropic.com',
  path: '—',
  authMechanism: 'apikey',
  credentialSecretRef: 'anthropic-api-key',
  apiFormat: 'openai-chat',
  weight: 1,
  phase: 'Ready',
  ...extras,
})

const azureEast = (
  extras: Partial<ExternalProviderRef> & Pick<ExternalProviderRef, 'providerName' | 'targetModel'>,
): ExternalProviderRef => ({
  displayName: 'Azure OpenAI (East US)',
  endpointUrl: 'https://eastus.openai.azure.com',
  path: '—',
  authMechanism: 'apikey',
  credentialSecretRef: 'azure-openai-eastus',
  apiFormat: 'openai-chat',
  weight: 1,
  phase: 'Ready',
  ...extras,
})

const bedrockEast = (
  extras: Partial<ExternalProviderRef> & Pick<ExternalProviderRef, 'providerName' | 'targetModel'>,
): ExternalProviderRef => ({
  displayName: 'AWS Bedrock (us-east-1)',
  endpointUrl: 'https://bedrock-runtime.us-east-1.amazonaws.com',
  path: '—',
  authMechanism: 'apikey',
  credentialSecretRef: 'aws-bedrock-credentials',
  apiFormat: 'openai-chat',
  weight: 1,
  phase: 'Ready',
  ...extras,
})

const vertex = (
  extras: Partial<ExternalProviderRef> & Pick<ExternalProviderRef, 'providerName' | 'targetModel'>,
): ExternalProviderRef => ({
  displayName: 'Google Vertex AI',
  endpointUrl: 'https://us-east1-aiplatform.googleapis.com',
  path: '—',
  authMechanism: 'oauth2',
  credentialSecretRef: 'vertex-ai-sa-json',
  apiFormat: 'openai-chat',
  weight: 1,
  phase: 'Ready',
  ...extras,
})

export const EXTERNAL_MODEL_SEED: readonly ExternalModelSeed[] = [
  {
    name: 'code-assist-ha',
    displayName: 'Code Assist (HA)',
    description:
      'High-availability code completion endpoint — 4-provider weighted split across OpenAI, Anthropic, Azure, and Bedrock for low-latency failover.',
    orgId: 'nsb',
    projectName: nsbProject,
    phase: 'Ready',
    providerRefs: [
      openai({ providerName: 'openai', targetModel: 'gpt-4.1-mini' }),
      anthropic({ providerName: 'anthropic', targetModel: 'claude-sonnet-4-5' }),
      azureEast({ providerName: 'azure-openai-eastus', targetModel: 'gpt-4.1-mini' }),
      bedrockEast({ providerName: 'aws-bedrock-east', targetModel: 'anthropic.claude-sonnet-4' }),
    ],
  },
  {
    name: 'gemini-pro',
    displayName: 'Gemini 2.5 Pro',
    description: 'Google Gemini 2.5 Pro via Vertex AI.',
    orgId: 'nsb',
    projectName: nsbProject,
    phase: 'Failed',
    providerRefs: [
      vertex({
        providerName: 'google-vertex',
        targetModel: 'google/gemini-2.5-pro',
        phase: 'Failed',
      }),
    ],
  },
  {
    name: 'embeddings-pool',
    displayName: 'Embeddings Pool',
    description:
      'Multi-provider embedding endpoint — distributes embedding workloads across OpenAI, Bedrock (east), and Vertex AI.',
    orgId: 'nsb',
    projectName: nsbProject,
    phase: 'Pending',
    providerRefs: [
      openai({ providerName: 'openai-embed', targetModel: 'text-embedding-3-large' }),
      bedrockEast({
        providerName: 'aws-bedrock-embed',
        targetModel: 'amazon.titan-embed-text-v2:0',
      }),
      vertex({
        providerName: 'google-vertex-embed',
        targetModel: 'text-embedding-005',
        phase: 'Pending',
      }),
    ],
  },
  {
    name: 'bsfg-research-ha',
    displayName: 'Research summarizer (HA)',
    description: 'BlueSolace research summarization with an OpenAI and Vertex split.',
    orgId: 'bluesolace',
    projectName: bsfgProject,
    phase: 'Ready',
    providerRefs: [
      openai({ providerName: 'openai', targetModel: 'gpt-4.1-mini', weight: 2 }),
      vertex({ providerName: 'google-vertex', targetModel: 'google/gemini-2.5-flash', weight: 1 }),
    ],
  },
]

export const getProviderRefWeightPercentage = (
  providerRefs: readonly ExternalProviderRef[],
  index: number,
): number => {
  const totalWeight = providerRefs.reduce((sum, ref) => sum + ref.weight, 0)
  if (totalWeight <= 0) {
    return 0
  }
  return Math.round((providerRefs[index].weight / totalWeight) * 100)
}

export const formatProviderRefWeight = (
  providerRefs: readonly ExternalProviderRef[],
  index: number,
): string => {
  const { weight } = providerRefs[index]
  if (weight === 0) {
    return 'Excluded from routing'
  }
  return `${weight} (${getProviderRefWeightPercentage(providerRefs, index)}%)`
}

export const authMechanismLabel = (authMechanism: ExternalAuthMechanism): string => {
  if (authMechanism === 'apikey') {
    return 'API key'
  }
  if (authMechanism === 'oauth2') {
    return 'OAuth2'
  }
  return 'Signature Version 4'
}

export const getExternalModelByName = (name: string): ExternalModelSeed | undefined =>
  EXTERNAL_MODEL_SEED.find((model) => model.name === name)

export const externalModelsForOrg = (orgId: VisionOrgId | 'all'): ExternalModelSeed[] => {
  if (orgId === 'all') {
    return [...EXTERNAL_MODEL_SEED]
  }
  return EXTERNAL_MODEL_SEED.filter((model) => model.orgId === orgId)
}
