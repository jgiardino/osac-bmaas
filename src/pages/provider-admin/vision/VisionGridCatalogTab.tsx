import {
  Content,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  Label,
  Stack,
  StackItem,
} from '@patternfly/react-core'
import type { ProviderCatalogDraft } from '../../../providerSetup/storage'
import { CATALOG_SERVICE_LABELS, formatRateCardSummary } from '../../../providerSetup/templateDemo'
import {
  formatInstanceCount,
  getVisionOrg,
  getVisionPreset,
  type VisionCluster,
  type VisionDeployment,
  type VisionGateway,
} from '../../../vision/fleetWorld'
import {
  buildVisionCatalogClusterRows,
  buildVisionCatalogModelRows,
  provisionedClustersForCatalogItem,
  type VisionCatalogClusterRow,
  type VisionCatalogModelRow,
} from '../../../vision/visionCatalogRows'
import type { VisionDrawerSelection, VisionGridObjectType } from '../../../vision/visionDrawer'
import { getVisionCatalogKebabItems } from './visionGridCatalogActions'
import { VisionGridClusterCard } from './VisionGridClusterCard'
import { VisionGridCountHeading } from './VisionGridCountHeading'
import { VisionGridDrawerCard } from './VisionGridDrawerCard'
import { VisionGridGatewayRelationList } from './VisionGridGatewayRelationList'
import { VisionGridModelLabels } from './VisionGridModelLabels'
import { VisionGridModelListBadge } from './VisionGridModelListBadge'
import { visionFleetModelSpecNodes } from './visionFleetModelSpec'
import {
  gatewayRelationsForDeployment,
  visionAdminScopeFooter,
  visionClusterDisplayName,
} from './visionGridServiceMeta'

type VisionGridCatalogTabProps = {
  mode: 'list' | 'detail'
  selection: VisionDrawerSelection
  highlight: VisionDrawerSelection
  objectTypes: readonly VisionGridObjectType[]
  search: string
  catalogItems: ProviderCatalogDraft[]
  deployments: VisionDeployment[]
  clusters: VisionCluster[]
  gateways: VisionGateway[]
  onHighlightPreset: (presetId: string) => void
  onHighlightCatalogItem: (catalogItemId: string) => void
  onHighlightCluster: (clusterId: string) => void
  onHighlightDeployment: (deploymentId: string) => void
  onViewPreset: (presetId: string) => void
  onViewCatalogItem: (catalogItemId: string) => void
  onViewCluster: (clusterId: string) => void
  onViewDeployment: (deploymentId: string) => void
  onPlacePreset: (presetId: string) => void
  onAddOffering: (offeringId: string) => void
  onOpenCatalogItem: (catalogItemId: string) => void
}

const isModelRowSelected = (row: VisionCatalogModelRow, selection: VisionDrawerSelection) => {
  if (selection.kind === 'preset' && row.presetId === selection.presetId) {
    return true
  }
  if (selection.kind === 'catalog-item' && row.catalogItemId === selection.catalogItemId) {
    return true
  }
  return false
}

const isClusterRowSelected = (row: VisionCatalogClusterRow, selection: VisionDrawerSelection) => {
  if (selection.kind === 'offering' && row.offeringId === selection.offeringId) {
    return true
  }
  if (selection.kind === 'catalog-item' && row.catalogItemId === selection.catalogItemId) {
    return true
  }
  return false
}

const highlightModelRow = (
  row: VisionCatalogModelRow,
  onHighlightPreset: (presetId: string) => void,
  onHighlightCatalogItem: (catalogItemId: string) => void,
) => {
  if (row.presetId) {
    onHighlightPreset(row.presetId)
    return
  }
  onHighlightCatalogItem(row.catalogItemId)
}

const viewModelRow = (
  row: VisionCatalogModelRow,
  onViewPreset: (presetId: string) => void,
  onViewCatalogItem: (catalogItemId: string) => void,
) => {
  if (row.presetId) {
    onViewPreset(row.presetId)
    return
  }
  onViewCatalogItem(row.catalogItemId)
}

