import type { VisionFleetSummary as VisionFleetSummaryData } from '../../../vision/fleetWorld'

type VisionFleetSummaryProps = {
  summary: VisionFleetSummaryData
}

export const VisionFleetSummary = ({ summary }: VisionFleetSummaryProps) => {
  const items = [
    { label: 'Total GPUs', value: String(summary.totalGpus) },
    { label: 'GPU utilization', value: `${summary.gpuUtilPercent}%` },
    { label: 'Tokens/sec', value: String(summary.tokensPerSec) },
    { label: 'Active models', value: String(summary.activeModels) },
    { label: 'Active clusters', value: String(summary.activeClusters) },
  ]

  return (
    <dl className="vision-fleet-summary">
      {items.map((item) => (
        <div key={item.label} className="vision-fleet-summary__item">
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
