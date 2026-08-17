export type PhaseStatus = 'Active' | 'Failed' | 'Pending' | 'Deleting' | 'Degraded' | 'Unhealthy' | 'Unknown';
export type CoverageStatus = 'fully-configured' | 'subscription-only' | 'policy-only' | 'unconfigured';

export interface TokenRateLimit {
  tokens: number;
  per: number;
  unit: 'minute' | 'hour' | 'day';
}

export interface SubscriptionRef {
  id: string;
  name: string;
  phase: PhaseStatus;
  priority: number;
  groups: string[];
  tokenLimits: TokenRateLimit[];
}

export interface AuthPolicyRef {
  id: string;
  name: string;
  phase: PhaseStatus;
  groups: string[];
}

export interface GovernanceModel {
  id: string;
  name: string;
  modelId: string;
  description: string;
  project: string;
  source?: 'internal' | 'external';
  providerSecret?: { name: string; namespace: string };
  status: CoverageStatus;
  subscriptions: SubscriptionRef[];
  policies: AuthPolicyRef[];
}

export interface GovernanceGroup {
  id: string;
  name: string;
  modelCount: number;
  subscriptionCount: number;
  policyCount: number;
  models: {
    modelId: string;
    modelName: string;
    subscriptions: SubscriptionRef[];
    policies: AuthPolicyRef[];
    status: CoverageStatus;
  }[];
}

export interface SubscriptionListItem {
  id: string;
  name: string;
  resourceName: string;
  description: string;
  phase: PhaseStatus;
  priority: number;
  groups: string[];
  models: string[];
  tokenLimits: Record<string, TokenRateLimit[]>;
  dateCreated: Date;
  lastModified: Date;
}

export interface AuthPolicyListItem {
  id: string;
  name: string;
  resourceName: string;
  description: string;
  phase: PhaseStatus;
  groups: string[];
  models: string[];
  dateCreated: Date;
  lastModified: Date;
}

export const getStatus = (hasSub: boolean, hasPol: boolean): CoverageStatus => {
  if (hasSub && hasPol) {return 'fully-configured';}
  if (hasSub && !hasPol) {return 'subscription-only';}
  if (!hasSub && hasPol) {return 'policy-only';}
  return 'unconfigured';
};

export const availableGroups = [
  'data-science-team',
  'analytics-team',
  'ml-engineers',
  'contractors',
  'platform-admins',
  'marketing-analytics',
  'interns',
  'qa-engineers',
  'devops-team',
  'security-reviewers',
  'product-managers',
  'release-managers',
  'frontend-engineers',
  'backend-services',
  'compliance-team',
];

