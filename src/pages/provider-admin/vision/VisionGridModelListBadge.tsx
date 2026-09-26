import { Flex, FlexItem } from '@patternfly/react-core'
import { VisionGridServingKindLabel, type VisionServingKind } from './VisionGridServingKindLabel'
import { VisionGridStatusLabel } from './VisionGridStatusLabel'

type VisionGridModelListBadgeProps = {
  idPrefix: string
  status: string
  servingKind?: VisionServingKind
}

export const VisionGridModelListBadge = ({
  idPrefix,
  status,
  servingKind,
}: VisionGridModelListBadgeProps) => (
  <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
    <FlexItem>
      <VisionGridStatusLabel id={`${idPrefix}-status`} status={status} />
    </FlexItem>
    {servingKind === 'external-model' ? (
      <FlexItem>
        <VisionGridServingKindLabel id={`${idPrefix}-kind`} kind={servingKind} />
      </FlexItem>
    ) : null}
  </Flex>
)
