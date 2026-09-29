import { useState } from 'react'
import {
  Alert,
  Card,
  CardBody,
  Content,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Form,
  FormGroup,
  Icon,
  Label,
  TextArea,
  Title,
  Wizard,
  WizardStep,
} from '@patternfly/react-core'
import { getCatalogServiceIcon } from '../../../catalog/serviceIcons'
import { CatalogPublishScopeIcon } from '../../../components/provider-admin/CatalogPublishScopeIcon'
import { VipEnterpriseOrganizationField } from '../../../components/provider-admin/VipEnterpriseOrganizationField'
import { KubernetesResourceNameField } from '../../../components/shared/KubernetesResourceNameHelper'
import type { RegisteredOrganization } from '../../../providerAdmin/organizations'
import { ensureProviderDemoOrganizations } from '../../../providerSetup/storage'
import {
  CATALOG_SERVICE_OFFERINGS,
  getPublishCatalogSuggestedDisplayName,
} from '../../../providerSetup/templateDemo'
import type {
  ModelSettingId,
  ModelSettingMode,
  ModelSettingModes,
} from '../../../vision/modelAuthoringFlow'
import { getModelCatalogTenantClusters } from './modelCatalogClusters'
import { ModelCatalogClusterAvailabilityStep } from './ModelCatalogClusterAvailabilityStep'
import { ModelCatalogResourcesStep } from './ModelCatalogResourcesStep'
import { ModelCatalogServingConfigurationStep } from './ModelCatalogServingConfigurationStep'
import {
  ModelCatalogSourceOptions,
  type ModelCatalogChoice,
  type ModelTenantAccessOption,
} from './ModelCatalogSourceOptions'

type ModelCatalogItemWizardPreviewProps = {
  eligibleClusterIds: readonly string[]
  onEligibleClusterIdsChange: (clusterIds: readonly string[]) => void
  settingModes: ModelSettingModes
  onSettingModeChange: (id: ModelSettingId, mode: ModelSettingMode) => void
}

type CatalogVisibility = 'global-public' | 'vip-enterprise'

const formatSelectedTenants = (
  organizations: readonly RegisteredOrganization[],
  selectedTenantIds: readonly string[],
) => {
  if (selectedTenantIds.length === 0) {
    return 'No tenants selected'
  }
  return selectedTenantIds
    .map(
      (tenantId) =>
        organizations.find((organization) => organization.tenantId === tenantId)?.name ?? tenantId,
    )
    .join(', ')
}