export const mockGovernanceModels: GovernanceModel[] = [
  {
    id: 'granite-3b-code-instruct',
    name: 'granite-3b-code-instruct',
    modelId: 'maas-vllm-inference-1/ibm/granite-3b-code-instruct',
    description: 'IBM Granite 3B Code Instruct model for code generation, completion, and instruction following tasks. Optimized for enterprise development workflows.',
    project: 'ai-models',
    status: 'fully-configured',
    subscriptions: [
      {
        id: 'sub-ds-granite',
        name: 'Data Science Granite Access',
        phase: 'Active',
        priority: 10,
        groups: ['data-science-team', 'ml-engineers'],
        tokenLimits: [
          { tokens: 1500, per: 1, unit: 'minute' },
          { tokens: 50000, per: 1, unit: 'hour' },
          { tokens: 500000, per: 1, unit: 'day' },
        ],
      },
      {
        id: 'sub-analytics-granite',
        name: 'Analytics Granite Limited',
        phase: 'Active',
        priority: 5,
        groups: ['analytics-team'],
        tokenLimits: [
          { tokens: 500, per: 1, unit: 'minute' },
          { tokens: 10000, per: 1, unit: 'hour' },
          { tokens: 80000, per: 1, unit: 'day' },
        ],
      },
    ],
    policies: [
      {
        id: 'pol-platform-all',
        name: 'Platform Wide Access',
        phase: 'Active',
        groups: ['data-science-team', 'ml-engineers', 'analytics-team', 'contractors'],
      },
    ],
  },
  {
    id: 'llama-3-70b-instruct',
    name: 'llama-3-70b-instruct',
    modelId: 'maas-vllm-inference-2/meta/llama-3-70b-instruct',
    description: 'Meta Llama 3 70B Instruct — large-scale instruction-tuned model for complex reasoning, summarization, and multi-turn dialogue.',
    project: 'ml-serving',
    status: 'fully-configured',
    subscriptions: [
      {
        id: 'sub-ds-llama',
        name: 'Data Science Llama Access',
        phase: 'Active',
        priority: 10,
        groups: ['data-science-team'],
        tokenLimits: [
          { tokens: 2000, per: 1, unit: 'minute' },
          { tokens: 25000, per: 1, unit: 'hour' },
          { tokens: 200000, per: 1, unit: 'day' },
        ],
      },
    ],
    policies: [
      {
        id: 'pol-ds-llama',
        name: 'Data Science Llama Policy',
        phase: 'Active',
        groups: ['data-science-team'],
      },
    ],
  },
  {
    id: 'mistral-7b-instruct',
    name: 'mistral-7b-instruct',
    modelId: 'maas-vllm-inference-1/mistralai/mistral-7b-instruct-v0.3',
    description: 'Mistral 7B Instruct v0.3 — efficient instruction-following model with strong performance for text generation and Q&A tasks.',
    project: 'ai-models',
    status: 'subscription-only',
    subscriptions: [
      {
        id: 'sub-contractors-mistral',
        name: 'Contractors Mistral Budget',
        phase: 'Active',
        priority: 0,
        groups: ['contractors'],
        tokenLimits: [
          { tokens: 100, per: 1, unit: 'minute' },
          { tokens: 2000, per: 1, unit: 'hour' },
          { tokens: 15000, per: 1, unit: 'day' },
        ],
      },
    ],
    policies: [],
  },
  {
    id: 'granite-code-20b',
    name: 'granite-code-20b',
    modelId: 'maas-llmd-inference-1/ibm/granite-code-20b',
    description: 'IBM Granite Code 20B — enterprise-grade code generation model supporting 116 programming languages with fill-in-the-middle capability.',
    project: 'ai-models',
    status: 'policy-only',
    subscriptions: [],
    policies: [
      {
        id: 'pol-platform-all',
        name: 'Platform Wide Access',
        phase: 'Active',
        groups: ['data-science-team', 'ml-engineers', 'analytics-team', 'contractors'],
      },
    ],
  },
  {
    id: 'codellama-34b',
    name: 'codellama-34b-instruct',
    modelId: 'maas-vllm-inference-3/meta/codellama-34b-instruct',
    description: '',
    project: 'ml-serving',
    status: 'unconfigured',
    subscriptions: [],
    policies: [],
  },
  {
    id: 'phi-3-mini',
    name: 'phi-3-mini-4k-instruct',
    modelId: 'maas-vllm-inference-2/microsoft/phi-3-mini-4k-instruct',
    description: '',
    project: 'ai-models',
    status: 'unconfigured',
    subscriptions: [],
    policies: [],
  },
  {
    id: 'starcoder2-15b',
    name: 'starcoder2-15b',
    modelId: 'maas-vllm-inference-3/bigcode/starcoder2-15b',
    description: 'BigCode StarCoder2 15B — open code LLM trained on The Stack v2 for code completion and generation across multiple languages.',
    project: 'ml-serving',
    status: 'fully-configured',
    subscriptions: [
      {
        id: 'sub-ml-eng-star',
        name: 'ML Engineers StarCoder',
        phase: 'Active',
        priority: 10,
        groups: ['ml-engineers'],
        tokenLimits: [
          { tokens: 3000, per: 1, unit: 'minute' },
          { tokens: 120000, per: 1, unit: 'hour' },
          { tokens: 800000, per: 1, unit: 'day' },
          { tokens: 5000, per: 10, unit: 'minute' },
        ],
      },
    ],
    policies: [
      {
        id: 'pol-ml-star',
        name: 'ML Engineers StarCoder Policy',
        phase: 'Active',
        groups: ['ml-engineers'],
      },
    ],
  },
  {
    id: 'qwen-2.5-coder-32b-instruct-extra-long-variant-finetuned',
    name: 'qwen-2.5-coder-32b-instruct-extra-long-variant-finetuned-on-enterprise-data',
    modelId: 'maas-vllm-inference-4/alibaba-cloud/qwen/qwen-2.5-coder-32b-instruct-enterprise-ft-v2-20250601',
    description: 'Short desc.',
    project: 'ai-models',
    status: 'unconfigured',
    subscriptions: [],
    policies: [],
  },
  {
    id: 'gpt-neo-125m',
    name: 'gpt-neo-125m',
    modelId: 'maas-vllm-inference-1/eleutherai/gpt-neo-125m',
    description: 'EleutherAI GPT-Neo 125M — lightweight open-source autoregressive language model for experimentation, prototyping, and low-resource environments where inference cost and latency must be minimized.',
    project: 'ml-serving',
    status: 'subscription-only',
    subscriptions: [
      {
        id: 'sub-interns-neo',
        name: 'Interns GPT-Neo Access',
        phase: 'Active',
        priority: 1,
        groups: ['interns'],
        tokenLimits: [
          { tokens: 500, per: 1, unit: 'minute' },
        ],
      },
    ],
    policies: [],
  },
  {
    id: 'deepseek-coder-v2-lite',
    name: 'deepseek-coder-v2-lite-instruct',
    modelId: 'maas-vllm-inference-5/deepseek-ai/deepseek-coder-v2-lite-instruct-awq-quantized-4bit-128g',
    description: 'DeepSeek Coder V2 Lite Instruct (AWQ 4-bit quantized, 128 group size) — high-efficiency code generation model optimized for constrained GPU environments with minimal quality loss from quantization. Supports 338 programming languages.',
    project: 'ai-models',
    status: 'fully-configured',
    subscriptions: [
      {
        id: 'sub-platform-deepseek',
        name: 'Platform DeepSeek Access',
        phase: 'Active',
        priority: 5,
        groups: ['data-science-team', 'ml-engineers'],
        tokenLimits: [
          { tokens: 1000, per: 1, unit: 'minute' },
          { tokens: 30000, per: 1, unit: 'hour' },
        ],
      },
    ],
    policies: [
      {
        id: 'pol-platform-all',
        name: 'Platform Wide Access',
        phase: 'Active',
        groups: ['data-science-team', 'ml-engineers', 'analytics-team', 'contractors'],
      },
    ],
  },
];

