import type { ProviderCatalogDraft } from '../../../providerSetup/storage'
import {
  buildVisionCatalogClusterRows,
  buildVisionCatalogModelRows,
} from '../../../vision/visionCatalogRows'
import type { VisionDrawerSelection } from '../../../vision/visionDrawer'
import type { VisionGridKebabItem } from './VisionGridKebab'

const DEFAULT_ADD_CLUSTER_OFFERING_ID = 'gpu-inference'

export const getVisionCatalogKebabItems = (
  selection: VisionDrawerSelection,
  catalogItems: ProviderCatalogDraft[],
  onPlacePreset: (presetId: string) => void,
  onAddOffering: (offeringId: string) => void,
  onOpenCatalogItem: (catalogItemId: string) => void,
): VisionGridKebabItem[] => {
  const modelRow = buildVisionCatalogModelRows(catalogItems).find((row) => {
    if (selection.kind === 'preset') {
      return row.presetId === selection.presetId
    }
    if (selection.kind === 'catalog-item') {
      return row.catalogItemId === selection.catalogItemId
    }
    return false
  })
  const clusterRow = modelRow
    ? undefined
    : buildVisionCatalogClusterRows(catalogItems).find((row) => {
        if (selection.kind === 'offering') {
          return row.offeringId === selection.offeringId
        }
        if (selection.kind === 'catalog-item') {
          return row.catalogItemId === selection.catalogItemId
        }
        return false
      })

  const items: VisionGridKebabItem[] = []
  if (modelRow?.presetId) {
    items.push({
      id: `place-${modelRow.presetId}`,
      label: 'Place on AI Grid',
      onClick: () => onPlacePreset(modelRow.presetId as string),
    })
  }
  if (clusterRow) {
    items.push({
      id: `add-cluster-${clusterRow.id}`,
      label: 'Launch instance',
      onClick: () => onAddOffering(clusterRow.offeringId ?? DEFAULT_ADD_CLUSTER_OFFERING_ID),
    })
  }
  const catalogItemId = modelRow?.catalogItemId ?? clusterRow?.catalogItemId
  if (catalogItemId) {
    items.push({
      id: `view-catalog-${catalogItemId}`,
      label: 'View in Catalog',
      onClick: () => onOpenCatalogItem(catalogItemId),
    })
  }
  return items
}
