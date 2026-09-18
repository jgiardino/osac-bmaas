import { Content, Stack, StackItem } from '@patternfly/react-core'
import { ModelsInstanceCard } from '../../../components/catalog/ModelsInstanceCard'
import {
  formatEqualSplitWeight,
  type ModelInstanceSeedItem,
} from '../../../vision/modelInstanceSeed'

type VisionModelGroupInspectorProps = {
  displayName: string
  instances: ModelInstanceSeedItem[]
}

export const VisionModelGroupInspector = ({
  displayName,
  instances,
}: VisionModelGroupInspectorProps) => {
  if (instances.length === 0) {
    return <Content component="p">This model is not available in the current filter.</Content>
  }

  return (
    <Stack hasGutter>
      <StackItem>
        <Content component="p" className="pf-v6-u-text-color-subtle">
          {instances.length} {instances.length === 1 ? 'instance' : 'instances'} of {displayName}
        </Content>
      </StackItem>
      {instances.map((item, index) => (
        <StackItem key={item.id}>
          <ModelsInstanceCard
            item={item}
            variant="compact"
            clusterIds={item.clusterId ? [item.clusterId] : undefined}
            weightLabel={formatEqualSplitWeight(instances.length, index)}
            idPrefix="vision-model-instance"
          />
        </StackItem>
      ))}
    </Stack>
  )
}
