import { ToggleGroup, ToggleGroupItem, Tooltip } from '@patternfly/react-core'
import { GlobeRouteIcon } from '@patternfly/react-icons/dist/esm/icons/globe-route-icon'
import { getCatalogServiceIcon } from '../../../catalog/serviceIcons'
import type { VisionGridObjectType } from '../../../vision/visionDrawer'

type VisionGridTypeToggleProps = {
  types: readonly VisionGridObjectType[]
  selected: readonly VisionGridObjectType[]
  onToggle: (type: VisionGridObjectType, isSelected: boolean) => void
  idPrefix: string
}

const TYPE_LABELS: Record<VisionGridObjectType, string> = {
  clusters: 'Clusters',
  models: 'Models',
  gateways: 'Gateway',
}

const typeIcon = (type: VisionGridObjectType) => {
  if (type === 'gateways') {
    return <GlobeRouteIcon />
  }
  return getCatalogServiceIcon(type === 'clusters' ? 'cluster' : 'models')
}

export const VisionGridTypeToggle = ({
  types,
  selected,
  onToggle,
  idPrefix,
}: VisionGridTypeToggleProps) => (
  <ToggleGroup aria-label="Object types" id={`${idPrefix}-group`}>
    {types.map((type) => (
      <ToggleGroupItem
        key={type}
        icon={
          <Tooltip content={TYPE_LABELS[type]}>
            <span>{typeIcon(type)}</span>
          </Tooltip>
        }
        aria-label={TYPE_LABELS[type]}
        buttonId={`${idPrefix}-${type}`}
        isSelected={selected.includes(type)}
        onChange={(_event, isSelected) => onToggle(type, isSelected)}
      />
    ))}
  </ToggleGroup>
)
