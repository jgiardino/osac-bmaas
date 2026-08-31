import { Content, Stack, StackItem } from '@patternfly/react-core'
import {
  getVisionOrg,
  getVisionPreset,
  getVisionSite,
  modelsOnGatewayCount,
  type VisionCluster,
  type VisionDeployment,
  type VisionGateway,
  type VisionOffPlatformModel,
} from '../../../vision/fleetWorld'
import type { VisionDrawerSelection, VisionGridObjectType } from '../../../vision/visionDrawer'
import { VisionClusterInspector } from './VisionClusterInspector'
import { VisionGatewayInspector } from './VisionGatewayInspector'
import { VisionGridClusterCard } from './VisionGridClusterCard'
import { VisionGridCountHeading } from './VisionGridCountHeading'
import { VisionGridDrawerCard } from './VisionGridDrawerCard'
import { VisionGridGatewayRelationList } from './VisionGridGatewayRelationList'
import { VisionGridModelListBadge } from './VisionGridModelListBadge'
import { VisionOffPlatformModelInspector } from './VisionOffPlatformModelInspector'
import { VisionServiceModelInspector } from './VisionServiceModelInspector'
import { visionFleetModelSpecNodes } from './visionFleetModelSpec'
import {
  gatewayRelationsForDeployment,
  gatewayRelationsForOffPlatform,
  visionAdminScopeFooter,
  visionClusterDisplayName,
  visionGatewayListSpecRows,
} from './visionGridServiceMeta'

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

const gatewayClusterLabel = (gateway: VisionGateway, clusters: VisionCluster[]) => {
  const cluster = clusters.find((entry) => entry.id === gateway.clusterId)
  if (!cluster) {
    return gateway.clusterId
  }
  const site = getVisionSite(cluster.siteId)
  return `${cluster.name} · ${site.regionLabel}`
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
  const visibleDeployments = deployments.filter((deployment) => {
    const cluster = clusters.find((entry) => entry.id === deployment.clusterId)
    const preset = getVisionPreset(deployment.presetId)
    const org = getVisionOrg(deployment.orgId)
    return (
      matches(preset?.displayName ?? '') ||
      matches(preset?.modelId ?? '') ||
      matches(cluster?.name ?? '') ||
      matches(org.label) ||
      matches(deployment.projectName)
    )
  })
  const visibleOffPlatform = offPlatformModels.filter((model) => {
    const org = getVisionOrg(model.orgId)
    const clusterName = visionClusterDisplayName(model.clusterId, clusters)
    return (
      matches(model.displayName) ||
      matches(model.modelId) ||
      matches(model.servedBy) ||
      matches(org.label) ||
      matches(model.projectName) ||
      matches(clusterName)
    )
  })
  const visibleGateways = gateways.filter((gateway) => {
    const org = getVisionOrg(gateway.orgId)
    return matches(gateway.label) || matches(gateway.hostname) || matches(org.label)
  })
  const showClusters = objectTypes.includes('clusters')
  const showModels = objectTypes.includes('models')
  const showGateways = objectTypes.includes('gateways')
  const modelCount = visibleDeployments.length + visibleOffPlatform.length

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
              visibleGateways.map((gateway) => {
                const org = getVisionOrg(gateway.orgId)
                return (
                  <StackItem key={gateway.id}>
                    <VisionGridDrawerCard
                      id={`vision-service-gateway-${gateway.id}`}
                      name={gateway.label}
                      secondary={gateway.hostname}
                      specRows={visionGatewayListSpecRows({
                        clusterValue: gatewayClusterLabel(gateway, clusters),
                        modelCount: modelsOnGatewayCount(deployments, offPlatformModels, gateway.id),
                      })}
                      footerRows={[{ label: 'Tenant', value: org.label }]}
                      isSelected={
                        highlight.kind === 'gateway' && highlight.gatewayId === gateway.id
                      }
                      onSelect={() => onHighlightGateway(gateway.id)}
                      onViewDetails={() => onViewGateway(gateway.id)}
                    />
                  </StackItem>
                )
              })
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
              <>
                {visibleDeployments.map((deployment) => {
                  const org = getVisionOrg(deployment.orgId)
                  const preset = getVisionPreset(deployment.presetId)
                  return (
                    <StackItem key={deployment.id}>
                      <VisionGridDrawerCard
                        id={`vision-service-model-${deployment.id}`}
                        name={preset?.displayName ?? deployment.presetId}
                        secondary={preset?.modelId ?? deployment.presetId}
                        specNodes={visionFleetModelSpecNodes({
                          idPrefix: `vision-service-model-${deployment.id}`,
                          clusterName: visionClusterDisplayName(deployment.clusterId, clusters),
                          size: deployment.replicas,
                        })}
                        extra={
                          <VisionGridGatewayRelationList
                            idPrefix={`vision-service-model-${deployment.id}`}
                            relations={gatewayRelationsForDeployment(deployment, gateways)}
                          />
                        }
                        footerRows={visionAdminScopeFooter(org.label, deployment.projectName)}
                        isSelected={
                          highlight.kind === 'deployment' &&
                          highlight.deploymentId === deployment.id
                        }
                        onSelect={() => onHighlightDeployment(deployment.id)}
                        onViewDetails={() => onViewDeployment(deployment.id)}
                        badge={
                          <VisionGridModelListBadge
                            idPrefix={`vision-service-model-${deployment.id}`}
                            status={deployment.status}
                          />
                        }
                      />
                    </StackItem>
                  )
                })}
                {visibleOffPlatform.map((model) => {
                  const org = getVisionOrg(model.orgId)
                  return (
                    <StackItem key={model.id}>
                      <VisionGridDrawerCard
                        id={`vision-service-model-${model.id}`}
                        name={model.displayName}
                        secondary={model.modelId}
                        specNodes={visionFleetModelSpecNodes({
                          idPrefix: `vision-service-model-${model.id}`,
                          clusterName: visionClusterDisplayName(model.clusterId, clusters),
                          servedBy: model.servedBy,
                        })}
                        extra={
                          <VisionGridGatewayRelationList
                            idPrefix={`vision-service-model-${model.id}`}
                            relations={gatewayRelationsForOffPlatform(model, gateways)}
                          />
                        }
                        footerRows={visionAdminScopeFooter(org.label, model.projectName)}
                        isSelected={
                          highlight.kind === 'off-platform-model' &&
                          highlight.modelId === model.id
                        }
                        onSelect={() => onHighlightOffPlatform(model.id)}
                        onViewDetails={() => onViewOffPlatform(model.id)}
                        badge={
                          <VisionGridModelListBadge
                            idPrefix={`vision-service-model-${model.id}`}
                            status="Ready"
                            servingKind="external-model"
                          />
                        }
                      />
                    </StackItem>
                  )
                })}
              </>
            )}
          </Stack>
        </StackItem>
      ) : null}
    </Stack>
  )
}