export const mockGovernanceGroups: GovernanceGroup[] = [
  {
    id: 'grp-data-science',
    name: 'data-science-team',
    modelCount: 3,
    subscriptionCount: 2,
    policyCount: 2,
    models: [
      {
        modelId: 'granite-3b-code-instruct',
        modelName: 'granite-3b-code-instruct',
        subscriptions: [{ id: 'sub-ds-granite', name: 'Data Science Granite Access', phase: 'Active', priority: 10, groups: ['data-science-team', 'ml-engineers'], tokenLimits: [{ tokens: 50000, per: 1, unit: 'day' }] }],
        policies: [{ id: 'pol-platform-all', name: 'Platform Wide Access', phase: 'Active', groups: ['data-science-team', 'ml-engineers', 'analytics-team', 'contractors'] }],
        status: 'fully-configured',
      },
      {
        modelId: 'llama-3-70b-instruct',
        modelName: 'llama-3-70b-instruct',
        subscriptions: [{ id: 'sub-ds-llama', name: 'Data Science Llama Access', phase: 'Active', priority: 10, groups: ['data-science-team'], tokenLimits: [{ tokens: 25000, per: 1, unit: 'day' }] }],
        policies: [{ id: 'pol-ds-llama', name: 'Data Science Llama Policy', phase: 'Active', groups: ['data-science-team'] }],
        status: 'fully-configured',
      },
      {
        modelId: 'granite-code-20b',
        modelName: 'granite-code-20b',
        subscriptions: [],
        policies: [{ id: 'pol-platform-all', name: 'Platform Wide Access', phase: 'Active', groups: ['data-science-team', 'ml-engineers', 'analytics-team', 'contractors'] }],
        status: 'policy-only',
      },
    ],
  },
  {
    id: 'grp-analytics',
    name: 'analytics-team',
    modelCount: 2,
    subscriptionCount: 1,
    policyCount: 1,
    models: [
      {
        modelId: 'granite-3b-code-instruct',
        modelName: 'granite-3b-code-instruct',
        subscriptions: [{ id: 'sub-analytics-granite', name: 'Analytics Granite Limited', phase: 'Active', priority: 5, groups: ['analytics-team'], tokenLimits: [{ tokens: 10000, per: 1, unit: 'day' }] }],
        policies: [{ id: 'pol-platform-all', name: 'Platform Wide Access', phase: 'Active', groups: ['data-science-team', 'ml-engineers', 'analytics-team', 'contractors'] }],
        status: 'fully-configured',
      },
      {
        modelId: 'granite-code-20b',
        modelName: 'granite-code-20b',
        subscriptions: [],
        policies: [{ id: 'pol-platform-all', name: 'Platform Wide Access', phase: 'Active', groups: ['data-science-team', 'ml-engineers', 'analytics-team', 'contractors'] }],
        status: 'policy-only',
      },
    ],
  },
  {
    id: 'grp-ml-engineers',
    name: 'ml-engineers',
    modelCount: 3,
    subscriptionCount: 2,
    policyCount: 2,
    models: [
      {
        modelId: 'granite-3b-code-instruct',
        modelName: 'granite-3b-code-instruct',
        subscriptions: [{ id: 'sub-ds-granite', name: 'Data Science Granite Access', phase: 'Active', priority: 10, groups: ['data-science-team', 'ml-engineers'], tokenLimits: [{ tokens: 50000, per: 1, unit: 'day' }] }],
        policies: [{ id: 'pol-platform-all', name: 'Platform Wide Access', phase: 'Active', groups: ['data-science-team', 'ml-engineers', 'analytics-team', 'contractors'] }],
        status: 'fully-configured',
      },
      {
        modelId: 'granite-code-20b',
        modelName: 'granite-code-20b',
        subscriptions: [],
        policies: [{ id: 'pol-platform-all', name: 'Platform Wide Access', phase: 'Active', groups: ['data-science-team', 'ml-engineers', 'analytics-team', 'contractors'] }],
        status: 'policy-only',
      },
      {
        modelId: 'starcoder2-15b',
        modelName: 'starcoder2-15b',
        subscriptions: [{ id: 'sub-ml-eng-star', name: 'ML Engineers StarCoder', phase: 'Active', priority: 10, groups: ['ml-engineers'], tokenLimits: [{ tokens: 100000, per: 1, unit: 'day' }] }],
        policies: [{ id: 'pol-ml-star', name: 'ML Engineers StarCoder Policy', phase: 'Active', groups: ['ml-engineers'] }],
        status: 'fully-configured',
      },
    ],
  },
  {
    id: 'grp-contractors',
    name: 'contractors',
    modelCount: 3,
    subscriptionCount: 1,
    policyCount: 1,
    models: [
      {
        modelId: 'granite-3b-code-instruct',
        modelName: 'granite-3b-code-instruct',
        subscriptions: [],
        policies: [{ id: 'pol-platform-all', name: 'Platform Wide Access', phase: 'Active', groups: ['data-science-team', 'ml-engineers', 'analytics-team', 'contractors'] }],
        status: 'policy-only',
      },
      {
        modelId: 'mistral-7b-instruct',
        modelName: 'mistral-7b-instruct',
        subscriptions: [{ id: 'sub-contractors-mistral', name: 'Contractors Mistral Budget', phase: 'Active', priority: 0, groups: ['contractors'], tokenLimits: [{ tokens: 2000, per: 1, unit: 'day' }] }],
        policies: [],
        status: 'subscription-only',
      },
      {
        modelId: 'granite-code-20b',
        modelName: 'granite-code-20b',
        subscriptions: [],
        policies: [{ id: 'pol-platform-all', name: 'Platform Wide Access', phase: 'Active', groups: ['data-science-team', 'ml-engineers', 'analytics-team', 'contractors'] }],
        status: 'policy-only',
      },
    ],
  },
  {
    id: 'grp-marketing',
    name: 'marketing-analytics',
    modelCount: 0,
    subscriptionCount: 0,
    policyCount: 0,
    models: [],
  },
];