export function ModelCatalogItemWizardPreview({
  eligibleClusterIds,
  onEligibleClusterIdsChange,
  settingModes,
  onSettingModeChange,
}: ModelCatalogItemWizardPreviewProps) {
  const [organizations] = useState<RegisteredOrganization[]>(() =>
    ensureProviderDemoOrganizations(),
  )
  const [visibility, setVisibility] = useState<CatalogVisibility>('global-public')
  const [selectedServiceId, setSelectedServiceId] = useState('models')
  const [selectedTenantIds, setSelectedTenantIds] = useState<string[]>([])
  const [displayName, setDisplayName] = useState('')
  const [description, setDescription] = useState('')
  const [clusterAccess, setClusterAccess] = useState<ModelSettingMode>('locked')
  const [tenantAccessOptions, setTenantAccessOptions] = useState<
    readonly ModelTenantAccessOption[]
  >(['catalog', 'connection'])
  const [catalogChoices, setCatalogChoices] = useState<Record<string, ModelCatalogChoice>>({})

  const modelService = CATALOG_SERVICE_OFFERINGS.find(
    (service) => service.id === selectedServiceId,
  )!
  const visibleTenantIds =
    visibility === 'global-public'
      ? organizations.map((organization) => organization.tenantId)
      : selectedTenantIds
  const visibleOrganizations = organizations.filter((organization) =>
    visibleTenantIds.includes(organization.tenantId),
  )
  const allClusters = organizations.flatMap((organization) =>
    getModelCatalogTenantClusters(organization.tenantId),
  )
  const selectedClusterNames = allClusters
    .filter((cluster) => eligibleClusterIds.includes(cluster.id))
    .map((cluster) => cluster.name)
  const selectedModelAccessLabels = [
    ...(tenantAccessOptions.includes('catalog') ? ['Models from the catalog'] : []),
    ...(tenantAccessOptions.includes('connection') ? ['Models from a connection'] : []),
  ]

  const selectVipEnterprise = () => {
    setVisibility('vip-enterprise')
    if (selectedTenantIds.length === 0 && organizations[0]) {
      setSelectedTenantIds([organizations[0].tenantId])
    }
  }

  return (
    <div className="vision-model-flow-preview">
      <Wizard
        className="vision-model-flow-preview__wizard"
        height="46rem"
        navAriaLabel="Create model catalog item steps"
      >
        <WizardStep name="Service" id="model-catalog-service">
          <div className="provider-setup-template__publish-service-step">
            <Content component="p" className="provider-setup-template__publish-step-lede">
              Choose the service this catalog item belongs to.
            </Content>
            <div
              className="provider-setup-template__service-cards"
              role="radiogroup"
              aria-label="Catalog service"
            >
              {CATALOG_SERVICE_OFFERINGS.map((service) => {
                const isSelected = selectedServiceId === service.id
                const titleId = `model-catalog-service-${service.id}-title`

                return (
                  <Card
                    key={service.id}
                    isSelectable
                    isSelected={isSelected}
                    className="provider-setup-template__service-card"
                    aria-labelledby={titleId}
                    onClick={() => setSelectedServiceId(service.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        setSelectedServiceId(service.id)
                      }
                    }}
                  >
                    <CardBody className="provider-setup-template__service-card-body">
                      {isSelected ? (
                        <Label
                          color="grey"
                          isCompact
                          className="provider-setup-template__service-card-badge"
                        >
                          Selected
                        </Label>
                      ) : null}
                      <div className="provider-setup-template__service-card-icon-wrap">
                        <Icon size="lg">{getCatalogServiceIcon(service.id)}</Icon>
                      </div>
                      <Title
                        id={titleId}
                        headingLevel="h3"
                        size="md"
                        className="provider-setup-template__service-card-title"
                      >
                        {service.title}
                      </Title>
                      <Content
                        component="p"
                        className="provider-setup-template__service-card-description"
                      >
                        {service.description}
                      </Content>
                    </CardBody>
                  </Card>
                )
              })}
            </div>
          </div>
        </WizardStep>

        <WizardStep name="General" id="model-catalog-general">
          <div className="provider-setup-template__publish-display-step">
            <Content component="p" className="provider-setup-template__publish-step-lede">
              Set the name and description tenants see in the catalog.
            </Content>
            <Form autoComplete="off" className="provider-setup-template__publish-display-form">
              <FormGroup label="Name" fieldId="model-catalog-name" isRequired>
                <KubernetesResourceNameField
                  id="model-catalog-name"
                  value={displayName}
                  onChange={setDisplayName}
                  aria-label="Name"
                  placeholder={`e.g. ${getPublishCatalogSuggestedDisplayName('models')}`}
                  isRequired
                />
              </FormGroup>
              <FormGroup label="Description" fieldId="model-catalog-description">
                <TextArea
                  id="model-catalog-description"
                  value={description}
                  onChange={(_event, value) => setDescription(value)}
                  aria-label="Description"
                  rows={3}
                  resizeOrientation="vertical"
                />
              </FormGroup>
            </Form>
          </div>
        </WizardStep>

        <WizardStep name="Visibility" id="model-catalog-visibility">
          <div className="provider-setup-template__publish-scope-step">
            <Content component="p" className="provider-setup-template__publish-step-lede">
              Control which tenants can discover and order this catalog item.
            </Content>
            <div
              className="provider-admin-catalog__scope-options"
              role="radiogroup"
              aria-label="Visibility"
            >
              <button
                type="button"
                className={`provider-admin-catalog__scope-card${
                  visibility === 'global-public'
                    ? ' provider-admin-catalog__scope-card--selected'
                    : ''
                }`}
                onClick={() => {
                  setVisibility('global-public')
                  setSelectedTenantIds([])
                }}
                role="radio"
                aria-checked={visibility === 'global-public'}
              >
                {visibility === 'global-public' ? (
                  <Label
                    color="grey"
                    isCompact
                    className="provider-admin-catalog__scope-selected-badge"
                  >
                    Selected
                  </Label>
                ) : null}
                <CatalogPublishScopeIcon
                  scope="global-public"
                  className="provider-admin-catalog__scope-icon"
                />
                <span className="provider-admin-catalog__scope-copy">
                  <span className="provider-admin-catalog__scope-title">Global public</span>
                  <span className="provider-admin-catalog__scope-detail">
                    Visible to all tenants.
                  </span>
                </span>
              </button>
              <div className="provider-admin-catalog__scope-vip-group">
                <button
                  type="button"
                  className={`provider-admin-catalog__scope-card${
                    visibility === 'vip-enterprise'
                      ? ' provider-admin-catalog__scope-card--selected'
                      : ''
                  }`}
                  onClick={selectVipEnterprise}
                  role="radio"
                  aria-checked={visibility === 'vip-enterprise'}
                >
                  {visibility === 'vip-enterprise' ? (
                    <Label
                      color="grey"
                      isCompact
                      className="provider-admin-catalog__scope-selected-badge"
                    >
                      Selected
                    </Label>
                  ) : null}
                  <CatalogPublishScopeIcon
                    scope="vip-enterprise"
                    className="provider-admin-catalog__scope-icon"
                  />
                  <span className="provider-admin-catalog__scope-copy">
                    <span className="provider-admin-catalog__scope-title">VIP enterprise</span>
                    <span className="provider-admin-catalog__scope-detail">
                      Visible only to selected enterprise tenants.
                    </span>
                  </span>
                </button>
                {visibility === 'vip-enterprise' ? (
                  <div className="provider-admin-catalog__scope-vip-nested">
                    <VipEnterpriseOrganizationField
                      organizations={[...organizations]}
                      selectedTenantIds={selectedTenantIds}
                      onSelectedTenantIdsChange={setSelectedTenantIds}
                      fieldIdPrefix="model-catalog"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </WizardStep>

        <WizardStep name="Cluster availability" id="model-catalog-clusters">
          <ModelCatalogClusterAvailabilityStep
            organizations={organizations}
            visibleTenantIds={visibleTenantIds}
            eligibleClusterIds={eligibleClusterIds}
            onEligibleClusterIdsChange={onEligibleClusterIdsChange}
            accessMode={clusterAccess}
            onAccessModeChange={setClusterAccess}
          />
        </WizardStep>

        <WizardStep name="Model source" id="model-catalog-source">
          <ModelCatalogSourceOptions
            tenants={visibleOrganizations}
            tenantAccessOptions={tenantAccessOptions}
            onTenantAccessOptionsChange={setTenantAccessOptions}
            catalogChoices={catalogChoices}
            onCatalogChoiceChange={(tenantId, choice) =>
              setCatalogChoices((current) => ({
                ...current,
                [tenantId]: choice,
              }))
            }
          />
        </WizardStep>

        <WizardStep name="Serving configuration" id="model-catalog-serving">
          <ModelCatalogServingConfigurationStep
            llmOnly={false}
            settingModes={settingModes}
            onSettingModeChange={onSettingModeChange}
          />
        </WizardStep>

        <WizardStep name="Resources" id="model-catalog-resources">
          <ModelCatalogResourcesStep
            settingModes={settingModes}
            onSettingModeChange={onSettingModeChange}
          />
        </WizardStep>

        <WizardStep name="Review" id="model-catalog-review">
          <div className="provider-setup-template__publish-review-step">
            <Content component="p" className="provider-setup-template__publish-step-lede">
              Confirm the catalog item details before creating.
            </Content>
            <DescriptionList
              isCompact
              className="provider-setup-template__publish-review-list"
              aria-label="Catalog item review"
            >
              <DescriptionListGroup>
                <DescriptionListTerm>Service</DescriptionListTerm>
                <DescriptionListDescription>{modelService.title}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Name</DescriptionListTerm>
                <DescriptionListDescription>{displayName || '—'}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Description</DescriptionListTerm>
                <DescriptionListDescription>{description || '—'}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Visibility</DescriptionListTerm>
                <DescriptionListDescription>
                  {visibility === 'global-public'
                    ? 'Global public'
                    : `VIP enterprise · ${formatSelectedTenants(organizations, selectedTenantIds)}`}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Eligible clusters</DescriptionListTerm>
                <DescriptionListDescription>
                  {selectedClusterNames.length > 0 ? selectedClusterNames.join(', ') : '—'}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Model access</DescriptionListTerm>
                <DescriptionListDescription>
                  {selectedModelAccessLabels.join(', ') || '—'}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Model choices</DescriptionListTerm>
                <DescriptionListDescription>
                  {visibleOrganizations
                    .map((tenant) => {
                      const choice = catalogChoices[tenant.tenantId] ?? 'all'
                      return `${tenant.name}: ${
                        choice === 'all' ? 'All models' : 'Specific models'
                      }`
                    })
                    .join('; ') || '—'}
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
            <Alert
              variant="info"
              isInline
              title="Starts as unpublished"
              className="provider-setup-template__publish-review-alert"
            >
              <Content component="p">
                New catalog items are saved as unpublished. Publish from the catalog when you are
                ready for tenants to use this offering.
              </Content>
            </Alert>
          </div>
        </WizardStep>
      </Wizard>
    </div>
  )
}
