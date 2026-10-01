export const NORTH_SUMMIT_SUBSCRIPTION_TIERS = [
  {
    id: 'limited',
    label: 'Limited',
    groupName: 'limited-users',
    priority: 1,
    multiplier: 0.5,
    description:
      'Lightweight access limited to smaller models or reduced token rate limits for larger models.',
  },
  {
    id: 'standard',
    label: 'Standard',
    groupName: 'standard-users',
    priority: 2,
    multiplier: 1,
    description: 'Full model access with balanced rate limits for general development and production.',
  },
  {
    id: 'premium',
    label: 'Premium',
    groupName: 'premium-users',
    priority: 3,
    multiplier: 2,
    description:
      'Priority access to flagship models with maximum limits, provisioned throughput, and enterprise SLAs.',
  },
] as const;
