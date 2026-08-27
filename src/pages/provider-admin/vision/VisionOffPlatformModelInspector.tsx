import {
  Content,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Stack,
  StackItem,
} from '@patternfly/react-core'
import {
  getVisionOrg,
  visibleGatewaysById,
  type VisionCluster,
  type VisionGateway,
  type VisionOffPlatformModel,
} from '../../../vision/fleetWorld'
import type { VisionDrawerSelection } from '../../../vision/visionDrawer'
import { VisionGridCountHeading } from './VisionGridCountHeading'
import { VisionGridDrawerCard } from './VisionGridDrawerCard'
import { VisionGridModelLabels } from './VisionGridModelLabels'

type VisionOffPlatformModelInspectorProps = {
  model: VisionOffPlatformModel
  clusters: VisionCluster[]
  gateways: VisionGateway[]
  highlight: VisionDrawerSelection
  onHighlightGateway: (gatewayId: VisionGateway['id']) => void
  onViewGateway: (gatewayId: VisionGateway['id']) => void
}

export const VisionOffPlatformModelInspector = ({
  model,
  clusters,
  gateways,
  highlight,
  onHighlightGateway,
  onViewGateway,
}: VisionOffPlatformModelInspectorProps) => {
  const org = getVisionOrg(model.orgId)
  const maasGateways = visibleGatewaysById(model.gatewayIds, gateways)

  return (
    <Stack hasGutter>
      <StackItem>
        <VisionGridModelLabels
          idPrefix="vision-off-platform-model"
          isMaas
          origin="external"
        />
      </StackItem>
      <StackItem>
        <DescriptionList isCompact aria-label={`${model.displayName} details`}>
          <DescriptionListGroup>
            <DescriptionListTerm>Offering</DescriptionListTerm>
            <DescriptionListDescription>{model.displayName}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Stable name</DescriptionListTerm>
            <DescriptionListDescription>{model.stableName}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Served by</DescriptionListTerm>
            <DescriptionListDescription>{model.servedBy}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Cluster</DescriptionListTerm>
            <DescriptionListDescription>
              Not running on a cluster on this platform
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Tenant</DescriptionListTerm>
            <DescriptionListDescription>{org.label}</DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </StackItem>
      <StackItem>
        <Content component="p">
          This model is available as a service on gateways you can access. It is always an external
          MaaS model.
        </Content>
      </StackItem>
      <StackItem>
        <VisionGridCountHeading
          id="vision-off-platform-maas-gateways"
          title="Available as a service on"
          count={maasGateways.length}
        />
      </StackItem>
      {maasGateways.length === 0 ? (
        <StackItem>
          <Content component="p">
            No gateways for this model are visible with the current tenant filter.
          </Content>
        </StackItem>
      ) : (
        maasGateways.map((gateway) => {
          const gatewayCluster = clusters.find((entry) => entry.id === gateway.clusterId)
          return (
            <StackItem key={gateway.id}>
              <VisionGridDrawerCard
                id={`vision-off-platform-gateway-${gateway.id}`}
                name={gateway.label}
                secondary={gateway.hostname}
                specRows={[{ label: 'Cluster', value: gatewayCluster?.name ?? gateway.clusterId }]}
                footerRows={[{ label: 'Tenant', value: getVisionOrg(gateway.orgId).label }]}
                isSelected={highlight.kind === 'gateway' && highlight.gatewayId === gateway.id}
                onSelect={() => onHighlightGateway(gateway.id)}
                onViewDetails={() => onViewGateway(gateway.id)}
                badge={
                  <VisionGridModelLabels
                    idPrefix={`vision-off-platform-gateway-${gateway.id}`}
                    isMaas
                    origin="external"
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
