import { Label } from '@patternfly/react-core'

type VisionGridClusterIdLabelProps = {
  id: string
  clusterId: string
  variant: 'outline' | 'filled'
}

export const VisionGridClusterIdLabel = ({
  id,
  clusterId,
  variant,
}: VisionGridClusterIdLabelProps) => (
  <Label id={id} color="grey" variant={variant} isCompact>
    {clusterId}
  </Label>
)
