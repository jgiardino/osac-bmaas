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
  formatModelCount,
  getVisionOrg,
  modelsOnGatewayCount,
  type VisionCluster,
  type VisionDeployment,
  type VisionGateway,
  type VisionOffPlatformModel,
} from '../../../vision/fleetWorld'
import type { VisionDrawerSelection } from '../../../vision/visionDrawer'
import { VisionGridClusterCard } from './VisionGridClusterCard'
import { VisionGridClusterIdLabel } from './VisionGridClusterIdLabel'
import { VisionGridCountHeading } from './VisionGridCountHeading'
import { VisionGridDrawerCard } from './VisionGridDrawerCard'
import { VisionGridGatewayKindLabels } from './VisionGridGatewayKindLabels'
import { VisionGridServingKindLabel } from './VisionGridServingKindLabel'
import { VisionGridStatusLabel } from './VisionGridStatusLabel'
import { VisionGridUnassignedLabel } from './VisionGridUnassignedLabel'
import { gatewayRelationsForOffPlatform } from './visionGridServiceMeta'

type VisionOffPlatformModelInspectorProps = {
  model: VisionOffPlatformModel
  clusters: VisionCluster[]
  deployments: VisionDeployment[]
  offPlatformModels: VisionOffPlatformModel[]
  gateways: VisionGateway[]
  highlight: VisionDrawerSelection
  onHighlightCluster: (clusterId: string) => void
  onHighlightGateway: (gatewayId: VisionGateway['id']) => void
  onViewCluster: (clusterId: string) => void
  onViewGateway: (gatewayId: VisionGateway['id']) => void
}

export const VisionOffPlatformModelInspector = ({
  model,
  clusters,
  deployments,
  offPlatformModels,
  gateways,
  highlight,
  onHighlightCluster,
  onHighlightGateway,
  onViewCluster,
  onViewGateway,
}: VisionOffPlatformModelInspectorProps) => {
  const org = getVisionOrg(model.orgId)
  const cluster = clusters.find((entry) => entry.id === model.clusterId)
  const relations = gatewayRelationsForOffPlatform(model, gateways)

  return (
    <Stack hasGutter>
      <StackItem>
        <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <VisionGridStatusLabel id="vision-off-platform-model-status" status="Ready" />
          </FlexItem>
          <FlexItem>
            <VisionGridServingKindLabel id="vision-off-platform-model-kind" kind="external-model" />
          </FlexItem>
        </Flex>
      </StackItem>
      <StackItem>
        <DescriptionList isCompact aria-label={`${model.displayName} details`}>
          <DescriptionListGroup>
            <DescriptionListTerm>Display name</DescriptionListTerm>
            <DescriptionListDescription>{model.displayName}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Model ID</DescriptionListTerm>
            <DescriptionListDescription>{model.modelId}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Served by</DescriptionListTerm>
            <DescriptionListDescription>{model.servedBy}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Tenant</DescriptionListTerm>
            <DescriptionListDescription>{org.label}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Project</DescriptionListTerm>
            <DescriptionListDescription>{model.projectName}</DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </StackItem>
      <StackItem>
        <Content component="p">
          This is an external model. The object lives in a project on a cluster; inference is
          served by {model.servedBy}.
        </Content>
      </StackItem>
      <StackItem>
        <VisionGridCountHeading
          id="vision-off-platform-model-cluster"
          title="Cluster"
          count={cluster ? 1 : 0}
        />
      </StackItem>
      {cluster ? (
        <StackItem>
          <VisionGridClusterCard
            id={`vision-off-platform-model-cluster-${cluster.id}`}
            cluster={cluster}
            isSelected={highlight.kind === 'cluster' && highlight.clusterId === cluster.id}
            onSelect={() => onHighlightCluster(cluster.id)}
            onViewDetails={() => onViewCluster(cluster.id)}
          />
        </StackItem>
      ) : (
        <StackItem>
          <Content component="p">{model.clusterId}</Content>
        </StackItem>
      )}
      <StackItem>
        <VisionGridCountHeading
          id="vision-off-platform-maas-gateways"
          title="Gateway"
          count={relations.length}
        />
      </StackItem>
      {relations.length === 0 ? (
        <StackItem>
          <VisionGridUnassignedLabel id="vision-off-platform-unassigned" />
        </StackItem>
      ) : (
        relations.map((relation) => {
          return (
            <StackItem key={relation.gateway.id}>
              <VisionGridDrawerCard
                id={`vision-off-platform-gateway-${relation.gateway.id}`}
                name={relation.gateway.label}
                secondary={relation.gateway.hostname}
                specNodes={[
                  ...(relation.origin === 'other-cluster'
                    ? [
                        {
                          label: 'Cluster',
                          value: (
                            <VisionGridClusterIdLabel
                              id={`vision-off-platform-gateway-${relation.gateway.id}-cluster`}
                              clusterId={relation.gateway.clusterId}
                              variant="filled"
                            />
                          ),
                        },
                      ]
                    : []),
                  {
                    label: 'Models',
                    value: formatModelCount(
                      modelsOnGatewayCount(deployments, offPlatformModels, relation.gateway.id),
                    ),
                  },
                ]}
                footerRows={[{ label: 'Tenant', value: getVisionOrg(relation.gateway.orgId).label }]}
                isSelected={
                  highlight.kind === 'gateway' && highlight.gatewayId === relation.gateway.id
                }
                onSelect={() => onHighlightGateway(relation.gateway.id)}
                onViewDetails={() => onViewGateway(relation.gateway.id)}
                badge={
                  <VisionGridGatewayKindLabels
                    idPrefix={`vision-off-platform-gateway-${relation.gateway.id}`}
                    relation={relation}
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
