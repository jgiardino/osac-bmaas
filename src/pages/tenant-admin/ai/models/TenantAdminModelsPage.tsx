import { useState } from 'react'
import {
  Button,
  EmptyState,
  EmptyStateBody,
  Label,
  SearchInput,
  Tab,
  TabTitleText,
  Tabs,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
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
import ModelDeploymentsAlternateTable from '../../../../components/catalog/ModelDeploymentsAlternateTable'
import type { ModelDeploymentAlternateView } from '../../../../components/catalog/ModelDeploymentsAlternateTable'
import { PillFilterSelect } from '../../../../components/shared/PillFilterSelect'
import { GenaiPageStack } from '../../../tenant-user/genai/GenaiPageStack'
import { TenantUserPageChrome } from '../../../tenant-user/genai/TenantUserPageChrome'
import type { RegisteredOrganization } from '../../../../providerAdmin/organizations'
import { TenantAdminModelsCatalogTab } from './TenantAdminModelsCatalogTab'

type MainTab = 'catalog' | 'deployments'
type DeploymentSourceTab = 'internal' | 'external'
type DeploymentStatus = 'Started' | 'Failed' | 'Stopped'
type ModelDeploymentView = ModelDeploymentAlternateView | 'rhoai-original'

const MODEL_DEPLOYMENT_VIEW_OPTIONS = [
  { value: 'rhoai-original', label: 'RHOAI original' },
  { value: 'flat-list', label: 'Flat list' },
  { value: 'grouped-by-model', label: 'Grouped by model' },
  { value: 'grouped-by-cluster', label: 'Grouped by cluster' },
]

interface ModelDeployment {
  id: string
  name: string
  resource: string
  endpoint: string
  hardware: string
  tenantId: string
  lastDeployed: string
  status: DeploymentStatus
  source: DeploymentSourceTab
}

// These display sections can be restored independently if the deployments copy is expanded.
const SHOW_DEPLOYMENT_DESCRIPTION = false
const SHOW_DEPLOYMENT_SOURCE_TABS = false

const INITIAL_DEPLOYMENTS: ModelDeployment[] = [
  {
    id: 'gpt-oss-20b-endpoint',
    name: 'gpt-oss-20b-endpoint',
    resource: 'vLLM ServingRuntime',
    endpoint: 'https://gpt-oss-20b-ml-project.apps.example.com',
    hardware: 'Large',
    tenantId: 'north-summit-bank',
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
    tenantId: 'harborline-capital',
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
    tenantId: 'north-summit-bank',
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
    tenantId: 'harborline-capital',
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

interface TenantAdminModelsPageProps {
  providerOrganizations?: RegisteredOrganization[]
  onManageSources?: () => void
  onTabChange?: (tab: MainTab) => void
  initialTab?: MainTab
}

const TenantAdminModelsPage = ({
  providerOrganizations,
  onManageSources,
  onTabChange,
  initialTab,
}: TenantAdminModelsPageProps) => {
  const [activeTab, setActiveTab] = useState<MainTab>(initialTab ?? 'deployments')
  const [activeSourceTab, setActiveSourceTab] = useState<DeploymentSourceTab>('internal')
  const [deployments, setDeployments] = useState(INITIAL_DEPLOYMENTS)
  const [searchValue, setSearchValue] = useState('')
  const [selectedTenantId, setSelectedTenantId] = useState('')
  const [deploymentView, setDeploymentView] = useState<ModelDeploymentView>('grouped-by-model')
  const [expandedDeploymentId, setExpandedDeploymentId] = useState<string | null>(null)
  const isProviderAdmin = providerOrganizations !== undefined
  const tenantOptions = [
    { value: '', label: 'All tenants' },
    ...(providerOrganizations ?? [])
      .slice()
      .sort((left, right) =>
        left.name.localeCompare(right.name, undefined, { sensitivity: 'base' }),
      )
      .map((organization) => ({ value: organization.tenantId, label: organization.name })),
  ]

  const visibleDeployments = deployments.filter(
    (deployment) =>
      deployment.source === activeSourceTab &&
      (!isProviderAdmin || !selectedTenantId || deployment.tenantId === selectedTenantId) &&
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
          {isProviderAdmin ? (
            <Td dataLabel="Visibility">
              {(providerOrganizations ?? []).find(
                (organization) => organization.tenantId === deployment.tenantId,
              )?.name ?? deployment.tenantId}
            </Td>
          ) : null}
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
          <Td noPadding colSpan={isProviderAdmin ? 9 : 8}>
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

  const selectTab = (tab: MainTab) => {
    setActiveTab(tab)
    onTabChange?.(tab)
  }

  return (
    <TenantUserPageChrome
      pageClassName="tenant-admin-models"
      kicker="AI"
      title="Models"
      description="Discover, deploy, and customize models for your organizations, and monitor the health and performance of your active deployments."
    >
      <GenaiPageStack>
        <Tabs
          activeKey={activeTab}
          onSelect={(_event, tabIndex) => {
            selectTab(tabIndex as MainTab)
          }}
          id="tenant-admin-models-tabs"
          aria-label="Models sections"
        >
          <Tab
            eventKey="catalog"
            title={<TabTitleText>Catalog</TabTitleText>}
            id="tenant-admin-models-catalog-tab"
          >
            <TenantAdminModelsCatalogTab onManageSources={onManageSources} />
          </Tab>
          <Tab
            eventKey="deployments"
            title={<TabTitleText>Deployments</TabTitleText>}
            id="tenant-admin-models-deployments-tab"
          >
            <GenaiPageStack>
              {SHOW_DEPLOYMENT_DESCRIPTION ? (
                <p>View and manage the health and performance of deployed models.</p>
              ) : null}
              {SHOW_DEPLOYMENT_SOURCE_TABS ? (
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
              ) : null}
              <Toolbar id="tenant-admin-model-deployments-toolbar" hasNoPadding>
                <ToolbarContent>
                  {isProviderAdmin ? (
                    <ToolbarItem>
                      <PillFilterSelect
                        id="provider-admin-model-deployments-tenant"
                        value={selectedTenantId}
                        options={tenantOptions}
                        onChange={(tenantId) => {
                          setSelectedTenantId(tenantId)
                          setExpandedDeploymentId(null)
                        }}
                        ariaLabel="Filter model deployments by tenant"
                      />
                    </ToolbarItem>
                  ) : null}
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
                      onClick={() => selectTab('catalog')}
                    >
                      Deploy model
                    </Button>
                  </ToolbarItem>
                  <ToolbarGroup align={{ default: 'alignEnd' }}>
                    <ToolbarItem>
                      <PillFilterSelect
                        id="model-deployments-view"
                        value={deploymentView}
                        options={MODEL_DEPLOYMENT_VIEW_OPTIONS}
                        onChange={(view) => {
                          setDeploymentView(view as ModelDeploymentView)
                          setExpandedDeploymentId(null)
                        }}
                        ariaLabel="Select model deployments view"
                        prefix="View: "
                      />
                    </ToolbarItem>
                  </ToolbarGroup>
                </ToolbarContent>
              </Toolbar>
              {deploymentView !== 'rhoai-original' ? (
                <ModelDeploymentsAlternateTable
                  key={`${deploymentView}-${selectedTenantId}`}
                  view={deploymentView}
                  selectedTenantId={selectedTenantId}
                  organizations={providerOrganizations ?? []}
                  tenantOrgId={isProviderAdmin ? undefined : 'nsb'}
                  showVisibility={isProviderAdmin}
                  searchValue={searchValue}
                />
              ) : visibleDeployments.length > 0 ? (
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
                      {isProviderAdmin ? <Th>Visibility</Th> : null}
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
