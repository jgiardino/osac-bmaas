import { Flex, FlexItem, Label } from '@patternfly/react-core'
import type { VisionMaasOrigin } from '../../../vision/fleetWorld'

type VisionGridModelLabelsProps = {
  idPrefix: string
  isMaas?: boolean
  origin?: VisionMaasOrigin | null
  status?: string
  instanceCountLabel?: string
}

export const VisionGridModelLabels = ({
  idPrefix,
  isMaas = false,
  origin = null,
  status,
  instanceCountLabel,
}: VisionGridModelLabelsProps) => {
  if (!isMaas && !origin && !status && !instanceCountLabel) {
    return null
  }

  return (
    <Flex spaceItems={{ default: 'spaceItemsSm' }} flexWrap={{ default: 'wrap' }}>
      {isMaas ? (
        <FlexItem>
          <Label id={`${idPrefix}-maas`} color="blue" isCompact>
            MaaS
          </Label>
        </FlexItem>
      ) : null}
      {origin === 'internal' ? (
        <FlexItem>
          <Label id={`${idPrefix}-origin`} color="orange" variant="outline" isCompact>
            Internal
          </Label>
        </FlexItem>
      ) : null}
      {origin === 'external' ? (
        <FlexItem>
          <Label id={`${idPrefix}-origin`} color="purple" variant="outline" isCompact>
            External
          </Label>
        </FlexItem>
      ) : null}
      {status ? (
        <FlexItem>
          <Label id={`${idPrefix}-status`} color="green" isCompact>
            {status}
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
