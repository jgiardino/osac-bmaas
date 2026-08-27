import { useMemo, useState, type CSSProperties } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Drawer,
  DrawerContent,
  DrawerContentBody,
  DrawerPanelContent,
  Divider,
  PageSection,
  Stack,
  StackItem,
} from '@patternfly/react-core'
import type { ProviderCatalogDraft } from '../../../providerSetup/storage'
import { getVisionScenarioSeed } from '../../../vision/fleetScenarios'
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
import {
  relatedClusterIdsForSelection,
  seedVisionDrawerSelection,
  visionSelectionsEqual,
  type VisionDrawerSelection,
  type VisionDrawerTab,
  type VisionGridAccordionSection,
} from '../../../vision/visionDrawer'
import { catalogItemVisibleForTenant } from '../../../vision/visionCatalogRows'
import { VisionAddClusterModal } from './VisionAddClusterModal'
import { VisionFleetMap } from './VisionFleetMap'
import { VisionFleetSummary } from './VisionFleetSummary'
import { VisionGridFilters } from './VisionGridFilters'
import { VisionGridPanel } from './VisionGridPanel'
import { VisionPlaceModelModal } from './VisionPlaceModelModal'

type VisionModelFleetPageProps = {
  catalogItems: ProviderCatalogDraft[]
  onOpenCatalogPreset: (catalogItemId: string) => void
}

