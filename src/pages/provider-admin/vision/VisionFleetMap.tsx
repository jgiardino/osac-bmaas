import type { CSSProperties, KeyboardEvent } from 'react'
import { useThemePreferences } from '../../../theme/themePreferences'
import { getClusterLatLng, getVisionSite, type VisionCluster } from '../../../vision/fleetWorld'

type VisionFleetMapProps = {
  clusters: VisionCluster[]
  selectedClusterId: string | null
  highlightedClusterIds: string[]
  isolateRelatedPins: boolean
  onSelectCluster: (clusterId: string) => void
}

const LIGHT_PIN = {
  available: '#3d7317',
  unavailable: '#ee0000',
  selected: '#0066cc',
}

const DARK_PIN = {
  available: '#87bb62',
  unavailable: '#ff4d4d',
  selected: '#7dc3ff',
}

const projectCoordinates = (latitude: number, longitude: number) => ({
  x: ((longitude + 180) / 360) * 1200,
  y: ((90 - latitude) / 180) * 600,
})

const handlePinKeyDown = (
  event: KeyboardEvent<SVGGElement>,
  clusterId: string,
  onSelectCluster: (clusterId: string) => void,
) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    onSelectCluster(clusterId)
  }
}

export const VisionFleetMap = ({
  clusters,
  selectedClusterId,
  highlightedClusterIds,
  isolateRelatedPins,
  onSelectCluster,
}: VisionFleetMapProps) => {
  const { colorScheme } = useThemePreferences()
  const palette = colorScheme === 'dark' ? DARK_PIN : LIGHT_PIN
  const highlighted = new Set(highlightedClusterIds)

  return (
    <div
      className="vision-fleet-map pf-v6-u-h-100"
      style={
        {
          '--vision-pin-available': palette.available,
          '--vision-pin-unavailable': palette.unavailable,
          '--vision-pin-fill-opacity': 0.35,
          '--vision-pin-stroke-opacity': 0.85,
        } as CSSProperties
      }
    >
      <svg
        className="vision-fleet-map__svg"
        viewBox="0 0 1200 600"
        role="img"
        aria-label="AI Grid map of clusters"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect className="vision-fleet-map__ocean" width="1200" height="600" />
        <path
          className="vision-fleet-map__land"
          d="M84 126 144 89 199 100 227 131 212 164 237 184 211 211 194 253 157 270 131 244 111 209 83 195 69 163Z M210 281 252 293 273 333 265 371 243 411 222 444 207 408 195 369 181 331Z M514 128 563 98 622 103 657 120 698 111 734 130 769 123 792 143 833 136 873 151 890 177 871 198 844 202 830 226 804 239 799 274 773 292 744 279 727 255 699 263 677 248 653 255 642 281 615 280 593 256 575 247 550 221 516 215 493 188Z M646 296 681 306 699 341 691 385 675 421 660 450 640 423 628 387 619 348Z M864 319 897 302 929 314 947 340 928 363 897 367 873 347Z"
        />
        {clusters.map((cluster) => {
          const site = getVisionSite(cluster.siteId)
          const [latitude, longitude] = getClusterLatLng(cluster, clusters)
          const { x, y } = projectCoordinates(latitude, longitude)
          const selected = selectedClusterId === cluster.id
          const isHighlighted = highlighted.has(cluster.id)
          const isFocused = selected || isHighlighted
          const dimmed = isolateRelatedPins && !isFocused
          const fillColor = isFocused
            ? palette.selected
            : cluster.health === 'available'
              ? palette.available
              : palette.unavailable

          return (
            <g
              key={cluster.id}
              className={`vision-fleet-map__pin-anchor${isFocused ? ' vision-fleet-map__pin-anchor--focused' : ''}`}
              transform={`translate(${x} ${y})`}
              role="button"
              tabIndex={0}
              aria-label={`View ${cluster.name}, ${site.regionLabel}, ${cluster.platform}`}
              onClick={() => onSelectCluster(cluster.id)}
              onKeyDown={(event) => handlePinKeyDown(event, cluster.id, onSelectCluster)}
            >
              <title>{`${cluster.name} · ${site.regionLabel} · ${cluster.platform}`}</title>
              <circle
                className="vision-fleet-map__pin-dot"
                r={isFocused ? 10 : 7}
                fill={fillColor}
                opacity={dimmed ? 0.4 : 1}
              />
              <text className="vision-fleet-map__pin-label" x="13" y="4">
                {cluster.name}
              </text>
            </g>
          )
        })}
      </svg>
      {clusters.length === 0 ? (
        <p className="vision-fleet-map__empty">
          No clusters on the grid yet. Launch an instance from the catalog to give models a place to
          run.
        </p>
      ) : null}
      <div className="vision-fleet-map__legend">
        <span className="vision-fleet-map__legend-item vision-fleet-map__legend-item--up">
          Available
        </span>
        <span className="vision-fleet-map__legend-item vision-fleet-map__legend-item--down">
          Unavailable
        </span>
      </div>
    </div>
  )
}
