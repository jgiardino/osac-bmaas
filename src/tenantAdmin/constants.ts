export type TenantAdminNavId =
  | 'overview'
  | 'ai-grid'
  | 'ai-asset-endpoints'
  | 'playground'
  | 'api-keys'
  | 'admin-maas-governance'
  | 'admin-models'
  | 'admin-model-catalog-settings'
  | 'admin-api-keys'
  | 'admin-ai-usage'
  | 'catalog'
  | 'services-baremetal'
  | 'services-clusters'
  | 'services-models'
  | 'services-virtual-machines'
  | 'projects-teams'
  | 'administration-roles'
  | 'administration-billing'
  | 'networking-virtual-networks'
  | 'networking-subnets'
  | 'networking-security-groups'
  | 'networking-external-ip-pools'
  | 'secrets'

export type TenantAdminNavItem = {
  id: string
  label: string
  children?: ReadonlyArray<{ id: TenantAdminNavId; label: string }>
}

export type TenantAdminNavGroup = {
  id: string
  label: string
  items: TenantAdminNavItem[]
}

export const TENANT_ADMIN_SERVICES_NAV_ITEMS: ReadonlyArray<{
  id: TenantAdminNavId
  label: string
}> = [
  { id: 'services-baremetal', label: 'Bare metal' },
  { id: 'services-clusters', label: 'Clusters' },
  { id: 'services-models', label: 'Models' },
  { id: 'services-virtual-machines', label: 'Virtual machines' },
]

export const TENANT_EXTERNAL_IPS_PAGE_LABEL = 'External IPs'

/** Shown on tenant external IP pool surfaces — pools are provisioned by the provider, not tenants. */
export const TENANT_EXTERNAL_IP_POOL_MANAGED_BY_LABEL = 'Provider administrator'

export const TENANT_ADMIN_NETWORKING_NAV_ITEMS: ReadonlyArray<{
  id: TenantAdminNavId
  label: string
}> = [
  { id: 'networking-virtual-networks', label: 'Virtual networks' },
  { id: 'networking-external-ip-pools', label: TENANT_EXTERNAL_IPS_PAGE_LABEL },
]

export const TENANT_ADMIN_ADMINISTRATION_NAV_ITEMS: ReadonlyArray<{
  id: TenantAdminNavId
  label: string
}> = [
  { id: 'administration-roles', label: 'Roles' },
  { id: 'administration-billing', label: 'Billing' },
]

export const TENANT_ADMIN_GENAI_STUDIO_NAV_ITEMS: ReadonlyArray<{
  id: TenantAdminNavId
  label: string
}> = [
  { id: 'ai-asset-endpoints', label: 'AI asset endpoints' },
  { id: 'playground', label: 'Playground' },
  { id: 'api-keys', label: 'API keys' },
]

export const TENANT_ADMIN_AI_NAV_ITEMS: ReadonlyArray<{
  id: TenantAdminNavId
  label: string
}> = [
  { id: 'admin-maas-governance', label: 'MaaS governance' },
  { id: 'admin-model-catalog-settings', label: 'Model catalog settings' },
  { id: 'admin-api-keys', label: 'API keys' },
  { id: 'admin-ai-usage', label: 'Usage' },
]

export const TENANT_ADMIN_NAV_ITEMS: TenantAdminNavItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'ai-grid', label: 'AI Grid' },
  { id: 'catalog', label: 'Catalog' },
  {
    id: 'services',
    label: 'Services',
    children: TENANT_ADMIN_SERVICES_NAV_ITEMS,
  },
  {
    id: 'genai-studio',
    label: 'GenAI studio',
    children: TENANT_ADMIN_GENAI_STUDIO_NAV_ITEMS,
  },
  {
    id: 'ai-administration',
    label: 'AI',
    children: TENANT_ADMIN_AI_NAV_ITEMS,
  },
  { id: 'projects-teams', label: 'Projects' },
  {
    id: 'networking',
    label: 'Networking',
    children: TENANT_ADMIN_NETWORKING_NAV_ITEMS,
  },
  {
    id: 'administration',
    label: 'Administration',
    children: TENANT_ADMIN_ADMINISTRATION_NAV_ITEMS,
  },
  { id: 'secrets', label: 'Secrets' },
]

/** Tenant Admin navigation used by the Model deployment MVP landing-page entry. */
export const TENANT_ADMIN_MODEL_DEPLOYMENT_MVP_NAV_ITEMS: TenantAdminNavItem[] =
  TENANT_ADMIN_NAV_ITEMS.map((item) =>
    item.id === 'ai-administration'
      ? {
          ...item,
          children: [{ id: 'admin-models', label: 'Models' }, ...(item.children ?? [])],
        }
      : item,
  )

export function getTenantAdminLeafNavItems(
  items: readonly TenantAdminNavItem[] = TENANT_ADMIN_NAV_ITEMS,
): Array<{ id: TenantAdminNavId; label: string }> {
  return items.flatMap((item) =>
    item.children?.length
      ? [...item.children]
      : [{ id: item.id as TenantAdminNavId, label: item.label }],
  )
}

export function isNetworkingNavId(navId: string): boolean {
  return navId.startsWith('networking-')
}

export function isServicesNavId(navId: string): boolean {
  return navId.startsWith('services-')
}

export function isAdministrationNavId(navId: string): boolean {
  return navId.startsWith('administration-')
}

/** @deprecated Use TENANT_ADMIN_NAV_ITEMS for navigation. */
export const TENANT_ADMIN_NAV_GROUPS: TenantAdminNavGroup[] = [
  {
    id: 'main',
    label: '',
    items: TENANT_ADMIN_NAV_ITEMS,
  },
]
