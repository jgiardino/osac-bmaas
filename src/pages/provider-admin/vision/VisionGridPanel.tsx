import { AngleLeftIcon } from '@patternfly/react-icons/dist/esm/icons/angle-left-icon'
import {
  Button,
  DrawerHead,
  DrawerPanelBody,
  Flex,
  FlexItem,
  Stack,
  StackItem,
  Tab,
  TabTitleText,
  Tabs,
  Title,
} from '@patternfly/react-core'
import type { ProviderCatalogDraft } from '../../../providerSetup/storage'
import type { VisionCluster, VisionDeployment } from '../../../vision/fleetWorld'
import {
  getVisionDrawerSelectionLabel,
  type VisionDrawerSelection,
  type VisionDrawerTab,
  type VisionGridAccordionSection,
} from '../../../vision/visionDrawer'
import { getVisionCatalogKebabItems } from './visionGridCatalogActions'
import { VisionGridCatalogTab } from './VisionGridCatalogTab'
import { VisionGridKebab } from './VisionGridKebab'
import { VisionGridServicesTab } from './VisionGridServicesTab'

type VisionGridPanelProps = {
  tab: VisionDrawerTab
  onTabChange: (tab: VisionDrawerTab) => void
  selection: VisionDrawerSelection
  highlight: VisionDrawerSelection
  onClearSelection: () => void
  catalogItems: ProviderCatalogDraft[]
  selectedCluster: VisionCluster | null
  deployments: VisionDeployment[]
  clusterDeployments: VisionDeployment[]
  clusters: VisionCluster[]
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
  openSection: VisionGridAccordionSection | null
  onOpenSection: (section: VisionGridAccordionSection | null) => void
}

export const VisionGridPanel = ({
  tab,
  onTabChange,
  selection,
  highlight,
  onClearSelection,
  catalogItems,
  selectedCluster,
  deployments,
  clusterDeployments,
  clusters,
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
  openSection,
  onOpenSection,
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
  const catalogTab = (
    <VisionGridCatalogTab
      mode={isDetail ? 'detail' : 'list'}
      selection={selection}
      highlight={highlight}
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
      selectedCluster={selectedCluster}
      clusterDeployments={clusterDeployments}
      deployments={deployments}
      clusters={clusters}
      openSection={openSection}
      onOpenSection={onOpenSection}
      onHighlightCluster={onHighlightCluster}
      onHighlightDeployment={onHighlightDeployment}
      onViewCluster={onViewCluster}
      onViewDeployment={onViewDeployment}
    />
  )

  return (
    <>
      <DrawerHead className={isDetail ? undefined : 'vision-grid-drawer-head--tabs'}>
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
          <Tabs
            activeKey={tab}
            onSelect={(_event, eventKey) => onTabChange(eventKey as VisionDrawerTab)}
            id="vision-grid-drawer-tabs"
            aria-label="Catalog and services"
            isFilled
          >
            <Tab
              eventKey="catalog"
              title={<TabTitleText>Catalog</TabTitleText>}
              id="vision-grid-catalog-tab"
            />
            <Tab
              eventKey="services"
              title={<TabTitleText>Services</TabTitleText>}
              id="vision-grid-services-tab"
            />
          </Tabs>
        )}
      </DrawerHead>
      <DrawerPanelBody>{tab === 'catalog' ? catalogTab : servicesTab}</DrawerPanelBody>
    </>
  )
}
