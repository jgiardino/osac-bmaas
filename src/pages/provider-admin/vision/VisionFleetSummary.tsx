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
      <DescriptionListTerm>
        <Button variant="link" isInline onClick={onActiveModelsClick} id="vision-active-models">
          Active models
        </Button>
      </DescriptionListTerm>
      <DescriptionListDescription>{summary.activeModels}</DescriptionListDescription>
    </DescriptionListGroup>
    <DescriptionListGroup>
      <DescriptionListTerm>
        <Button variant="link" isInline onClick={onActiveClustersClick} id="vision-active-clusters">
          Active clusters
        </Button>
      </DescriptionListTerm>
      <DescriptionListDescription>{summary.activeClusters}</DescriptionListDescription>
    </DescriptionListGroup>
  </DescriptionList>
)
