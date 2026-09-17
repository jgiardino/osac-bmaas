import { aiAssetModelIdentities } from '../../../../vision/modelInstanceSeed'
import type { AIModel, MCPServer } from './types'

const endpointFor = (item: { isMaas: boolean; locationKind: string }): string =>
  item.isMaas
    ? 'https://maas.apps.example.com/v1'
    : 'http://credit-risk.svc.cluster.local:8080'

export const MOCK_AI_MODELS: AIModel[] = aiAssetModelIdentities().map((item) => ({
  model_name: item.displayName,
  model_id: item.maasModelRefId,
  serving_runtime: item.locationKind === 'off-platform' ? 'external' : 'vllm',
  api_protocol: 'openai',
  version: '1.0.0',
  usecase: item.useCase,
  description: item.description,
  endpoints: item.isMaas
    ? [`external: ${endpointFor(item)}`]
    : [`internal: ${endpointFor(item)}`],
  status: 'Running',
  display_name: item.displayName,
  model_source_type: item.isMaas ? 'maas' : 'namespace',
  model_type: 'llm',
  capabilities: ['text-generation'],
  internalEndpoint: item.isMaas ? undefined : endpointFor(item),
  externalEndpoint: item.isMaas ? endpointFor(item) : undefined,
  inPlayground: item.isMaas,
  tenantId: item.tenantId,
}))

export const MOCK_MCP_SERVERS: MCPServer[] = [
  {
    id: 'mcp-github',
    name: 'GitHub-MCP-Server',
    url: 'http://github-mcp-server.crimson-show.svc.cluster.local:8080/sse',
    endpoint: '/sse',
    transport: 'sse',
    status: 'unknown',
    description: 'MCP server for GitHub integration',
  },
  {
    id: 'mcp-k8s',
    name: 'Kubernetes-MCP-Server',
    url: 'http://kubernetes-mcp-server.crimson-show.svc.cluster.local:8080/sse',
    endpoint: '/sse',
    transport: 'sse',
    status: 'healthy',
    description: 'MCP server for Kubernetes cluster access',
  },
  {
    id: 'mcp-slack',
    name: 'Slack-MCP-Server',
    url: 'http://slack-mcp-server.crimson-show.svc.cluster.local:8080/sse',
    endpoint: '/sse',
    transport: 'sse',
    status: 'error',
    description: 'MCP server for Slack workspace tools',
  },
]
