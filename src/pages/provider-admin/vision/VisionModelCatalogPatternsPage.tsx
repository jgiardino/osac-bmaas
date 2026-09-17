import { useState } from 'react'
import { Content, Stack, StackItem, Tab, TabTitleText, Tabs, Title } from '@patternfly/react-core'
import type { IAction } from '@patternfly/react-table'
import { ProviderAdminWorkspacePageHeader } from '../../../components/provider-admin/ProviderAdminWorkspacePageHeader'
import { ModelsCatalogItemCard } from '../../../components/catalog/ModelsCatalogItemCard'
import { LAUNCH_INSTANCE_WIZARD_DEMO } from '../../../tenantUser/launchInstanceWizard'
import { createModelCatalogDrafts } from '../../../vision/modelCatalogSeed'
import { VisionModelInstancePatternsPage } from './VisionModelInstancePatternsPage'
import { VisionModelListPatternsPage } from './VisionModelListPatternsPage'

type PatternsTab = 'catalog' | 'instance-lists' | 'fleet-list'

const PATTERN_ITEMS = createModelCatalogDrafts()

const launchKebab = (): IAction[] => [
  {
    title: 'View details',
  },
  {
    title: LAUNCH_INSTANCE_WIZARD_DEMO.launchInstanceLabel,
  },
]

export const VisionModelCatalogPatternsPage = () => {
  const [activeTab, setActiveTab] = useState<PatternsTab>('instance-lists')

  return (
    <div className="provider-admin-workspace-page">
      <ProviderAdminWorkspacePageHeader
        kicker="Vision"
        title="Patterns"
        lede="Catalog item cards follow Ethan’s catalog chrome. Instance lists are the 2.8 keep-set in each page’s list chrome. Fleet list variations are older AI Grid card treatments."
      />
      <Tabs
        activeKey={activeTab}
        onSelect={(_event, key) => setActiveTab(key as PatternsTab)}
        aria-label="UI pattern areas"
        id="vision-patterns-tabs"
      >
        <Tab eventKey="catalog" title={<TabTitleText>Catalog item</TabTitleText>} id="vision-patterns-tab-catalog">
          <Stack hasGutter>
            <StackItem>
              <Title headingLevel="h2" size="lg">
                Catalog page
              </Title>
              <Content component="p">
                Same chrome as Ethan’s latest catalog cards: service and status, kebab-case name,
                Locked / Editable properties, rate, visibility footer. No catalog item id on the
                card.
              </Content>
            </StackItem>
            <StackItem>
              <div className="catalog-card-grid catalog-card-grid--stable provider-admin-catalog-items__card-grid">
                {PATTERN_ITEMS.map((item) => (
                  <ModelsCatalogItemCard
                    key={`page-${item.catalogItemId}`}
                    item={item}
                    kebabItems={launchKebab()}
                  />
                ))}
              </div>
            </StackItem>
            <StackItem>
              <Title headingLevel="h2" size="lg">
                Compact (AI Grid Catalog drawer)
              </Title>
              <Content component="p">
                Same card, drawer-width variant. Product pages import this component.
              </Content>
            </StackItem>
            <StackItem>
              <Stack hasGutter>
                {PATTERN_ITEMS.map((item) => (
                  <StackItem key={`compact-${item.catalogItemId}`}>
                    <ModelsCatalogItemCard
                      variant="compact"
                      item={item}
                      kebabItems={launchKebab()}
                    />
                  </StackItem>
                ))}
              </Stack>
            </StackItem>
          </Stack>
        </Tab>
        <Tab
          eventKey="instance-lists"
          title={<TabTitleText>Instance lists</TabTitleText>}
          id="vision-patterns-tab-instance-lists"
        >
          <VisionModelInstancePatternsPage />
        </Tab>
        <Tab
          eventKey="fleet-list"
          title={<TabTitleText>Fleet list</TabTitleText>}
          id="vision-patterns-tab-fleet-list"
        >
          <VisionModelListPatternsPage embedded />
        </Tab>
      </Tabs>
    </div>
  )
}

export default VisionModelCatalogPatternsPage
