import { Content, Stack, StackItem } from '@patternfly/react-core'
import { ExternalModelCard } from '../../../components/catalog/ExternalModelCard'
import { ModelsInstanceCard } from '../../../components/catalog/ModelsInstanceCard'
import {
  externalModelsForOrg,
  getExternalModelByName,
} from '../../../vision/externalModelSeed'
import {
  getVisionOrg,
  getVisionSite,
  type VisionCluster,
  type VisionDeployment,
  type VisionGateway,
  type VisionOffPlatformModel,
  type VisionOrgId,
} from '../../../vision/fleetWorld'
import { groupModelInstancesByModelId, servicesModelsForOrg } from '../../../vision/modelInstanceSeed'
import type { VisionDrawerSelection, VisionGridObjectType } from '../../../vision/visionDrawer'
import { VisionClusterInspector } from './VisionClusterInspector'
import { VisionExternalModelInspector } from './VisionExternalModelInspector'
import { VisionGatewayInspector } from './VisionGatewayInspector'
import { VisionGridClusterCard } from './VisionGridClusterCard'
import { VisionGridCountHeading } from './VisionGridCountHeading'
import { VisionModelGroupInspector } from './VisionModelGroupInspector'
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
  onViewModelGroup: (modelId: string) => void
  onViewExternalModelGroup: (name: string) => void
}

const seedOrgFromClusters = (clusters: VisionCluster[]): VisionOrgId | 'all' => {
  const orgIds = new Set(clusters.map((cluster) => cluster.orgId))
  return orgIds.size === 1 ? [...orgIds][0] : 'all'
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
  onViewModelGroup,
  onViewExternalModelGroup,
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
    if (selection.kind === 'model-group') {
      const seedOrgId = seedOrgFromClusters(clusters)
      const instances = servicesModelsForOrg(seedOrgId).filter(
        (item) => item.modelId === selection.modelId,
      )
      return (
        <VisionModelGroupInspector
          displayName={instances[0]?.displayName ?? selection.modelId}
          instances={instances}
        />
      )
    }
    if (selection.kind === 'external-model-group') {
      const seedOrgId = seedOrgFromClusters(clusters)
      const model = getExternalModelByName(selection.name)
      const isVisible =
        model && (seedOrgId === 'all' || model.orgId === seedOrgId)
      if (!isVisible || !model) {
        return (
          <Content component="p">This service is not available in the current filter.</Content>
        )
      }
      return <VisionExternalModelInspector model={model} />
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
  const showClusters = objectTypes.includes('clusters')
  const showModels = objectTypes.includes('models')
  const seedOrgId = seedOrgFromClusters(clusters)
  const visibleSeedModels = servicesModelsForOrg(seedOrgId).filter(
    (item) =>
      matches(item.displayName) ||
      matches(item.modelId) ||
      matches(item.tenantLabel) ||
      matches(item.projectName) ||
      matches(item.clusterId ?? ''),
  )
  const modelGroups = groupModelInstancesByModelId(visibleSeedModels)
  const visibleExternalModels = externalModelsForOrg(seedOrgId).filter(
    (model) =>
      matches(model.displayName) ||
      matches(model.name) ||
      matches(model.projectName) ||
      model.providerRefs.some(
        (ref) => matches(ref.displayName) || matches(ref.providerName) || matches(ref.targetModel),
      ),
  )
  const modelCount = modelGroups.length + visibleExternalModels.length

  if (!showClusters && !showModels) {
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
      {showModels ? (
        <StackItem id="vision-services-models-content">
          <Stack hasGutter>
            <StackItem>
              <VisionGridCountHeading
                id="vision-services-models-toggle"
                title="Models"
                count={modelCount}
                showDivider={showClusters}
              />
            </StackItem>
            {modelCount === 0 ? (
              <StackItem>
                <Content component="p">No model instances running in the current filter.</Content>
              </StackItem>
            ) : (
              <>
                {modelGroups.map((group) => (
                  <StackItem key={group.modelId}>
                    <ModelsInstanceCard
                      item={group.representative}
                      variant="compact"
                      clusterIds={group.clusterIds}
                      clusterLabel={group.clusterLabel}
                      idPrefix="vision-service-model"
                      onViewDetails={() => onViewModelGroup(group.modelId)}
                    />
                  </StackItem>
                ))}
                {visibleExternalModels.map((model) => (
                  <StackItem key={model.name}>
                    <ExternalModelCard
                      model={model}
                      variant="compact"
                      idPrefix="vision-service-external-model"
                      onViewDetails={() => onViewExternalModelGroup(model.name)}
                    />
                  </StackItem>
                ))}
              </>
            )}
          </Stack>
        </StackItem>
      ) : null}
    </Stack>
  )
}
