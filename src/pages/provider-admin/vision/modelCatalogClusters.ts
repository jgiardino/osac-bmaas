import {
  DEMO_BLUESOLACE_TENANT_ID,
  DEMO_HARBORLINE_CAPITAL_TENANT_ID,
  DEMO_NORTH_SUMMIT_BANK_TENANT_ID,
} from '../../../providerAdmin/organizations'
import { createInitialClusters, type VisionCluster } from '../../../vision/fleetWorld'

export type ModelCatalogClusterChoice = Pick<
  VisionCluster,
  'id' | 'name' | 'region' | 'platform' | 'nodeCount' | 'gpuCount'
>

const toClusterChoice = (cluster: VisionCluster): ModelCatalogClusterChoice => ({
  id: cluster.id,
  name: cluster.name,
  region: cluster.region,
  platform: cluster.platform,
  nodeCount: cluster.nodeCount,
  gpuCount: cluster.gpuCount,
})

export const getModelCatalogTenantClusters = (tenantId: string): ModelCatalogClusterChoice[] => {
  const availableClusters = createInitialClusters().filter(
    (cluster) => cluster.health === 'available',
  )

  if (tenantId === DEMO_NORTH_SUMMIT_BANK_TENANT_ID) {
    return availableClusters.filter((cluster) => cluster.orgId === 'nsb').map(toClusterChoice)
  }

  if (tenantId === DEMO_BLUESOLACE_TENANT_ID) {
    return availableClusters
      .filter((cluster) => cluster.orgId === 'bluesolace')
      .map(toClusterChoice)
  }

  if (tenantId === DEMO_HARBORLINE_CAPITAL_TENANT_ID) {
    return availableClusters
      .filter((cluster) => cluster.orgId === 'nsb')
      .slice(0, 2)
      .map((cluster, index) => {
        const regionId = index === 0 ? 'us-west-1' : 'us-east-1'
        const name = `harborline-capital-${regionId}`
        return {
          ...toClusterChoice(cluster),
          id: name,
          name,
        }
      })
  }

  return []
}
