import { DEMO_NORTH_SUMMIT_BANK_TENANT_ID } from '../providerAdmin/organizations'
import type { ProviderCatalogDraft } from '../providerSetup/storage'
import type { ProviderAdminNavId } from '../providerAdmin/constants'

export const MODEL_FLEET_VISION_VALUE = 'model-fleet'
export const MODEL_FLEET_VISION_NAV_ID = 'vision-model-fleet' satisfies ProviderAdminNavId

export const GRANITE_3B_CATALOG_ITEM_ID = 'cat-granite-3b-instruct'
export const GRANITE_3B_STABLE_NAME = 'granite-3b'
export const GRANITE_3B_PRESET_DISPLAY_NAME = 'Granite 3B instruct'

export const isModelFleetVision = (searchParams: URLSearchParams): boolean =>
  searchParams.get('vision') === MODEL_FLEET_VISION_VALUE ||
  searchParams.get('nav') === MODEL_FLEET_VISION_NAV_ID

export const isVisionModelServingPreset = (item: { catalogItemId?: string }): boolean =>
  item.catalogItemId === GRANITE_3B_CATALOG_ITEM_ID

export const createGranite3bInstructCatalogDraft = (): ProviderCatalogDraft => ({
  catalogItemId: GRANITE_3B_CATALOG_ITEM_ID,
  templateRefId: 'maas-granite-3b-instruct',
  templateName: 'granite-3b-instruct-serving',
  displayName: GRANITE_3B_PRESET_DISPLAY_NAME,
  description:
    'Predefined model serving configuration (size, accelerators, replicas). Place this on the AI Grid; do not treat it as a VM or bare-metal SKU.',
  scope: 'vip-enterprise',
  enterpriseTenantId: DEMO_NORTH_SUMMIT_BANK_TENANT_ID,
  enterpriseTenantIds: [DEMO_NORTH_SUMMIT_BANK_TENANT_ID],
  rateCard: {
    hourlyRate: 6.4,
    monthlyRate: 4200,
    currency: 'USD',
    billingUnit: 'per-instance',
  },
  serviceId: 'models',
  instanceTypeLabel: '2 replicas · 1× NVIDIA H100 80 GB',
  diskImageLabel: 'ibm/granite-3b-instruct',
  status: 'live',
  createdAt: '2026-08-01T12:00:00.000Z',
})

export const mergeVisionCatalogItems = (
  items: ProviderCatalogDraft[],
  visionEnabled: boolean,
): ProviderCatalogDraft[] => {
  if (!visionEnabled) {
    return items.filter((item) => item.catalogItemId !== GRANITE_3B_CATALOG_ITEM_ID)
  }

  const withoutVision = items.filter((item) => item.catalogItemId !== GRANITE_3B_CATALOG_ITEM_ID)
  return [createGranite3bInstructCatalogDraft(), ...withoutVision]
}
