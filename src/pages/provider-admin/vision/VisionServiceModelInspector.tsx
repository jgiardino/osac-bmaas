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
  getVisionPreset,
  isDeploymentMaas,
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
import { VisionGridGatewayRelationList } from './VisionGridGatewayRelationList'
import { VisionGridModelListBadge } from './VisionGridModelListBadge'
import { VisionGridStatusLabel } from './VisionGridStatusLabel'
import { VisionGridUnassignedLabel } from './VisionGridUnassignedLabel'
import { visionFleetModelSpecNodes } from './visionFleetModelSpec'
import {
  gatewayRelationsForDeployment,
  visionAdminScopeFooter,
  visionClusterDisplayName,
} from './visionGridServiceMeta'

type VisionServiceModelInspectorProps = {
  deploymentId: string
  deployments: VisionDeployment[]
  offPlatformModels: VisionOffPlatformModel[]
  clusters: VisionCluster[]
  gateways: VisionGateway[]
  highlight: VisionDrawerSelection
  onHighlightCluster: (clusterId: string) => void
  onHighlightDeployment: (deploymentId: string) => void
  onHighlightGateway: (gatewayId: VisionGateway['id']) => void
  onViewCluster: (clusterId: string) => void
  onViewDeployment: (deploymentId: string) => void
  onViewGateway: (gatewayId: VisionGateway['id']) => void
}

export const VisionServiceModelInspector = ({
  deploymentId,
  deployments,
  offPlatformModels,
  clusters,
  gateways,
  highlight,
  onHighlightCluster,
  onHighlightDeployment,
  onHighlightGateway,
  onViewCluster,
  onViewDeployment,
  onViewGateway,
}: VisionServiceModelInspectorProps) => {
  const deployment = deployments.find((entry) => entry.id === deploymentId)
  if (!deployment) {
    return (
      <Content component="p">This model instance is not running in the current filter.</Content>
    )
  }

  const preset = getVisionPreset(deployment.presetId)
  const cluster = clusters.find((entry) => entry.id === deployment.clusterId)
  const relations = gatewayRelationsForDeployment(deployment, gateways)
  const others = deployments.filter(
    (entry) => entry.presetId === deployment.presetId && entry.id !== deployment.id,
  )
  const isMaas = isDeploymentMaas(deployment)

  return (
    <Stack hasGutter>
      <StackItem>
        <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <VisionGridStatusLabel id="vision-service-model-status" status={deployment.status} />
          </FlexItem>
        </Flex>
      </StackItem>
      <StackItem>
        <DescriptionList isCompact aria-label="Model instance details">
          <DescriptionListGroup>
            <DescriptionListTerm>Display name</DescriptionListTerm>
            <DescriptionListDescription>
              {preset?.displayName ?? deployment.presetId}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Model ID</DescriptionListTerm>
            <DescriptionListDescription>
              {preset?.modelId ?? deployment.presetId}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Size</DescriptionListTerm>
            <DescriptionListDescription>{deployment.replicas}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Traffic</DescriptionListTerm>
            <DescriptionListDescription>{deployment.reqPerMin} req/min</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Tenant</DescriptionListTerm>
            <DescriptionListDescription>{getVisionOrg(deployment.orgId).label}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Project</DescriptionListTerm>
            <DescriptionListDescription>{deployment.projectName}</DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </StackItem>
      <StackItem>
        <VisionGridCountHeading
          id="vision-service-model-cluster"
          title="Cluster"
          count={cluster ? 1 : 0}
        />
      </StackItem>
      {cluster ? (
        <StackItem>
          <VisionGridClusterCard
            id={`vision-service-model-cluster-${cluster.id}`}
            cluster={cluster}
            isSelected={highlight.kind === 'cluster' && highlight.clusterId === cluster.id}
            onSelect={() => onHighlightCluster(cluster.id)}
            onViewDetails={() => onViewCluster(cluster.id)}
          />
        </StackItem>
      ) : (
        <StackItem>
          <Content component="p">{deployment.clusterId}</Content>
        </StackItem>
      )}
      {!isMaas && relations.length > 0 ? (
        <StackItem>
          <Content component="p">Connected to a gateway. Not published as MaaS yet.</Content>
          <Content component="p" className="pf-v6-u-text-color-subtle">
            Next, you will be able to make this instance available as a service by selecting a
            gateway.
          </Content>
        </StackItem>
      ) : null}
      {!isMaas && relations.length === 0 ? (
        <StackItem>
          <Content component="p">
            This instance is not connected to a gateway and is not available as a service.
          </Content>
          <Content component="p" className="pf-v6-u-text-color-subtle">
            Next, you will be able to make this instance available as a service by selecting a
            gateway.
          </Content>
        </StackItem>
      ) : null}
      <StackItem>
        <VisionGridCountHeading
          id="vision-service-model-maas-gateways"
          title="Gateway"
          count={relations.length}
        />
      </StackItem>
      {relations.length === 0 ? (
        <StackItem>
          <VisionGridUnassignedLabel id="vision-service-model-unassigned" />
        </StackItem>
      ) : (
        relations.map((relation) => {
          return (
            <StackItem key={relation.gateway.id}>
              <VisionGridDrawerCard
                id={`vision-service-model-maas-${relation.gateway.id}`}
                name={relation.gateway.label}
                secondary={relation.gateway.hostname}
                specNodes={[
                  ...(relation.origin === 'other-cluster'
                    ? [
                        {
                          label: 'Cluster',
                          value: (
                            <VisionGridClusterIdLabel
                              id={`vision-service-model-maas-${relation.gateway.id}-cluster`}
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
                    idPrefix={`vision-service-model-maas-${relation.gateway.id}`}
                    relation={relation}
                  />
                }
              />
            </StackItem>
          )
        })
      )}
      <StackItem>
        <VisionGridCountHeading
          id="vision-service-model-running-on"
          title="Other instances"
          count={others.length}
        />
      </StackItem>
      {others.length === 0 ? (
        <StackItem>
          <Content component="p">This is the only instance of this offering in the current filter.</Content>
        </StackItem>
      ) : (
        others.map((other) => {
          const org = getVisionOrg(other.orgId)
          return (
            <StackItem key={other.id}>
              <VisionGridDrawerCard
                id={`vision-also-on-${other.id}`}
                name={preset?.displayName ?? other.presetId}
                secondary={preset?.modelId ?? other.presetId}
                specNodes={visionFleetModelSpecNodes({
                  idPrefix: `vision-also-on-${other.id}`,
                  clusterName: visionClusterDisplayName(other.clusterId, clusters),
                  size: other.replicas,
                })}
                extra={
                  <VisionGridGatewayRelationList
                    idPrefix={`vision-also-on-${other.id}`}
                    relations={gatewayRelationsForDeployment(other, gateways)}
                  />
                }
                footerRows={visionAdminScopeFooter(org.label, other.projectName)}
                isSelected={highlight.kind === 'deployment' && highlight.deploymentId === other.id}
                onSelect={() => onHighlightDeployment(other.id)}
                onViewDetails={() => onViewDeployment(other.id)}
                badge={
                  <VisionGridModelListBadge
                    idPrefix={`vision-also-on-${other.id}`}
                    status={other.status}
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
