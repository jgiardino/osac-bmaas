import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Content, PageSection, Title } from '@patternfly/react-core'
import { VisionModelFleetPage } from './provider-admin/vision/VisionModelFleetPage'
import { ensureProviderCatalogDemoItems } from '../providerSetup/prototypeEntry'

export const AIGridFutureVisionPage = () => {
  const navigate = useNavigate()
  const [catalogItems] = useState(() => ensureProviderCatalogDemoItems())

  return (
    <main className="ai-grid-future-vision">
      <PageSection className="ai-grid-future-vision__header">
        <Title headingLevel="h1" size="2xl">
          AI Grid <small>(future vision)</small>
        </Title>
        <Content component="p">
          Explore model deployments, clusters, gateways, and catalog relationships across the
          provider environment.
        </Content>
      </PageSection>
      <VisionModelFleetPage
        catalogItems={catalogItems}
        onOpenCatalogPreset={(catalogItemId) =>
          navigate(`/provider/workspace?nav=catalog&item=${encodeURIComponent(catalogItemId)}`)
        }
      />
    </main>
  )
}
