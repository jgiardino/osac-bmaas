import { maasGovernanceModelRows } from '../../../../vision/modelInstanceSeed';

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
  identityId: string;
  name: string;
  modelId: string;
  description: string;
  project: string;
  cluster: string;
  tenantId: string;
  tenantLabel: string;
  gateways: string[];
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

const IDS = {
  granite: 'granite-3b',
  mistral: 'mistral-7b',
  llama: 'llama-4-scout',
  titan: 'titan-express',
  claude: 'claude-sonnet-4',
} as const;

export const mockSubscriptionsList: SubscriptionListItem[] = [
  {
    id: 'sub-ds-granite',
    name: 'Data Science Granite Access',
    resourceName: 'data-science-granite-access',
    description: 'Primary North Summit Bank subscription for Granite 3B instruct.',
    phase: 'Active',
    priority: 10,
    groups: ['data-science-team', 'ml-engineers'],
    models: [IDS.granite],
    tokenLimits: {
      [IDS.granite]: [
        { tokens: 1500, per: 1, unit: 'minute' },
        { tokens: 50000, per: 1, unit: 'hour' },
        { tokens: 500000, per: 1, unit: 'day' },
      ],
    },
    dateCreated: new Date('2025-11-15'),
    lastModified: new Date('2026-04-10T09:22:00'),
  },
  {
    id: 'sub-analytics-granite',
    name: 'Analytics Granite Limited',
    resourceName: 'analytics-granite-limited',
    description: 'Cost-controlled Granite access for analytics.',
    phase: 'Active',
    priority: 5,
    groups: ['analytics-team'],
    models: [IDS.granite],
    tokenLimits: {
      [IDS.granite]: [
        { tokens: 500, per: 1, unit: 'minute' },
        { tokens: 10000, per: 1, unit: 'hour' },
        { tokens: 80000, per: 1, unit: 'day' },
      ],
    },
    dateCreated: new Date('2025-12-01'),
    lastModified: new Date('2026-03-18T14:05:00'),
  },
  {
    id: 'sub-nsb-mistral-titan',
    name: 'NSB lightweight and Bedrock access',
    resourceName: 'nsb-lightweight-bedrock-access',
    description: 'Mistral 7B and Titan Text Express for North Summit Bank teams.',
    phase: 'Active',
    priority: 8,
    groups: ['data-science-team', 'ml-engineers'],
    models: [IDS.mistral, IDS.titan],
    tokenLimits: {
      [IDS.mistral]: [
        { tokens: 800, per: 1, unit: 'minute' },
        { tokens: 20000, per: 1, unit: 'hour' },
        { tokens: 150000, per: 1, unit: 'day' },
      ],
      [IDS.titan]: [
        { tokens: 600, per: 1, unit: 'minute' },
        { tokens: 15000, per: 1, unit: 'hour' },
      ],
    },
    dateCreated: new Date('2026-02-20'),
    lastModified: new Date('2026-05-01T11:30:00'),
  },
  {
    id: 'sub-bsfg-llama',
    name: 'BlueSolace Llama access',
    resourceName: 'bluesolace-llama-access',
    description: 'Llama 4 Scout subscription. No authorization policy is assigned yet.',
    phase: 'Active',
    priority: 10,
    groups: ['data-science-team'],
    models: [IDS.llama],
    tokenLimits: {
      [IDS.llama]: [
        { tokens: 2000, per: 1, unit: 'minute' },
        { tokens: 25000, per: 1, unit: 'hour' },
        { tokens: 200000, per: 1, unit: 'day' },
      ],
    },
    dateCreated: new Date('2026-01-10'),
    lastModified: new Date('2026-01-10'),
  },
];

export const mockAuthPoliciesList: AuthPolicyListItem[] = [
  {
    id: 'pol-nsb-platform',
    name: 'NSB platform access',
    resourceName: 'nsb-platform-access',
    description: 'Authorization for Granite, Mistral, and Titan on North Summit Bank gateways.',
    phase: 'Active',
    groups: ['data-science-team', 'ml-engineers', 'analytics-team'],
    models: [IDS.granite, IDS.mistral, IDS.titan],
    dateCreated: new Date('2025-10-01'),
    lastModified: new Date('2026-04-20T13:10:00'),
  },
];

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

export const computeGovernanceModels = (): GovernanceModel[] =>
  maasGovernanceModelRows().map((row) => {
    const subs: SubscriptionRef[] = mockSubscriptionsList
      .filter((s) => s.models.includes(row.modelId))
      .map((s) => ({
        id: s.id,
        name: s.name,
        phase: s.phase,
        priority: s.priority,
        groups: s.groups,
        tokenLimits: s.tokenLimits[row.modelId] || [],
      }));
    const pols: AuthPolicyRef[] = mockAuthPoliciesList
      .filter((p) => p.models.includes(row.modelId))
      .map((p) => ({
        id: p.id,
        name: p.name,
        phase: p.phase,
        groups: p.groups,
      }));
    return {
      id: row.instanceId,
      identityId: row.modelId,
      name: row.displayName,
      modelId: row.maasModelRefId,
      description: row.description,
      project: row.projectName,
      cluster: row.clusterLabel,
      tenantId: row.tenantId,
      tenantLabel: row.tenantLabel,
      gateways: row.gatewayId ? [row.gatewayId] : [],
      source: row.locationKind === 'off-platform' ? 'external' : 'internal',
      status: getStatus(subs.length > 0, pols.length > 0),
      subscriptions: subs,
      policies: pols,
    };
  });

const originalGroupNames = ['data-science-team', 'analytics-team', 'ml-engineers'];

export const computeGovernanceGroups = (): GovernanceGroup[] => {
  const allGroupNames = new Set<string>(originalGroupNames);
  mockSubscriptionsList.forEach((s) => s.groups.forEach((g) => allGroupNames.add(g)));
  mockAuthPoliciesList.forEach((p) => p.groups.forEach((g) => allGroupNames.add(g)));

  const models = computeGovernanceModels();
  const uniqueModels = models.filter((model, index) =>
    models.findIndex((entry) => entry.identityId === model.identityId) === index,
  );

  return [...allGroupNames].map((groupName) => {
    const groupModels = uniqueModels
      .filter(
        (m) =>
          m.subscriptions.some((s) => s.groups.includes(groupName)) ||
          m.policies.some((p) => p.groups.includes(groupName)),
      )
      .map((m) => ({
        modelId: m.identityId,
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
