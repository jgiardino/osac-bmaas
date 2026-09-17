import { Content, Stack, StackItem } from '@patternfly/react-core'
import { useLocation } from 'react-router-dom'
import { ModelsInstanceCard } from '../../../components/catalog/ModelsInstanceCard'
import {
  getVisionOrg,
  getVisionSite,
  modelsOnGatewayCount,
  type VisionCluster,
  type VisionDeployment,
  type VisionGateway,
  type VisionOffPlatformModel,
  type VisionOrgId,
} from '../../../vision/fleetWorld'
import { servicesModelsForOrg } from '../../../vision/modelInstanceSeed'
import type { VisionDrawerSelection, VisionGridObjectType } from '../../../vision/visionDrawer'
import { VisionClusterInspector } from './VisionClusterInspector'
import { VisionGatewayInspector } from './VisionGatewayInspector'
import { VisionGridClusterCard } from './VisionGridClusterCard'
import { VisionGridCountHeading } from './VisionGridCountHeading'
import { VisionGridGatewayCard } from './VisionGridGatewayCard'
import { VisionOffPlatformModelInspector } from './VisionOffPlatformModelInspector'
import { VisionServiceModelInspector } from './VisionServiceModelInspector'

type VisionGridServicesTabProps = {
  mode: 'list' | 'detail'
  selection: VisionDrawerSelection
  highlight: VisionDrawerSelection
  objectTypes: readonly VisionGridObjectType[]
  search: string
  selectedCluster: VisionCluster | null
  selectedGateway: VisionGateway | null
  selectedOffPlatform: VisionOffPlatformModel | null
  clusterDeployments: VisionDeployment[]
  deployments: VisionDeployment[]
  clusters: VisionCluster[]
  gateways: VisionGateway[]
  offPlatformModels: VisionOffPlatformModel[]
  onHighlightCluster: (clusterId: string) => void
  onHighlightDeployment: (deploymentId: string) => void
  onHighlightGateway: (gatewayId: VisionGateway['id']) => void
  onHighlightOffPlatform: (modelId: string) => void
  onViewCluster: (clusterId: string) => void
  onViewDeployment: (deploymentId: string) => void
  onViewGateway: (gatewayId: VisionGateway['id']) => void
  onViewOffPlatform: (modelId: string) => void
}