export const VisionGridCatalogTab = ({
  mode,
  selection,
  highlight,
  objectTypes,
  search,
  catalogItems,
  deployments,
  clusters,
  gateways,
  onHighlightPreset,
  onHighlightCatalogItem,
  onHighlightCluster,
  onHighlightDeployment,
  onViewPreset,
  onViewCatalogItem,
  onViewCluster,
  onViewDeployment,
  onPlacePreset,
  onAddOffering,
  onOpenCatalogItem,
}: VisionGridCatalogTabProps) => {
  const modelRows = buildVisionCatalogModelRows(catalogItems)
  const clusterRows = buildVisionCatalogClusterRows(catalogItems)
  const selectedModel = modelRows.find((row) => isModelRowSelected(row, selection))
  const selectedCluster = clusterRows.find((row) => isClusterRowSelected(row, selection))
  const query = search.trim().toLowerCase()
  const matchesQuery = (name: string, catalogItemId: string) =>
    !query ||
    name.toLowerCase().includes(query) ||
    catalogItemId.toLowerCase().includes(query)
  const visibleModelRows = modelRows.filter((row) =>
    matchesQuery(row.displayName, row.catalogItemId),
  )
  const visibleClusterRows = clusterRows.filter((row) =>
    matchesQuery(row.displayName, row.catalogItemId),
  )
  const showClusters = objectTypes.includes('clusters')
  const showModels = objectTypes.includes('models')

  if (mode === 'detail') {
    if (selectedModel) {
      return (
        <VisionCatalogModelDetail
          row={selectedModel}
          catalogItems={catalogItems}
          deployments={deployments}
          clusters={clusters}
          gateways={gateways}
          highlight={highlight}
          onHighlightDeployment={onHighlightDeployment}
          onViewDeployment={onViewDeployment}
        />
      )
    }
    if (selectedCluster) {
      return (
        <VisionCatalogClusterDetail
          row={selectedCluster}
          catalogItems={catalogItems}
          clusters={clusters}
          highlight={highlight}
          onHighlightCluster={onHighlightCluster}
          onViewCluster={onViewCluster}
        />
      )
    }
    return (
      <Content component="p">This item is not in the catalog for the current filter.</Content>
    )
  }

  if (!showClusters && !showModels) {
    return <Content component="p">Select a type to show catalog items.</Content>
  }

  return (
    <Stack hasGutter>
      {showClusters ? (
        <StackItem id="vision-catalog-clusters-content">
          <Stack hasGutter>
            <StackItem>
              <VisionGridCountHeading
                id="vision-catalog-clusters-toggle"
                title="Clusters"
                count={visibleClusterRows.length}
                showDivider={false}
              />
            </StackItem>
            {visibleClusterRows.length === 0 ? (
              <StackItem>
                <Content component="p">No clusters in the catalog.</Content>
              </StackItem>
            ) : (
              visibleClusterRows.map((row) => {
                const instanceCount = provisionedClustersForCatalogItem(
                  row.catalogItemId,
                  catalogItems,
                  clusters,
                ).length
                return (
                  <StackItem key={row.id}>
                    <VisionGridDrawerCard
                      id={`vision-catalog-cluster-${row.id}`}
                      name={row.displayName}
                      secondary={row.catalogItemId}
                      specRows={row.specRows}
                      footerRows={[{ label: 'Rate', value: row.rate }]}
                      isSelected={isClusterRowSelected(row, highlight)}
                      onSelect={() => onHighlightCatalogItem(row.catalogItemId)}
                      onViewDetails={() => onViewCatalogItem(row.catalogItemId)}
                      badge={
                        <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                          <FlexItem>
                            <Label color="blue" isCompact>
                              {CATALOG_SERVICE_LABELS.cluster}
                            </Label>
                          </FlexItem>
                          <FlexItem>
                            <Label color="grey" isCompact>
                              {formatInstanceCount(instanceCount)}
                            </Label>
                          </FlexItem>
                        </Flex>
                      }
                      kebabItems={getVisionCatalogKebabItems(
                        { kind: 'catalog-item', catalogItemId: row.catalogItemId },
                        catalogItems,
                        onPlacePreset,
                        onAddOffering,
                        onOpenCatalogItem,
                      )}
                    />
                  </StackItem>
                )
              })
            )}
          </Stack>
        </StackItem>
      ) : null}
      {showModels ? (
        <StackItem id="vision-catalog-models-content">
          <Stack hasGutter>
            <StackItem>
              <VisionGridCountHeading
                id="vision-catalog-models-toggle"
                title="Models"
                count={visibleModelRows.length}
                showDivider={showClusters}
              />
            </StackItem>
            {visibleModelRows.length === 0 ? (
              <StackItem>
                <Content component="p">No models in the catalog.</Content>
              </StackItem>
            ) : (
              visibleModelRows.map((row) => (
                <StackItem key={row.id}>
                  <VisionGridDrawerCard
                    id={`vision-catalog-model-${row.id}`}
                    name={row.displayName}
                    secondary={row.catalogItemId}
                    specRows={row.specRows}
                    footerRows={[{ label: 'Rate', value: row.rate }]}
                    isSelected={isModelRowSelected(row, highlight)}
                    onSelect={() =>
                      highlightModelRow(row, onHighlightPreset, onHighlightCatalogItem)
                    }
                    onViewDetails={() => viewModelRow(row, onViewPreset, onViewCatalogItem)}
                    badge={
                      <VisionGridModelLabels
                        idPrefix={`vision-catalog-model-${row.id}`}
                        typeLabel={CATALOG_SERVICE_LABELS.models}
                        instanceCountLabel={formatInstanceCount(
                          row.presetId
                            ? deployments.filter((deployment) => deployment.presetId === row.presetId)
                                .length
                            : 0,
                        )}
                      />
                    }
                    kebabItems={getVisionCatalogKebabItems(
                      row.presetId
                        ? { kind: 'preset', presetId: row.presetId }
                        : { kind: 'catalog-item', catalogItemId: row.catalogItemId },
                      catalogItems,
                      onPlacePreset,
                      onAddOffering,
                      onOpenCatalogItem,
                    )}
                  />
                </StackItem>
              ))
            )}
          </Stack>
        </StackItem>
      ) : null}
    </Stack>
  )
}

