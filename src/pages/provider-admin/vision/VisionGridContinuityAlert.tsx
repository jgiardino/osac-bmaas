import { Alert } from '@patternfly/react-core'
import { useSearchParams } from 'react-router-dom'
import {
  GRANITE_3B_STABLE_NAME,
  isModelFleetVision,
} from '../../../vision/modelFleet'

type VisionGridContinuityAlertProps = {
  surface: 'priya' | 'chris'
}

export const VisionGridContinuityAlert = ({ surface }: VisionGridContinuityAlertProps) => {
  const [searchParams] = useSearchParams()
  if (!isModelFleetVision(searchParams)) {
    return null
  }

  const body =
    surface === 'priya'
      ? `${GRANITE_3B_STABLE_NAME} is served in US East and called through the EU West gateway. Grant groups on this page — this is the same model as the AI Grid, not a separate console.`
      : `${GRANITE_3B_STABLE_NAME} is on a subscription granted to you. Create an API key for that model. Geography is not the point of this page.`

  return (
    <Alert
      variant="info"
      isInline
      title="AI Grid continuity"
      className="vision-grid-continuity-alert"
    >
      {body}
    </Alert>
  )
}
