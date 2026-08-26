import { useMemo, useState } from 'react'
import { ProviderAdminWorkspacePageHeader } from '../../../components/provider-admin/ProviderAdminWorkspacePageHeader'
import {
  clusterMatchesFilters,
  clustersForPreset,
  createClusterFromOffering,
  createDeploymentOnCluster,
  createInitialClusters,
  createInitialDeployments,
  createInitialPaths,
  deploymentMatchesFilters,
  deploymentsOnCluster,
  ensureServingPath,
  gatewaysForOrgFilter,
  getVisionOffering,
  getVisionPreset,
  pathMatchesFilters,
  summarizeFleet,
  type VisionCluster,
  type VisionDeployment,
  type VisionGatewayFilter,
  type VisionGatewayId,
  type VisionOrgFilter,
  type VisionOrgId,
  type VisionServingPath,
  type VisionSiteId,
} from '../../../vision/fleetWorld'
import { VisionAddClusterModal } from './VisionAddClusterModal'
import { VisionFleetMap } from './VisionFleetMap'
import { VisionFleetSummary } from './VisionFleetSummary'
import { VisionGridFilters } from './VisionGridFilters'
import { VisionGridPanel } from './VisionGridPanel'
import { VisionPlaceModelModal } from './VisionPlaceModelModal'

type VisionModelFleetPageProps = {
  onOpenCatalogPreset: (catalogItemId: string) => void
}