export const VisionModelFleetPage = ({
  catalogItems,
  onOpenCatalogPreset,
}: VisionModelFleetPageProps) => {
  const [searchParams] = useSearchParams()
  const seed = getVisionScenarioSeed(searchParams)
  const [clusters, setClusters] = useState<VisionCluster[]>(() =>
    seed.emptyGrid ? [] : createInitialClusters(),
  )
  const [deployments, setDeployments] = useState<VisionDeployment[]>(() =>
    seed.emptyGrid ? [] : createInitialDeployments(),
  )
  const [paths, setPaths] = useState<VisionServingPath[]>(() =>
    seed.emptyGrid ? [] : createInitialPaths(),
  )
  const [orgFilter, setOrgFilter] = useState<VisionOrgFilter>(seed.orgFilter)
  const [gatewayFilter, setGatewayFilter] = useState<VisionGatewayFilter>(seed.gatewayFilter)
  const [highlight, setHighlight] = useState<VisionDrawerSelection>(() =>
    seedVisionDrawerSelection(seed),
  )
  const [detail, setDetail] = useState<VisionDrawerSelection>(() =>
    seedVisionDrawerSelection(seed),
  )
  const [drawerTab, setDrawerTab] = useState<VisionDrawerTab>(() =>
    seed.selectedClusterId ? 'services' : 'catalog',
  )
  const [servicesSection, setServicesSection] = useState<VisionGridAccordionSection | null>(
    'clusters',
  )
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
  const visibleCatalogItems = useMemo(
    () => catalogItems.filter((item) => catalogItemVisibleForTenant(item, orgFilter)),
    [catalogItems, orgFilter],
  )
  const summary = useMemo(
    () => summarizeFleet(visibleClusters, visibleDeployments),
    [visibleClusters, visibleDeployments],
  )
  const selectedCluster =
    detail.kind === 'cluster'
      ? (visibleClusters.find((cluster) => cluster.id === detail.clusterId) ??
        clusters.find((cluster) => cluster.id === detail.clusterId) ??
        null)
      : null
  const clusterDeployments = selectedCluster
    ? deploymentsOnCluster(visibleDeployments, selectedCluster.id)
    : []
  const relatedClusterIds = relatedClusterIdsForSelection(
    highlight,
    visibleClusters,
    visibleDeployments,
    visibleCatalogItems,
  )
  const selectedDeployment =
    highlight.kind === 'deployment'
      ? (visibleDeployments.find((entry) => entry.id === highlight.deploymentId) ?? null)
      : null
  const selectedClusterId =
    highlight.kind === 'cluster'
      ? highlight.clusterId
      : (selectedDeployment?.clusterId ?? null)
  const highlightedClusterIds =
    highlight.kind === 'cluster' || highlight.kind === 'deployment' ? [] : relatedClusterIds
  const isolateRelatedPins =
    relatedClusterIds.length > 0 && relatedClusterIds.length < visibleClusters.length
  const placePreset = placePresetId ? (getVisionPreset(placePresetId) ?? null) : null
  const addOffering = addOfferingId ? (getVisionOffering(addOfferingId) ?? null) : null
  const initiallySelectedForPlace = placePresetId
    ? clustersForPreset(visibleDeployments, placePresetId).filter((clusterId) =>
        visibleClusters.some((cluster) => cluster.id === clusterId && cluster.health === 'available'),
      )
    : []

  const toggleHighlight = (next: VisionDrawerSelection) => {
    setHighlight((current) => (visionSelectionsEqual(current, next) ? { kind: 'none' } : next))
  }

  const openDetails = (next: VisionDrawerSelection, tab?: VisionDrawerTab) => {
    setHighlight(next)
    setDetail(next)
    if (tab) {
      setDrawerTab(tab)
    }
  }

  const handleOrgChange = (value: VisionOrgFilter) => {
    setOrgFilter(value)
    const allowed = gatewaysForOrgFilter(value)
    if (gatewayFilter !== 'all' && !allowed.some((gateway) => gateway.id === gatewayFilter)) {
      setGatewayFilter('all')
    }
  }

  const clearDetail = () => {
    setDetail({ kind: 'none' })
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
    setHighlight({ kind: 'preset', presetId })
    setDetail({ kind: 'preset', presetId })
    setPlacePresetId(null)
  }

  const handlePinCluster = (clusterId: string) => {
    const next: VisionDrawerSelection = { kind: 'cluster', clusterId }
    if (detail.kind === 'cluster' && detail.clusterId === clusterId) {
      setDetail({ kind: 'none' })
      setHighlight({ kind: 'none' })
      setDrawerTab('services')
      return
    }
    openDetails(next, 'services')
  }

  const handleAddCluster = (siteId: VisionSiteId) => {
    const offering = addOfferingId ? getVisionOffering(addOfferingId) : undefined
    if (!offering) {
      return
    }

    const fallbackOrg: VisionOrgId = orgFilter === 'all' ? 'nsb' : orgFilter
    const allowedGateways = gatewaysForOrgFilter(fallbackOrg)
    const gatewayId: VisionGatewayId =
      gatewayFilter === 'all' ? (allowedGateways[0]?.id ?? 'nsb-retail') : gatewayFilter

    const created = createClusterFromOffering(offering, siteId, fallbackOrg, gatewayId, clusters)
    setClusters((current) => [...current, created])
    openDetails({ kind: 'cluster', clusterId: created.id }, 'services')
    setAddOfferingId(null)
  }

  return (
    <>
      <PageSection
        padding={{ default: 'noPadding' }}
        aria-label="Tenant and gateway filters"
      >
        <VisionGridFilters
          orgFilter={orgFilter}
          gatewayFilter={gatewayFilter}
          onOrgChange={handleOrgChange}
          onGatewayChange={(value) => {
            setGatewayFilter(value)
          }}
        />
      </PageSection>
      <PageSection
        isFilled
        padding={{ default: 'noPadding' }}
        hasBodyWrapper={false}
        className="pf-v6-u-min-height"
        aria-label="AI Grid map and drawer"
      >
        <Drawer isExpanded isInline isStatic className="pf-v6-u-h-100" id="vision-grid-layout">
          <DrawerContent
            className="pf-v6-u-h-100 pf-v6-u-min-height"
            panelContent={
              <DrawerPanelContent
                widths={{ default: 'width_33' }}
                id="vision-grid-drawer"
                style={
                  {
                    '--pf-v6-c-drawer__panel--MaxHeight': '100%',
                    overflow: 'hidden',
                  } as CSSProperties
                }
              >
                <VisionGridPanel
                  tab={drawerTab}
                  onTabChange={(nextTab) => {
                    setDrawerTab(nextTab)
                    setDetail({ kind: 'none' })
                  }}
                  selection={detail}
                  highlight={highlight}
                  onClearSelection={clearDetail}
                  catalogItems={visibleCatalogItems}
                  selectedCluster={selectedCluster}
                  deployments={visibleDeployments}
                  clusterDeployments={clusterDeployments}
                  clusters={visibleClusters}
                  onHighlightPreset={(presetId) => toggleHighlight({ kind: 'preset', presetId })}
                  onHighlightCatalogItem={(catalogItemId) =>
                    toggleHighlight({ kind: 'catalog-item', catalogItemId })
                  }
                  onHighlightCluster={(clusterId) =>
                    toggleHighlight({ kind: 'cluster', clusterId })
                  }
                  onHighlightDeployment={(deploymentId) =>
                    toggleHighlight({ kind: 'deployment', deploymentId })
                  }
                  onViewPreset={(presetId) => openDetails({ kind: 'preset', presetId })}
                  onViewCatalogItem={(catalogItemId) =>
                    openDetails({ kind: 'catalog-item', catalogItemId })
                  }
                  onViewCluster={(clusterId) =>
                    openDetails({ kind: 'cluster', clusterId }, 'services')
                  }
                  onViewDeployment={(deploymentId) =>
                    openDetails({ kind: 'deployment', deploymentId }, 'services')
                  }
                  onPlacePreset={setPlacePresetId}
                  onAddOffering={setAddOfferingId}
                  onOpenCatalogItem={onOpenCatalogPreset}
                  openSection={servicesSection}
                  onOpenSection={setServicesSection}
                />
              </DrawerPanelContent>
            }
          >
            <DrawerContentBody className="pf-v6-u-h-100 pf-v6-u-min-height">
              <Stack className="pf-v6-u-h-100">
                <StackItem isFilled className="pf-v6-u-min-height">
                  <VisionFleetMap
                    clusters={visibleClusters}
                    selectedClusterId={selectedClusterId}
                    highlightedClusterIds={highlightedClusterIds}
                    isolateRelatedPins={isolateRelatedPins}
                    onSelectCluster={handlePinCluster}
                  />
                </StackItem>
                <StackItem>
                  <Divider />
                  <VisionFleetSummary
                    summary={summary}
                    onActiveModelsClick={() => {
                      setDrawerTab('services')
                      setDetail({ kind: 'none' })
                      setServicesSection('models')
                    }}
                    onActiveClustersClick={() => {
                      setDrawerTab('services')
                      setDetail({ kind: 'none' })
                      setServicesSection('clusters')
                    }}
                  />
                </StackItem>
              </Stack>
            </DrawerContentBody>
          </DrawerContent>
        </Drawer>
      </PageSection>

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
    </>
  )
}
