import { useState } from 'react'
import {
  Button,
  EmptyState,
  EmptyStateBody,
  Gallery,
  Label,
  SearchInput,
  Tab,
  TabTitleText,
  Tabs,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core'
import {
  ActionsColumn,
  ExpandableRowContent,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table'
import type { IAction } from '@patternfly/react-table'
import { ModelsCatalogItemCard } from '../../../../components/catalog/ModelsCatalogItemCard'
import { GenaiPageStack } from '../../../tenant-user/genai/GenaiPageStack'
import { TenantUserPageChrome } from '../../../tenant-user/genai/TenantUserPageChrome'
import { createModelCatalogDrafts } from '../../../../vision/modelCatalogSeed'

type MainTab = 'catalog' | 'deployments'
type DeploymentSourceTab = 'internal' | 'external'
type DeploymentStatus = 'Started' | 'Failed' | 'Stopped'

interface ModelDeployment {
  id: string
  name: string
  resource: string
  endpoint: string
  hardware: string
  lastDeployed: string
  status: DeploymentStatus
  source: DeploymentSourceTab
}

const MODEL_CATALOG_DRAFTS = createModelCatalogDrafts()

const INITIAL_DEPLOYMENTS: ModelDeployment[] = [
  {
    id: 'gpt-oss-20b-endpoint',
    name: 'gpt-oss-20b-endpoint',
    resource: 'vLLM ServingRuntime',
    endpoint: 'https://gpt-oss-20b-ml-project.apps.example.com',
    hardware: 'Large',
    lastDeployed: 'Sep 22, 2026',
    status: 'Started',
    source: 'internal',
  },
  {
    id: 'llama-assist',
    name: 'llama-assist',
    resource: 'vLLM ServingRuntime',
    endpoint: 'https://llama-assist-ml-project.apps.example.com',
    hardware: 'Medium',
    lastDeployed: 'Sep 20, 2026',
    status: 'Started',
    source: 'internal',
  },
  {
    id: 'edge-detector',
    name: 'edge-detector',
    resource: 'OpenVINO Model Server',
    endpoint: 'https://edge-detector-ml-project.apps.example.com',
    hardware: 'Small',
    lastDeployed: 'Sep 18, 2026',
    status: 'Failed',
    source: 'internal',
  },
  {
    id: 'external-gpt-4o',
    name: 'external-gpt-4o',
    resource: 'External service',
    endpoint: 'https://api.openai.com/v1',
    hardware: '—',
    lastDeployed: 'Sep 16, 2026',
    status: 'Started',
    source: 'external',
  },
]

const DeploymentStatusLabel = ({ status }: { status: DeploymentStatus }) => {
  const color = status === 'Started' ? 'green' : status === 'Failed' ? 'red' : 'grey'

  return (
    <Label color={color} variant="outline" isCompact>
      {status}
    </Label>
  )
}

const TenantAdminModelsPage = () => {
  const [activeTab, setActiveTab] = useState<MainTab>('deployments')
  const [activeSourceTab, setActiveSourceTab] = useState<DeploymentSourceTab>('internal')
  const [deployments, setDeployments] = useState(INITIAL_DEPLOYMENTS)
  const [searchValue, setSearchValue] = useState('')
  const [expandedDeploymentId, setExpandedDeploymentId] = useState<string | null>(null)

  const visibleDeployments = deployments.filter(
    (deployment) =>
      deployment.source === activeSourceTab &&
      deployment.name.toLocaleLowerCase().includes(searchValue.trim().toLocaleLowerCase()),
  )

  const stopDeployment = (deploymentId: string) => {
    setDeployments((current) =>
      current.map((deployment) =>
        deployment.id === deploymentId ? { ...deployment, status: 'Stopped' } : deployment,
      ),
    )
  }

  const renderDeploymentRows = () =>
    visibleDeployments.flatMap((deployment, rowIndex) => {
      const isExpanded = expandedDeploymentId === deployment.id
      const actions: IAction[] = [
        {
          title: 'View deployment details',
          onClick: () => setExpandedDeploymentId(isExpanded ? null : deployment.id),
        },
      ]

      return [
        <Tr key={deployment.id} id={`model-deployment-row-${deployment.id}`}>
          <Td
            expand={{
              rowIndex,
              isExpanded,
              onToggle: () => setExpandedDeploymentId(isExpanded ? null : deployment.id),
              expandId: `model-deployment-expand-${deployment.id}`,
            }}
          />
          <Td dataLabel="Model deployment name">{deployment.name}</Td>
          <Td dataLabel="Deployment resource">{deployment.resource}</Td>
          <Td dataLabel="Inference endpoints">{deployment.endpoint}</Td>
          <Td dataLabel="Hardware profile">{deployment.hardware}</Td>
          <Td dataLabel="Last deployed">{deployment.lastDeployed}</Td>
          <Td dataLabel="Status">
            <DeploymentStatusLabel status={deployment.status} />
          </Td>
          <Td isActionCell>
            {deployment.status === 'Stopped' ? null : (
              <Button
                variant="link"
                isInline
                onClick={() => stopDeployment(deployment.id)}
                id={`model-deployment-stop-${deployment.id}`}
              >
                Stop
              </Button>
            )}
          </Td>
          <Td isActionCell>
            <ActionsColumn items={actions} />
          </Td>
        </Tr>,
        <Tr key={`${deployment.id}-details`} isExpanded={isExpanded}>
          <Td />
          <Td noPadding colSpan={8}>
            <ExpandableRowContent>
              <div className="pf-v6-u-p-md">
                <strong>Inference endpoint</strong>
                <p>{deployment.endpoint}</p>
              </div>
            </ExpandableRowContent>
          </Td>
        </Tr>,
      ]
    })

  return (
    <TenantUserPageChrome
      pageClassName="tenant-admin-models"
      title="Models"
    >
      <GenaiPageStack>
        <Tabs
          activeKey={activeTab}
          onSelect={(_event, tabIndex) => setActiveTab(tabIndex as MainTab)}
          id="tenant-admin-models-tabs"
          aria-label="Models sections"
        >
          <Tab
            eventKey="catalog"
            title={<TabTitleText>Catalog</TabTitleText>}
            id="tenant-admin-models-catalog-tab"
          >
            <Gallery hasGutter>
              {MODEL_CATALOG_DRAFTS.map((item) => (
                <ModelsCatalogItemCard
                  key={item.catalogItemId}
                  id={`tenant-admin-model-catalog-${item.catalogItemId}`}
                  item={item}
                />
              ))}
            </Gallery>
          </Tab>
          <Tab
            eventKey="deployments"
            title={<TabTitleText>Deployments</TabTitleText>}
            id="tenant-admin-models-deployments-tab"
          >
            <GenaiPageStack>
              <p>View and manage the health and performance of deployed models.</p>
              <Tabs
                activeKey={activeSourceTab}
                onSelect={(_event, tabIndex) => {
                  setActiveSourceTab(tabIndex as DeploymentSourceTab)
                  setSearchValue('')
                  setExpandedDeploymentId(null)
                }}
                id="tenant-admin-model-deployment-source-tabs"
                aria-label="Model deployment source"
              >
                <Tab
                  eventKey="internal"
                  title={<TabTitleText>Internal models</TabTitleText>}
                  id="tenant-admin-model-deployments-internal-tab"
                >
                  <div />
                </Tab>
                <Tab
                  eventKey="external"
                  title={<TabTitleText>External models</TabTitleText>}
                  id="tenant-admin-model-deployments-external-tab"
                >
                  <div />
                </Tab>
              </Tabs>
              <Toolbar id="tenant-admin-model-deployments-toolbar" hasNoPadding>
                <ToolbarContent>
                  <ToolbarItem>
                    <SearchInput
                      id="tenant-admin-model-deployments-search"
                      aria-label="Filter deployments by name"
                      placeholder="Filter by name"
                      value={searchValue}
                      onChange={(_event, value) => setSearchValue(value)}
                      onClear={() => setSearchValue('')}
                    />
                  </ToolbarItem>
                  <ToolbarItem>
                    <Button
                      variant="primary"
                      id="tenant-admin-deploy-model-button"
                      onClick={() => setActiveTab('catalog')}
                    >
                      Deploy model
                    </Button>
                  </ToolbarItem>
                </ToolbarContent>
              </Toolbar>
              {visibleDeployments.length > 0 ? (
                <Table
                  aria-label={`${activeSourceTab === 'internal' ? 'Internal' : 'External'} model deployments`}
                  id="tenant-admin-model-deployments-table"
                  variant="compact"
                >
                  <Thead>
                    <Tr>
                      <Th screenReaderText="Expand deployment" />
                      <Th>Model deployment name</Th>
                      <Th>Deployment resource</Th>
                      <Th>Inference endpoints</Th>
                      <Th>Hardware profile</Th>
                      <Th>Last deployed</Th>
                      <Th>Status</Th>
                      <Th screenReaderText="Stop deployment" />
                      <Th screenReaderText="Actions" />
                    </Tr>
                  </Thead>
                  <Tbody>{renderDeploymentRows()}</Tbody>
                </Table>
              ) : (
                <EmptyState
                  headingLevel="h2"
                  titleText={searchValue.trim() ? 'No models match your filter' : 'No deployments'}
                  id="tenant-admin-model-deployments-empty-state"
                >
                  <EmptyStateBody>
                    {searchValue.trim()
                      ? 'Try a different name or clear the search field.'
                      : 'Deploy a model to see its status and inference endpoint here.'}
                  </EmptyStateBody>
                </EmptyState>
              )}
            </GenaiPageStack>
          </Tab>
        </Tabs>
      </GenaiPageStack>
    </TenantUserPageChrome>
  )
}

export default TenantAdminModelsPage
