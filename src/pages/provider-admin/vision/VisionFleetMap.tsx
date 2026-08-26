import { Tooltip } from '@patternfly/react-core'
import {
  getVisionPreset,
  getVisionSite,
  type VisionCluster,
  type VisionServingPath,
} from '../../../vision/fleetWorld'

type VisionFleetMapProps = {
  clusters: VisionCluster[]
  paths: VisionServingPath[]
  selectedClusterId: string | null
  selectedPathId: string | null
  highlightedClusterIds: string[]
  onSelectCluster: (clusterId: string) => void
  onSelectPath: (pathId: string) => void
}

export const VisionFleetMap = ({
  clusters,
  paths,
  selectedClusterId,
  selectedPathId,
  highlightedClusterIds,
  onSelectCluster,
  onSelectPath,
}: VisionFleetMapProps) => {
  const highlighted = new Set(highlightedClusterIds)
  const selectedPath = paths.find((path) => path.id === selectedPathId)
  const selectedPathPreset = selectedPath ? getVisionPreset(selectedPath.presetId) : undefined
  const selectedFrom = selectedPath
    ? clusters.find((cluster) => cluster.id === selectedPath.fromClusterId)
    : undefined
  const selectedTo = selectedPath
    ? clusters.find((cluster) => cluster.id === selectedPath.toClusterId)
    : undefined

  return (
    <div className="vision-fleet-map">
      <svg
        className="vision-fleet-map__svg"
        viewBox="0 0 100 56"
        preserveAspectRatio="none"
        role="img"
        aria-label="AI Grid map of clusters across US and EU sites"
      >
        <rect className="vision-fleet-map__ocean" x="0" y="0" width="100" height="56" />
        <path
          className="vision-fleet-map__land"
          d="M6 16 C14 10 22 11 28 16 C34 22 33 30 30 36 C24 46 14 48 8 42 C3 36 2 24 6 16 Z"
        />
        <path
          className="vision-fleet-map__land"
          d="M48 18 C56 12 64 13 70 18 C76 24 75 32 70 38 C64 44 54 42 50 36 C46 28 44 22 48 18 Z"
        />
        <text className="vision-fleet-map__label" x="16" y="28">
          United States
        </text>
        <text className="vision-fleet-map__label" x="58" y="28">
          Europe
        </text>
        {paths.map((path) => {
          const from = clusters.find((cluster) => cluster.id === path.fromClusterId)
          const to = clusters.find((cluster) => cluster.id === path.toClusterId)
          if (!from || !to) {
            return null
          }
          const isSelected = selectedPathId === path.id
          return (
            <g key={path.id}>
              <line
                className="vision-fleet-map__route-hit"
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                onClick={() => onSelectPath(path.id)}
              />
              <line
                className={[
                  'vision-fleet-map__route',
                  path.isLive ? 'vision-fleet-map__route--live' : '',
                  isSelected ? 'vision-fleet-map__route--selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
              />
            </g>
          )
        })}
      </svg>
      {clusters.map((cluster) => {
        const site = getVisionSite(cluster.siteId)
        const isSelected = selectedClusterId === cluster.id
        const isHighlighted = highlighted.has(cluster.id)
        return (
          <Tooltip
            key={cluster.id}
            content={
              <div>
                <div>
                  <strong>{cluster.name}</strong> ({cluster.platform})
                </div>
                <div>
                  {cluster.gpuCount} GPU · {cluster.gpuUtilPercent}% util · {site.regionLabel}
                </div>
              </div>
            }
          >
            <button
              type="button"
              className={[
                'vision-fleet-map__pin',
                cluster.health === 'available'
                  ? 'vision-fleet-map__pin--healthy'
                  : 'vision-fleet-map__pin--degraded',
                isSelected ? 'vision-fleet-map__pin--selected' : '',
                isHighlighted ? 'vision-fleet-map__pin--highlighted' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{ left: `${cluster.x}%`, top: `${(cluster.y / 56) * 100}%` }}
              aria-pressed={isSelected}
              aria-label={`${cluster.name}, ${site.regionLabel}, ${cluster.health}`}
              onClick={() => onSelectCluster(cluster.id)}
            >
              <span className="vision-fleet-map__pin-dot" />
              {isSelected ? (
                <span className="vision-fleet-map__pin-label">{cluster.name}</span>
              ) : null}
            </button>
          </Tooltip>
        )
      })}
      <div className="vision-fleet-map__legend">
        <span className="vision-fleet-map__legend-item vision-fleet-map__legend-item--up">
          Available
        </span>
        <span className="vision-fleet-map__legend-item vision-fleet-map__legend-item--down">
          Unavailable
        </span>
      </div>
      {selectedPath && selectedFrom && selectedTo ? (
        <div className="vision-fleet-map__path-card" role="status">
          <strong>{selectedPathPreset?.stableName ?? selectedPath.presetId}</strong>
          {` · ${selectedFrom.name} → ${selectedTo.name} · ${selectedPath.reqPerMin} req/min`}
        </div>
      ) : null}
    </div>
  )
}
