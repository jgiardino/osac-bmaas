import {
  Content,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  Stack,
  StackItem,
} from '@patternfly/react-core'
import {
  getVisionOrg,
  getVisionPreset,
  modelsOnGatewayCount,
  offPlatformModelsOnGateway,
  type VisionCluster,
  type VisionDeployment,
  type VisionGateway,
  type VisionOffPlatformModel,
} from '../../../vision/fleetWorld'
import type { VisionDrawerSelection } from '../../../vision/visionDrawer'
import { VisionGridClusterCard } from './VisionGridClusterCard'
import { VisionGridCountHeading } from './VisionGridCountHeading'
import { VisionGridDrawerCard } from './VisionGridDrawerCard'
import { VisionGridGatewayKindLabels } from './VisionGridGatewayKindLabels'
import { VisionGridModelListBadge } from './VisionGridModelListBadge'
import { VisionGridServingKindLabel } from './VisionGridServingKindLabel'
import { visionFleetModelSpecNodes } from './visionFleetModelSpec'
import {
  gatewayRelationsForDeployment,
  gatewayRelationsForOffPlatform,
  visionAdminScopeFooter,
  visionClusterDisplayName,
} from './visionGridServiceMeta'

type VisionGatewayInspectorProps = {
  gateway: VisionGateway
  clusters: VisionCluster[]
  deployments: VisionDeployment[]
  offPlatformModels: VisionOffPlatformModel[]
  highlight: VisionDrawerSelection
  onHighlightCluster: (clusterId: string) => void
  onHighlightDeployment: (deploymentId: string) => void
  onHighlightOffPlatform: (modelId: string) => void
  onViewCluster: (clusterId: string) => void
  onViewDeployment: (deploymentId: string) => void
  onViewOffPlatform: (modelId: string) => void
}

export const VisionGatewayInspector = ({
  gateway,
  clusters,
  deployments,
  offPlatformModels,
  highlight,
  onHighlightCluster,
  onHighlightDeployment,
  onHighlightOffPlatform,
  onViewCluster,
  onViewDeployment,
  onViewOffPlatform,
}: VisionGatewayInspectorProps) => {
  const org = getVisionOrg(gateway.orgId)
  const cluster = clusters.find((entry) => entry.id === gateway.clusterId)
  const gatewayDeployments = deployments.filter(
    (deployment) =>
      deployment.maasGatewayIds.includes(gateway.id) || deployment.attachedGatewayId === gateway.id,
  )
  const gatewayOffPlatform = offPlatformModelsOnGateway(offPlatformModels, gateway.id)
  const modelCount = modelsOnGatewayCount(deployments, offPlatformModels, gateway.id)

  return (
    <Stack hasGutter>
      <StackItem>
        <DescriptionList isCompact aria-label={`${gateway.label} details`}>
          <DescriptionListGroup>
            <DescriptionListTerm>Hostname</DescriptionListTerm>
            <DescriptionListDescription>{gateway.hostname}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Tenant</DescriptionListTerm>
            <DescriptionListDescription>{org.label}</DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </StackItem>
      <StackItem>
        <VisionGridCountHeading id="vision-gateway-cluster" title="Cluster" />
      </StackItem>
      {cluster ? (
        <StackItem>
          <VisionGridClusterCard
            id={`vision-gateway-cluster-${cluster.id}`}
            cluster={cluster}
            isSelected={highlight.kind === 'cluster' && highlight.clusterId === cluster.id}
            onSelect={() => onHighlightCluster(cluster.id)}
            onViewDetails={() => onViewCluster(cluster.id)}
          />
        </StackItem>
      ) : (
        <StackItem>
          <Content component="p">{gateway.clusterId}</Content>
        </StackItem>
      )}
      <StackItem>
        <VisionGridCountHeading id="vision-gateway-maas-models" title="Models" count={modelCount} />
      </StackItem>
      {modelCount === 0 ? (
        <StackItem>
          <Content component="p">No models are on this gateway.</Content>
        </StackItem>
      ) : (
        <>
          {gatewayDeployments.map((deployment) => {
            const preset = getVisionPreset(deployment.presetId)
            const relation = gatewayRelationsForDeployment(deployment, [gateway])[0] ?? {
              gateway,
              isMaas: deployment.maasGatewayIds.includes(gateway.id),
              origin:
                deployment.clusterId === gateway.clusterId ? 'this-cluster' : 'other-cluster',
            }
            return (
              <StackItem key={deployment.id}>
                <VisionGridDrawerCard
                  id={`vision-gateway-maas-${deployment.id}`}
                  name={preset?.displayName ?? deployment.presetId}
                  secondary={preset?.modelId ?? deployment.presetId}
                  specNodes={visionFleetModelSpecNodes({
                    idPrefix: `vision-gateway-maas-${deployment.id}`,
                    clusterName: visionClusterDisplayName(deployment.clusterId, clusters),
                    size: deployment.replicas,
                    clusterVariant:
                      deployment.clusterId === gateway.clusterId ? 'outline' : 'filled',
                  })}
                  footerRows={visionAdminScopeFooter(
                    getVisionOrg(deployment.orgId).label,
                    deployment.projectName,
                  )}
                  isSelected={
                    highlight.kind === 'deployment' && highlight.deploymentId === deployment.id
                  }
                  onSelect={() => onHighlightDeployment(deployment.id)}
                  onViewDetails={() => onViewDeployment(deployment.id)}
                  badge={
                    <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                      <FlexItem>
                        <VisionGridModelListBadge
                          idPrefix={`vision-gateway-maas-${deployment.id}`}
                          status={deployment.status}
                        />
                      </FlexItem>
                      <FlexItem>
                        <VisionGridGatewayKindLabels
                          idPrefix={`vision-gateway-maas-${deployment.id}`}
                          relation={relation}
                        />
                      </FlexItem>
                    </Flex>
                  }
                />
              </StackItem>
            )
          })}
          {gatewayOffPlatform.map((model) => {
            const relation = gatewayRelationsForOffPlatform(model, [gateway])[0] ?? {
              gateway,
              isMaas: true,
              origin:
                model.clusterId === gateway.clusterId ? 'this-cluster' : 'other-cluster',
            }
            return (
              <StackItem key={model.id}>
                <VisionGridDrawerCard
                  id={`vision-gateway-maas-${model.id}`}
                  name={model.displayName}
                  secondary={model.modelId}
                  specNodes={visionFleetModelSpecNodes({
                    idPrefix: `vision-gateway-maas-${model.id}`,
                    clusterName: visionClusterDisplayName(model.clusterId, clusters),
                    servedBy: model.servedBy,
                    clusterVariant: model.clusterId === gateway.clusterId ? 'outline' : 'filled',
                  })}
                  footerRows={visionAdminScopeFooter(
                    getVisionOrg(model.orgId).label,
                    model.projectName,
                  )}
                  isSelected={
                    highlight.kind === 'off-platform-model' && highlight.modelId === model.id
                  }
                  onSelect={() => onHighlightOffPlatform(model.id)}
                  onViewDetails={() => onViewOffPlatform(model.id)}
                  badge={
                    <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                      <FlexItem>
                        <VisionGridServingKindLabel
                          id={`vision-gateway-maas-${model.id}-kind`}
                          kind="external-model"
                        />
                      </FlexItem>
                      <FlexItem>
                        <VisionGridGatewayKindLabels
                          idPrefix={`vision-gateway-maas-${model.id}`}
                          relation={relation}
                        />
                      </FlexItem>
                    </Flex>
                  }
                />
              </StackItem>
            )
          })}
        </>
      )}
    </Stack>
  )
}
