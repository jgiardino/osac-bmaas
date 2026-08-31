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

const PIN_FILL_OPACITY = 0.35
const PIN_STROKE_OPACITY = 0.85

type VisionPinPalette = {
  available: string
  unavailable: string
  selected: string
}

const LIGHT_PIN: VisionPinPalette = {
  available: '#3d7317',
  unavailable: '#ee0000',
  selected: '#0066cc',
}

const DARK_PIN: VisionPinPalette = {
  available: '#87bb62',
  unavailable: '#ff4d4d',
  selected: '#7dc3ff',
}

const EMPTY_CENTER: L.LatLngExpression = [45, -40]

const LIGHT_TILES =
  'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
const DARK_TILES =
  'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
const TILE_ATTRIBUTION =
  'Tiles &copy; Esri &mdash; Esri, TomTom, Garmin, FAO, NOAA, USGS, OpenStreetMap contributors'

const createTileLayer = (isDark: boolean) =>
  L.tileLayer(isDark ? DARK_TILES : LIGHT_TILES, {
    attribution: TILE_ATTRIBUTION,
    maxZoom: 16,
  })

export const VisionFleetMap = ({
  clusters,
  selectedClusterId,
  highlightedClusterIds,
  isolateRelatedPins,
  onSelectCluster,
}: VisionFleetMapProps) => {
  const { colorScheme } = useThemePreferences()
  const isDark = colorScheme === 'dark'
  const palette = isDark ? DARK_PIN : LIGHT_PIN
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const tilesRef = useRef<L.TileLayer | null>(null)
  const layerRef = useRef<L.LayerGroup | null>(null)
  const onSelectRef = useRef(onSelectCluster)
  const fittedClusterKeyRef = useRef('')

  useEffect(() => {
    onSelectRef.current = onSelectCluster
  }, [onSelectCluster])

  useEffect(() => {
    const container = containerRef.current
    if (!container || mapRef.current) {
      return undefined
    }

    const map = L.map(container, {
      scrollWheelZoom: true,
      attributionControl: true,
    })
    const layer = L.layerGroup().addTo(map)
    mapRef.current = map
    layerRef.current = layer
    map.setView(EMPTY_CENTER, 3)

    const observer = new ResizeObserver(() => {
      map.invalidateSize()
    })
    observer.observe(container)

    return () => {
      observer.disconnect()
      map.remove()
      mapRef.current = null
      tilesRef.current = null
      layerRef.current = null
      fittedClusterKeyRef.current = ''
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) {
      return
    }

    const nextTiles = createTileLayer(isDark)
    nextTiles.addTo(map)
    if (tilesRef.current) {
      map.removeLayer(tilesRef.current)
    }
    tilesRef.current = nextTiles
  }, [isDark])

  useEffect(() => {
    const map = mapRef.current
    const layer = layerRef.current
    if (!map || !layer) {
      return
    }

    layer.clearLayers()
    const highlighted = new Set(highlightedClusterIds)
    const bounds = L.latLngBounds([])
    const clusterKey = clusters.map((cluster) => cluster.id).join('|')

    clusters.forEach((cluster) => {
      const site = getVisionSite(cluster.siteId)
      const latLng = getClusterLatLng(cluster, clusters)
      const isSelected = selectedClusterId === cluster.id
      const isHighlighted = highlighted.has(cluster.id)
      const isFocus = isSelected || isHighlighted
      const dimmed = isolateRelatedPins && !isFocus
      const fillColor =
        isSelected || isHighlighted
          ? palette.selected
          : cluster.health === 'available'
            ? palette.available
            : palette.unavailable

      const marker = L.circleMarker(latLng, {
        radius: isFocus ? 10 : 7,
        color: fillColor,
        weight: isFocus ? 3 : 2,
        fillColor,
        fillOpacity: dimmed ? PIN_FILL_OPACITY * 0.4 : PIN_FILL_OPACITY,
        opacity: dimmed ? PIN_STROKE_OPACITY * 0.4 : PIN_STROKE_OPACITY,
      })
      marker.bindTooltip(`${cluster.name} · ${site.regionLabel} · ${cluster.platform}`, {
        direction: 'top',
        opacity: 1,
        permanent: isFocus,
      })
      marker.on('click', () => onSelectRef.current(cluster.id))
      marker.addTo(layer)
      bounds.extend(latLng)
    })

    if (clusters.length === 0) {
      map.setView(EMPTY_CENTER, 3)
      fittedClusterKeyRef.current = ''
      return
    }

    if (fittedClusterKeyRef.current !== clusterKey) {
      map.fitBounds(bounds.pad(0.35), { maxZoom: 6, animate: false })
      fittedClusterKeyRef.current = clusterKey
    }
  }, [clusters, highlightedClusterIds, isolateRelatedPins, palette, selectedClusterId])

  return (
    <div
      className="vision-fleet-map pf-v6-u-h-100"
      style={
        {
          '--vision-pin-available': palette.available,
          '--vision-pin-unavailable': palette.unavailable,
          '--vision-pin-fill-opacity': PIN_FILL_OPACITY,
          '--vision-pin-stroke-opacity': PIN_STROKE_OPACITY,
        } as CSSProperties
      }
    >
      <div ref={containerRef} className="vision-fleet-map__leaflet" aria-label="AI Grid map of clusters" />
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