type VisionCatalogModelDetailProps = {
  row: VisionCatalogModelRow
  catalogItems: ProviderCatalogDraft[]
  deployments: VisionDeployment[]
  clusters: VisionCluster[]
  gateways: VisionGateway[]
  highlight: VisionDrawerSelection
  onHighlightDeployment: (deploymentId: string) => void
  onViewDeployment: (deploymentId: string) => void
}

const VisionCatalogModelDetail = ({
  row,
  catalogItems,
  deployments,
  clusters,
  gateways,
  highlight,
  onHighlightDeployment,
  onViewDeployment,
}: VisionCatalogModelDetailProps) => {
  const preset = row.presetId ? getVisionPreset(row.presetId) : undefined
  const catalogItem = catalogItems.find((item) => item.catalogItemId === row.catalogItemId)
  const instances = row.presetId
    ? deployments.filter((deployment) => deployment.presetId === row.presetId)
    : []

  return (
    <Stack hasGutter>
      <StackItem>
        <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <VisionGridModelLabels
              idPrefix="vision-catalog-model-detail"
              typeLabel={CATALOG_SERVICE_LABELS.models}
              instanceCountLabel={formatInstanceCount(instances.length)}
            />
          </FlexItem>
        </Flex>
      </StackItem>
      <StackItem>
        <DescriptionList isCompact aria-label={`${row.displayName} details`}>
          {preset ? (
            <DescriptionListGroup>
              <DescriptionListTerm>Model ID</DescriptionListTerm>
              <DescriptionListDescription>{preset.modelId}</DescriptionListDescription>
            </DescriptionListGroup>
          ) : null}
          {catalogItem?.instanceTypeLabel ? (
            <DescriptionListGroup>
              <DescriptionListTerm>Size</DescriptionListTerm>
              <DescriptionListDescription>{catalogItem.instanceTypeLabel}</DescriptionListDescription>
            </DescriptionListGroup>
          ) : null}
          {catalogItem ? (
            <DescriptionListGroup>
              <DescriptionListTerm>Rate</DescriptionListTerm>
              <DescriptionListDescription>
                {formatRateCardSummary(catalogItem.rateCard)}
              </DescriptionListDescription>
            </DescriptionListGroup>
          ) : null}
        </DescriptionList>
      </StackItem>
      {catalogItem?.description ? (
        <StackItem>
          <Content component="p" className="pf-v6-u-text-color-subtle">
            {catalogItem.description}
          </Content>
        </StackItem>
      ) : null}
      <StackItem>
        <VisionGridCountHeading
          id="vision-catalog-model-instances"
          title="Instances"
          count={instances.length}
        />
      </StackItem>
      {instances.length === 0 ? (
        <StackItem>
          <Content component="p">
            No instances of this offering are running in the current filter.
          </Content>
        </StackItem>
      ) : (
        instances.map((deployment) => {
          const org = getVisionOrg(deployment.orgId)
          return (
            <StackItem key={deployment.id}>
              <VisionGridDrawerCard
                id={`vision-catalog-instance-${deployment.id}`}
                name={preset?.displayName ?? deployment.presetId}
                secondary={preset?.modelId ?? deployment.presetId}
                specNodes={visionFleetModelSpecNodes({
                  idPrefix: `vision-catalog-instance-${deployment.id}`,
                  clusterName: visionClusterDisplayName(deployment.clusterId, clusters),
                  size: deployment.replicas,
                })}
                extra={
                  <VisionGridGatewayRelationList
                    idPrefix={`vision-catalog-instance-${deployment.id}`}
                    relations={gatewayRelationsForDeployment(deployment, gateways)}
                  />
                }
                footerRows={visionAdminScopeFooter(org.label, deployment.projectName)}
                isSelected={
                  highlight.kind === 'deployment' && highlight.deploymentId === deployment.id
                }
                onSelect={() => onHighlightDeployment(deployment.id)}
                onViewDetails={() => onViewDeployment(deployment.id)}
                badge={
                  <VisionGridModelListBadge
                    idPrefix={`vision-catalog-instance-${deployment.id}`}
                    status={deployment.status}
                  />
                }
              />
            </StackItem>
          )
        })
      )}
    </Stack>
  )
}

