import type { ProviderCatalogDraft } from '../providerSetup/storage'
import {
  VISION_GATEWAYS,
  VISION_MODEL_PRESETS,
  clustersForGateway,
  clustersForOffering,
  clustersForOffPlatformModel,
  clustersForPreset,
  getVisionOffering,
  getVisionOffPlatformModel,
  getVisionPreset,
  type VisionCluster,
  type VisionDeployment,
  type VisionGatewayId,
} from './fleetWorld'

export type VisionDrawerTab = 'catalog' | 'services'

export type VisionGridObjectType = 'clusters' | 'models' | 'gateways'

export const DEFAULT_VISION_OBJECT_TYPES: VisionGridObjectType[] = ['clusters', 'models']
export const CATALOG_OBJECT_TYPES: VisionGridObjectType[] = ['clusters', 'models']
export const SERVICES_OBJECT_TYPES: VisionGridObjectType[] = ['clusters', 'models', 'gateways']

export type VisionDrawerSelection =
  | { kind: 'none' }
  | { kind: 'cluster'; clusterId: string }
  | { kind: 'preset'; presetId: string }
  | { kind: 'deployment'; deploymentId: string }
  | { kind: 'offering'; offeringId: string }
  | { kind: 'catalog-item'; catalogItemId: string }
  | { kind: 'gateway'; gatewayId: VisionGatewayId }
  | { kind: 'off-platform-model'; modelId: string }

export const toggleVisionObjectType = (
  current: readonly VisionGridObjectType[],
  type: VisionGridObjectType,
  isSelected: boolean,
): VisionGridObjectType[] => {
  if (isSelected) {
    return current.includes(type) ? [...current] : [...current, type]
  }
  return current.filter((entry) => entry !== type)
}

export const visionSelectionsEqual = (
  left: VisionDrawerSelection,
  right: VisionDrawerSelection,
): boolean => {
  if (left.kind !== right.kind) {
    return false
  }
  if (left.kind === 'none' || right.kind === 'none') {
    return true
  }
  if (left.kind === 'cluster' && right.kind === 'cluster') {
    return left.clusterId === right.clusterId
  }
  if (left.kind === 'preset' && right.kind === 'preset') {
    return left.presetId === right.presetId
  }
  if (left.kind === 'deployment' && right.kind === 'deployment') {
    return left.deploymentId === right.deploymentId
  }
  if (left.kind === 'offering' && right.kind === 'offering') {
    return left.offeringId === right.offeringId
  }
  if (left.kind === 'catalog-item' && right.kind === 'catalog-item') {
    return left.catalogItemId === right.catalogItemId
  }
  if (left.kind === 'gateway' && right.kind === 'gateway') {
    return left.gatewayId === right.gatewayId
  }
  if (left.kind === 'off-platform-model' && right.kind === 'off-platform-model') {
    return left.modelId === right.modelId
  }
  return false
}

export const seedVisionDrawerSelection = (seed: {
  selectedClusterId: string | null
  selectedPresetId: string | null
  selectedGatewayId?: VisionGatewayId | null
}): VisionDrawerSelection => {
  if (seed.selectedClusterId) {
    return { kind: 'cluster', clusterId: seed.selectedClusterId }
  }
  if (seed.selectedGatewayId) {
    return { kind: 'gateway', gatewayId: seed.selectedGatewayId }
  }
  if (seed.selectedPresetId) {
    return { kind: 'preset', presetId: seed.selectedPresetId }
  }
  return { kind: 'none' }
}

export const getVisionDrawerSelectionLabel = (
  selection: VisionDrawerSelection,
  clusters: VisionCluster[],
  catalogItems: ProviderCatalogDraft[],
  deployments: VisionDeployment[] = [],
): string | null => {
  switch (selection.kind) {
    case 'none':
      return null
    case 'cluster':
      return clusters.find((cluster) => cluster.id === selection.clusterId)?.name ?? selection.clusterId
    case 'preset':
      return getVisionPreset(selection.presetId)?.displayName ?? selection.presetId
    case 'deployment': {
      const deployment = deployments.find((entry) => entry.id === selection.deploymentId)
      if (!deployment) {
        return selection.deploymentId
      }
      const preset = getVisionPreset(deployment.presetId)
      const cluster = clusters.find((entry) => entry.id === deployment.clusterId)
      const modelName = preset?.stableName ?? deployment.presetId
      return cluster ? `${modelName} on ${cluster.name}` : modelName
    }
    case 'offering':
      return getVisionOffering(selection.offeringId)?.name ?? selection.offeringId
    case 'catalog-item':
      return (
        catalogItems.find((item) => item.catalogItemId === selection.catalogItemId)?.displayName ??
        selection.catalogItemId
      )
    case 'gateway':
      return VISION_GATEWAYS.find((gateway) => gateway.id === selection.gatewayId)?.label ?? selection.gatewayId
    case 'off-platform-model':
      return getVisionOffPlatformModel(selection.modelId)?.displayName ?? selection.modelId
  }
}

export const relatedClusterIdsForSelection = (
  selection: VisionDrawerSelection,
  clusters: VisionCluster[],
  deployments: VisionDeployment[],
  catalogItems: ProviderCatalogDraft[],
): string[] => {
  switch (selection.kind) {
    case 'none':
      return []
    case 'cluster':
      return clusters.some((cluster) => cluster.id === selection.clusterId) ? [selection.clusterId] : []
    case 'preset':
      return clustersForPreset(deployments, selection.presetId)
    case 'deployment': {
      const deployment = deployments.find((entry) => entry.id === selection.deploymentId)
      return deployment ? [deployment.clusterId] : []
    }
    case 'offering': {
      const offering = getVisionOffering(selection.offeringId)
      return offering ? clustersForOffering(clusters, offering) : []
    }
    case 'catalog-item': {
      const item = catalogItems.find((entry) => entry.catalogItemId === selection.catalogItemId)
      if (!item) {
        return []
      }
      if (item.serviceId === 'models') {
        const preset = VISION_MODEL_PRESETS.find((entry) => entry.catalogItemId === item.catalogItemId)
        return preset ? clustersForPreset(deployments, preset.id) : []
      }
      return []
    }
    case 'gateway':
      return clustersForGateway(clusters, selection.gatewayId)
    case 'off-platform-model': {
      const model = getVisionOffPlatformModel(selection.modelId)
      return model ? clustersForOffPlatformModel(model, clusters) : []
    }
  }
}
