import type { CatalogSpecRow } from '../../../catalog/catalogSpecs'
import {
  formatModelCount,
  type VisionCluster,
  type VisionDeployment,
  type VisionGateway,
  type VisionOffPlatformModel,
} from '../../../vision/fleetWorld'

export type VisionGatewayRelation = {
  gateway: VisionGateway
  isMaas: boolean
  origin: 'this-cluster' | 'other-cluster'
}

export const visionAdminScopeFooter = (
  tenantLabel: string,
  projectName?: string,
): Array<{ label: string; value: string }> => {
  const rows = [{ label: 'Tenant', value: tenantLabel }]
  if (projectName) {
    rows.push({ label: 'Project', value: projectName })
  }
  return rows
}

export const visionClusterDisplayName = (
  clusterId: string,
  clusters: VisionCluster[],
): string => clusters.find((entry) => entry.id === clusterId)?.name ?? clusterId

export const visionGatewayListSpecRows = ({
  clusterValue,
  modelCount,
  includeCluster = true,
}: {
  clusterValue?: string
  modelCount: number
  includeCluster?: boolean
}): CatalogSpecRow[] => {
  const rows: CatalogSpecRow[] = []
  if (includeCluster && clusterValue) {
    rows.push({ label: 'Cluster', value: clusterValue })
  }
  rows.push({ label: 'Models', value: formatModelCount(modelCount) })
  return rows
}

const originForGateway = (
  gateway: VisionGateway,
  homeClusterId: string | null,
): VisionGatewayRelation['origin'] =>
  homeClusterId && gateway.clusterId === homeClusterId ? 'this-cluster' : 'other-cluster'

export const gatewayRelationsForDeployment = (
  deployment: VisionDeployment,
  gateways: VisionGateway[],
): VisionGatewayRelation[] => {
  const visible = new Map(gateways.map((gateway) => [gateway.id, gateway]))
  const relations: VisionGatewayRelation[] = []
  const seen = new Set<string>()

  const add = (gatewayId: VisionGateway['id'], isMaas: boolean) => {
    if (seen.has(gatewayId)) {
      return
    }
    const gateway = visible.get(gatewayId)
    if (!gateway) {
      return
    }
    seen.add(gatewayId)
    relations.push({
      gateway,
      isMaas,
      origin: originForGateway(gateway, deployment.clusterId),
    })
  }

  deployment.maasGatewayIds.forEach((gatewayId) => add(gatewayId, true))
  if (deployment.attachedGatewayId) {
    add(deployment.attachedGatewayId, false)
  }

  return relations.sort((left, right) => {
    if (left.origin !== right.origin) {
      return left.origin === 'this-cluster' ? -1 : 1
    }
    if (left.isMaas !== right.isMaas) {
      return left.isMaas ? -1 : 1
    }
    return left.gateway.label.localeCompare(right.gateway.label)
  })
}

export const gatewayRelationsForOffPlatform = (
  model: VisionOffPlatformModel,
  gateways: VisionGateway[],
): VisionGatewayRelation[] => {
  const visible = new Map(gateways.map((gateway) => [gateway.id, gateway]))
  return model.gatewayIds
    .map((gatewayId) => visible.get(gatewayId))
    .filter((gateway): gateway is VisionGateway => Boolean(gateway))
    .map((gateway) => ({
      gateway,
      isMaas: true,
      origin: originForGateway(gateway, model.clusterId),
    }))
}
