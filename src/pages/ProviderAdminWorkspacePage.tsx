import { useLayoutEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  syncWorkspaceActionParam,
  syncWorkspaceNavParam,
  WORKSPACE_ACTION_REGISTER_TENANT,
} from '../shared/workspaceNavUrl'
import { ProviderAdminShell } from '../components/provider-admin/ProviderAdminShell'
import { ProviderSetupWizardPanel } from '../components/provider-setup/ProviderSetupWizardPanel'
import type { ProviderAdminNavId } from '../providerAdmin/constants'
import { isServicesNavId, resolveProviderAdminNavId } from '../providerAdmin/constants'
import { ProviderAdminCatalogPage } from './ProviderAdminCatalogPage'
import { ProviderAdminOverviewPage } from './ProviderAdminOverviewPage'
import { ProviderAdminBmaasTemplatesPage } from './infrastructure/ProviderAdminBmaasTemplatesPage'
import { ProviderAdminDataCentersPage } from './infrastructure/ProviderAdminDataCentersPage'
import { ProviderAdminHardwareInventoryPage } from './infrastructure/ProviderAdminHardwareInventoryPage'
import { ProviderAdminBillingPage } from './ProviderAdminBillingPage'
import { ProviderAdminOrganizationsPage } from './ProviderAdminOrganizationsPage'
import { ProviderAdminRateCardsPage } from './ProviderAdminRateCardsPage'
import { ProviderAdminExternalNetworksPage } from './infrastructure/ProviderAdminExternalNetworksPage'
import { PlaceholderProviderAdminPage } from './PlaceholderProviderAdminPage'
import { ProviderServiceSelectionPage } from './provider-setup/ProviderServiceSelectionPage'
import { TenantSecretsPage } from './tenant/TenantSecretsPage'
import TenantAdminModelsPage from './tenant-admin/ai/models/TenantAdminModelsPage'
import { ModelCatalogSettingsPage } from './tenant-admin/ai/model-catalog-settings'
import { VisionModelFleetPage } from './provider-admin/vision/VisionModelFleetPage'
import { AiAssetEndpointsPage } from './tenant-user/genai/asset-endpoints/AiAssetEndpointsPage'
import { GenaiApiKeysPage } from './tenant-user/genai/api-keys'
import { PlaygroundPage } from './tenant-user/genai/playground'
import { GENAI_API_KEYS_DETAIL_PARAMS } from './tenant-user/genai/genaiNavParams'
import type { ProviderServiceId } from '../providerSetup/constants'
import { generateCatalogItemId, type PublishedTemplatePayload } from '../providerSetup/templateDemo'
import { DEFAULT_CATALOG_NETWORK_POLICY } from '../providerAdmin/catalogNetworkPolicy'
import {
  ensureProviderCatalogDemoItems,
  ensureProviderPostSetupPrototype,
  isProviderAdminNavId,
} from '../providerSetup/prototypeEntry'
import {
  getProviderActiveNav,
  getProviderCatalogItems,
  getProviderRegisteredOrganizations,
  getProviderSelectedServices,
  isProviderServicesSelected,
  isProviderSetupComplete,
  addProviderCatalogItem,
  assignCatalogToRegisteredOrganization,
  setProviderActiveNav,
  setProviderSelectedServices,
  setProviderSetupComplete,
} from '../providerSetup/storage'
import type { WorkspaceTransition } from '../providerAdmin/workspace'
import type { BmaasTemplateLookup } from '../providerAdmin/bmaasTemplates'

function normalizeProviderNavParam(value: string | null): ProviderAdminNavId | null {
  const normalizedNav =
    value === 'administration-rbac' || value === 'administration-roles'
      ? 'administration-organizations'
      : value
  if (!isProviderAdminNavId(normalizedNav)) {
    return null
  }

  return resolveProviderAdminNavId(normalizedNav)
}

function readInitialProviderNav(searchParams: URLSearchParams): ProviderAdminNavId {
  const requestedNav = normalizeProviderNavParam(searchParams.get('nav'))
  if (requestedNav) {
    ensureProviderPostSetupPrototype(requestedNav)
    return requestedNav
  }

  return getProviderActiveNav()
}

