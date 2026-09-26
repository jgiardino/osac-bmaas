import type { VisionGatewayRelation } from './visionGridServiceMeta'
import { VisionGridClusterIdLabel } from './VisionGridClusterIdLabel'
import { VisionGridGatewayKindLabels } from './VisionGridGatewayKindLabels'
import { VisionGridUnassignedLabel } from './VisionGridUnassignedLabel'
import type { VisionClusterPresentation } from './visionFleetModelSpec'

export type VisionGatewayClusterReveal = 'always' | 'other-only'

type VisionGridGatewayRelationListProps = {
  idPrefix: string
  relations: VisionGatewayRelation[]
  variant?: 'filled' | 'outline'
  clusterReveal?: VisionGatewayClusterReveal
  clusterPresentation?: VisionClusterPresentation
}

const showClusterForRelation = (
  relation: VisionGatewayRelation,
  clusterReveal: VisionGatewayClusterReveal,
) => clusterReveal === 'always' || relation.origin === 'other-cluster'

export const VisionGridGatewayRelationList = ({
  idPrefix,
  relations,
  variant = 'filled',
  clusterReveal = 'always',
  clusterPresentation = 'label',
}: VisionGridGatewayRelationListProps) => {
  if (relations.length === 0) {
    return <VisionGridUnassignedLabel id={`${idPrefix}-unassigned`} />
  }

  return (
    <ul className="vision-grid-gateway-relations__list">
      {relations.map((relation) => (
        <li key={relation.gateway.id} className="vision-grid-gateway-relations__item">
          <span className="vision-grid-gateway-relations__name">{relation.gateway.label}</span>
          {showClusterForRelation(relation, clusterReveal) ? (
            clusterPresentation === 'label' ? (
              <VisionGridClusterIdLabel
                id={`${idPrefix}-${relation.gateway.id}-cluster`}
                clusterId={relation.gateway.clusterId}
                variant={relation.origin === 'other-cluster' ? 'filled' : 'outline'}
              />
            ) : (
              <span className="vision-grid-gateway-relations__cluster">
                {relation.gateway.clusterId}
              </span>
            )
          ) : null}
          <VisionGridGatewayKindLabels
            idPrefix={`${idPrefix}-${relation.gateway.id}`}
            relation={relation}
            variant={variant}
          />
        </li>
      ))}
    </ul>
  )
}