export const mockSubscriptionsList: SubscriptionListItem[] = [
  {
    id: 'sub-enterprise-bundle',
    name: 'Enterprise Multi-Model Bundle',
    resourceName: 'enterprise-multi-model-bundle',
    description: 'Consolidated enterprise subscription covering primary inference models with differentiated rate limits per model',
    phase: 'Active',
    priority: 8,
    groups: ['platform-admins', 'data-science-team', 'ml-engineers', 'analytics-team', 'qa-engineers', 'devops-team', 'security-reviewers', 'product-managers', 'release-managers', 'frontend-engineers', 'backend-services', 'compliance-team'],
    models: ['granite-3b-code-instruct', 'gpt-4-turbo-ext', 'llama-3-70b-instruct', 'claude-sonnet-ext', 'mistral-7b-instruct', 'gemini-pro-ext', 'starcoder2-15b'],
    tokenLimits: {
      'granite-3b-code-instruct': [
        { tokens: 2000, per: 1, unit: 'minute' },
        { tokens: 80000, per: 1, unit: 'hour' },
        { tokens: 600000, per: 1, unit: 'day' },
      ],
      'gpt-4-turbo-ext': [
        { tokens: 1000, per: 1, unit: 'minute' },
        { tokens: 30000, per: 1, unit: 'hour' },
      ],
      'llama-3-70b-instruct': [
        { tokens: 500, per: 1, unit: 'minute' },
        { tokens: 15000, per: 1, unit: 'hour' },
      ],
      'claude-sonnet-ext': [
        { tokens: 800, per: 1, unit: 'minute' },
        { tokens: 25000, per: 1, unit: 'hour' },
      ],
      'mistral-7b-instruct': [
        { tokens: 1000, per: 1, unit: 'minute' },
      ],
      'gemini-pro-ext': [
        { tokens: 1500, per: 1, unit: 'minute' },
        { tokens: 50000, per: 1, unit: 'hour' },
      ],
      'starcoder2-15b': [
        { tokens: 2500, per: 1, unit: 'minute' },
        { tokens: 100000, per: 1, unit: 'hour' },
        { tokens: 700000, per: 1, unit: 'day' },
        { tokens: 4000, per: 10, unit: 'minute' },
      ],
    },
    dateCreated: new Date('2026-04-02T18:12:02'),
    lastModified: new Date('2026-05-28T10:15:00'),
  },
  {
    id: 'sub-ds-granite',
    name: 'Data Science Granite Access',
    resourceName: 'data-science-granite-access',
    description: 'Primary access subscription for data science team to Granite models',
    phase: 'Active',
    priority: 10,
    groups: [
      'data-science-team', 'ml-engineers', 'analytics-team', 'platform-admins', 'qa-engineers',
      'devops-team', 'security-reviewers', 'product-managers', 'release-managers', 'frontend-engineers',
      'backend-services', 'compliance-team', 'contractors', 'marketing-analytics', 'research-interns',
      'infrastructure-ops', 'cloud-architects', 'database-admins', 'site-reliability-eng', 'mobile-dev-team',
      'ai-ethics-board', 'technical-writers', 'support-engineers', 'solutions-architects', 'data-governance',
      'network-security', 'performance-testing', 'ux-research-team', 'api-platform-team', 'model-ops-team',
      'cost-optimization', 'incident-response', 'change-management', 'capacity-planning', 'audit-team',
      'vendor-management', 'training-enablement', 'partner-integrations', 'customer-success', 'executive-sponsors',
    ],
    models: [
      'granite-3b-code-instruct', 'gpt-4-turbo-ext', 'llama-3-70b-instruct', 'claude-sonnet-ext',
      'mistral-7b-instruct', 'gemini-pro-ext', 'granite-code-20b', 'cohere-command-ext',
      'codellama-34b', 'phi-3-mini', 'starcoder2-15b', 'qwen-2.5-coder-32b-instruct-extra-long-variant-finetuned',
      'gpt-neo-125m', 'deepseek-coder-v2-lite', 'mistral-large-ext',
      'falcon-40b', 'mixtral-8x7b', 'yi-34b',
      'llama-3-8b', 'granite-8b-code', 'jamba-instruct', 'command-r-plus',
    ],
    tokenLimits: { 'granite-3b-code-instruct': [
      { tokens: 1500, per: 1, unit: 'minute' },
      { tokens: 50000, per: 1, unit: 'hour' },
      { tokens: 500000, per: 1, unit: 'day' },
    ] },
    dateCreated: new Date('2025-11-15'),
    lastModified: new Date('2026-04-10T09:22:00'),
  },
  {
    id: 'sub-analytics-granite',
    name: 'Analytics Granite Limited',
    resourceName: 'analytics-granite-limited',
    description: 'Limited access for analytics team — cost-controlled',
    phase: 'Active',
    priority: 5,
    groups: ['analytics-team'],
    models: ['granite-3b-code-instruct'],
    tokenLimits: { 'granite-3b-code-instruct': [
      { tokens: 500, per: 1, unit: 'minute' },
      { tokens: 10000, per: 1, unit: 'hour' },
      { tokens: 80000, per: 1, unit: 'day' },
    ] },
    dateCreated: new Date('2025-12-01'),
    lastModified: new Date('2026-03-18T14:05:00'),
  },
  {
    id: 'sub-ds-llama',
    name: 'Data Science Llama Access',
    resourceName: 'data-science-llama-access',
    description: '',
    phase: 'Active',
    priority: 10,
    groups: ['data-science-team'],
    models: ['llama-3-70b-instruct'],
    tokenLimits: { 'llama-3-70b-instruct': [
      { tokens: 2000, per: 1, unit: 'minute' },
      { tokens: 25000, per: 1, unit: 'hour' },
      { tokens: 200000, per: 1, unit: 'day' },
    ] },
    dateCreated: new Date('2026-01-10'),
    lastModified: new Date('2026-01-10'),
  },
  {
    id: 'sub-contractors-mistral',
    name: 'Contractors Mistral Budget',
    resourceName: 'contractors-mistral-budget',
    description: 'Restricted budget for contractor team — Mistral 7B only',
    phase: 'Active',
    priority: 0,
    groups: ['contractors'],
    models: ['mistral-7b-instruct'],
    tokenLimits: { 'mistral-7b-instruct': [
      { tokens: 100, per: 1, unit: 'minute' },
      { tokens: 2000, per: 1, unit: 'hour' },
      { tokens: 15000, per: 1, unit: 'day' },
    ] },
    dateCreated: new Date('2026-02-20'),
    lastModified: new Date('2026-05-01T11:30:00'),
  },
  {
    id: 'sub-ml-eng-star',
    name: 'ML Engineers StarCoder',
    resourceName: 'ml-engineers-starcoder',
    description: '',
    phase: 'Active',
    priority: 10,
    groups: ['ml-engineers'],
    models: ['starcoder2-15b'],
    tokenLimits: { 'starcoder2-15b': [
      { tokens: 3000, per: 1, unit: 'minute' },
      { tokens: 120000, per: 1, unit: 'hour' },
      { tokens: 800000, per: 1, unit: 'day' },
      { tokens: 5000, per: 10, unit: 'minute' },
    ] },
    dateCreated: new Date('2026-03-05'),
    lastModified: new Date('2026-05-20T16:45:00'),
  },
  {
    id: 'sub-intern-starter',
    name: 'Intern Starter Pack',
    resourceName: 'intern-starter-pack',
    description: 'Lightweight access for interns — limited to small models for experimentation',
    phase: 'Pending',
    priority: 1,
    groups: ['interns'],
    models: ['gpt-neo-125m', 'phi-3-mini'],
    tokenLimits: {
      'gpt-neo-125m': [
        { tokens: 200, per: 1, unit: 'minute' },
      ],
      'phi-3-mini': [
        { tokens: 300, per: 1, unit: 'minute' },
      ],
    },
    dateCreated: new Date('2026-04-02T18:12:09'),
    lastModified: new Date('2026-04-02T18:12:09'),
  },
  {
    id: 'sub-experimental-codegen',
    name: 'Experimental Code Generation Access',
    resourceName: 'experimental-codegen-access',
    description: 'Broad experimental access to code generation models for evaluation across all teams',
    phase: 'Failed',
    priority: 3,
    groups: ['ml-engineers', 'data-science-team', 'analytics-team', 'contractors', 'interns', 'marketing-analytics'],
    models: ['codellama-34b', 'deepseek-coder-v2-lite', 'starcoder2-15b'],
    tokenLimits: {
      'codellama-34b': [
        { tokens: 500, per: 1, unit: 'minute' },
        { tokens: 10000, per: 1, unit: 'hour' },
      ],
      'deepseek-coder-v2-lite': [
        { tokens: 800, per: 1, unit: 'minute' },
        { tokens: 20000, per: 1, unit: 'hour' },
      ],
      'starcoder2-15b': [
        { tokens: 600, per: 1, unit: 'minute' },
        { tokens: 15000, per: 1, unit: 'hour' },
      ],
    },
    dateCreated: new Date('2026-04-02T18:12:15'),
    lastModified: new Date('2026-04-15T08:00:00'),
  },
  {
    id: 'sub-legacy-contractor-cleanup',
    name: 'Legacy Contractor Cleanup',
    resourceName: 'legacy-contractor-cleanup',
    description: 'Deprecated contractor subscription being removed — migrated to enterprise bundle',
    phase: 'Deleting',
    priority: 0,
    groups: ['contractors'],
    models: ['mistral-7b-instruct'],
    tokenLimits: {
      'mistral-7b-instruct': [
        { tokens: 50, per: 1, unit: 'minute' },
        { tokens: 500, per: 1, unit: 'hour' },
        { tokens: 5000, per: 1, unit: 'day' },
      ],
    },
    dateCreated: new Date('2025-09-15T14:30:00'),
    lastModified: new Date('2026-05-30T22:00:00'),
  },
  {
    id: 'sub-auditor-readonly',
    name: 'Auditor Read-Only Access',
    resourceName: 'auditor-readonly-access',
    description: 'Read-only model access for external auditors — subscription created but no matching authorization policy exists',
    phase: 'Degraded',
    priority: 1,
    groups: ['external-auditors'],
    models: ['granite-3b-code-instruct', 'mistral-7b-instruct'],
    tokenLimits: {
      'granite-3b-code-instruct': [
        { tokens: 100, per: 1, unit: 'minute' },
        { tokens: 1000, per: 1, unit: 'day' },
      ],
      'mistral-7b-instruct': [
        { tokens: 50, per: 1, unit: 'minute' },
        { tokens: 500, per: 1, unit: 'day' },
      ],
    },
    dateCreated: new Date('2026-05-20T10:00:00'),
    lastModified: new Date('2026-05-20T10:00:00'),
  },
];

