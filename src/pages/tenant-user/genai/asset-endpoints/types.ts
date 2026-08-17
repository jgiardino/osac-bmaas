/** Subset of odh-dashboard gen-ai AIModel / MCP types for the prod comparison page. */

export type ModelSourceType = 'namespace' | 'custom_endpoint' | 'maas'
export type ModelType = 'llm' | 'embedding' | 'transcription'

export interface AIModel {
  model_name: string
  model_id: string
  serving_runtime: string
  api_protocol: string
  version: string
  usecase: string
  description: string
  endpoints: string[]
  /** Kubernetes-style status: Running | Stop | other */
  status: string
  display_name: string
  model_source_type: ModelSourceType
  model_type?: ModelType
  capabilities?: string[]
  internalEndpoint?: string
  externalEndpoint?: string
  /** Demo-only: whether this model is already configured in the playground */
  inPlayground?: boolean
}

export interface MCPServer {
  id: string
  name: string
  url: string
  endpoint: string
  transport: 'sse' | 'streamable-http'
  description: string
  status: 'healthy' | 'error' | 'unknown'
}
