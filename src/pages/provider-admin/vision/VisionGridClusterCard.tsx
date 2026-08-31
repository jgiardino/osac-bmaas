import type { CatalogSpecRow } from '../../../catalog/catalogSpecs'
import { getVisionOrg, getVisionSite, type VisionCluster } from '../../../vision/fleetWorld'
import { VisionGridDrawerCard } from './VisionGridDrawerCard'
import { VisionGridStatusLabel } from './VisionGridStatusLabel'

const visionClusterSpecRows = (cluster: VisionCluster): CatalogSpecRow[] => [
  { label: 'Cluster version', value: cluster.openshiftVersion },
  { label: 'Platform', value: `${cluster.platform} · ${cluster.region}` },
  { label: 'Host type', value: cluster.gpuCount > 0 ? 'GPU' : 'CPU' },
]

type VisionGridClusterCardProps = {
  id: string
  cluster: VisionCluster
  isSelected: boolean
  onSelect: () => void
  onViewDetails: () => void
}

export const VisionGridClusterCard = ({
  id,
  cluster,
  isSelected,
  onSelect,
  onViewDetails,
}: VisionGridClusterCardProps) => {
  const site = getVisionSite(cluster.siteId)
  const org = getVisionOrg(cluster.orgId)
  const isAvailable = cluster.health === 'available'

  return (
    <VisionGridDrawerCard
      id={id}
      name={cluster.name}
      secondary={site.regionLabel}
      secondaryIsMono={false}
      specRows={visionClusterSpecRows(cluster)}
      footerRows={[{ label: 'Tenant', value: org.label }]}
      isSelected={isSelected}
      onSelect={onSelect}
      onViewDetails={onViewDetails}
      badge={
        <VisionGridStatusLabel
          id={`${id}-status`}
          status={isAvailable ? 'Available' : 'Unavailable'}
        />
      }
    />
  )
}
