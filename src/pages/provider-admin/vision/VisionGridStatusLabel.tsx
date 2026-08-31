import { Label } from '@patternfly/react-core'

type VisionGridStatusLabelProps = {
  id: string
  status: string
}

export const VisionGridStatusLabel = ({ id, status }: VisionGridStatusLabelProps) => {
  const lowered = status.toLowerCase()
  const color =
    lowered === 'unavailable' || lowered === 'inactive' || lowered === 'failed' ? 'red' : 'green'

  return (
    <Label id={id} color={color} isCompact>
      {status}
    </Label>
  )
}
