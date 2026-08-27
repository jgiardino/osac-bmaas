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
  getVisionGateway,
  getVisionOrg,
  getVisionPreset,
  getVisionSite,
  type VisionCluster,
  type VisionDeployment,
} from '../../../vision/fleetWorld'
import type { VisionDrawerSelection } from '../../../vision/visionDrawer'
import { VisionGridCountHeading } from './VisionGridCountHeading'
import { VisionGridDrawerCard } from './VisionGridDrawerCard'

type VisionServiceModelInspectorProps = {
  deploymentId: string
  deployments: VisionDeployment[]
  clusters: VisionCluster[]
  highlight: VisionDrawerSelection
  onHighlightDeployment: (deploymentId: string) => void
  onViewCluster: (clusterId: string) => void
  onViewDeployment: (deploymentId: string) => void
}

export const VisionServiceModelInspector = ({
  deploymentId,
  deployments,
  clusters,
  highlight,
  onHighlightDeployment,
  onViewCluster,
  onViewDeployment,
}: VisionServiceModelInspectorProps) => {
  const deployment = deployments.find((entry) => entry.id === deploymentId)
  if (!deployment) {
    return (
      <Content component="p">This model instance is not running in the current filter.</Content>
    )
  }

  const preset = getVisionPreset(deployment.presetId)
  const cluster = clusters.find((entry) => entry.id === deployment.clusterId)
  const others = deployments.filter(
    (entry) => entry.presetId === deployment.presetId && entry.id !== deployment.id,
  )

  return (
    <Stack hasGutter>
      <StackItem>
        <Label color="green" isCompact>
          {deployment.status}
        </Label>
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
                  {getVisionSite(cluster.siteId).regionLabel} · {getVisionGateway(cluster.gatewayId).label}
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
            <DescriptionListTerm>Replicas</DescriptionListTerm>
            <DescriptionListDescription>{deployment.replicas}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Traffic</DescriptionListTerm>
            <DescriptionListDescription>{deployment.reqPerMin} req/min</DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </StackItem>
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
                  <Label color="green" isCompact>
                    {other.status}
                  </Label>
                }
              />
            </StackItem>
          )
        })
      )}
    </Stack>
  )
}
