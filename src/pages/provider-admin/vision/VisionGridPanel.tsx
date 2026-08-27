import {
  Button,
  DrawerHead,
  DrawerPanelBody,
  Flex,
  FlexItem,
  SearchInput,
  Stack,
  StackItem,
  Title,
} from '@patternfly/react-core'
import { AngleLeftIcon } from '@patternfly/react-icons/dist/esm/icons/angle-left-icon'
import type { ProviderCatalogDraft } from '../../../providerSetup/storage'
import type { VisionCluster, VisionDeployment, VisionGateway, VisionOffPlatformModel } from '../../../vision/fleetWorld'
import {
  CATALOG_OBJECT_TYPES,
  getVisionDrawerSelectionLabel,
  SERVICES_OBJECT_TYPES,
  type VisionDrawerSelection,
  type VisionDrawerTab,
  type VisionGridObjectType,
} from '../../../vision/visionDrawer'
import { getVisionCatalogKebabItems } from './visionGridCatalogActions'
import { VisionGridCatalogTab } from './VisionGridCatalogTab'
import { VisionGridKebab } from './VisionGridKebab'
import { VisionGridServicesTab } from './VisionGridServicesTab'
import { VisionGridTypeToggle } from './VisionGridTypeToggle'

type VisionGridPanelProps = {
  tab: VisionDrawerTab
  selection: VisionDrawerSelection
  highlight: VisionDrawerSelection
  objectTypes: readonly VisionGridObjectType[]
  onObjectTypeToggle: (type: VisionGridObjectType, isSelected: boolean) => void
  search: string
  onSearchChange: (value: string) => void
  onClearSelection: () => void
  catalogItems: ProviderCatalogDraft[]
  selectedCluster: VisionCluster | null
  selectedGateway: VisionGateway | null
  selectedOffPlatform: VisionOffPlatformModel | null
  deployments: VisionDeployment[]
  clusterDeployments: VisionDeployment[]
  clusters: VisionCluster[]
  gateways: VisionGateway[]
  offPlatformModels: VisionOffPlatformModel[]
  onHighlightPreset: (presetId: string) => void
  onHighlightCatalogItem: (catalogItemId: string) => void
  onHighlightCluster: (clusterId: string) => void
  onHighlightDeployment: (deploymentId: string) => void
  onHighlightGateway: (gatewayId: VisionGateway['id']) => void
  onHighlightOffPlatform: (modelId: string) => void
  onViewPreset: (presetId: string) => void
  onViewCatalogItem: (catalogItemId: string) => void
  onViewCluster: (clusterId: string) => void
  onViewDeployment: (deploymentId: string) => void
  onViewGateway: (gatewayId: VisionGateway['id']) => void
  onViewOffPlatform: (modelId: string) => void
  onPlacePreset: (presetId: string) => void
  onAddOffering: (offeringId: string) => void
  onOpenCatalogItem: (catalogItemId: string) => void
}

