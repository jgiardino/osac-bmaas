import { Label } from '@patternfly/react-core'
import type { ExternalModelPhase } from '../../vision/externalModelSeed'

type ExternalModelPhaseLabelProps = {
  phase: ExternalModelPhase
  id: string
}

export const ExternalModelPhaseLabel = ({ phase, id }: ExternalModelPhaseLabelProps) => {
  if (phase === 'Failed') {
    return (
      <Label id={id} color="red" isCompact>
        Failed
      </Label>
    )
  }
  if (phase === 'Pending') {
    return (
      <Label id={id} color="purple" isCompact>
        Pending
      </Label>
    )
  }
  return (
    <Label id={id} color="green" isCompact>
      Ready
    </Label>
  )
}