const PUBLISH_PHASE_MS = 900
const ENTER_PHASE_MS = 700
export function ProviderAdminWorkspacePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [setupComplete, setSetupComplete] = useState(() => isProviderSetupComplete())
  const [servicesSelected, setServicesSelected] = useState(() => isProviderServicesSelected())
  const [selectedServices, setSelectedServices] = useState<ProviderServiceId[]>(() =>
    getProviderSelectedServices(),
  )
  const [activeNavId, setActiveNavId] = useState<ProviderAdminNavId>(() =>
    readInitialProviderNav(searchParams),
  )
  const [catalogItems, setCatalogItems] = useState(() =>
    isProviderSetupComplete() ? ensureProviderCatalogDemoItems() : getProviderCatalogItems(),
  )
  const [workspaceTransition, setWorkspaceTransition] = useState<WorkspaceTransition>('idle')
  const [openTemplateLookup, setOpenTemplateLookup] = useState<BmaasTemplateLookup | null>(null)
  const [openCatalogItemKey, setOpenCatalogItemKey] = useState<string | null>(null)
  const [providerModelsInitialTab, setProviderModelsInitialTab] = useState<'catalog' | 'deployments'>(
    'deployments',
  )
  const [navContentKey, setNavContentKey] = useState(0)
  const catalogEditLeaveAttemptRef = useRef<((onConfirmed: () => void) => void) | null>(null)

  const navParam = searchParams.get('nav')
  const isModelDeploymentMvp = searchParams.get('navVersion') === 'model-deployment-mvp'

  useLayoutEffect(() => {
    const requestedNav = normalizeProviderNavParam(navParam)
    if (requestedNav) {
      // Do not re-run full demo seed/sync on every left-nav click — that rewrote
      // catalog identities and could drop unpublished drafts when returning to Catalog.
      const storedItems = getProviderCatalogItems()
      if (storedItems.length === 0) {
        ensureProviderPostSetupPrototype(requestedNav)
      } else {
        setProviderActiveNav(requestedNav)
      }
      setCatalogItems(getProviderCatalogItems())
      setSelectedServices(getProviderSelectedServices())
      setServicesSelected(true)
      setSetupComplete(true)
      setActiveNavId(requestedNav)
      return
    }

    const fallbackNav = getProviderActiveNav()
    syncWorkspaceNavParam(setSearchParams, fallbackNav, { replace: true })

    if (isProviderSetupComplete()) {
      const storedItems = getProviderCatalogItems()
      setCatalogItems(
        storedItems.length > 0 ? storedItems : ensureProviderCatalogDemoItems(),
      )
    }
    // Only react when `nav` changes — not when `item=` opens catalog details.
  }, [navParam, setSearchParams])

  const handleServicesContinue = (nextSelectedServices: ProviderServiceId[]) => {
    setProviderSelectedServices(nextSelectedServices)
    setSelectedServices(nextSelectedServices)
    setServicesSelected(true)
  }

  const handleChangeServices = () => {
    setServicesSelected(false)
  }

  const handleCreateCatalogItem = (payload: PublishedTemplatePayload) => {
    const status = payload.status ?? 'unpublished'
    const draft = {
      catalogItemId: generateCatalogItemId(),
      templateRefId: payload.templateRefId,
      templateName: payload.templateName,
      displayName: payload.displayName,
      description: payload.description,
      scope: payload.scope,
      rateCard: payload.rateCard,
      serviceId: payload.serviceId,
      networkPolicy: payload.networkPolicy ?? DEFAULT_CATALOG_NETWORK_POLICY,
      ...(payload.enterpriseTenantId
        ? { enterpriseTenantId: payload.enterpriseTenantId }
        : {}),
      ...(payload.enterpriseTenantIds?.length
        ? { enterpriseTenantIds: payload.enterpriseTenantIds }
        : {}),
      ...(payload.instanceTypeId ? { instanceTypeId: payload.instanceTypeId } : {}),
      ...(payload.instanceTypeLabel ? { instanceTypeLabel: payload.instanceTypeLabel } : {}),
      ...(payload.diskImageId ? { diskImageId: payload.diskImageId } : {}),
      ...(payload.diskImageLabel ? { diskImageLabel: payload.diskImageLabel } : {}),
      ...(payload.clusterVersionMode
        ? { clusterVersionMode: payload.clusterVersionMode }
        : {}),
      ...(payload.hardwareOsMode ? { hardwareOsMode: payload.hardwareOsMode } : {}),
      ...(payload.osImageMode ? { osImageMode: payload.osImageMode } : {}),
      ...(payload.nodeSetId ? { nodeSetId: payload.nodeSetId } : {}),
      ...(payload.nodeSetLabel ? { nodeSetLabel: payload.nodeSetLabel } : {}),
      ...(payload.hostTypeId ? { hostTypeId: payload.hostTypeId } : {}),
      ...(payload.hostTypeLabel ? { hostTypeLabel: payload.hostTypeLabel } : {}),
      ...(payload.clusterNodeTopologyMode
        ? { clusterNodeTopologyMode: payload.clusterNodeTopologyMode }
        : {}),
      ...(payload.fieldPolicies?.length ? { fieldPolicies: payload.fieldPolicies } : {}),
      ...(payload.modelChoice ? { modelChoice: payload.modelChoice } : {}),
      ...(payload.modelSourceSettings
        ? { modelSourceSettings: payload.modelSourceSettings }
        : {}),
      ...(payload.modelClusterAvailability
        ? { modelClusterAvailability: payload.modelClusterAvailability }
        : {}),
      ...(payload.modelSettingModes ? { modelSettingModes: payload.modelSettingModes } : {}),
      status,
      createdAt: new Date().toISOString(),
    }

    addProviderCatalogItem(draft)

    const vipOrganizationIds =
      payload.vipOrganizationIds?.length
        ? payload.vipOrganizationIds
        : payload.vipOrganizationId
          ? [payload.vipOrganizationId]
          : []

    for (const organizationId of vipOrganizationIds) {
      assignCatalogToRegisteredOrganization(organizationId, draft)
    }

    setCatalogItems(getProviderCatalogItems())

    if (status === 'unpublished') {
      setProviderActiveNav('catalog')
      setProviderSetupComplete()
      setActiveNavId('catalog')
      syncWorkspaceNavParam(setSearchParams, 'catalog', { replace: true })
      setSetupComplete(true)
      setWorkspaceTransition('idle')
      return draft
    }

    setWorkspaceTransition('publishing')

    window.setTimeout(() => {
      setProviderActiveNav('catalog')
      setProviderSetupComplete()
      setActiveNavId('catalog')
      syncWorkspaceNavParam(setSearchParams, 'catalog', { replace: true })
      setSetupComplete(true)
      setWorkspaceTransition('entering')
    }, PUBLISH_PHASE_MS)

    window.setTimeout(() => {
      setWorkspaceTransition('idle')
    }, PUBLISH_PHASE_MS + ENTER_PHASE_MS)

    return draft
  }

  const handleRegisterOrganization = () => {
    const openRegister = () => {
      setActiveNavId('administration-organizations')
      setProviderActiveNav('administration-organizations')
      setNavContentKey((current) => current + 1)
      syncWorkspaceActionParam(setSearchParams, WORKSPACE_ACTION_REGISTER_TENANT)
    }

    if (catalogEditLeaveAttemptRef.current) {
      catalogEditLeaveAttemptRef.current(openRegister)
      return
    }

    openRegister()
  }

  const performNavChange = (navId: ProviderAdminNavId) => {
    const resolvedNavId = resolveProviderAdminNavId(navId)
    setActiveNavId(resolvedNavId)
    setProviderActiveNav(resolvedNavId)
    setNavContentKey((current) => current + 1)
    syncWorkspaceNavParam(setSearchParams, resolvedNavId, {
      showLanding: true,
      clearParams: GENAI_API_KEYS_DETAIL_PARAMS,
    })
  }

  const handleNavChange = (navId: ProviderAdminNavId) => {
    if (catalogEditLeaveAttemptRef.current) {
      catalogEditLeaveAttemptRef.current(() => {
        performNavChange(navId)
      })
      return
    }

    performNavChange(navId)
  }

  const renderPostSetupContent = () => {
    const resolvedActiveNavId = resolveProviderAdminNavId(activeNavId)

    if (
      catalogItems.length === 0 &&
      (resolvedActiveNavId === 'overview' ||
        resolvedActiveNavId === 'catalog' ||
        isServicesNavId(activeNavId))
    ) {
      return <ProviderAdminOverviewPage />
    }

    switch (resolvedActiveNavId) {
      case 'catalog':
        return (
          <ProviderAdminCatalogPage
            catalogItems={catalogItems}
            isEntering={workspaceTransition === 'entering'}
            onCreateCatalogItem={handleCreateCatalogItem}
            onCatalogItemsChange={(items) => setCatalogItems(items ?? getProviderCatalogItems())}
            isPublishing={workspaceTransition !== 'idle'}
            onRegisterOrganization={handleRegisterOrganization}
            openCatalogItemKey={openCatalogItemKey}
            onOpenCatalogItemConsumed={() => setOpenCatalogItemKey(null)}
            onEditLeaveAttemptChange={(attemptLeave) => {
              catalogEditLeaveAttemptRef.current = attemptLeave
            }}
          />
        )
      case 'ai-grid':
        return (
          <VisionModelFleetPage
            catalogItems={catalogItems}
            onOpenCatalogPreset={(catalogItemId) => {
              setOpenCatalogItemKey(catalogItemId)
              handleNavChange('catalog')
            }}
          />
        )
      case 'provider-ai-models':
        return (
          <TenantAdminModelsPage
            providerOrganizations={getProviderRegisteredOrganizations()}
            initialTab={providerModelsInitialTab}
            onTabChange={setProviderModelsInitialTab}
            onManageSources={() => {
              setProviderModelsInitialTab('catalog')
              handleNavChange('provider-ai-model-catalog-settings')
            }}
          />
        )
      case 'provider-ai-model-catalog-settings':
        return (
          <ModelCatalogSettingsPage
            isProviderAdmin
            onBackToModels={() => handleNavChange('provider-ai-models')}
          />
        )
      case 'provider-ai-usage':
        return (
          <PlaceholderProviderAdminPage
            title="AI usage"
            description="Review AI model usage across the provider environment."
          />
        )
      case 'genai-asset-endpoints':
        return (
          <AiAssetEndpointsPage
            onNavigateToPlayground={() => handleNavChange('genai-playground')}
          />
        )
      case 'genai-playground':
        return <PlaygroundPage />
      case 'genai-api-keys':
        return <GenaiApiKeysPage />
      case 'infrastructure-data-centers':
        return <ProviderAdminDataCentersPage />
      case 'infrastructure-hardware-inventory':
        return <ProviderAdminHardwareInventoryPage />
      case 'infrastructure-bmaas-templates':
        return (
          <ProviderAdminBmaasTemplatesPage
            onCreateCatalogItem={handleCreateCatalogItem}
            isPublishing={workspaceTransition !== 'idle'}
            openTemplateLookup={openTemplateLookup}
            onOpenTemplateConsumed={() => setOpenTemplateLookup(null)}
          />
        )
      case 'networking':
        return <ProviderAdminExternalNetworksPage />
      case 'secrets':
        return <TenantSecretsPage scope="provider" tenantSlug="" />
      case 'administration-organizations':
        return <ProviderAdminOrganizationsPage onNavigate={handleNavChange} />
      case 'administration-billing':
        return <ProviderAdminBillingPage />
      case 'administration-rate-cards':
        return <ProviderAdminRateCardsPage />
      case 'system':
        return (
          <PlaceholderProviderAdminPage
            title="System"
            description="Review platform configuration, integrations, and operational settings."
          />
        )
      case 'overview':
      default:
        return (
          <ProviderAdminOverviewPage />
        )
    }
  }

  const renderWorkspaceContent = () => {
    if (!setupComplete) {
      if (servicesSelected) {
        return (
          <ProviderSetupWizardPanel
            selectedServices={selectedServices}
            onChangeServices={handleChangeServices}
            onCreateCatalogItem={handleCreateCatalogItem}
            isPublishing={workspaceTransition !== 'idle'}
          />
        )
      }

      return (
        <ProviderServiceSelectionPage
          initialSelectedServices={selectedServices}
          onContinue={handleServicesContinue}
        />
      )
    }

    return (
      <div key={navContentKey}>{renderPostSetupContent()}</div>
    )
  }

  return (
    <ProviderAdminShell
      showNavigation={setupComplete}
      activeNavId={activeNavId}
      onNavChange={handleNavChange}
      workspaceTransition={workspaceTransition}
      isModelDeploymentMvp={isModelDeploymentMvp}
    >
      {renderWorkspaceContent()}
    </ProviderAdminShell>
  )
}