export const mockAuthPoliciesList: AuthPolicyListItem[] = [
  {
    id: 'pol-platform-all',
    name: 'Platform Wide Access',
    resourceName: 'platform-wide-access',
    description: 'Broad gateway access for all approved platform teams. Security-reviewed quarterly.',
    phase: 'Active',
    groups: ['data-science-team', 'ml-engineers', 'analytics-team', 'contractors'],
    models: ['granite-3b-code-instruct', 'gpt-4-turbo-ext', 'granite-code-20b', 'gemini-pro-ext'],
    dateCreated: new Date('2025-10-01'),
    lastModified: new Date('2026-04-20T13:10:00'),
  },
  {
    id: 'pol-ds-llama',
    name: 'Data Science Llama Policy',
    resourceName: 'data-science-llama-policy',
    description: 'Gateway access for data science team to Llama 3 70B',
    phase: 'Active',
    groups: ['data-science-team'],
    models: ['llama-3-70b-instruct', 'claude-sonnet-ext'],
    dateCreated: new Date('2026-01-10'),
    lastModified: new Date('2026-01-10'),
  },
  {
    id: 'pol-ml-star',
    name: 'ML Engineers StarCoder Policy',
    resourceName: 'ml-engineers-starcoder-policy',
    description: '',
    phase: 'Unhealthy',
    groups: ['ml-engineers'],
    models: ['starcoder2-15b'],
    dateCreated: new Date('2026-03-05'),
    lastModified: new Date('2026-05-12T09:30:00'),
  },
  {
    id: 'pol-enterprise-inference',
    name: 'Enterprise Inference Gateway',
    resourceName: 'enterprise-inference-gateway',
    description: 'Centralized gateway policy for primary enterprise inference models — reviewed quarterly by platform security',
    phase: 'Pending',
    groups: ['data-science-team', 'ml-engineers', 'platform-admins'],
    models: ['granite-3b-code-instruct', 'llama-3-70b-instruct', 'mistral-7b-instruct', 'starcoder2-15b', 'granite-code-20b', 'cohere-command-ext', 'mistral-large-ext'],
    dateCreated: new Date('2026-04-02T18:12:22'),
    lastModified: new Date('2026-04-02T18:12:22'),
  },
  {
    id: 'pol-intern-sandbox',
    name: 'Intern Sandbox Policy',
    resourceName: 'intern-sandbox-policy',
    description: '',
    phase: 'Failed',
    groups: ['interns'],
    models: ['gpt-neo-125m', 'phi-3-mini'],
    dateCreated: new Date('2026-04-02T18:12:29'),
    lastModified: new Date('2026-04-18T07:45:00'),
  },
  {
    id: 'pol-all-teams-codegen',
    name: 'All Teams Code Generation Policy',
    resourceName: 'all-teams-codegen-policy',
    description: 'Organization-wide code generation policy covering all teams and code-focused models',
    phase: 'Active',
    groups: ['data-science-team', 'ml-engineers', 'analytics-team', 'contractors', 'interns', 'platform-admins', 'marketing-analytics'],
    models: ['codellama-34b', 'deepseek-coder-v2-lite', 'starcoder2-15b', 'qwen-2.5-coder-32b-instruct-extra-long-variant-finetuned'],
    dateCreated: new Date('2026-04-02T18:12:38'),
    lastModified: new Date('2026-05-25T15:20:00'),
  },
  {
    id: 'pol-partner-devs',
    name: 'Partner Developer Access',
    resourceName: 'partner-developer-access',
    description: 'Authorization policy for partner developers — policy created but no matching subscription with rate limits exists',
    phase: 'Unknown',
    groups: ['partner-devs'],
    models: ['granite-3b-code-instruct', 'llama-3-70b-instruct'],
    dateCreated: new Date('2026-05-22T09:00:00'),
    lastModified: new Date('2026-05-22T09:00:00'),
  },
  {
    id: 'pol-research-gemma',
    name: 'Research Team Gemma Policy',
    resourceName: 'research-team-gemma-policy',
    description: 'Authorization policy for research team to access Gemma 7B — no subscription with rate limits has been created yet',
    phase: 'Active',
    groups: ['data-science-team', 'research-interns'],
    models: ['gemma-7b'],
    dateCreated: new Date('2026-06-01T14:00:00'),
    lastModified: new Date('2026-06-01T14:00:00'),
  },
];

