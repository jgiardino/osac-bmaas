import {
  Button,
  Content,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Label,
  Stack,
  StackItem,
} from '@patternfly/react-core'
import {
  deploymentsOnGatewayAsMaas,
  getVisionOrg,
  getVisionPreset,
  getVisionSite,
  maasOriginOnGateway,
  offPlatformModelsOnGateway,
  type VisionCluster,
  type VisionDeployment,
  type VisionGateway,
  type VisionOffPlatformModel,
} from '../../../vision/fleetWorld'
import type { VisionDrawerSelection } from '../../../vision/visionDrawer'
import { VisionGridCountHeading } from './VisionGridCountHeading'
import { VisionGridDrawerCard } from './VisionGridDrawerCard'
import { VisionGridModelLabels } from './VisionGridModelLabels'

type VisionGatewayInspectorProps = {
  gateway: VisionGateway
  clusters: VisionCluster[]
  deployments: VisionDeployment[]
  offPlatformModels: VisionOffPlatformModel[]
  highlight: VisionDrawerSelection
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
  onHighlightDeployment,
  onHighlightOffPlatform,
  onViewCluster,
  onViewDeployment,
  onViewOffPlatform,
}: VisionGatewayInspectorProps) => {
  const org = getVisionOrg(gateway.orgId)
  const cluster = clusters.find((entry) => entry.id === gateway.clusterId)
  const site = cluster ? getVisionSite(cluster.siteId) : null
  const maasDeployments = deploymentsOnGatewayAsMaas(deployments, gateway.id)
  const maasOffPlatform = offPlatformModelsOnGateway(offPlatformModels, gateway.id)
  const maasCount = maasDeployments.length + maasOffPlatform.length

  return (
    <Stack hasGutter>
      <StackItem>
        <Label color="blue" isCompact>
          Gateway
        </Label>
      </StackItem>
      <StackItem>
        <DescriptionList isCompact aria-label={`${gateway.label} details`}>
          <DescriptionListGroup>
            <DescriptionListTerm>Hostname</DescriptionListTerm>
            <DescriptionListDescription>{gateway.hostname}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Cluster</DescriptionListTerm>
            <DescriptionListDescription>
              {cluster ? (
                <Button variant="link" isInline onClick={() => onViewCluster(cluster.id)}>
                  {cluster.name}
                </Button>
              ) : (
                gateway.clusterId
              )}
            </DescriptionListDescription>
          </DescriptionListGroup>
          {site ? (
            <DescriptionListGroup>
              <DescriptionListTerm>Site</DescriptionListTerm>
              <DescriptionListDescription>
                {site.label} · {site.regionLabel}
              </DescriptionListDescription>
            </DescriptionListGroup>
          ) : null}
          <DescriptionListGroup>
            <DescriptionListTerm>Tenant</DescriptionListTerm>
            <DescriptionListDescription>{org.label}</DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </StackItem>
      <StackItem>
        <VisionGridCountHeading id="vision-gateway-maas-models" title="MaaS models" count={maasCount} />
      </StackItem>
      {maasCount === 0 ? (
        <StackItem>
          <Content component="p">No models are available as a service on this gateway.</Content>
        </StackItem>
      ) : (
        <>
          {maasDeployments.map((deployment) => {
            const preset = getVisionPreset(deployment.presetId)
            const origin = maasOriginOnGateway(deployment, gateway)
            const homeCluster = clusters.find((entry) => entry.id === deployment.clusterId)
            return (
              <StackItem key={deployment.id}>
                <VisionGridDrawerCard
                  id={`vision-gateway-maas-${deployment.id}`}
                  name={preset?.stableName ?? deployment.presetId}
                  secondary={preset?.displayName}
                  specRows={[
                    { label: 'Cluster', value: homeCluster?.name ?? deployment.clusterId },
                    { label: 'Size', value: deployment.replicas },
                  ]}
                  footerRows={[{ label: 'Tenant', value: getVisionOrg(deployment.orgId).label }]}
                  isSelected={
                    highlight.kind === 'deployment' && highlight.deploymentId === deployment.id
                  }
                  onSelect={() => onHighlightDeployment(deployment.id)}
                  onViewDetails={() => onViewDeployment(deployment.id)}
                  badge={
                    <VisionGridModelLabels
                      idPrefix={`vision-gateway-maas-${deployment.id}`}
                      isMaas
                      origin={origin}
                      status={deployment.status}
                    />
                  }
                />
              </StackItem>
            )
          })}
          {maasOffPlatform.map((model) => (
            <StackItem key={model.id}>
              <VisionGridDrawerCard
                id={`vision-gateway-maas-${model.id}`}
                name={model.displayName}
                secondary={model.servedBy}
                specRows={[
                  { label: 'Served by', value: model.servedBy },
                  { label: 'Stable name', value: model.stableName },
                ]}
                footerRows={[{ label: 'Tenant', value: getVisionOrg(model.orgId).label }]}
                isSelected={
                  highlight.kind === 'off-platform-model' && highlight.modelId === model.id
                }
                onSelect={() => onHighlightOffPlatform(model.id)}
                onViewDetails={() => onViewOffPlatform(model.id)}
                badge={
                  <VisionGridModelLabels
                    idPrefix={`vision-gateway-maas-${model.id}`}
                    isMaas
                    origin="external"
                  />
                }
              />
            </StackItem>
          ))}
        </>
      )}
    </Stack>
  )
}
