import type { Subscription } from './types';
import { maasGovernanceIdentities } from '../../../../../vision/legacyModelInstanceSeed';
import { NORTH_SUMMIT_SUBSCRIPTION_TIERS } from '../../../../../vision/maasSubscriptionTiers';
import { getMockSubscriptionsList } from '../../../../tenant-admin/ai/maas-governance/mockData';

// Generate YAML for a subscription
const generateSubscriptionYAML = (subscription: Subscription): string => {
  const modelRefsYAML = subscription.modelRefs.map(ref => {
    const tokenLimit = Array.isArray(ref.tokenRateLimits) ? ref.tokenRateLimits[0] : ref.tokenRateLimits;
    return `    - name: ${ref.name}
      tokenRateLimits:
        limit: ${tokenLimit.limit}
        window: ${tokenLimit.window}`;
  }).join('\n');

  const groupsYAML = subscription.owner.groups.map(g => `      - name: "${g.name}"`).join('\n');

  return `apiVersion: maas.opendatahub.io/v1alpha1
kind: MaaSSubscription
metadata:
  name: ${subscription.name}
  namespace: opendatahub
spec:
  displayName: "${subscription.displayName}"
  priority: ${subscription.priority}
  owner:
    groups:
${groupsYAML}
  modelRefs:
${modelRefsYAML}
status:
  phase: ${subscription.status}`;
};

// Available groups (shared with Tiers for consistency)
export const mockOwnerGroups = [
  { name: 'limited-users' },
  { name: 'standard-users' },
  { name: 'premium-users' },
  { name: 'acme-corp-ai-users' },
  { name: 'acme-data-science' },
  { name: 'enterprise-users' },
  { name: 'research-team' },
  { name: 'dev-team' },
];

// Available models (MaaSModel references) — same identities as MaaS governance.
export const mockMaaSModels = maasGovernanceIdentities().map((item) => ({
  id: item.maasModelRefId,
  name: item.displayName,
  provider: item.locationKind === 'off-platform' ? 'External' : 'Internal',
  namespace: item.projectName,
  description: item.description,
}));

const northSummitTierIds = new Set(
  NORTH_SUMMIT_SUBSCRIPTION_TIERS.map((tier) => `sub-nsb-${tier.id}`),
);
const apiKeyModelRefIds = new Set(mockMaaSModels.map((model) => model.id));
const governanceToApiKeyModelRefId: Record<string, string> = {
  'granite-3b': 'granite-3b-instruct',
};
const getApiKeyModelRefId = (modelId: string): string =>
  governanceToApiKeyModelRefId[modelId] ?? modelId;
const getLegacyWindow = (per: number, unit: 'minute' | 'hour' | 'day'): string => {
  const suffix = unit === 'minute' ? 'm' : unit === 'hour' ? 'h' : 'd';
  return `${per}${suffix}`;
};

// Use the same Limited, Standard, and Premium source data as MaaS governance in every view.
export const mockSubscriptions: Subscription[] = getMockSubscriptionsList()
  .filter((subscription) => northSummitTierIds.has(subscription.id))
  .map((subscription) => ({
    id: subscription.id,
    name: subscription.resourceName,
    displayName: subscription.name,
    description: subscription.description,
    priority: subscription.priority,
    status: subscription.phase === 'Active' ? 'Active' : 'Inactive',
    owner: { groups: subscription.groups.map((name) => ({ name })) },
    modelRefs: subscription.models.flatMap((modelId) => {
      const apiKeyModelRefId = getApiKeyModelRefId(modelId);
      if (!apiKeyModelRefIds.has(apiKeyModelRefId)) {
        return [];
      }

      return [
        {
          name: apiKeyModelRefId,
          tokenRateLimits: (subscription.tokenLimits[modelId] ?? []).map((limit) => ({
            limit: limit.tokens,
            window: getLegacyWindow(limit.per, limit.unit),
            perAmount: limit.per,
            perUnit: limit.unit,
          })),
        },
      ];
    }),
    dateCreated: subscription.dateCreated,
    createdBy: 'platform-admin',
  }));

// Populate YAML for each subscription
mockSubscriptions.forEach(subscription => {
  subscription.yaml = generateSubscriptionYAML(subscription);
});

/** Prototype: update priority in shared mock so list/detail/playground stay consistent. */
export const updateMockSubscriptionPriority = (id: string, priority: number): void => {
  const sub = mockSubscriptions.find((s) => s.id === id);
  if (sub) {
    sub.priority = priority;
    sub.yaml = generateSubscriptionYAML(sub);
  }
};

// Utility functions
export const getSubscriptionById = (id: string): Subscription | undefined =>
  mockSubscriptions.find(s => s.id === id);

export const getModelById = (id: string) =>
  mockMaaSModels.find(m => m.id === id);

export const getGroupByName = (name: string) =>
  mockOwnerGroups.find(g => g.name === name);

// Get priority label from priority number (1–10 scale; higher value = higher priority)
export const getPriorityLabel = (priority: number): string => {
  if (priority >= 9) {return 'Highest';}
  if (priority >= 7) {return 'High';}
  if (priority >= 5) {return 'Standard';}
  if (priority === 4) {return 'Elevated';}
  if (priority === 3) {return 'Fair';}
  if (priority === 2) {return 'Basic';}
  if (priority === 1) {return 'Minimal';}
  return 'Standard';
};

export interface RelatedPolicy {
  id: string;
  name: string;
  description: string;
  type: 'MaaS Auth Policy' | 'Token Rate Limit Policy';
}

export const mockRelatedPolicies: Record<string, RelatedPolicy[]> = {
  'sub-nsb-premium': [
    { id: 'north-summit-premium-access', name: 'Premium access policy', description: 'Authorization for North Summit Bank premium model access.', type: 'MaaS Auth Policy' },
    { id: 'premium-token-rate-limit', name: 'Premium Token Rate Limits', description: 'Maximum token limits for premium model access.', type: 'Token Rate Limit Policy' },
    { id: 'prod-rate-limit-high', name: 'Production Rate Limit High', description: 'High throughput for production workloads: 10K requests/minute, 500K tokens/minute', type: 'Token Rate Limit Policy' },
  ],
  'sub-nsb-standard': [
    { id: 'standard-token-rate-limit', name: 'Standard Token Rate Limits', description: 'Balanced token limits for general development and production.', type: 'Token Rate Limit Policy' },
  ],
  'sub-nsb-limited': [
    { id: 'limited-token-rate-limit', name: 'Limited Token Rate Limits', description: 'Lightweight access and reduced token limits for larger models.', type: 'Token Rate Limit Policy' },
  ],
};

export const getRelatedPolicies = (subscriptionId: string): RelatedPolicy[] =>
  mockRelatedPolicies[subscriptionId] || [];
