export type ProviderAdminNavId =
  | 'overview'
  | 'catalog'
  | 'services-baremetal'
  | 'services-clusters'
  | 'services-models'
  | 'services-virtual-machines'
  | 'genai-asset-endpoints'
  | 'genai-playground'
  | 'genai-api-keys'
  | 'ai-maas-governance'
  | 'ai-model-catalog-settings'
  | 'ai-admin-api-keys'
  | 'networking-virtual-networks'
  | 'networking-subnets'
  | 'networking-security-groups'
  | 'networking-external-ip-pools'
  | 'infrastructure-data-centers'
  | 'infrastructure-hardware-inventory'
  | 'infrastructure-bmaas-templates'
  | 'administration-organizations'
  | 'administration-quotas'
  | 'billing-metering'
  | 'system'

export type ProviderAdminNavItem = {
  id: ProviderAdminNavId
  label: string
}

export const PROVIDER_ADMIN_NAV_ITEMS: ProviderAdminNavItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'catalog', label: 'Catalog' },
  { id: 'billing-metering', label: 'Billing & metering' },
]

export const PROVIDER_ADMIN_SERVICES_NAV_ITEMS: ProviderAdminNavItem[] = [
  { id: 'services-baremetal', label: 'Bare metal' },
  { id: 'services-clusters', label: 'Clusters' },
  { id: 'services-models', label: 'Models' },
  { id: 'services-virtual-machines', label: 'Virtual machines' },
]

export const PROVIDER_ADMIN_GENAI_NAV_ITEMS: ProviderAdminNavItem[] = [
  { id: 'genai-asset-endpoints', label: 'AI asset endpoints' },
  { id: 'genai-playground', label: 'Playground' },
  { id: 'genai-api-keys', label: 'API keys' },
]

export const PROVIDER_ADMIN_AI_NAV_ITEMS: ProviderAdminNavItem[] = [
  { id: 'ai-maas-governance', label: 'MaaS governance' },
  { id: 'ai-model-catalog-settings', label: 'Model catalog settings' },
  { id: 'ai-admin-api-keys', label: 'API keys' },
]

export const PROVIDER_ADMIN_NETWORKING_NAV_ITEMS: ProviderAdminNavItem[] = [
  { id: 'networking-virtual-networks', label: 'Virtual networks' },
  { id: 'networking-subnets', label: 'Subnets' },
  { id: 'networking-security-groups', label: 'Security groups' },
  { id: 'networking-external-ip-pools', label: 'External IP pools' },
]

export const PROVIDER_ADMIN_INFRASTRUCTURE_NAV_ITEMS: ProviderAdminNavItem[] = [
  { id: 'infrastructure-data-centers', label: 'Data centers' },
  { id: 'infrastructure-hardware-inventory', label: 'Hardware inventory' },
  { id: 'infrastructure-bmaas-templates', label: 'Profiles & templates' },
]

export const PROVIDER_ADMIN_ADMINISTRATION_NAV_ITEMS: ProviderAdminNavItem[] = [
  { id: 'administration-organizations', label: 'Organizations' },
  { id: 'administration-quotas', label: 'Quotas' },
]

export function isServicesNavId(navId: string): boolean {
  return navId.startsWith('services-')
}

export function isGenaiStudioNavId(navId: string): boolean {
  return navId.startsWith('genai-')
}

export function isAiSettingsNavId(navId: string): boolean {
  return navId.startsWith('ai-')
}

export function isNetworkingNavId(navId: string): boolean {
  return navId.startsWith('networking-')
}

export function isInfrastructureNavId(navId: string): boolean {
  return navId.startsWith('infrastructure-')
}

export function isAdministrationNavId(navId: string): boolean {
  return navId.startsWith('administration-')
}

export function isOrganizationsNavId(navId: string): boolean {
  return navId === 'administration-organizations'
}