// --- Mutable store operations ---

let _dataVersion = 0;
export const getDataVersion = (): number => _dataVersion;

export const addSubscriptionToStore = (sub: SubscriptionListItem): void => {
  mockSubscriptionsList.push(sub);
  _dataVersion++;
};

export const addAuthPolicyToStore = (pol: AuthPolicyListItem): void => {
  mockAuthPoliciesList.push(pol);
  _dataVersion++;
};

export const deleteSubscriptionFromStore = (id: string): void => {
  const idx = mockSubscriptionsList.findIndex((s) => s.id === id);
  if (idx >= 0) {mockSubscriptionsList.splice(idx, 1);}
  _dataVersion++;
};

export const deleteAuthPolicyFromStore = (id: string): void => {
  const idx = mockAuthPoliciesList.findIndex((p) => p.id === id);
  if (idx >= 0) {mockAuthPoliciesList.splice(idx, 1);}
  _dataVersion++;
};

export const removeGroupFromSubscription = (subId: string, groupName: string): void => {
  const sub = mockSubscriptionsList.find((s) => s.id === subId);
  if (sub) {
    sub.groups = sub.groups.filter((g) => g !== groupName);
    _dataVersion++;
  }
};

export const removeGroupFromPolicy = (polId: string, groupName: string): void => {
  const pol = mockAuthPoliciesList.find((p) => p.id === polId);
  if (pol) {
    pol.groups = pol.groups.filter((g) => g !== groupName);
    _dataVersion++;
  }
};

