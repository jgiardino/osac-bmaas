import { Label } from '@patternfly/react-core'

type VisionGridUnassignedLabelProps = {
  id: string
}

export const VisionGridUnassignedLabel = ({ id }: VisionGridUnassignedLabelProps) => (
  <Label
    id={id}
    color="grey"
    isCompact
    icon={<span className="vision-grid-unassigned-dot" aria-hidden />}
  >
    Unassigned
  </Label>
)
