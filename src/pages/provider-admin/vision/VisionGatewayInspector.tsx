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
  type VisionCluster,
  type VisionDeployment,
  type VisionGateway,
  type VisionOffPlatformModel,
} from '../../../vision/fleetWorld'
import { ModelsInstanceCard } from '../../../components/catalog/ModelsInstanceCard'
import { modelsOnGateway } from '../../../vision/modelInstanceSeed'
import type { VisionDrawerSelection } from '../../../vision/visionDrawer'
import { VisionGridClusterCard } from './VisionGridClusterCard'
import { VisionGridCountHeading } from './VisionGridCountHeading'

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
  highlight,
  onHighlightCluster,
  onViewCluster,
}: VisionGatewayInspectorProps) => {
  const org = getVisionOrg(gateway.orgId)
  const cluster = clusters.find((entry) => entry.id === gateway.clusterId)
  const nestedModels = modelsOnGateway(gateway.id)
  const modelCount = nestedModels.length

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
        nestedModels.map((item) => (
          <StackItem key={item.id}>
            <ModelsInstanceCard
              item={item}
              variant="compact"
              parent="gateway"
              idPrefix="vision-gateway-model"
            />
          </StackItem>
        ))
      )}
    </Stack>
  )
}
