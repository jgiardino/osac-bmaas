import { useState } from 'react'
import {
  Badge,
  EmptyState,
  EmptyStateBody,
  Icon,
  Label,
  LabelGroup,
  MenuToggle,
  SearchInput,
  Select,
  SelectList,
  SelectOption,
  Tab,
  TabTitleText,
  Tabs,
  Toolbar,
  ToolbarContent,
  ToolbarFilter,
  ToolbarGroup,
  ToolbarItem,
  ToolbarToggleGroup,
} from '@patternfly/react-core'
import { ExpandableRowContent, Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table'
import FilterIcon from '@patternfly/react-icons/dist/esm/icons/filter-icon'
import type { PhaseStatus } from './mockData'
import { MaasModelIdentity } from '../../../../components/catalog/MaasModelIdentity'
import { TenantUserPageChrome } from '../../../tenant-user/genai/TenantUserPageChrome'
import type { GovernanceModel, SubscriptionListItem, SubscriptionRef, TokenRateLimit } from './mockData'
import { PhaseStaticLabel } from './PopoverLabels'
import MaaSGovernanceLearnMore from './MaaSGovernanceLearnMore'

type GovernanceTab = 'models' | 'subscriptions'
type ModelFilterAttribute = 'model' | 'group' | 'subscription' | 'modelType'
type SubscriptionFilterAttribute = 'keyword' | 'group' | 'model' | 'phase'

const MODEL_FILTER_LABELS: Record<ModelFilterAttribute, string> = {
  model: 'Model name',
  group: 'Group name',
  subscription: 'Subscription name',
  modelType: 'Model type',
}

const MODEL_FILTER_PLACEHOLDERS: Record<Exclude<ModelFilterAttribute, 'modelType'>, string> = {
  model: 'Filter by model name, model ID, or description',
  group: 'Filter by group name',
  subscription: 'Filter by subscription name',
}

const MODEL_FILTER_OPTIONS: ModelFilterAttribute[] = [
  'model',
  'group',
  'subscription',
  'modelType',
]

const SUBSCRIPTION_FILTER_LABELS: Record<SubscriptionFilterAttribute, string> = {
  keyword: 'Keyword',
  group: 'Group name',
  model: 'Model name',
  phase: 'Status',
}

const SUBSCRIPTION_FILTER_PLACEHOLDERS: Record<Exclude<SubscriptionFilterAttribute, 'phase'>, string> = {
  keyword: 'Filter by name, resource name, or description',
  group: 'Filter by group name',
  model: 'Filter by model name',
}

const SUBSCRIPTION_FILTER_OPTIONS: SubscriptionFilterAttribute[] = [
  'keyword',
  'group',
  'model',
  'phase',
]

const SUBSCRIPTION_PHASES: PhaseStatus[] = [
  'Active',
  'Pending',
  'Failed',
  'Deleting',
  'Degraded',
  'Unhealthy',
  'Unknown',
]

const includesQuery = (values: string[], query: string): boolean =>
  values.some((value) => value.toLocaleLowerCase().includes(query))

interface TenantMaaSGovernanceViewProps {
  models: GovernanceModel[]
  subscriptions: SubscriptionListItem[]
}

const formatTokenRateLimits = (limits: TokenRateLimit[]): string =>
  limits
    .map(
      (limit) =>
        `${limit.tokens.toLocaleString()} tokens per ${limit.per > 1 ? `${limit.per} ` : ''}${limit.unit}`,
    )
    .join(' · ')

const renderSubscriptionDetails = (
  model: GovernanceModel,
  subscriptions: SubscriptionListItem[],
) => {
  if (model.subscriptions.length === 0) {
    return (
      <EmptyState headingLevel="h3" titleText="No subscriptions" variant="xs">
        <EmptyStateBody>No subscription tiers are available for this model.</EmptyStateBody>
      </EmptyState>
    )
  }

  return (
    <Table
      aria-label={`${model.name} subscriptions`}
      variant="compact"
      isNested
      id={`tenant-maas-subscriptions-${model.id}`}
    >
      <Thead>
        <Tr resetOffset>
          <Th>Subscription</Th>
          <Th modifier="fitContent">Groups</Th>
          <Th>Token rate limits</Th>
          <Th modifier="fitContent">Status</Th>
        </Tr>
      </Thead>
      <Tbody>
        {model.subscriptions.map((subscription: SubscriptionRef) => {
          const details = subscriptions.find((item) => item.id === subscription.id)

          return (
            <Tr key={subscription.id} id={`tenant-maas-subscription-${subscription.id}`}>
              <Td dataLabel="Subscription">
                <div>
                  <strong>{subscription.name}</strong>
                </div>
                {details?.description ? <div>{details.description}</div> : null}
              </Td>
              <Td dataLabel="Groups">
                {subscription.groups.length > 0 ? (
                  <LabelGroup isCompact>
                    {subscription.groups.map((group) => (
                      <Label key={group} color="grey" isCompact>
                        {group}
                      </Label>
                    ))}
                  </LabelGroup>
                ) : (
                  '—'
                )}
              </Td>
              <Td dataLabel="Token rate limits">
                {subscription.tokenLimits.length > 0
                  ? formatTokenRateLimits(subscription.tokenLimits)
                  : '—'}
              </Td>
              <Td dataLabel="Status" modifier="fitContent">
                <PhaseStaticLabel phase={subscription.phase} />
              </Td>
            </Tr>
          )
        })}
      </Tbody>
    </Table>
  )
}

type SubscriptionExpandColumn = 'groups' | 'models'

const renderSubscriptionGroupsExpanded = (subscription: SubscriptionListItem) => (
  <ExpandableRowContent>
    <div className="pf-v6-u-pb-lg">
      <Table
        aria-label={`${subscription.name} groups`}
        variant="compact"
        isNested
        id={`tenant-maas-subscription-groups-${subscription.id}`}
      >
        <Thead>
          <Tr resetOffset>
            <Th>Group name</Th>
          </Tr>
        </Thead>
        <Tbody>
          {subscription.groups.map((group) => (
            <Tr key={group} resetOffset>
              <Td dataLabel="Group name">
                <strong>{group}</strong>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  </ExpandableRowContent>
)

const renderSubscriptionModelsExpanded = (
  subscription: SubscriptionListItem,
  models: GovernanceModel[],
) => (
  <ExpandableRowContent>
    <div className="pf-v6-u-pb-lg">
      <Table
        aria-label={`${subscription.name} models`}
        variant="compact"
        isNested
        id={`tenant-maas-subscription-models-${subscription.id}`}
      >
        <Thead>
          <Tr resetOffset>
            <Th>Model name</Th>
            <Th>Token limits</Th>
          </Tr>
        </Thead>
        <Tbody>
          {subscription.models.map((modelId) => {
            const model = models.find((item) => item.identityId === modelId)
            const sourceLabel = model
              ? {
                  text: model.source === 'external' ? 'External' : 'Internal',
                  color: model.source === 'external' ? ('teal' as const) : ('orange' as const),
                }
              : undefined

            return (
              <Tr key={modelId} resetOffset>
                <Td dataLabel="Model name">
                  <MaasModelIdentity
                    id={`tenant-maas-subscription-model-${subscription.id}-${modelId}`}
                    displayName={model?.name ?? modelId}
                    modelRefId={model?.modelId ?? modelId}
                    description={model?.description}
                    labels={sourceLabel ? [sourceLabel] : []}
                  />
                </Td>
                <Td dataLabel="Token limits">
                  {formatTokenRateLimits(subscription.tokenLimits[modelId] ?? []) || '—'}
                </Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </div>
  </ExpandableRowContent>
)

const renderSubscriptionsList = (
  subscriptions: SubscriptionListItem[],
  models: GovernanceModel[],
  expandedSubscriptions: Record<string, SubscriptionExpandColumn>,
  onToggleExpand: (subscriptionId: string, column: SubscriptionExpandColumn) => void,
  emptyTitle: string,
  emptyBody: string,
) => {
  if (subscriptions.length === 0) {
    return (
      <EmptyState headingLevel="h2" titleText={emptyTitle}>
        <EmptyStateBody>{emptyBody}</EmptyStateBody>
      </EmptyState>
    )
  }

  return (
    <Table aria-label="MaaS subscriptions" isExpandable id="tenant-maas-subscriptions-table">
      <Thead>
        <Tr>
          <Th>Subscription</Th>
          <Th modifier="fitContent">Status</Th>
          <Th modifier="fitContent">Groups</Th>
          <Th modifier="fitContent">Models</Th>
          <Th modifier="fitContent">Priority</Th>
        </Tr>
      </Thead>
      {subscriptions.map((subscription, rowIndex) => {
        const expandedColumn = expandedSubscriptions[subscription.id]
        const isExpanded = Boolean(expandedColumn)

        return (
          <Tbody
            key={subscription.id}
            isExpanded={isExpanded}
            id={`tenant-maas-subscription-body-${subscription.id}`}
          >
            <Tr
              isControlRow
              isContentExpanded={isExpanded}
              id={`tenant-maas-subscription-row-${subscription.id}`}
            >
              <Td dataLabel="Subscription">
                <div>
                  <strong>{subscription.name}</strong>
                </div>
                {subscription.description ? <div>{subscription.description}</div> : null}
              </Td>
              <Td dataLabel="Status" modifier="fitContent">
                <PhaseStaticLabel phase={subscription.phase} />
              </Td>
              <Td
                dataLabel="Groups"
                modifier="fitContent"
                compoundExpand={{
                  rowIndex,
                  isExpanded: expandedColumn === 'groups',
                  onToggle: () => onToggleExpand(subscription.id, 'groups'),
                  expandId: `tenant-maas-subscription-expand-${subscription.id}-groups`,
                  columnIndex: 2,
                }}
              >
                {subscription.groups.length}
              </Td>
              <Td
                dataLabel="Models"
                modifier="fitContent"
                compoundExpand={{
                  rowIndex,
                  isExpanded: expandedColumn === 'models',
                  onToggle: () => onToggleExpand(subscription.id, 'models'),
                  expandId: `tenant-maas-subscription-expand-${subscription.id}-models`,
                  columnIndex: 3,
                }}
              >
                {subscription.models.length}
              </Td>
              <Td dataLabel="Priority" modifier="fitContent">
                {subscription.priority}
              </Td>
            </Tr>
            <Tr isExpanded={expandedColumn === 'groups'}>
              <Td colSpan={5}>{renderSubscriptionGroupsExpanded(subscription)}</Td>
            </Tr>
            <Tr isExpanded={expandedColumn === 'models'}>
              <Td colSpan={5}>{renderSubscriptionModelsExpanded(subscription, models)}</Td>
            </Tr>
          </Tbody>
        )
      })}
    </Table>
  )
}

const TenantMaaSGovernanceView = ({ models, subscriptions }: TenantMaaSGovernanceViewProps) => {
  const [activeTab, setActiveTab] = useState<GovernanceTab>('models')
  const [expandedModelIds, setExpandedModelIds] = useState<Set<string>>(() => new Set())
  const [expandedSubscriptions, setExpandedSubscriptions] = useState<
    Record<string, SubscriptionExpandColumn>
  >({})
  const [modelFilterAttr, setModelFilterAttr] = useState<ModelFilterAttribute>('model')
  const [modelFilters, setModelFilters] = useState<Partial<Record<ModelFilterAttribute, string>>>({})
  const [modelSearchValue, setModelSearchValue] = useState('')
  const [isModelFilterAttrOpen, setIsModelFilterAttrOpen] = useState(false)
  const [isModelTypeSelectOpen, setIsModelTypeSelectOpen] = useState(false)
  const [subscriptionFilterAttr, setSubscriptionFilterAttr] =
    useState<SubscriptionFilterAttribute>('keyword')
  const [subscriptionFilters, setSubscriptionFilters] = useState<
    Partial<Record<Exclude<SubscriptionFilterAttribute, 'phase'>, string>>
  >({})
  const [subscriptionSearchValue, setSubscriptionSearchValue] = useState('')
  const [subscriptionPhaseFilters, setSubscriptionPhaseFilters] = useState<Set<PhaseStatus>>(
    () => new Set(),
  )
  const [isSubscriptionFilterAttrOpen, setIsSubscriptionFilterAttrOpen] = useState(false)
  const [isSubscriptionPhaseOpen, setIsSubscriptionPhaseOpen] = useState(false)
  const tenantModelIds = new Set(models.map((model) => model.identityId))
  const tenantSubscriptions = subscriptions.filter((subscription) =>
    subscription.models.some((modelId) => tenantModelIds.has(modelId)),
  )
  const filteredModels = models.filter((model) =>
    Object.entries(modelFilters).every(([attribute, value]) => {
      const query = value?.trim().toLocaleLowerCase() ?? ''
      if (!query) {
        return true
      }
      if (attribute === 'modelType') {
        return (model.source ?? 'internal') === query
      }
      if (attribute === 'group') {
        return includesQuery(
          model.subscriptions.flatMap((subscription) => subscription.groups),
          query,
        )
      }
      if (attribute === 'subscription') {
        return includesQuery(
          model.subscriptions.map((subscription) => subscription.name),
          query,
        )
      }
      return includesQuery([model.name, model.modelId, model.description], query)
    }),
  )
  const filteredSubscriptions = tenantSubscriptions.filter((subscription) => {
    if (subscriptionPhaseFilters.size > 0 && !subscriptionPhaseFilters.has(subscription.phase)) {
      return false
    }

    return Object.entries(subscriptionFilters).every(([attribute, value]) => {
      const query = value?.trim().toLocaleLowerCase() ?? ''
      if (!query) {
        return true
      }
      if (attribute === 'group') {
        return includesQuery(subscription.groups, query)
      }
      if (attribute === 'model') {
        return includesQuery(
          subscription.models.flatMap((modelId) => {
            const model = models.find((item) => item.identityId === modelId)
            return [model?.name ?? modelId, model?.modelId ?? modelId]
          }),
          query,
        )
      }
      return includesQuery(
        [subscription.name, subscription.resourceName, subscription.description],
        query,
      )
    })
  })

  const clearModelFilter = (attribute: ModelFilterAttribute) => {
    setModelFilters((current) => {
      const next = { ...current }
      delete next[attribute]
      return next
    })
    if (modelFilterAttr === attribute) {
      setModelSearchValue('')
    }
  }

  const updateModelSearch = (value: string) => {
    setModelSearchValue(value)
    setModelFilters((current) => ({ ...current, [modelFilterAttr]: value }))
  }

  const clearSubscriptionFilter = (
    attribute: Exclude<SubscriptionFilterAttribute, 'phase'>,
  ) => {
    setSubscriptionFilters((current) => {
      const next = { ...current }
      delete next[attribute]
      return next
    })
    if (subscriptionFilterAttr === attribute) {
      setSubscriptionSearchValue('')
    }
  }

  const updateSubscriptionSearch = (value: string) => {
    setSubscriptionSearchValue(value)
    if (subscriptionFilterAttr !== 'phase') {
      setSubscriptionFilters((current) => ({ ...current, [subscriptionFilterAttr]: value }))
    }
  }

  const toggleSubscriptionPhase = (phase: PhaseStatus) => {
    setSubscriptionPhaseFilters((current) => {
      const next = new Set(current)
      if (next.has(phase)) {
        next.delete(phase)
      } else {
        next.add(phase)
      }
      return next
    })
  }

  const toggleSubscriptionDetails = (
    subscriptionId: string,
    column: SubscriptionExpandColumn,
  ) => {
    setExpandedSubscriptions((current) => {
      const next = { ...current }
      if (next[subscriptionId] === column) {
        delete next[subscriptionId]
      } else {
        next[subscriptionId] = column
      }
      return next
    })
  }

  const toggleModel = (modelId: string) => {
    setExpandedModelIds((current) => {
      const next = new Set(current)
      if (next.has(modelId)) {
        next.delete(modelId)
      } else {
        next.add(modelId)
      }
      return next
    })
  }

  const renderModelFilters = () => (
    <Toolbar
      id="tenant-maas-models-toolbar"
      clearAllFilters={() => {
        setModelFilters({})
        setModelSearchValue('')
      }}
      hasNoPadding
    >
      <ToolbarContent>
        <ToolbarToggleGroup
          toggleIcon={<FilterIcon />}
          breakpoint="xl"
          id="tenant-maas-models-filter-toggle-group"
        >
          <ToolbarGroup variant="filter-group" id="tenant-maas-models-filter-group">
            <ToolbarItem>
              <Select
                id="tenant-maas-models-filter-attribute"
                isOpen={isModelFilterAttrOpen}
                selected={modelFilterAttr}
                onSelect={(_event, value) => {
                  const attribute = value as ModelFilterAttribute
                  setModelFilterAttr(attribute)
                  setModelSearchValue(
                    attribute === 'modelType' ? '' : (modelFilters[attribute] ?? ''),
                  )
                  setIsModelFilterAttrOpen(false)
                }}
                onOpenChange={setIsModelFilterAttrOpen}
            toggle={(toggleRef) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setIsModelFilterAttrOpen((open) => !open)}
                    isExpanded={isModelFilterAttrOpen}
                    icon={<Icon className="pill-filter-select__icon"><FilterIcon /></Icon>}
                    className="bmaas-dropdown-toggle pill-filter-select__toggle"
                    id="tenant-maas-models-filter-toggle"
                  >
                    {MODEL_FILTER_LABELS[modelFilterAttr]}
                  </MenuToggle>
                )}
              >
                <SelectList id="tenant-maas-models-filter-attributes">
                  {MODEL_FILTER_OPTIONS.map((attribute) => (
                    <SelectOption key={attribute} value={attribute}>
                      {MODEL_FILTER_LABELS[attribute]}
                    </SelectOption>
                  ))}
                </SelectList>
              </Select>
            </ToolbarItem>
            {MODEL_FILTER_OPTIONS.map((attribute) => (
              <ToolbarFilter
                key={attribute}
                labels={
                  modelFilters[attribute]
                    ? [
                        attribute === 'modelType'
                          ? modelFilters.modelType === 'internal'
                            ? 'Internal'
                            : 'External'
                          : modelFilters[attribute]!,
                      ]
                    : []
                }
                deleteLabel={() => clearModelFilter(attribute)}
                deleteLabelGroup={() => clearModelFilter(attribute)}
                categoryName={MODEL_FILTER_LABELS[attribute]}
                showToolbarItem={modelFilterAttr === attribute}
              >
                {attribute === 'modelType' ? (
                  <Select
                    id="tenant-maas-model-type-filter"
                    isOpen={isModelTypeSelectOpen}
                    selected={modelFilters.modelType || undefined}
                    onSelect={(_event, value) => {
                      if (typeof value === 'string') {
                        setModelFilters((current) => ({ ...current, modelType: value }))
                      }
                      setIsModelTypeSelectOpen(false)
                    }}
                    onOpenChange={setIsModelTypeSelectOpen}
                    toggle={(toggleRef) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setIsModelTypeSelectOpen((open) => !open)}
                        isExpanded={isModelTypeSelectOpen}
                        id="tenant-maas-model-type-toggle"
                      >
                        {modelFilters.modelType
                          ? modelFilters.modelType === 'internal'
                            ? 'Internal'
                            : 'External'
                          : 'Filter by model type'}
                      </MenuToggle>
                    )}
                  >
                    <SelectList id="tenant-maas-model-type-options">
                      <SelectOption value="internal">Internal</SelectOption>
                      <SelectOption value="external">External</SelectOption>
                    </SelectList>
                  </Select>
                ) : (
                  <SearchInput
                    id={`tenant-maas-model-search-${attribute}`}
                    placeholder={MODEL_FILTER_PLACEHOLDERS[attribute]}
                    value={modelFilterAttr === attribute ? modelSearchValue : ''}
                    onChange={(_event, value) => updateModelSearch(value)}
                    onClear={() => updateModelSearch('')}
                  />
                )}
              </ToolbarFilter>
            ))}
          </ToolbarGroup>
        </ToolbarToggleGroup>
      </ToolbarContent>
    </Toolbar>
  )

  const renderSubscriptionFilters = () => (
    <Toolbar
      id="tenant-maas-subscriptions-toolbar"
      clearAllFilters={() => {
        setSubscriptionFilters({})
        setSubscriptionSearchValue('')
        setSubscriptionPhaseFilters(new Set())
      }}
      hasNoPadding
    >
      <ToolbarContent>
        <ToolbarToggleGroup
          toggleIcon={<FilterIcon />}
          breakpoint="xl"
          id="tenant-maas-subscriptions-filter-toggle-group"
        >
          <ToolbarGroup variant="filter-group" id="tenant-maas-subscriptions-filter-group">
            <ToolbarItem>
              <Select
                id="tenant-maas-subscriptions-filter-attribute"
                isOpen={isSubscriptionFilterAttrOpen}
                selected={subscriptionFilterAttr}
                onSelect={(_event, value) => {
                  const attribute = value as SubscriptionFilterAttribute
                  setSubscriptionFilterAttr(attribute)
                  setSubscriptionSearchValue(
                    attribute === 'phase' ? '' : (subscriptionFilters[attribute] ?? ''),
                  )
                  setIsSubscriptionFilterAttrOpen(false)
                }}
                onOpenChange={setIsSubscriptionFilterAttrOpen}
                toggle={(toggleRef) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setIsSubscriptionFilterAttrOpen((open) => !open)}
                    isExpanded={isSubscriptionFilterAttrOpen}
                    icon={<Icon className="pill-filter-select__icon"><FilterIcon /></Icon>}
                    className="bmaas-dropdown-toggle pill-filter-select__toggle"
                    id="tenant-maas-subscriptions-filter-toggle"
                  >
                    {SUBSCRIPTION_FILTER_LABELS[subscriptionFilterAttr]}
                  </MenuToggle>
                )}
              >
                <SelectList id="tenant-maas-subscriptions-filter-attributes">
                  {SUBSCRIPTION_FILTER_OPTIONS.map((attribute) => (
                    <SelectOption key={attribute} value={attribute}>
                      {SUBSCRIPTION_FILTER_LABELS[attribute]}
                    </SelectOption>
                  ))}
                </SelectList>
              </Select>
            </ToolbarItem>
            {(['keyword', 'group', 'model'] as const).map((attribute) => (
              <ToolbarFilter
                key={attribute}
                labels={subscriptionFilters[attribute]?.trim() ? [subscriptionFilters[attribute]!] : []}
                deleteLabel={() => clearSubscriptionFilter(attribute)}
                deleteLabelGroup={() => clearSubscriptionFilter(attribute)}
                categoryName={SUBSCRIPTION_FILTER_LABELS[attribute]}
                showToolbarItem={subscriptionFilterAttr === attribute}
              >
                <SearchInput
                  id={`tenant-maas-subscription-search-${attribute}`}
                  placeholder={SUBSCRIPTION_FILTER_PLACEHOLDERS[attribute]}
                  value={subscriptionFilterAttr === attribute ? subscriptionSearchValue : ''}
                  onChange={(_event, value) => updateSubscriptionSearch(value)}
                  onClear={() => updateSubscriptionSearch('')}
                />
              </ToolbarFilter>
            ))}
            <ToolbarFilter
              labels={Array.from(subscriptionPhaseFilters)}
              deleteLabel={(_category, label) => {
                const phase = (typeof label === 'string' ? label : label.key) as PhaseStatus
                setSubscriptionPhaseFilters((current) => {
                  const next = new Set(current)
                  next.delete(phase)
                  return next
                })
              }}
              deleteLabelGroup={() => setSubscriptionPhaseFilters(new Set())}
              categoryName="Status"
              showToolbarItem={subscriptionFilterAttr === 'phase'}
            >
              <Select
                id="tenant-maas-subscription-phase-filter"
                isOpen={isSubscriptionPhaseOpen}
                selected={Array.from(subscriptionPhaseFilters)}
                onSelect={(_event, value) => {
                  if (typeof value === 'string') {
                    toggleSubscriptionPhase(value as PhaseStatus)
                  }
                }}
                onOpenChange={setIsSubscriptionPhaseOpen}
                toggle={(toggleRef) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setIsSubscriptionPhaseOpen((open) => !open)}
                    isExpanded={isSubscriptionPhaseOpen}
                    id="tenant-maas-subscription-phase-toggle"
                  >
                    Filter by status
                    {subscriptionPhaseFilters.size > 0 ? (
                      <>
                        {' '}
                        <Badge isRead>{subscriptionPhaseFilters.size}</Badge>
                      </>
                    ) : null}
                  </MenuToggle>
                )}
              >
                <SelectList id="tenant-maas-subscription-phase-options">
                  {SUBSCRIPTION_PHASES.map((phase) => (
                    <SelectOption
                      key={phase}
                      value={phase}
                      hasCheckbox
                      isSelected={subscriptionPhaseFilters.has(phase)}
                    >
                      {phase}
                    </SelectOption>
                  ))}
                </SelectList>
              </Select>
            </ToolbarFilter>
          </ToolbarGroup>
        </ToolbarToggleGroup>
      </ToolbarContent>
    </Toolbar>
  )

  return (
    <TenantUserPageChrome
      pageClassName="tenant-admin-maas-governance"
      kicker="AI"
      title="MaaS governance"
      description={
        <>
          Review MaaS models and subscriptions available to your organization.{' '}
          <MaaSGovernanceLearnMore />
        </>
      }
    >
      <Tabs
        activeKey={activeTab}
        onSelect={(_event, tabKey) => setActiveTab(tabKey as GovernanceTab)}
        id="tenant-maas-governance-tabs"
      >
        <Tab eventKey="models" title={<TabTitleText>Models</TabTitleText>} id="tenant-maas-models-tab">
          {renderModelFilters()}
          {models.length === 0 ? (
            <EmptyState headingLevel="h2" titleText="No MaaS models available">
              <EmptyStateBody>Models published for your organization will appear here.</EmptyStateBody>
            </EmptyState>
          ) : filteredModels.length === 0 ? (
            <EmptyState headingLevel="h2" titleText="No MaaS models match these filters">
              <EmptyStateBody>Adjust your filters or clear them to see models.</EmptyStateBody>
            </EmptyState>
          ) : (
            <Table
              aria-label="MaaS models available to your organization"
              isExpandable
              id="tenant-maas-models-table"
            >
              <Thead>
                <Tr>
                  <Th screenReaderText="Expand model" />
                  <Th>Model</Th>
                  <Th>Subscriptions</Th>
                </Tr>
              </Thead>
              {filteredModels.map((model, rowIndex) => {
                const isExpanded = expandedModelIds.has(model.id)

                return (
                  <Tbody
                    key={model.id}
                    isExpanded={isExpanded}
                    id={`tenant-maas-model-body-${model.id}`}
                  >
                    <Tr isContentExpanded={isExpanded} id={`tenant-maas-model-${model.id}`}>
                      <Td
                        expand={{
                          rowIndex,
                          isExpanded,
                          onToggle: () => toggleModel(model.id),
                          expandId: `tenant-maas-model-expand-${model.id}`,
                        }}
                      />
                      <Td dataLabel="Model">
                        <MaasModelIdentity
                          id={`tenant-maas-model-identity-${model.id}`}
                          displayName={model.name}
                          modelRefId={model.modelId}
                          description={model.description}
                          labels={[
                            model.source === 'external'
                              ? { text: 'External', color: 'teal' }
                              : { text: 'Internal', color: 'orange' },
                          ]}
                        />
                      </Td>
                      <Td dataLabel="Subscriptions">{model.subscriptions.length}</Td>
                    </Tr>
                    <Tr isExpanded={isExpanded} id={`tenant-maas-model-details-${model.id}`}>
                      <Td />
                      <Td noPadding colSpan={2}>
                        <ExpandableRowContent>
                          <div className="pf-v6-u-pb-lg">
                            {renderSubscriptionDetails(model, tenantSubscriptions)}
                          </div>
                        </ExpandableRowContent>
                      </Td>
                    </Tr>
                  </Tbody>
                )
              })}
            </Table>
          )}
        </Tab>
        <Tab
          eventKey="subscriptions"
          title={<TabTitleText>Subscriptions</TabTitleText>}
          id="tenant-maas-subscriptions-tab"
        >
          {renderSubscriptionFilters()}
          {renderSubscriptionsList(
            filteredSubscriptions,
            models,
            expandedSubscriptions,
            toggleSubscriptionDetails,
            tenantSubscriptions.length === 0
              ? 'No subscriptions available'
              : 'No subscriptions match these filters',
            tenantSubscriptions.length === 0
              ? 'Subscriptions assigned to your organization will appear here.'
              : 'Adjust your filters or clear them to see subscriptions.',
          )}
        </Tab>
      </Tabs>
    </TenantUserPageChrome>
  )
}

export default TenantMaaSGovernanceView