export const VisionModelFleetPage = ({ onOpenCatalogPreset }: VisionModelFleetPageProps) => {
  const [clusters, setClusters] = useState<VisionCluster[]>(() => createInitialClusters())
  const [deployments, setDeployments] = useState<VisionDeployment[]>(() => createInitialDeployments())
  const [paths, setPaths] = useState<VisionServingPath[]>(() => createInitialPaths())
  const [orgFilter, setOrgFilter] = useState<VisionOrgFilter>('all')
  const [gatewayFilter, setGatewayFilter] = useState<VisionGatewayFilter>('all')
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>('ocp-us-east-1')
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null)
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>('granite-3b')
  const [selectedOfferingId, setSelectedOfferingId] = useState<string | null>(null)
  const [placePresetId, setPlacePresetId] = useState<string | null>(null)
  const [addOfferingId, setAddOfferingId] = useState<string | null>(null)

  const visibleClusters = useMemo(
    () => clusters.filter((cluster) => clusterMatchesFilters(cluster, orgFilter, gatewayFilter)),
    [clusters, gatewayFilter, orgFilter],
  )
  const visibleDeployments = useMemo(
    () =>
      deployments.filter((deployment) =>
        deploymentMatchesFilters(deployment, orgFilter, gatewayFilter),
      ),
    [deployments, gatewayFilter, orgFilter],
  )
  const visiblePaths = useMemo(
    () =>
      paths.filter((path) => pathMatchesFilters(path, clusters, orgFilter, gatewayFilter)),
    [clusters, gatewayFilter, orgFilter, paths],
  )
  const summary = useMemo(
    () => summarizeFleet(visibleClusters, visibleDeployments),
    [visibleClusters, visibleDeployments],
  )
  const selectedCluster =
    visibleClusters.find((cluster) => cluster.id === selectedClusterId) ??
    visibleClusters[0] ??
    null
  const resolvedPathId = visiblePaths.some((path) => path.id === selectedPathId)
    ? selectedPathId
    : null
  const clusterDeployments = selectedCluster
    ? deploymentsOnCluster(visibleDeployments, selectedCluster.id)
    : []
  const highlightedClusterIds = selectedPresetId
    ? clustersForPreset(visibleDeployments, selectedPresetId)
    : []
  const placePreset = placePresetId ? (getVisionPreset(placePresetId) ?? null) : null
  const addOffering = addOfferingId ? (getVisionOffering(addOfferingId) ?? null) : null
  const initiallySelectedForPlace = placePresetId
    ? clustersForPreset(visibleDeployments, placePresetId).filter((clusterId) =>
        visibleClusters.some((cluster) => cluster.id === clusterId && cluster.health === 'available'),
      )
    : []

  const handleOrgChange = (value: VisionOrgFilter) => {
    setOrgFilter(value)
    const allowed = gatewaysForOrgFilter(value)
    if (gatewayFilter !== 'all' && !allowed.some((gateway) => gateway.id === gatewayFilter)) {
      setGatewayFilter('all')
    }
    setSelectedPathId(null)
  }

  const placeOnClusters = (presetId: string, clusterIds: string[]) => {
    const preset = getVisionPreset(presetId)
    if (!preset) {
      return
    }

    let nextDeployments = deployments
    clusterIds.forEach((clusterId) => {
      const cluster = clusters.find((entry) => entry.id === clusterId)
      if (!cluster || cluster.health !== 'available') {
        return
      }
      const exists = nextDeployments.some(
        (deployment) => deployment.presetId === presetId && deployment.clusterId === clusterId,
      )
      if (!exists) {
        nextDeployments = [...nextDeployments, createDeploymentOnCluster(preset, cluster)]
      }
    })

    let nextPaths = paths
    clusterIds.forEach((clusterId) => {
      nextPaths = ensureServingPath(nextPaths, clusters, nextDeployments, presetId, clusterId)
    })

    setDeployments(nextDeployments)
    setPaths(nextPaths)
    setSelectedPresetId(presetId)
    setSelectedClusterId(clusterIds[clusterIds.length - 1] ?? selectedClusterId)
    setPlacePresetId(null)
  }

  const handleSelectCluster = (clusterId: string) => {
    setSelectedClusterId(clusterId)
    setSelectedPathId(null)
  }

  const handleAddCluster = (siteId: VisionSiteId) => {
    const offering = addOfferingId ? getVisionOffering(addOfferingId) : undefined
    if (!offering) {
      return
    }

    const fallbackOrg: VisionOrgId = orgFilter === 'all' ? 'nsb' : orgFilter
    const allowedGateways = gatewaysForOrgFilter(fallbackOrg)
    const gatewayId: VisionGatewayId =
      gatewayFilter === 'all'
        ? (allowedGateways[0]?.id ?? 'nsb-retail')
        : gatewayFilter

    const created = createClusterFromOffering(offering, siteId, fallbackOrg, gatewayId, clusters)
    setClusters((current) => [...current, created])
    setSelectedClusterId(created.id)
    setSelectedOfferingId(null)
    setAddOfferingId(null)
  }

  return (
    <div className="provider-admin-workspace-page vision-model-fleet">
      <ProviderAdminWorkspacePageHeader
        kicker="Provider workspace"
        title="AI Grid"
        lede="Geographic view of clusters and models Vertexa manages. Filter by organization or gateway. Place presets or spin up clusters without leaving this console."
      />

      <VisionGridFilters
        orgFilter={orgFilter}
        gatewayFilter={gatewayFilter}
        onOrgChange={handleOrgChange}
        onGatewayChange={(value) => {
          setGatewayFilter(value)
          setSelectedPathId(null)
        }}
      />

      <div className="vision-model-fleet__canvas">
        <div className="vision-model-fleet__map-column">
          <VisionFleetMap
            clusters={visibleClusters}
            paths={visiblePaths}
            selectedClusterId={selectedCluster?.id ?? null}
            selectedPathId={resolvedPathId}
            highlightedClusterIds={highlightedClusterIds}
            onSelectCluster={handleSelectCluster}
            onSelectPath={(pathId) => {
              setSelectedPathId(pathId)
              const path = paths.find((entry) => entry.id === pathId)
              if (path) {
                setSelectedPresetId(path.presetId)
                setSelectedClusterId(path.toClusterId)
              }
            }}
          />
          <VisionFleetSummary summary={summary} />
        </div>
        <VisionGridPanel
          selectedPresetId={selectedPresetId}
          selectedOfferingId={selectedOfferingId}
          selectedCluster={selectedCluster}
          deployments={visibleDeployments}
          clusterDeployments={clusterDeployments}
          clusters={visibleClusters}
          onSelectPreset={(presetId) => {
            setSelectedPresetId((current) => (current === presetId ? null : presetId))
            setSelectedOfferingId(null)
          }}
          onSelectOffering={(offeringId) => {
            setSelectedOfferingId((current) => (current === offeringId ? null : offeringId))
            setSelectedPresetId(null)
          }}
          onPlacePreset={setPlacePresetId}
          onAddOffering={setAddOfferingId}
          onOpenCatalogPreset={onOpenCatalogPreset}
        />
      </div>

      <VisionPlaceModelModal
        key={placePresetId ?? 'place-closed'}
        isOpen={Boolean(placePreset)}
        preset={placePreset}
        clusters={visibleClusters}
        initiallySelectedClusterIds={initiallySelectedForPlace}
        onClose={() => setPlacePresetId(null)}
        onPlace={(clusterIds) => {
          if (placePresetId) {
            placeOnClusters(placePresetId, clusterIds)
          }
        }}
      />
      <VisionAddClusterModal
        key={addOfferingId ?? 'add-closed'}
        isOpen={Boolean(addOffering)}
        offering={addOffering}
        onClose={() => setAddOfferingId(null)}
        onAdd={handleAddCluster}
      />
    </div>
  )
}
