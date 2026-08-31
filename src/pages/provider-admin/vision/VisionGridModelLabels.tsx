import { Flex, FlexItem, Label } from '@patternfly/react-core'

type VisionGridModelLabelsProps = {
  idPrefix: string
  typeLabel?: string
  instanceCountLabel?: string
}

export const VisionGridModelLabels = ({
  idPrefix,
  typeLabel,
  instanceCountLabel,
}: VisionGridModelLabelsProps) => {
  if (!typeLabel && !instanceCountLabel) {
    return null
  }

  return (
    <Flex spaceItems={{ default: 'spaceItemsSm' }} flexWrap={{ default: 'wrap' }}>
      {typeLabel ? (
        <FlexItem>
          <Label id={`${idPrefix}-type`} color="blue" isCompact>
            {typeLabel}
          </Label>
        </FlexItem>
      ) : null}
      {instanceCountLabel ? (
        <FlexItem>
          <Label id={`${idPrefix}-instances`} color="grey" isCompact>
            {instanceCountLabel}
          </Label>
        </FlexItem>
      ) : null}
    </Flex>
  )
}
