import { useLocation } from 'react-router-dom'
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
  getVisionSite,
  modelsOnGatewayCount,
  type VisionCluster,
  type VisionDeployment,
  type VisionGateway,
  type VisionOffPlatformModel,
} from '../../../vision/fleetWorld'
import { ModelsInstanceCard } from '../../../components/catalog/ModelsInstanceCard'
import { modelsOnCluster } from '../../../vision/modelInstanceSeed'
import type { VisionDrawerSelection } from '../../../vision/visionDrawer'
import { VisionGridCountHeading } from './VisionGridCountHeading'
import { VisionGridGatewayCard } from './VisionGridGatewayCard'

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
  fleetDeployments,
  offPlatformModels,
  gateways: visibleGateways,
  highlight,
  onHighlightGateway,
  onViewGateway,
}: VisionClusterInspectorProps) => {
  const { pathname } = useLocation()
  const showTenant = pathname.startsWith('/provider')
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
  const nestedModels = modelsOnCluster(cluster.id)

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
            <VisionGridGatewayCard
              id={`vision-cluster-gateway-${gateway.id}`}
              gateway={gateway}
              modelCount={modelsOnGatewayCount(fleetDeployments, offPlatformModels, gateway.id)}
              includeCluster={false}
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
          count={nestedModels.length}
        />
      </StackItem>
      {nestedModels.length === 0 ? (
        <StackItem>
          <Content component="p">No model instances provisioned on this cluster.</Content>
        </StackItem>
      ) : (
        nestedModels.map((item) => (
          <StackItem key={item.id}>
            <ModelsInstanceCard
              item={item}
              variant="compact"
              parent="cluster"
              showTenant={showTenant}
              idPrefix="vision-cluster-model"
            />
          </StackItem>
        ))
      )}
    </Stack>
  )
}
