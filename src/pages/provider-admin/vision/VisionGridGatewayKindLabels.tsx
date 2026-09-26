import { Flex, FlexItem, Label } from '@patternfly/react-core'
import type { VisionGatewayRelation } from './visionGridServiceMeta'

type VisionGridGatewayKindLabelsProps = {
  idPrefix: string
  relation: Pick<VisionGatewayRelation, 'isMaas'>
  variant?: 'filled' | 'outline'
}

export const VisionGridGatewayKindLabels = ({
  idPrefix,
  relation,
  variant = 'filled',
}: VisionGridGatewayKindLabelsProps) =>
  relation.isMaas ? (
    <Flex spaceItems={{ default: 'spaceItemsSm' }} flexWrap={{ default: 'wrap' }}>
      <FlexItem>
        <Label id={`${idPrefix}-maas`} color="blue" variant={variant} isCompact>
          MaaS
        </Label>
      </FlexItem>
    </Flex>
  ) : null
