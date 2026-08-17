import { useState } from 'react'
import { Tab, TabTitleText, Tabs } from '@patternfly/react-core'

import { TenantUserPageChrome } from '../TenantUserPageChrome'
import { McpTab } from './McpTab'
import { ModelsTab } from './ModelsTab'

type TabKey = 'models' | 'mcp'

type AiAssetEndpointsPageProps = {
  onNavigateToPlayground?: () => void
}

/**
 * Production-shaped AI asset endpoints list (osac-ux asset-endpoints-prod / odh-dashboard gen-ai).
 * First-level tenant nav chrome matches Catalog / Services / Activity log.
 */
export function AiAssetEndpointsPage({ onNavigateToPlayground }: AiAssetEndpointsPageProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('models')

  return (
    <TenantUserPageChrome
      pageClassName="tenant-user-ai-asset-endpoints"
      title="AI asset endpoints"
      description="Browse endpoints for models and MCP servers that are available as AI assets."
    >
      <Tabs
        activeKey={activeTab}
        onSelect={(_e, key) => setActiveTab(key as TabKey)}
        aria-label="AI Assets tabs"
        id="aae-prod-tabs"
      >
        <Tab
          eventKey="models"
          title={<TabTitleText>Models</TabTitleText>}
          id="aae-prod-tab-models"
        >
          <ModelsTab />
        </Tab>
        <Tab
          eventKey="mcp"
          title={<TabTitleText>MCP servers</TabTitleText>}
          id="aae-prod-tab-mcp"
        >
          <McpTab onTryInPlayground={onNavigateToPlayground} />
        </Tab>
      </Tabs>
    </TenantUserPageChrome>
  )
}
