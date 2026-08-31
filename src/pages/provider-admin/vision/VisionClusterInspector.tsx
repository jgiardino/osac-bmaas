import {
  Content,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  Label,
  Stack,
  StackItem,
} from '@patternfly/react-core'
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
import type { VisionDrawerSelection } from '../../../vision/visionDrawer'
import { VisionGridCountHeading } from './VisionGridCountHeading'
import { VisionGridDrawerCard } from './VisionGridDrawerCard'
import { VisionGridGatewayRelationList } from './VisionGridGatewayRelationList'
import { VisionGridModelListBadge } from './VisionGridModelListBadge'
import { visionFleetModelSpecNodes } from './visionFleetModelSpec'
import {
  gatewayRelationsForDeployment,
  visionAdminScopeFooter,
  visionGatewayListSpecRows,
} from './visionGridServiceMeta'

type VisionClusterInspectorProps = {
  cluster: VisionCluster | null
  deployments: VisionDeployment[]
  fleetDeployments: VisionDeployment[]
  offPlatformModels: VisionOffPlatformModel[]
  gateways: VisionGateway[]
  highlight: VisionDrawerSelection
  onHighlightDeployment: (deploymentId: string) => void
  onHighlightGateway: (gatewayId: VisionGateway['id']) => void
  onViewDeployment: (deploymentId: string) => void
  onViewGateway: (gatewayId: VisionGateway['id']) => void
}

export const VisionClusterInspector = ({
  cluster,
  deployments,
  fleetDeployments,
  offPlatformModels,
  gateways: visibleGateways,
  highlight,
  onHighlightDeployment,
  onHighlightGateway,
  onViewDeployment,
  onViewGateway,
}: VisionClusterInspectorProps) => {
  if (!cluster) {
    return (
      <Stack hasGutter>
        <StackItem>
          <Content component="p">
            This cluster is hidden by the tenant filter. Use Catalog or Services to return to the
            list.
          </Content>
        </StackItem>
      </Stack>
    )
  }

  const site = getVisionSite(cluster.siteId)
  const org = getVisionOrg(cluster.orgId)
  const gateways = visibleGateways.filter((gateway) => gateway.clusterId === cluster.id)
  const isAvailable = cluster.health === 'available'

  return (
    <Stack hasGutter>
      <StackItem>
        <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <Label color={isAvailable ? 'green' : 'red'} isCompact>
              {isAvailable ? 'Available' : 'Unavailable'}
            </Label>
          </FlexItem>
          <FlexItem>
            <Content component="small">
              {cluster.nodesReady}/{cluster.nodeCount} nodes ready
            </Content>
          </FlexItem>
        </Flex>
      </StackItem>
      <StackItem>
        <DescriptionList isCompact aria-label={`${cluster.name} details`}>
          <DescriptionListGroup>
            <DescriptionListTerm>Site</DescriptionListTerm>
            <DescriptionListDescription>
              {site.label} · {site.regionLabel}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Platform</DescriptionListTerm>
            <DescriptionListDescription>
              {cluster.platform} · {cluster.region}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>OpenShift</DescriptionListTerm>
            <DescriptionListDescription>{cluster.openshiftVersion}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>GPUs</DescriptionListTerm>
            <DescriptionListDescription>
              {cluster.gpuCount} · {cluster.gpuUtilPercent}% utilized
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Tenant</DescriptionListTerm>
            <DescriptionListDescription>{org.label}</DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </StackItem>
      <StackItem>
        <VisionGridCountHeading
          id="vision-cluster-gateways"
          title="Gateways"
          count={gateways.length}
        />
      </StackItem>
      {gateways.length === 0 ? (
        <StackItem>
          <Content component="p">No gateways are provisioned on this cluster.</Content>
        </StackItem>
      ) : (
        gateways.map((gateway) => (
          <StackItem key={gateway.id}>
            <VisionGridDrawerCard
              id={`vision-cluster-gateway-${gateway.id}`}
              name={gateway.label}
              secondary={gateway.hostname}
              specRows={visionGatewayListSpecRows({
                modelCount: modelsOnGatewayCount(fleetDeployments, offPlatformModels, gateway.id),
                includeCluster: false,
              })}
              footerRows={[{ label: 'Tenant', value: org.label }]}
              isSelected={highlight.kind === 'gateway' && highlight.gatewayId === gateway.id}
              onSelect={() => onHighlightGateway(gateway.id)}
              onViewDetails={() => onViewGateway(gateway.id)}
            />
          </StackItem>
        ))
      )}
      <StackItem>
        <VisionGridCountHeading
          id="vision-cluster-running-models"
          title="Model instances"
          count={deployments.length}
        />
      </StackItem>
      {deployments.length === 0 ? (
        <StackItem>
          <Content component="p">No model instances provisioned on this cluster.</Content>
        </StackItem>
      ) : (
        deployments.map((deployment) => {
          const preset = getVisionPreset(deployment.presetId)
          return (
            <StackItem key={deployment.id}>
              <VisionGridDrawerCard
                id={`vision-running-${deployment.id}`}
                name={preset?.displayName ?? deployment.presetId}
                secondary={preset?.modelId ?? deployment.presetId}
                specNodes={visionFleetModelSpecNodes({
                  idPrefix: `vision-running-${deployment.id}`,
                  clusterName: cluster.name,
                  size: deployment.replicas,
                  includeCluster: false,
                })}
                extra={
                  <VisionGridGatewayRelationList
                    idPrefix={`vision-running-${deployment.id}`}
                    relations={gatewayRelationsForDeployment(deployment, visibleGateways)}
                    clusterReveal="other-only"
                  />
                }
                footerRows={visionAdminScopeFooter(org.label, deployment.projectName)}
                isSelected={
                  highlight.kind === 'deployment' && highlight.deploymentId === deployment.id
                }
                onSelect={() => onHighlightDeployment(deployment.id)}
                onViewDetails={() => onViewDeployment(deployment.id)}
                badge={
                  <VisionGridModelListBadge
                    idPrefix={`vision-running-${deployment.id}`}
                    status={deployment.status}
                  />
                }
              />
            </StackItem>
          )
        })
      )}
    </Stack>
  )
}
