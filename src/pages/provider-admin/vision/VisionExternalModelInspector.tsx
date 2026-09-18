import { Content, Stack, StackItem } from '@patternfly/react-core'
import { ExternalModelCard } from '../../../components/catalog/ExternalModelCard'
import {
  formatProviderRefWeight,
  type ExternalModelSeed,
} from '../../../vision/externalModelSeed'

type VisionExternalModelInspectorProps = {
  model: ExternalModelSeed
}

export const VisionExternalModelInspector = ({ model }: VisionExternalModelInspectorProps) => {
  const count = model.providerRefs.length

  return (
    <Stack hasGutter>
      <StackItem>
        <Content component="p" className="pf-v6-u-text-color-subtle">
          {count} {count === 1 ? 'provider' : 'providers'} serving {model.displayName}
        </Content>
      </StackItem>
      {model.providerRefs.map((provider, index) => (
        <StackItem key={provider.providerName}>
          <ExternalModelCard
            model={model}
            variant="compact"
            focusProvider={provider}
            weightLabel={formatProviderRefWeight(model.providerRefs, index)}
            idPrefix="vision-external-provider"
          />
        </StackItem>
      ))}
    </Stack>
  )
}
