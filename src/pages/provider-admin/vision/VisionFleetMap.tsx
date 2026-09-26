import { useEffect, useRef, type CSSProperties } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useThemePreferences } from '../../../theme/themePreferences'
import { getClusterLatLng, getVisionSite, type VisionCluster } from '../../../vision/fleetWorld'

type VisionFleetMapProps = {
  clusters: VisionCluster[]
  selectedClusterId: string | null
  highlightedClusterIds: string[]
  isolateRelatedPins: boolean
  onSelectCluster: (clusterId: string) => void
}

const PIN_OPACITY = 0.35
const PIN_STROKE_OPACITY = 0.85
const LIGHT_TILES =
  'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
const DARK_TILES =
  'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
const TILE_ATTRIBUTION =
  'Tiles &copy; Esri &mdash; Esri, TomTom, Garmin, FAO, NOAA, USGS, OpenStreetMap contributors'
const INITIAL_CENTER: L.LatLngExpression = [45, -40]

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

export const VisionFleetMap = ({
  clusters,
  selectedClusterId,
  highlightedClusterIds,
  isolateRelatedPins,
  onSelectCluster,
}: VisionFleetMapProps) => {
  const { colorScheme } = useThemePreferences()
  const palette = colorScheme === 'dark' ? DARK_PIN : LIGHT_PIN
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const layerRef = useRef<L.LayerGroup | null>(null)
  const tileLayerRef = useRef<L.TileLayer | null>(null)
  const onSelectRef = useRef(onSelectCluster)
  const renderedClusterIdsRef = useRef('')

  useEffect(() => {
    onSelectRef.current = onSelectCluster
  }, [onSelectCluster])

  useEffect(() => {
    const container = containerRef.current
    if (!container || mapRef.current) {
      return undefined
    }

    const map = L.map(container, { scrollWheelZoom: true, attributionControl: true })
    const layer = L.layerGroup().addTo(map)
    mapRef.current = map
    layerRef.current = layer
    map.setView(INITIAL_CENTER, 3)

    const resizeObserver = new ResizeObserver(() => map.invalidateSize())
    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
      map.remove()
      mapRef.current = null
      layerRef.current = null
      tileLayerRef.current = null
      renderedClusterIdsRef.current = ''
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) {
      return
    }

    const previousTileLayer = tileLayerRef.current
    if (previousTileLayer) {
      map.removeLayer(previousTileLayer)
    }

    const tileLayer = L.tileLayer(colorScheme === 'dark' ? DARK_TILES : LIGHT_TILES, {
      attribution: TILE_ATTRIBUTION,
      maxZoom: 16,
    }).addTo(map)
    tileLayerRef.current = tileLayer
  }, [colorScheme])

  useEffect(() => {
    const map = mapRef.current
    const layer = layerRef.current
    if (!map || !layer) {
      return
    }

    layer.clearLayers()
    const highlighted = new Set(highlightedClusterIds)
    const bounds = L.latLngBounds([])
    const clusterIds = clusters.map((cluster) => cluster.id).join('|')

    clusters.forEach((cluster) => {
      const site = getVisionSite(cluster.siteId)
      const latLng = getClusterLatLng(cluster, clusters)
      const selected = selectedClusterId === cluster.id
      const isHighlighted = highlighted.has(cluster.id)
      const isFocused = selected || isHighlighted
      const isDimmed = isolateRelatedPins && !isFocused
      const color = isFocused
        ? palette.selected
        : cluster.health === 'available'
          ? palette.available
          : palette.unavailable

      const marker = L.circleMarker(latLng, {
        radius: isFocused ? 10 : 7,
        color,
        weight: isFocused ? 3 : 2,
        fillColor: color,
        fillOpacity: isDimmed ? PIN_OPACITY * 0.4 : PIN_OPACITY,
        opacity: isDimmed ? PIN_STROKE_OPACITY * 0.4 : PIN_STROKE_OPACITY,
      })
      marker.bindTooltip(`${cluster.name} · ${site.regionLabel} · ${cluster.platform}`, {
        direction: 'top',
        opacity: 1,
        permanent: isFocused,
      })
      marker.on('click', () => onSelectRef.current(cluster.id))
      marker.addTo(layer)
      bounds.extend(latLng)
    })

    if (clusters.length === 0) {
      map.setView(INITIAL_CENTER, 3)
      renderedClusterIdsRef.current = ''
      return
    }

    if (renderedClusterIdsRef.current !== clusterIds) {
      map.fitBounds(bounds.pad(0.35), { maxZoom: 6, animate: false })
      renderedClusterIdsRef.current = clusterIds
    }
    map.invalidateSize()
  }, [clusters, highlightedClusterIds, isolateRelatedPins, palette, selectedClusterId])

  const mapStyle = {
    '--vision-pin-available': palette.available,
    '--vision-pin-unavailable': palette.unavailable,
    '--vision-pin-fill-opacity': PIN_OPACITY,
    '--vision-pin-stroke-opacity': PIN_STROKE_OPACITY,
  } as CSSProperties

  return (
    <div className="vision-fleet-map pf-v6-u-h-100" style={mapStyle}>
      <div
        ref={containerRef}
        className="vision-fleet-map__leaflet"
        aria-label="AI Grid map of clusters"
      />
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
