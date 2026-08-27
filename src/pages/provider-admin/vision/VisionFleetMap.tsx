import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getClusterLatLng, getVisionSite, type VisionCluster } from '../../../vision/fleetWorld'

type VisionFleetMapProps = {
  clusters: VisionCluster[]
  selectedClusterId: string | null
  highlightedClusterIds: string[]
  isolateRelatedPins: boolean
  onSelectCluster: (clusterId: string) => void
}

const AVAILABLE_COLOR = '#3d7317'
const UNAVAILABLE_COLOR = '#a30000'
const SELECTED_COLOR = '#0066cc'
const EMPTY_CENTER: L.LatLngExpression = [45, -40]

export const VisionFleetMap = ({
  clusters,
  selectedClusterId,
  highlightedClusterIds,
  isolateRelatedPins,
  onSelectCluster,
}: VisionFleetMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const layerRef = useRef<L.LayerGroup | null>(null)
  const onSelectRef = useRef(onSelectCluster)

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
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 12,
    }).addTo(map)
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
      layerRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const layer = layerRef.current
    if (!map || !layer) {
      return
    }

    layer.clearLayers()
    const highlighted = new Set(highlightedClusterIds)
    const bounds = L.latLngBounds([])

    clusters.forEach((cluster) => {
      const site = getVisionSite(cluster.siteId)
      const latLng = getClusterLatLng(cluster, clusters)
      const isSelected = selectedClusterId === cluster.id
      const isHighlighted = highlighted.has(cluster.id)
      const isFocus = isSelected || isHighlighted
      const dimmed = isolateRelatedPins && !isFocus
      const color =
        isSelected || isHighlighted
          ? SELECTED_COLOR
          : cluster.health === 'available'
            ? AVAILABLE_COLOR
            : UNAVAILABLE_COLOR

      const marker = L.circleMarker(latLng, {
        radius: isFocus ? 10 : 7,
        color,
        weight: isFocus ? 3 : 2,
        fillColor: color,
        fillOpacity: dimmed ? 0.25 : 0.9,
        opacity: dimmed ? 0.35 : 1,
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
      return
    }

    map.fitBounds(bounds.pad(0.35), { maxZoom: 6, animate: false })
    map.invalidateSize()
  }, [clusters, highlightedClusterIds, isolateRelatedPins, selectedClusterId])

  return (
    <div className="vision-fleet-map pf-v6-u-h-100">
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