export const VisionGridServicesTab = ({
  mode,
  selection,
  highlight,
  objectTypes,
  search,
  selectedCluster,
  selectedGateway,
  selectedOffPlatform,
  clusterDeployments,
  deployments,
  clusters,
  gateways,
  offPlatformModels,
  onHighlightCluster,
  onHighlightDeployment,
  onHighlightGateway,
  onHighlightOffPlatform,
  onViewCluster,
  onViewDeployment,
  onViewGateway,
  onViewOffPlatform,
}: VisionGridServicesTabProps) => {
  const { pathname } = useLocation()
  const showTenant = pathname.startsWith('/provider')

  if (mode === 'detail') {
    if (selection.kind === 'cluster') {
      return (
        <VisionClusterInspector
          cluster={selectedCluster}
          deployments={clusterDeployments}
          fleetDeployments={deployments}
          offPlatformModels={offPlatformModels}
          gateways={gateways}
          highlight={highlight}
          onHighlightDeployment={onHighlightDeployment}
          onHighlightGateway={onHighlightGateway}
          onViewDeployment={onViewDeployment}
          onViewGateway={onViewGateway}
        />
      )
    }
    if (selection.kind === 'deployment') {
      return (
        <VisionServiceModelInspector
          deploymentId={selection.deploymentId}
          deployments={deployments}
          offPlatformModels={offPlatformModels}
          clusters={clusters}
          gateways={gateways}
          highlight={highlight}
          onHighlightCluster={onHighlightCluster}
          onHighlightDeployment={onHighlightDeployment}
          onHighlightGateway={onHighlightGateway}
          onViewCluster={onViewCluster}
          onViewDeployment={onViewDeployment}
          onViewGateway={onViewGateway}
        />
      )
    }
    if (selection.kind === 'off-platform-model') {
      if (!selectedOffPlatform) {
        return (
          <Content component="p">This service is not available in the current filter.</Content>
        )
      }
      return (
        <VisionOffPlatformModelInspector
          model={selectedOffPlatform}
          clusters={clusters}
          deployments={deployments}
          offPlatformModels={offPlatformModels}
          gateways={gateways}
          highlight={highlight}
          onHighlightCluster={onHighlightCluster}
          onHighlightGateway={onHighlightGateway}
          onViewCluster={onViewCluster}
          onViewGateway={onViewGateway}
        />
      )
    }
    if (selection.kind === 'gateway') {
      if (!selectedGateway) {
        return (
          <Content component="p">This service is not available in the current filter.</Content>
        )
      }
      return (
        <VisionGatewayInspector
          gateway={selectedGateway}
          clusters={clusters}
          deployments={deployments}
          offPlatformModels={offPlatformModels}
          highlight={highlight}
          onHighlightCluster={onHighlightCluster}
          onHighlightDeployment={onHighlightDeployment}
          onHighlightOffPlatform={onHighlightOffPlatform}
          onViewCluster={onViewCluster}
          onViewDeployment={onViewDeployment}
          onViewOffPlatform={onViewOffPlatform}
        />
      )
    }
    if (selection.kind === 'preset') {
      const first = deployments.find((deployment) => deployment.presetId === selection.presetId)
      if (first) {
        return (
          <VisionServiceModelInspector
            deploymentId={first.id}
            deployments={deployments}
            offPlatformModels={offPlatformModels}
            clusters={clusters}
            gateways={gateways}
            highlight={highlight}
            onHighlightCluster={onHighlightCluster}
            onHighlightDeployment={onHighlightDeployment}
            onHighlightGateway={onHighlightGateway}
            onViewCluster={onViewCluster}
            onViewDeployment={onViewDeployment}
            onViewGateway={onViewGateway}
          />
        )
      }
    }
    return (
      <Content component="p">This service is not available in the current filter.</Content>
    )
  }

  const query = search.trim().toLowerCase()
  const matches = (value: string) => !query || value.toLowerCase().includes(query)
  const visibleClusters = clusters.filter((cluster) => {
    const site = getVisionSite(cluster.siteId)
    const org = getVisionOrg(cluster.orgId)
    return matches(cluster.name) || matches(site.regionLabel) || matches(org.label)
  })
  const visibleGateways = gateways.filter((gateway) => {
    const org = getVisionOrg(gateway.orgId)
    return matches(gateway.label) || matches(gateway.hostname) || matches(org.label)
  })
  const showClusters = objectTypes.includes('clusters')
  const showModels = objectTypes.includes('models')
  const showGateways = objectTypes.includes('gateways')
  const orgIds = new Set(clusters.map((cluster) => cluster.orgId))
  const seedOrgId: VisionOrgId | 'all' = orgIds.size === 1 ? [...orgIds][0] : 'all'
  const visibleSeedModels = servicesModelsForOrg(seedOrgId).filter(
    (item) =>
      matches(item.displayName) ||
      matches(item.modelId) ||
      matches(item.tenantLabel) ||
      matches(item.projectName) ||
      matches(item.clusterId ?? ''),
  )
  const modelCount = visibleSeedModels.length

  if (!showClusters && !showModels && !showGateways) {
    return <Content component="p">Select a type to show services.</Content>
  }

  return (
    <Stack hasGutter>
      {showClusters ? (
        <StackItem id="vision-services-clusters-content">
          <Stack hasGutter>
            <StackItem>
              <VisionGridCountHeading
                id="vision-services-clusters-toggle"
                title="Clusters"
                count={visibleClusters.length}
                showDivider={false}
              />
            </StackItem>
            {visibleClusters.length === 0 ? (
              <StackItem>
                <Content component="p">No clusters in the current filter.</Content>
              </StackItem>
            ) : (
              visibleClusters.map((cluster) => (
                  <StackItem key={cluster.id}>
                    <VisionGridClusterCard
                      id={`vision-service-cluster-${cluster.id}`}
                      cluster={cluster}
                      isSelected={
                        highlight.kind === 'cluster' && highlight.clusterId === cluster.id
                      }
                      onSelect={() => onHighlightCluster(cluster.id)}
                      onViewDetails={() => onViewCluster(cluster.id)}
                    />
                  </StackItem>
                ))
            )}
          </Stack>
        </StackItem>
      ) : null}
      {showGateways ? (
        <StackItem id="vision-services-gateways-content">
          <Stack hasGutter>
            <StackItem>
              <VisionGridCountHeading
                id="vision-services-gateways-toggle"
                title="Gateway"
                count={visibleGateways.length}
                showDivider={showClusters}
              />
            </StackItem>
            {visibleGateways.length === 0 ? (
              <StackItem>
                <Content component="p">No gateways in the current filter.</Content>
              </StackItem>
            ) : (
              visibleGateways.map((gateway) => (
                  <StackItem key={gateway.id}>
                    <VisionGridGatewayCard
                      id={`vision-service-gateway-${gateway.id}`}
                      gateway={gateway}
                      clusters={clusters}
                      modelCount={modelsOnGatewayCount(deployments, offPlatformModels, gateway.id)}
                      isSelected={
                        highlight.kind === 'gateway' && highlight.gatewayId === gateway.id
                      }
                      onSelect={() => onHighlightGateway(gateway.id)}
                      onViewDetails={() => onViewGateway(gateway.id)}
                    />
                  </StackItem>
                ))
            )}
          </Stack>
        </StackItem>
      ) : null}
      {showModels ? (
        <StackItem id="vision-services-models-content">
          <Stack hasGutter>
            <StackItem>
              <VisionGridCountHeading
                id="vision-services-models-toggle"
                title="Models"
                count={modelCount}
                showDivider={showClusters || showGateways}
              />
            </StackItem>
            {modelCount === 0 ? (
              <StackItem>
                <Content component="p">No model instances running in the current filter.</Content>
              </StackItem>
            ) : (
              visibleSeedModels.map((item) => (
                <StackItem key={item.id}>
                  <ModelsInstanceCard
                    item={item}
                    variant="compact"
                    showTenant={showTenant}
                    idPrefix="vision-service-model"
                  />
                </StackItem>
              ))
            )}
          </Stack>
        </StackItem>
      ) : null}
    </Stack>
  )
}
