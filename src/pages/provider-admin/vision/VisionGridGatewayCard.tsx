import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import type { CatalogSpecRow } from '../../../catalog/catalogSpecs'
import { getGatewayIcon } from '../../../catalog/serviceIcons'
import {
  getVisionOrg,
  visionProjectForOrg,
  type VisionCluster,
  type VisionGateway,
} from '../../../vision/fleetWorld'
import type { VisionFleetSpecNode } from './visionFleetModelSpec'
import { VisionGridDrawerCard } from './VisionGridDrawerCard'
import { VisionGridStatusLabel } from './VisionGridStatusLabel'
import { gatewayClusterLabel, visionGatewayListSpecRows } from './visionGridServiceMeta'

type VisionGridGatewayCardProps = {
  id: string
  gateway: VisionGateway
  clusters?: VisionCluster[]
  modelCount: number
  includeCluster?: boolean
  isSelected: boolean
  onSelect: () => void
  onViewDetails: () => void
  specRows?: CatalogSpecRow[]
  specNodes?: VisionFleetSpecNode[]
  badge?: ReactNode
}

export const VisionGridGatewayCard = ({
  id,
  gateway,
  clusters = [],
  modelCount,
  includeCluster = true,
  isSelected,
  onSelect,
  onViewDetails,
  specRows,
  specNodes,
  badge,
}: VisionGridGatewayCardProps) => {
  const { pathname } = useLocation()
  const showTenant = pathname.startsWith('/provider')
  const org = getVisionOrg(gateway.orgId)

  return (
    <VisionGridDrawerCard
      id={id}
      icon={getGatewayIcon()}
      name={gateway.label}
      secondary={gateway.hostname}
      specRows={
        specNodes
          ? undefined
          : (specRows ??
            visionGatewayListSpecRows({
              clusterValue: gatewayClusterLabel(gateway, clusters),
              modelCount,
              includeCluster,
            }))
      }
      specNodes={specNodes}
      footerRows={[
        ...(showTenant ? [{ label: 'Tenant', value: org.label }] : []),
        { label: 'Project', value: visionProjectForOrg(gateway.orgId) },
      ]}
      isSelected={isSelected}
      onSelect={onSelect}
      onViewDetails={onViewDetails}
      badge={badge ?? <VisionGridStatusLabel id={`${id}-status`} status="Ready" />}
    />
  )
}
