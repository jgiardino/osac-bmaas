import { Flex, FlexItem, Label } from '@patternfly/react-core'
import type { ReactNode } from 'react'

export type MaasModelIdentityLabel = {
  text: string
  color: 'blue' | 'orange' | 'purple' | 'green' | 'grey' | 'teal'
}

type MaasModelIdentityProps = {
  id: string
  displayName: string
  modelRefId: string
  description?: string
  labels?: MaasModelIdentityLabel[]
}

export const MaasModelIdentity = ({
  id,
  displayName,
  modelRefId,
  description,
  labels = [],
}: MaasModelIdentityProps): ReactNode => (
  <div id={id}>
    <Flex
      spaceItems={{ default: 'spaceItemsSm' }}
      alignItems={{ default: 'alignItemsCenter' }}
      flexWrap={{ default: 'wrap' }}
    >
      <FlexItem>
        <strong>{displayName}</strong>
      </FlexItem>
      {labels.map((label) => (
        <FlexItem key={label.text}>
          <Label
            color={label.color}
            variant="filled"
            isCompact
            id={`${id}-label-${label.text.toLowerCase()}`}
          >
            {label.text}
          </Label>
        </FlexItem>
      ))}
    </Flex>
    <div className="pf-v6-u-font-family-monospace pf-v6-u-font-size-xs pf-v6-u-text-color-subtle">
      {modelRefId}
    </div>
    {description ? (
      <div className="pf-v6-u-font-size-xs pf-v6-u-text-color-subtle">{description}</div>
    ) : null}
  </div>
)
