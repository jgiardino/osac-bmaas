import {
  CLUSTER_NODE_SETS_CATALOG_ITEM_ID,
  LEGACY_CLUSTER_NODE_SETS_CATALOG_ITEM_ID,
  resolveCatalogSpecRows,
  resolveClusterCatalogHighlightRows,
  type CatalogSpecRow,
} from '../catalog/catalogSpecs'
import { getCatalogEnterpriseTenantIds } from '../components/provider-admin/VipEnterpriseOrganizationField'
import { DEMO_NORTH_SUMMIT_BANK_ORG_ID, DEMO_NORTH_SUMMIT_BANK_TENANT_ID } from '../providerAdmin/organizations'
import {
  getCatalogItemStatus,
  type CatalogItemStatus,
  type ProviderCatalogDraft,
} from '../providerSetup/storage'
import { formatRateCardSummary } from '../providerSetup/templateDemo'
import { VISION_MODEL_PRESETS, type VisionCluster, type VisionOrgFilter } from './fleetWorld'

export type VisionCatalogModelRow = {
  id: string
  displayName: string
  specRows: CatalogSpecRow[]
  rate: string
  presetId: string | null
  catalogItemId: string
  status: CatalogItemStatus
}

export type VisionCatalogClusterRow = {
  id: string
  displayName: string
  specRows: CatalogSpecRow[]
  rate: string
  offeringId: string | null
  catalogItemId: string
  status: CatalogItemStatus
}

const NSB_TENANT_IDS = [DEMO_NORTH_SUMMIT_BANK_TENANT_ID, DEMO_NORTH_SUMMIT_BANK_ORG_ID]

export const catalogItemVisibleForTenant = (
  item: ProviderCatalogDraft,
  orgFilter: VisionOrgFilter,
): boolean => {
  if (orgFilter === 'all') {
    return true
  }
  if (item.scope !== 'vip-enterprise') {
    return true
  }
  const ids = getCatalogEnterpriseTenantIds(item)
  if (orgFilter === 'nsb') {
    return ids.some((tenantId) => NSB_TENANT_IDS.includes(tenantId))
  }
  return ids.some(
    (tenantId) =>
      tenantId.toLowerCase().includes('bluesolace') || tenantId.toLowerCase().includes('evergreen'),
  )
}

export const buildVisionCatalogModelRows = (
  catalogItems: ProviderCatalogDraft[],
): VisionCatalogModelRow[] =>
  catalogItems
    .filter((item) => item.serviceId === 'models')
    .map((item) => {
      const preset = VISION_MODEL_PRESETS.find((entry) => entry.catalogItemId === item.catalogItemId)
      return {
        id: item.catalogItemId,
        displayName: item.displayName,
        specRows: resolveCatalogSpecRows(item),
        rate: formatRateCardSummary(item.rateCard),
        presetId: preset?.id ?? null,
        catalogItemId: item.catalogItemId,
        status: getCatalogItemStatus(item),
      }
    })

export const buildVisionCatalogClusterRows = (
  catalogItems: ProviderCatalogDraft[],
): VisionCatalogClusterRow[] =>
  catalogItems
    .filter((item) => item.serviceId === 'cluster')
    .map((item) => ({
      id: item.catalogItemId,
      displayName: item.displayName,
      specRows: resolveClusterCatalogHighlightRows(item),
      rate: formatRateCardSummary(item.rateCard),
      offeringId: null,
      catalogItemId: item.catalogItemId,
      status: getCatalogItemStatus(item),
    }))

/** Seed clusters belong to the demo node-sets SKU. If Catalog has only one cluster item, all clusters count as its instances. */
export const provisionedClustersForCatalogItem = (
  catalogItemId: string,
  catalogItems: ProviderCatalogDraft[],
  clusters: VisionCluster[],
): VisionCluster[] => {
  const clusterItems = catalogItems.filter((item) => item.serviceId === 'cluster')
  if (clusterItems.length === 0) {
    return []
  }
  const isSoleClusterItem =
    clusterItems.length === 1 && clusterItems[0].catalogItemId === catalogItemId
  const isDemoNodeSets =
    catalogItemId === CLUSTER_NODE_SETS_CATALOG_ITEM_ID ||
    catalogItemId === LEGACY_CLUSTER_NODE_SETS_CATALOG_ITEM_ID
  return isSoleClusterItem || isDemoNodeSets ? clusters : []
}