// --- Dynamic computation from mutable store ---

interface BaseModel {
  id: string;
  name: string;
  modelId: string;
  description: string;
  project: string;
  source?: 'internal' | 'external';
  providerSecret?: { name: string; namespace: string };
}

const baseModels: BaseModel[] = [
  { id: 'granite-3b-code-instruct', name: 'granite-3b-code-instruct', modelId: 'maas-vllm-inference-1/ibm/granite-3b-code-instruct', description: 'IBM Granite 3B Code Instruct model for code generation, completion, and instruction following tasks. Optimized for enterprise development workflows.', project: 'ai-models' },
  { id: 'gpt-4-turbo-ext', name: 'gpt-4-turbo', modelId: 'external/openai-prod/gpt-4-turbo', description: 'OpenAI GPT-4 Turbo — multi-provider with Azure failover.', project: 'sample-g', source: 'external', providerSecret: { name: 'openai-api-key', namespace: 'sample-g' } },
  { id: 'nomic-embed-text', name: 'nomic-embed-text-v1.5', modelId: 'maas-vllm-inference-2/nomic-ai/nomic-embed-text-v1.5', description: 'Nomic Embed Text v1.5 — open embedding model. Recently deployed, not yet assigned to any subscription or policy.', project: 'ai-models' },
  { id: 'llama-3-70b-instruct', name: 'llama-3-70b-instruct', modelId: 'maas-vllm-inference-2/meta/llama-3-70b-instruct', description: 'Meta Llama 3 70B Instruct — large-scale instruction-tuned model for complex reasoning, summarization, and multi-turn dialogue.', project: 'ml-serving' },
  { id: 'claude-sonnet-ext', name: 'claude-sonnet-4', modelId: 'external/anthropic-prod/claude-sonnet-4-20250514', description: 'Anthropic Claude Sonnet 4 via external provider.', project: 'sample-g', source: 'external', providerSecret: { name: 'anthropic-api-key', namespace: 'sample-g' } },
  { id: 'whisper-large-v3', name: 'whisper-large-v3', modelId: 'maas-vllm-inference-3/openai/whisper-large-v3', description: 'OpenAI Whisper Large V3 — speech recognition model deployed for transcription tasks. Pending governance configuration.', project: 'ml-serving' },
  { id: 'mistral-7b-instruct', name: 'mistral-7b-instruct', modelId: 'maas-vllm-inference-1/mistralai/mistral-7b-instruct-v0.3', description: 'Mistral 7B Instruct v0.3 — efficient instruction-following model with strong performance for text generation and Q&A tasks.', project: 'ai-models' },
  { id: 'gemini-pro-ext', name: 'gemini-1.5-pro', modelId: 'external/google-vertex/gemini-1.5-pro', description: 'Google Gemini 1.5 Pro — advanced multimodal model with 1M token context window via Vertex AI.', project: 'ai-models', source: 'external', providerSecret: { name: 'vertex-ai-credentials', namespace: 'ai-models' } },
  { id: 'falcon-40b', name: 'falcon-40b-instruct', modelId: 'maas-vllm-inference-3/tii/falcon-40b-instruct', description: 'TII Falcon 40B Instruct — subscription exists but no authorization policy has been created yet.', project: 'ai-models' },
  { id: 'gemma-7b', name: 'gemma-7b-it', modelId: 'maas-vllm-inference-2/google/gemma-7b-it', description: 'Google Gemma 7B IT — authorization policy exists but no subscription has been created (no rate limits defined).', project: 'ai-models' },
  { id: 'cohere-command-ext', name: 'command-r-plus-ext', modelId: 'external/cohere-prod/command-r-plus-08-2024', description: 'Cohere Command R+ via external API — optimized for enterprise RAG and tool-use scenarios.', project: 'ml-serving', source: 'external', providerSecret: { name: 'cohere-api-key', namespace: 'ml-serving' } },
  { id: 'granite-code-20b', name: 'granite-code-20b', modelId: 'maas-llmd-inference-1/ibm/granite-code-20b', description: 'IBM Granite Code 20B — enterprise-grade code generation model supporting 116 programming languages with fill-in-the-middle capability.', project: 'ai-models' },
  { id: 'codellama-34b', name: 'codellama-34b-instruct', modelId: 'maas-vllm-inference-3/meta/codellama-34b-instruct', description: '', project: 'ml-serving' },
  { id: 'phi-3-mini', name: 'phi-3-mini-4k-instruct', modelId: 'maas-vllm-inference-2/microsoft/phi-3-mini-4k-instruct', description: '', project: 'ai-models' },
  { id: 'starcoder2-15b', name: 'starcoder2-15b', modelId: 'maas-vllm-inference-3/bigcode/starcoder2-15b', description: 'BigCode StarCoder2 15B — open code LLM trained on The Stack v2 for code completion and generation across multiple languages.', project: 'ml-serving' },
  { id: 'qwen-2.5-coder-32b-instruct-extra-long-variant-finetuned', name: 'qwen-2.5-coder-32b-instruct-extra-long-variant-finetuned-on-enterprise-data', modelId: 'maas-vllm-inference-4/alibaba-cloud/qwen/qwen-2.5-coder-32b-instruct-enterprise-ft-v2-20250601', description: 'Short desc.', project: 'ai-models' },
  { id: 'gpt-neo-125m', name: 'gpt-neo-125m', modelId: 'maas-vllm-inference-1/eleutherai/gpt-neo-125m', description: 'EleutherAI GPT-Neo 125M — lightweight open-source autoregressive language model for experimentation, prototyping, and low-resource environments where inference cost and latency must be minimized.', project: 'ml-serving' },
  { id: 'deepseek-coder-v2-lite', name: 'deepseek-coder-v2-lite-instruct', modelId: 'maas-vllm-inference-5/deepseek-ai/deepseek-coder-v2-lite-instruct-awq-quantized-4bit-128g', description: 'DeepSeek Coder V2 Lite Instruct (AWQ 4-bit quantized, 128 group size) — high-efficiency code generation model optimized for constrained GPU environments with minimal quality loss from quantization. Supports 338 programming languages.', project: 'ai-models' },
  { id: 'mistral-large-ext', name: 'mistral-large-2', modelId: 'external/mistral-api/mistral-large-2407', description: 'Mistral Large 2 via Mistral API — 123B parameter flagship model for complex reasoning and multilingual tasks.', project: 'ml-serving', source: 'external', providerSecret: { name: 'mistral-api-key', namespace: 'ml-serving' } },
  { id: 'mixtral-8x7b', name: 'mixtral-8x7b-instruct', modelId: 'maas-vllm-inference-4/mistralai/mixtral-8x7b-instruct-v0.1', description: 'Mistral Mixtral 8x7B MoE.', project: 'ml-serving' },
  { id: 'yi-34b', name: 'yi-34b-chat', modelId: 'maas-vllm-inference-5/01-ai/yi-34b-chat', description: '01.AI Yi 34B Chat.', project: 'ai-models' },
  { id: 'llama-3-8b', name: 'llama-3-8b-instruct', modelId: 'maas-vllm-inference-1/meta/llama-3-8b-instruct', description: 'Meta Llama 3 8B Instruct.', project: 'ml-serving' },
  { id: 'granite-8b-code', name: 'granite-8b-code-instruct', modelId: 'maas-vllm-inference-2/ibm/granite-8b-code-instruct', description: 'IBM Granite 8B Code Instruct.', project: 'ai-models' },
  { id: 'jamba-instruct', name: 'jamba-1.5-mini', modelId: 'maas-vllm-inference-3/ai21/jamba-1.5-mini', description: 'AI21 Jamba 1.5 Mini.', project: 'ai-models' },
  { id: 'command-r-plus', name: 'command-r-plus', modelId: 'maas-vllm-inference-4/cohere/command-r-plus', description: 'Cohere Command R+.', project: 'ml-serving' },
];

