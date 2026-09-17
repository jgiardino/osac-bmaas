import { aiAssetModelIdentities } from '../../../../vision/modelInstanceSeed'

/** Demo models/MCP servers for the Playground settings panel (non-chat). */

export const MOCK_PLAYGROUND_MODELS = aiAssetModelIdentities().map((item) => ({
  id: item.modelId,
  name: item.displayName,
  modelRefId: item.maasModelRefId,
  description: item.description,
  isMaas: item.isMaas,
  tenantId: item.tenantId,
}))

export const MOCK_PLAYGROUND_MCP_SERVERS = [
  { id: 'mcp-github', name: 'GitHub-MCP-Server', description: 'MCP server for GitHub integration' },
  {
    id: 'mcp-k8s',
    name: 'Kubernetes-MCP-Server',
    description: 'MCP server for Kubernetes cluster access',
  },
]
