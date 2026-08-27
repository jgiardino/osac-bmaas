import {
  Button,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from '@patternfly/react-core'
import type { VisionFleetSummary as VisionFleetSummaryData } from '../../../vision/fleetWorld'

type VisionFleetSummaryProps = {
  summary: VisionFleetSummaryData
  onActiveModelsClick: () => void
  onActiveClustersClick: () => void
}

export const VisionFleetSummary = ({
  summary,
  onActiveModelsClick,
  onActiveClustersClick,
}: VisionFleetSummaryProps) => (
  <DescriptionList
    id="vision-fleet-summary"
    className="pf-v6-u-p-md"
    isCompact
    isHorizontal
    columnModifier={{ default: '3Col' }}
    aria-label="Fleet summary"
  >
    <DescriptionListGroup>
      <DescriptionListTerm>Total GPUs</DescriptionListTerm>
      <DescriptionListDescription>{summary.totalGpus}</DescriptionListDescription>
    </DescriptionListGroup>
    <DescriptionListGroup>
      <DescriptionListTerm>GPU utilization</DescriptionListTerm>
      <DescriptionListDescription>{summary.gpuUtilPercent}%</DescriptionListDescription>
    </DescriptionListGroup>
    <DescriptionListGroup>
      <DescriptionListTerm>Tokens/sec</DescriptionListTerm>
      <DescriptionListDescription>{summary.tokensPerSec}</DescriptionListDescription>
    </DescriptionListGroup>
    <DescriptionListGroup>
      <DescriptionListTerm>Active models</DescriptionListTerm>
      <DescriptionListDescription>
        <Button variant="link" isInline onClick={onActiveModelsClick} id="vision-active-models">
          {summary.activeModels}
        </Button>
      </DescriptionListDescription>
    </DescriptionListGroup>
    <DescriptionListGroup>
      <DescriptionListTerm>Active clusters</DescriptionListTerm>
      <DescriptionListDescription>
        <Button variant="link" isInline onClick={onActiveClustersClick} id="vision-active-clusters">
          {summary.activeClusters}
        </Button>
      </DescriptionListDescription>
    </DescriptionListGroup>
  </DescriptionList>
)