type VisionCatalogClusterDetailProps = {
  row: VisionCatalogClusterRow
  catalogItems: ProviderCatalogDraft[]
  clusters: VisionCluster[]
  highlight: VisionDrawerSelection
  onHighlightCluster: (clusterId: string) => void
  onViewCluster: (clusterId: string) => void
}

const VisionCatalogClusterDetail = ({
  row,
  catalogItems,
  clusters,
  highlight,
  onHighlightCluster,
  onViewCluster,
}: VisionCatalogClusterDetailProps) => {
  const catalogItem = catalogItems.find((item) => item.catalogItemId === row.catalogItemId)
  const instances = provisionedClustersForCatalogItem(row.catalogItemId, catalogItems, clusters)

  return (
    <Stack hasGutter>
      <StackItem>
        <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <Label color="blue" isCompact>
              {CATALOG_SERVICE_LABELS.cluster}
            </Label>
          </FlexItem>
          <FlexItem>
            <Label color="grey" isCompact>
              {formatInstanceCount(instances.length)}
            </Label>
          </FlexItem>
        </Flex>
      </StackItem>
      <StackItem>
        <DescriptionList isCompact aria-label={`${row.displayName} details`}>
          {catalogItem?.nodeSetLabel ? (
            <DescriptionListGroup>
              <DescriptionListTerm>Node set</DescriptionListTerm>
              <DescriptionListDescription>{catalogItem.nodeSetLabel}</DescriptionListDescription>
            </DescriptionListGroup>
          ) : null}
          {catalogItem?.hostTypeLabel ? (
            <DescriptionListGroup>
              <DescriptionListTerm>Host type</DescriptionListTerm>
              <DescriptionListDescription>{catalogItem.hostTypeLabel}</DescriptionListDescription>
            </DescriptionListGroup>
          ) : null}
          {catalogItem?.diskImageLabel ? (
            <DescriptionListGroup>
              <DescriptionListTerm>Version</DescriptionListTerm>
              <DescriptionListDescription>{catalogItem.diskImageLabel}</DescriptionListDescription>
            </DescriptionListGroup>
          ) : null}
          {catalogItem ? (
            <DescriptionListGroup>
              <DescriptionListTerm>Rate</DescriptionListTerm>
              <DescriptionListDescription>
                {formatRateCardSummary(catalogItem.rateCard)}
              </DescriptionListDescription>
            </DescriptionListGroup>
          ) : null}
        </DescriptionList>
      </StackItem>
      {catalogItem?.description ? (
        <StackItem>
          <Content component="p" className="pf-v6-u-text-color-subtle">
            {catalogItem.description}
          </Content>
        </StackItem>
      ) : null}
      <StackItem>
        <VisionGridCountHeading
          id="vision-catalog-cluster-instances"
          title="Instances"
          count={instances.length}
        />
      </StackItem>
      {instances.length === 0 ? (
        <StackItem>
          <Content component="p">
            No clusters of this offering are provisioned in the current filter.
          </Content>
        </StackItem>
      ) : (
        instances.map((cluster) => (
          <StackItem key={cluster.id}>
            <VisionGridClusterCard
              id={`vision-catalog-cluster-instance-${cluster.id}`}
              cluster={cluster}
              isSelected={highlight.kind === 'cluster' && highlight.clusterId === cluster.id}
              onSelect={() => onHighlightCluster(cluster.id)}
              onViewDetails={() => onViewCluster(cluster.id)}
            />
          </StackItem>
        ))
      )}
    </Stack>
  )
}
