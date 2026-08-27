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

type VisionClusterInspectorProps = {
  cluster: VisionCluster | null
  deployments: VisionDeployment[]
  highlight: VisionDrawerSelection
  onHighlightDeployment: (deploymentId: string) => void
  onViewDeployment: (deploymentId: string) => void
}

export const VisionClusterInspector = ({
  cluster,
  deployments,
  highlight,
  onHighlightDeployment,
  onViewDeployment,
}: VisionClusterInspectorProps) => {
  if (!cluster) {
    return (
      <Stack hasGutter>
        <StackItem>
          <Content component="p">
            This cluster is hidden by the organization or gateway filter. Use Catalog or Services to
            return to the list.
          </Content>
        </StackItem>
      </Stack>
    )
  }

  const site = getVisionSite(cluster.siteId)
  const org = getVisionOrg(cluster.orgId)
  const gateway = getVisionGateway(cluster.gatewayId)
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
          <DescriptionListGroup>
            <DescriptionListTerm>Gateway</DescriptionListTerm>
            <DescriptionListDescription>
              {gateway.label} · {gateway.hostname}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </StackItem>
      <StackItem>
        <VisionGridCountHeading
          id="vision-cluster-running-models"
          title="Running models"
          count={deployments.length}
        />
      </StackItem>
      {deployments.length === 0 ? (
        <StackItem>
          <Content component="p">No model instances running on this cluster.</Content>
        </StackItem>
      ) : (
        deployments.map((deployment) => {
          const preset = getVisionPreset(deployment.presetId)
          return (
            <StackItem key={deployment.id}>
              <VisionGridDrawerCard
                id={`vision-running-${deployment.id}`}
                name={preset?.stableName ?? deployment.presetId}
                secondary={preset?.displayName}
                specRows={[
                  { label: 'Model', value: preset?.stableName ?? deployment.presetId },
                  { label: 'Size', value: deployment.replicas },
                ]}
                footerRows={[{ label: 'Traffic', value: `${deployment.reqPerMin} req/min` }]}
                isSelected={
                  highlight.kind === 'deployment' && highlight.deploymentId === deployment.id
                }
                onSelect={() => onHighlightDeployment(deployment.id)}
                onViewDetails={() => onViewDeployment(deployment.id)}
                badge={
                  <Label color="green" isCompact>
                    {deployment.status}
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
