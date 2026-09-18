import type { ProviderCatalogDraft } from '../providerSetup/storage'
import type { ProviderAdminNavId } from '../providerAdmin/constants'
import {
  createModelCatalogDrafts,
  isVisionModelsCatalogItem,
  MODEL_CATALOG_ITEM_IDS,
} from './modelCatalogSeed'

export const MODEL_FLEET_VISION_VALUE = 'model-fleet'
export const MODEL_FLEET_VISION_NAV_ID = 'vision-model-fleet' satisfies ProviderAdminNavId
export const MODEL_CATALOG_PATTERNS_NAV_ID =
  'vision-model-catalog-patterns' satisfies ProviderAdminNavId

/** Local Vite only. Hidden from GitHub Pages / production builds. */
export const SHOW_LOCAL_DEV_PATTERNS_NAV = import.meta.env.DEV

export const resolvePublishedProviderNav = (
  navId: ProviderAdminNavId,
): ProviderAdminNavId =>
  SHOW_LOCAL_DEV_PATTERNS_NAV || navId !== MODEL_CATALOG_PATTERNS_NAV_ID
    ? navId
    : MODEL_FLEET_VISION_NAV_ID

/** Legacy Granite catalog id — stripped from Catalog; still used by AI Grid instance seeds. */
export const GRANITE_3B_CATALOG_ITEM_ID = 'cat-granite-3b-instruct'
export const GRANITE_3B_STABLE_NAME = 'granite-3b'
export const GRANITE_3B_PRESET_DISPLAY_NAME = 'Granite 3B instruct'

export const isModelFleetVision = (searchParams: URLSearchParams): boolean =>
  searchParams.get('vision') === MODEL_FLEET_VISION_VALUE ||
  searchParams.get('nav') === MODEL_FLEET_VISION_NAV_ID ||
  searchParams.get('nav') === MODEL_CATALOG_PATTERNS_NAV_ID

export const isVisionModelServingPreset = (item: { catalogItemId?: string }): boolean =>
  isVisionModelsCatalogItem(item)

const VISION_CATALOG_IDS_TO_STRIP = new Set([
  GRANITE_3B_CATALOG_ITEM_ID,
  ...MODEL_CATALOG_ITEM_IDS,
])

export const mergeVisionCatalogItems = (
  items: ProviderCatalogDraft[],
): ProviderCatalogDraft[] => {
  const withoutVision = items.filter(
    (item) => !VISION_CATALOG_IDS_TO_STRIP.has(item.catalogItemId),
  )
  return [...createModelCatalogDrafts(), ...withoutVision]
}