export const VisionGridPanel = ({
  tab,
  selection,
  highlight,
  objectTypes,
  onObjectTypeToggle,
  search,
  onSearchChange,
  onClearSelection,
  catalogItems,
  selectedCluster,
  selectedGateway,
  selectedOffPlatform,
  deployments,
  clusterDeployments,
  clusters,
  gateways,
  offPlatformModels,
  onHighlightPreset,
  onHighlightCatalogItem,
  onHighlightCluster,
  onHighlightDeployment,
  onHighlightGateway,
  onHighlightOffPlatform,
  onViewPreset,
  onViewCatalogItem,
  onViewCluster,
  onViewDeployment,
  onViewGateway,
  onViewOffPlatform,
  onPlacePreset,
  onAddOffering,
  onOpenCatalogItem,
}: VisionGridPanelProps) => {
  const isDetail = selection.kind !== 'none'
  const detailLabel =
    getVisionDrawerSelectionLabel(selection, clusters, catalogItems, deployments) ?? 'Details'
  const listLabel = tab === 'catalog' ? 'Catalog' : 'Services'
  const kebabItems =
    isDetail && tab === 'catalog'
      ? getVisionCatalogKebabItems(
          selection,
          catalogItems,
          onPlacePreset,
          onAddOffering,
          onOpenCatalogItem,
        )
      : []
  const typeOptions = tab === 'catalog' ? CATALOG_OBJECT_TYPES : SERVICES_OBJECT_TYPES
  const searchId = tab === 'catalog' ? 'vision-catalog-search' : 'vision-services-search'
  const searchPlaceholder =
    tab === 'catalog' ? 'Search catalog items' : 'Search instances'
  const catalogTab = (
    <VisionGridCatalogTab
      mode={isDetail ? 'detail' : 'list'}
      selection={selection}
      highlight={highlight}
      objectTypes={objectTypes}
      search={search}
      catalogItems={catalogItems}
      deployments={deployments}
      clusters={clusters}
      onHighlightPreset={onHighlightPreset}
      onHighlightCatalogItem={onHighlightCatalogItem}
      onHighlightDeployment={onHighlightDeployment}
      onViewPreset={onViewPreset}
      onViewCatalogItem={onViewCatalogItem}
      onViewDeployment={onViewDeployment}
      onPlacePreset={onPlacePreset}
      onAddOffering={onAddOffering}
      onOpenCatalogItem={onOpenCatalogItem}
    />
  )
  const servicesTab = (
    <VisionGridServicesTab
      mode={isDetail ? 'detail' : 'list'}
      selection={selection}
      highlight={highlight}
      objectTypes={objectTypes}
      search={search}
      selectedCluster={selectedCluster}
      selectedGateway={selectedGateway}
      selectedOffPlatform={selectedOffPlatform}
      clusterDeployments={clusterDeployments}
      deployments={deployments}
      clusters={clusters}
      gateways={gateways}
      offPlatformModels={offPlatformModels}
      onHighlightCluster={onHighlightCluster}
      onHighlightDeployment={onHighlightDeployment}
      onHighlightGateway={onHighlightGateway}
      onHighlightOffPlatform={onHighlightOffPlatform}
      onViewCluster={onViewCluster}
      onViewDeployment={onViewDeployment}
      onViewGateway={onViewGateway}
      onViewOffPlatform={onViewOffPlatform}
    />
  )

  return (
    <>
      <DrawerHead>
        {isDetail ? (
          <Flex
            justifyContent={{ default: 'justifyContentSpaceBetween' }}
            alignItems={{ default: 'alignItemsFlexStart' }}
            flexWrap={{ default: 'nowrap' }}
          >
            <FlexItem grow={{ default: 'grow' }}>
              <Stack>
                <StackItem>
                  <Button
                    variant="link"
                    isInline
                    icon={<AngleLeftIcon />}
                    onClick={onClearSelection}
                    id="vision-grid-back"
                  >
                    {listLabel}
                  </Button>
                </StackItem>
                <StackItem>
                  <Title headingLevel="h2" size="lg" id="vision-grid-detail-title">
                    {detailLabel}
                  </Title>
                </StackItem>
              </Stack>
            </FlexItem>
            {kebabItems.length > 0 ? (
              <FlexItem>
                <VisionGridKebab
                  id="vision-grid-detail-actions"
                  label={`Actions for ${detailLabel}`}
                  items={kebabItems}
                />
              </FlexItem>
            ) : null}
          </Flex>
        ) : (
          <Flex
            id="vision-grid-panel-toolbar"
            className="vision-grid-panel-toolbar"
            alignItems={{ default: 'alignItemsCenter' }}
            flexWrap={{ default: 'nowrap' }}
            spaceItems={{ default: 'spaceItemsSm' }}
          >
            <FlexItem grow={{ default: 'grow' }} className="vision-grid-panel-search">
              <SearchInput
                id={searchId}
                placeholder={searchPlaceholder}
                value={search}
                onChange={(_event, value) => onSearchChange(value)}
                onClear={() => onSearchChange('')}
                aria-label={searchPlaceholder}
              />
            </FlexItem>
            <FlexItem>
              <VisionGridTypeToggle
                types={typeOptions}
                selected={objectTypes}
                onToggle={onObjectTypeToggle}
                idPrefix="vision-type"
              />
            </FlexItem>
          </Flex>
        )}
      </DrawerHead>
      <DrawerPanelBody>{tab === 'catalog' ? catalogTab : servicesTab}</DrawerPanelBody>
    </>
  )
}
