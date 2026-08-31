import { Label } from '@patternfly/react-core'

export type VisionServingKind = 'on-cluster' | 'external-model'

type VisionGridServingKindLabelProps = {
  id: string
  kind: VisionServingKind
  variant?: 'filled' | 'outline'
}

export const VisionGridServingKindLabel = ({
  id,
  kind,
  variant = 'filled',
}: VisionGridServingKindLabelProps) => {
  if (kind !== 'external-model') {
    return null
  }

  return (
    <Label id={id} color="purple" variant={variant} isCompact>
      External
    </Label>
  )
}
