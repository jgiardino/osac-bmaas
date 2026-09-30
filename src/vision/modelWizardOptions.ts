export const HARDWARE_PROFILES = [
  'default',
  'Small',
  'Medium',
  'Large',
  'GPU (1x)',
  'GPU (2x)',
  'GPU (4x) A100',
  'High performance',
  'Standard',
]

export const TOPOLOGIES = [
  {
    id: 'single-node',
    label: 'Single node',
    description:
      "Each replica runs on a single node. Use when your model fits in a single GPU's memory.",
  },
  {
    id: 'multi-node',
    label: 'Multi-node',
    description:
      "Each replica spans multiple nodes using tensor parallelism. Use when your model is too large for a single GPU's memory.",
  },
  {
    id: 'single-node-disaggregated',
    label: 'Single node disaggregated',
    description:
      'Each replica runs on a single node, with prefill and decode handled by separate pools. Use when you want to optimize time-to-first-token and throughput independently.',
  },
  {
    id: 'multi-node-disaggregated',
    label: 'Multi-node disaggregated',
    description:
      'Each replica spans multiple nodes, with prefill and decode handled by separate pools. Use when your model requires both multi-node parallelism and prefill/decode optimization.',
  },
] as const

export const ACCELERATOR_CONFIGURATIONS = [
  'default',
  'Small',
  'Medium',
  'Large',
  'GPU (1x)',
  'GPU (2x)',
  'GPU (4x) A100',
  'High performance',
  'Standard',
]

export const ROUTING_OPTIONS = [
  'Default optimized routing',
  'Managed scheduler with HTTPRoute',
  'Managed scheduler',
  'Lab routing profile',
]

export const TOPOLOGY_CONFIGURATIONS = [
  'Single node (default)',
  'Multi-node data parallel',
  'My custom 4xA100 config',
]

export const DEPLOYMENT_METHODS = [
  {
    id: 'standard',
    label: 'LLM inference service',
    description: 'Deploy a large language model using the standard LLM inference service.',
  },
  {
    id: 'llm-d',
    label: 'LLM inference service with llm-d',
    description:
      'Deploy a large language model with llm-d for additional scheduling and routing capabilities.',
  },
] as const

export const SERVING_RUNTIMES = [
  { id: 'config-vllm-nvidia', value: 'vLLM NVIDIA GPU config', version: 'v0.8.5' },
  {
    id: 'config-vllm-intel-gaudi',
    value: 'vLLM Intel Gaudi Accelerator config',
    version: 'v0.7.3',
  },
  { id: 'config-vllm-spyre-x86', value: 'vLLM Spyre on x86 config', version: 'v0.8.5' },
  { id: 'config-vllm-amd', value: 'vLLM AMD GPU config', version: 'v0.8.5' },
  {
    id: 'config-vllm-cpu-ppc',
    value: 'vLLM CPU (ppc64le/s390x) config',
    version: 'v0.6.6',
  },
  {
    id: 'config-vllm-cpu-amd64',
    value: 'vLLM CPU (amd 64-EXPERIMENTAL) config',
    version: 'v0.6.6',
  },
  { id: 'config-vllm-spyre-s390x', value: 'vLLM Spyre s390x config', version: 'v0.7.3' },
] as const