export const computeGovernanceModels = (): GovernanceModel[] =>
  baseModels.map((bm) => {
    const subs: SubscriptionRef[] = mockSubscriptionsList
      .filter((s) => s.models.includes(bm.id))
      .map((s) => ({
        id: s.id,
        name: s.name,
        phase: s.phase,
        priority: s.priority,
        groups: s.groups,
        tokenLimits: s.tokenLimits[bm.id] || [],
      }));
    const pols: AuthPolicyRef[] = mockAuthPoliciesList
      .filter((p) => p.models.includes(bm.id))
      .map((p) => ({
        id: p.id,
        name: p.name,
        phase: p.phase,
        groups: p.groups,
      }));
    return {
      ...bm,
      source: bm.source || 'internal',
      status: getStatus(subs.length > 0, pols.length > 0),
      subscriptions: subs,
      policies: pols,
    };
  });

const originalGroupNames = ['data-science-team', 'analytics-team', 'ml-engineers', 'contractors', 'external-auditors', 'partner-devs', 'marketing-analytics'];

export const computeGovernanceGroups = (): GovernanceGroup[] => {
  const allGroupNames = new Set<string>(originalGroupNames);
  mockSubscriptionsList.forEach((s) => s.groups.forEach((g) => allGroupNames.add(g)));
  mockAuthPoliciesList.forEach((p) => p.groups.forEach((g) => allGroupNames.add(g)));

  const models = computeGovernanceModels();

  return [...allGroupNames].map((groupName) => {
    const groupModels = models
      .filter(
        (m) =>
          m.subscriptions.some((s) => s.groups.includes(groupName)) ||
          m.policies.some((p) => p.groups.includes(groupName)),
      )
      .map((m) => ({
        modelId: m.id,
        modelName: m.name,
        subscriptions: m.subscriptions.filter((s) => s.groups.includes(groupName)),
        policies: m.policies.filter((p) => p.groups.includes(groupName)),
        status: getStatus(
          m.subscriptions.some((s) => s.groups.includes(groupName)),
          m.policies.some((p) => p.groups.includes(groupName)),
        ),
      }));

    const subNames = new Set<string>();
    const polNames = new Set<string>();
    groupModels.forEach((gm) => {
      gm.subscriptions.forEach((s) => subNames.add(s.name));
      gm.policies.forEach((p) => polNames.add(p.name));
    });

    return {
      id: `grp-${groupName}`,
      name: groupName,
      modelCount: groupModels.length,
      subscriptionCount: subNames.size,
      policyCount: polNames.size,
      models: groupModels,
    };
  });
};
