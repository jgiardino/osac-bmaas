import { Content, Stack, StackItem } from '@patternfly/react-core'
import { ModelsInstanceCard } from '../../../components/catalog/ModelsInstanceCard'
import type { ModelInstanceSeedItem } from '../../../vision/modelInstanceSeed'

type VisionModelGroupInspectorProps = {
  displayName: string
  instances: ModelInstanceSeedItem[]
  showTenant?: boolean
}

export const VisionModelGroupInspector = ({
  displayName,
  instances,
  showTenant = false,
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
      {instances.map((item) => (
        <StackItem key={item.id}>
          <ModelsInstanceCard
            item={item}
            variant="compact"
            showTenant={showTenant}
            idPrefix="vision-model-instance"
          />
        </StackItem>
      ))}
    </Stack>
  )
}
