import {
  Button,
  Content,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Stack,
  StackItem,
} from '@patternfly/react-core'
import {
  getVisionGateway,
  getVisionOrg,
  getVisionPreset,
  getVisionSite,
  homeMaasOrigin,
  isDeploymentMaas,
  visibleGatewaysById,
  type VisionCluster,
  type VisionDeployment,
  type VisionGateway,
} from '../../../vision/fleetWorld'
import type { VisionDrawerSelection } from '../../../vision/visionDrawer'
import { VisionGridCountHeading } from './VisionGridCountHeading'
import { VisionGridDrawerCard } from './VisionGridDrawerCard'
import { VisionGridModelLabels } from './VisionGridModelLabels'

type VisionServiceModelInspectorProps = {
  deploymentId: string
  deployments: VisionDeployment[]
  clusters: VisionCluster[]
  gateways: VisionGateway[]
  highlight: VisionDrawerSelection
  onHighlightDeployment: (deploymentId: string) => void
  onHighlightGateway: (gatewayId: VisionGateway['id']) => void
  onViewCluster: (clusterId: string) => void
  onViewDeployment: (deploymentId: string) => void
  onViewGateway: (gatewayId: VisionGateway['id']) => void
}

export const VisionServiceModelInspector = ({
  deploymentId,
  deployments,
  clusters,
  gateways,
  highlight,
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
  const attachedGateway = deployment.attachedGatewayId
    ? (gateways.find((gateway) => gateway.id === deployment.attachedGatewayId) ??
      getVisionGateway(deployment.attachedGatewayId))
    : undefined
  const maasGateways = visibleGatewaysById(deployment.maasGatewayIds, gateways)
  const localMaasGateways = maasGateways.filter(
    (gateway) => gateway.clusterId === deployment.clusterId,
  )
  const externalMaasGateways = maasGateways.filter(
    (gateway) => gateway.clusterId !== deployment.clusterId,
  )
  const others = deployments.filter(
    (entry) => entry.presetId === deployment.presetId && entry.id !== deployment.id,
  )
  const isMaas = isDeploymentMaas(deployment)
  const origin = homeMaasOrigin(deployment)

  return (
    <Stack hasGutter>
      <StackItem>
        <VisionGridModelLabels
          idPrefix="vision-service-model"
          isMaas={isMaas}
          origin={origin}
          status={deployment.status}
        />
      </StackItem>
      <StackItem>
        <DescriptionList isCompact aria-label="Model instance details">
          <DescriptionListGroup>
            <DescriptionListTerm>Offering</DescriptionListTerm>
            <DescriptionListDescription>
              {preset?.displayName ?? deployment.presetId}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Stable name</DescriptionListTerm>
            <DescriptionListDescription>
              {preset?.stableName ?? deployment.presetId}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Cluster</DescriptionListTerm>
            <DescriptionListDescription>
              {cluster ? (
                <Button variant="link" isInline onClick={() => onViewCluster(cluster.id)}>
                  {cluster.name}
                </Button>
              ) : (
                deployment.clusterId
              )}
            </DescriptionListDescription>
          </DescriptionListGroup>
          {cluster ? (
            <>
              <DescriptionListGroup>
                <DescriptionListTerm>Site</DescriptionListTerm>
                <DescriptionListDescription>
                  {getVisionSite(cluster.siteId).regionLabel}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Tenant</DescriptionListTerm>
                <DescriptionListDescription>
                  {getVisionOrg(cluster.orgId).label}
                </DescriptionListDescription>
              </DescriptionListGroup>
            </>
          ) : null}
          <DescriptionListGroup>
            <DescriptionListTerm>Gateway on this cluster</DescriptionListTerm>
            <DescriptionListDescription>
              {attachedGateway ? (
                <Button
                  variant="link"
                  isInline
                  onClick={() => {
                    onHighlightGateway(attachedGateway.id)
                    onViewGateway(attachedGateway.id)
                  }}
                >
                  {attachedGateway.label}
                </Button>
              ) : (
                'None'
              )}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Replicas</DescriptionListTerm>
            <DescriptionListDescription>{deployment.replicas}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Traffic</DescriptionListTerm>
            <DescriptionListDescription>{deployment.reqPerMin} req/min</DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </StackItem>
      {!isMaas && attachedGateway ? (
        <StackItem>
          <Content component="p">
            Connected to gateway {attachedGateway.label}. Not available as a service yet.
          </Content>
          <Content component="p" className="pf-v6-u-text-color-subtle">
            Next, you will be able to make this instance available as a service by selecting a
            gateway.
          </Content>
        </StackItem>
      ) : null}
      {!isMaas && !attachedGateway ? (
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
      {isMaas ? (
        <>
          <StackItem>
            <VisionGridCountHeading
              id="vision-service-model-maas-gateways"
              title="Available as a service on"
              count={maasGateways.length}
            />
          </StackItem>
          {localMaasGateways.length === 0 && externalMaasGateways.length === 0 ? (
            <StackItem>
              <Content component="p">
                This instance is available as a service on gateways you cannot see with the current
                tenant filter.
              </Content>
            </StackItem>
          ) : (
            [...localMaasGateways, ...externalMaasGateways].map((gateway) => {
              const gatewayCluster = clusters.find((entry) => entry.id === gateway.clusterId)
              const originOnGateway =
                gateway.clusterId === deployment.clusterId ? 'internal' : 'external'
              return (
                <StackItem key={gateway.id}>
                  <VisionGridDrawerCard
                    id={`vision-service-model-maas-${gateway.id}`}
                    name={gateway.label}
                    secondary={gateway.hostname}
                    specRows={[{ label: 'Cluster', value: gatewayCluster?.name ?? gateway.clusterId }]}
                    footerRows={[{ label: 'Tenant', value: getVisionOrg(gateway.orgId).label }]}
                    isSelected={highlight.kind === 'gateway' && highlight.gatewayId === gateway.id}
                    onSelect={() => onHighlightGateway(gateway.id)}
                    onViewDetails={() => onViewGateway(gateway.id)}
                    badge={
                      <VisionGridModelLabels
                        idPrefix={`vision-service-model-maas-${gateway.id}`}
                        isMaas
                        origin={originOnGateway}
                      />
                    }
                  />
                </StackItem>
              )
            })
          )}
        </>
      ) : null}
      <StackItem>
        <VisionGridCountHeading
          id="vision-service-model-running-on"
          title="Also placed on"
          count={others.length}
        />
      </StackItem>
      {others.length === 0 ? (
        <StackItem>
          <Content component="p">This is the only instance of this offering in the current filter.</Content>
        </StackItem>
      ) : (
        others.map((other) => {
          const otherCluster = clusters.find((entry) => entry.id === other.clusterId)
          if (!otherCluster) {
            return null
          }
          const site = getVisionSite(otherCluster.siteId)
          const org = getVisionOrg(otherCluster.orgId)
          return (
            <StackItem key={other.id}>
              <VisionGridDrawerCard
                id={`vision-also-on-${other.id}`}
                name={`${preset?.stableName ?? other.presetId} on ${otherCluster.name}`}
                secondary={preset?.displayName}
                specRows={[
                  { label: 'Model', value: preset?.stableName ?? other.presetId },
                  { label: 'Size', value: other.replicas },
                  { label: 'Site', value: site.regionLabel },
                ]}
                footerRows={[{ label: 'Tenant', value: org.label }]}
                isSelected={highlight.kind === 'deployment' && highlight.deploymentId === other.id}
                onSelect={() => onHighlightDeployment(other.id)}
                onViewDetails={() => onViewDeployment(other.id)}
                badge={
                  <VisionGridModelLabels
                    idPrefix={`vision-also-on-${other.id}`}
                    isMaas={isDeploymentMaas(other)}
                    origin={homeMaasOrigin(other)}
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
