/** Demo models/MCP servers for the Playground settings panel (non-chat). */

export const MOCK_PLAYGROUND_MODELS = [
  { id: 'granite-3-8b-instruct', name: 'Granite 3 8B Instruct' },
  { id: 'Llama-3.2-3B-Instruct', name: 'Llama 3.2 3B Instruct' },
  { id: 'claude-sonnet-4', name: 'Anthropic Claude Sonnet 4' },
];

export const MOCK_PLAYGROUND_MCP_SERVERS = [
  { id: 'mcp-github', name: 'GitHub-MCP-Server', description: 'MCP server for GitHub integration' },
  {
    id: 'mcp-k8s',
    name: 'Kubernetes-MCP-Server',
    description: 'MCP server for Kubernetes cluster access',
  },
];
