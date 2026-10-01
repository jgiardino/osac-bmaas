import { useState } from 'react'
import { EmptyState, EmptyStateBody, Label, LabelGroup } from '@patternfly/react-core'
import { ActionsColumn, Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table'
import { AlignedExpandableRow } from './AlignedExpandableRow'
import { MaasModelIdentity } from './MaasModelIdentity'
import { ServicesModelsTable } from './ServicesModelsTable'
import { VISION_ORGS, type VisionOrgId } from '../../vision/fleetWorld'
import { externalModelsForOrg } from '../../vision/externalModelSeed'
import type { ExternalModelSeed } from '../../vision/externalModelSeed'
import {
  servicesModelInstances,
  servicesModelsForOrg,
  type ModelInstanceSeedItem,
} from '../../vision/legacyModelInstanceSeed'
import { ExternalModelPhaseLabel } from './ExternalModelPhaseLabel'
import type { RegisteredOrganization } from '../../providerAdmin/organizations'

export type ModelDeploymentAlternateView = 'flat-list' | 'grouped-by-model' | 'grouped-by-cluster'

interface ModelDeploymentsAlternateTableProps {
  view: ModelDeploymentAlternateView
  selectedTenantId?: string
  organizations?: RegisteredOrganization[]
  tenantOrgId?: VisionOrgId
  showVisibility?: boolean
  searchValue: string
}

interface ClusterModelGroup {
  id: string
  instances: ModelInstanceSeedItem[]
  externalModels: ExternalModelSeed[]
}

const getVisionOrgId = (organization: RegisteredOrganization | undefined): VisionOrgId | null => {
  if (organization?.slug === 'northsummit' || organization?.tenantId === 'north-summit-bank') {
    return 'nsb'
  }
  if (
    organization?.slug === 'evergreen' ||
    organization?.slug === 'bluesolace' ||
    organization?.tenantId === 'bluesolace-financial-group'
  ) {
    return 'bluesolace'
  }
  return null
}

const ModelDeploymentsAlternateTable = ({
  view,
  selectedTenantId = '',
  organizations = [],
  tenantOrgId,
  showVisibility = true,
  searchValue,
}: ModelDeploymentsAlternateTableProps) => {
  const [expandedModelIds, setExpandedModelIds] = useState<Set<string>>(() => new Set())
  const [expandedClusterIds, setExpandedClusterIds] = useState<Set<string>>(() => new Set())
  const selectedOrganization = organizations.find(
    (organization) => organization.tenantId === selectedTenantId,
  )
  const selectedVisionOrgId = selectedTenantId
    ? getVisionOrgId(selectedOrganization)
    : tenantOrgId ?? 'all'
  const filteredInternalModels =
    selectedVisionOrgId === 'all'
      ? servicesModelInstances()
      : selectedVisionOrgId
        ? servicesModelsForOrg(selectedVisionOrgId)
        : []
  const query = searchValue.trim().toLocaleLowerCase()
  const internalModels = filteredInternalModels.filter(
    (model) =>
      model.modelId !== 'credit-risk-scorer' &&
      (!query ||
        model.displayName.toLocaleLowerCase().includes(query) ||
        model.maasModelRefId.toLocaleLowerCase().includes(query) ||
        model.description.toLocaleLowerCase().includes(query)),
  )
  const externalModels = (selectedVisionOrgId ? externalModelsForOrg(selectedVisionOrgId) : []).filter(
    (model) =>
      !query ||
      model.displayName.toLocaleLowerCase().includes(query) ||
      model.name.toLocaleLowerCase().includes(query) ||
      model.description.toLocaleLowerCase().includes(query) ||
      model.providerRefs.some((provider) => provider.displayName.toLocaleLowerCase().includes(query)),
  )
  const toggleExpandedModel = (id: string) => {
    setExpandedModelIds((current) => {
      const next = new Set(current)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleExpandedCluster = (id: string) => {
    setExpandedClusterIds((current) => {
      const next = new Set(current)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const emptyStateBody = query
    ? 'Try a different search or clear the search field.'
    : showVisibility
      ? 'Select another tenant or choose All tenants to view model deployments.'
      : 'Deploy a model to see it here.'
  const emptyStateTitle = query ? 'No models match your filter' : 'No model deployments for this tenant'

  if (view === 'grouped-by-model') {
    if (internalModels.length === 0 && externalModels.length === 0) {
      return (
        <EmptyState titleText={emptyStateTitle} headingLevel="h2">
          <EmptyStateBody>{emptyStateBody}</EmptyStateBody>
        </EmptyState>
      )
    }

    return (
      <ServicesModelsTable
        instances={internalModels}
        externalModels={externalModels}
        expandedIds={expandedModelIds}
        onToggleExpand={toggleExpandedModel}
        showVisibility={showVisibility}
        idPrefix="model-deployments-grouped-by-model"
      />
    )
  }

  if (view === 'flat-list') {
    if (internalModels.length === 0 && externalModels.length === 0) {
      return (
        <EmptyState titleText={emptyStateTitle} headingLevel="h2">
          <EmptyStateBody>{emptyStateBody}</EmptyStateBody>
        </EmptyState>
      )
    }

    return (
      <Table
        variant="compact"
        aria-label="Model deployments flat list"
        id="model-deployments-flat-list"
      >
        <Thead>
          <Tr>
            <Th>Model</Th>
            <Th>Cluster</Th>
            {showVisibility ? <Th>Visibility</Th> : null}
            <Th modifier="fitContent">Status</Th>
            <Th modifier="fitContent" screenReaderText="Actions" />
          </Tr>
        </Thead>
        <Tbody>
          {internalModels.map((model) => (
            <Tr key={model.id} id={`flat-model-${model.id}`}>
              <Td dataLabel="Model">
                <MaasModelIdentity
                  id={`flat-model-${model.id}-identity`}
                  displayName={model.displayName}
                  modelRefId={model.maasModelRefId}
                  description={model.description}
                />
              </Td>
              <Td dataLabel="Cluster">
                <Label color="grey" isCompact>
                  {model.clusterId ?? '—'}
                </Label>
              </Td>
              {showVisibility ? <Td dataLabel="Visibility">{model.tenantLabel}</Td> : null}
              <Td dataLabel="Status" modifier="fitContent">
                <Label color="green" isCompact>
                  Ready
                </Label>
              </Td>
              <Td isActionCell modifier="fitContent">
                <ActionsColumn items={[{ title: 'View details' }]} />
              </Td>
            </Tr>
          ))}
          {externalModels.map((model) => (
            <Tr key={model.name} id={`flat-model-${model.name}`}>
              <Td dataLabel="Model">
                <MaasModelIdentity
                  id={`flat-model-${model.name}-identity`}
                  displayName={model.displayName}
                  modelRefId={model.name}
                  description={model.description}
                  labels={[{ text: 'External', color: 'teal' }]}
                />
              </Td>
              <Td dataLabel="Cluster">
                <LabelGroup isCompact>
                  {model.providerRefs.map((provider) => (
                    <Label key={provider.providerName} color="teal" isCompact>
                      {provider.displayName}
                    </Label>
                  ))}
                </LabelGroup>
              </Td>
              {showVisibility ? (
                <Td dataLabel="Visibility">
                  {VISION_ORGS.find((organization) => organization.id === model.orgId)?.label ??
                    model.orgId}
                </Td>
              ) : null}
              <Td dataLabel="Status" modifier="fitContent">
                <ExternalModelPhaseLabel phase={model.phase} id={`flat-model-${model.name}-status`} />
              </Td>
              <Td isActionCell modifier="fitContent">
                <ActionsColumn items={[{ title: 'View details' }]} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    )
  }

  const clustersById = new Map<string, ModelInstanceSeedItem[]>()
  for (const model of internalModels) {
    const clusterId = model.clusterId ?? '—'
    const clusterModels = clustersById.get(clusterId) ?? []
    clusterModels.push(model)
    clustersById.set(clusterId, clusterModels)
  }
  const externalModelsByClusterId = new Map<string, ExternalModelSeed[]>()
  for (const model of externalModels) {
    const clusterModels = externalModelsByClusterId.get('Off-platform') ?? []
    clusterModels.push(model)
    externalModelsByClusterId.set('Off-platform', clusterModels)
  }
  const clusterIds = new Set([...clustersById.keys(), ...externalModelsByClusterId.keys()])
  const clusterGroups: ClusterModelGroup[] = [...clusterIds].map((id) => ({
    id,
    instances: clustersById.get(id) ?? [],
    externalModels: externalModelsByClusterId.get(id) ?? [],
  }))

  if (clusterGroups.length === 0) {
    return (
      <EmptyState titleText={emptyStateTitle} headingLevel="h2">
        <EmptyStateBody>{emptyStateBody}</EmptyStateBody>
      </EmptyState>
    )
  }

  return (
    <>
      <Table
        variant="compact"
        isExpandable
        aria-label="Model deployments grouped by cluster"
        id="model-deployments-grouped-by-cluster"
      >
        <Thead>
          <Tr>
            <Th />
            <Th>Cluster</Th>
            <Th>Models</Th>
            <Th modifier="fitContent">Status</Th>
            <Th modifier="fitContent" screenReaderText="Actions" />
          </Tr>
        </Thead>
        {clusterGroups.map((group, rowIndex) => {
          const isExpanded = expandedClusterIds.has(group.id)
          const rowId = `cluster-${group.id}`
          const models = Array.from(
            new Map(
              group.instances.map((item) => [item.modelId, item.displayName] as const),
            ).entries(),
          )
          const modelNames = [
            ...models.map(([modelId, displayName]) => ({ id: modelId, displayName })),
            ...group.externalModels.map((model) => ({ id: model.name, displayName: model.displayName })),
          ]
          const actions = [
            {
              title: isExpanded ? 'Hide models' : 'View models',
              onClick: () => toggleExpandedCluster(group.id),
            },
          ]

          return (
            <Tbody key={group.id} isExpanded={isExpanded} id={`${rowId}-tbody`}>
              <Tr isContentExpanded={isExpanded} id={`${rowId}-row`}>
                <Td
                  expand={{
                    rowIndex,
                    isExpanded,
                    onToggle: () => toggleExpandedCluster(group.id),
                    expandId: `${rowId}-expand`,
                  }}
                />
                <Td dataLabel="Cluster">
                  <Label color="grey" isCompact>
                    {group.id}
                  </Label>
                </Td>
                <Td dataLabel="Models">
                  <LabelGroup isCompact>
                    {modelNames.map((model) => (
                      <Label key={model.id} variant="outline" isCompact>
                        {model.displayName}
                      </Label>
                    ))}
                  </LabelGroup>
                </Td>
                <Td dataLabel="Status" modifier="fitContent">
                  <Label color="green" isCompact>
                    Ready
                  </Label>
                </Td>
                <Td isActionCell modifier="fitContent">
                  <ActionsColumn items={actions} />
                </Td>
              </Tr>
              <AlignedExpandableRow
                isExpanded={isExpanded}
                colSpan={showVisibility ? 3 : 2}
                id={`${rowId}-expanded`}
              >
                <Table
                  variant="compact"
                  isNested
                  aria-label={`Models on ${group.id}`}
                  id={`${rowId}-models`}
                >
                  <Thead>
                    <Tr resetOffset>
                      <Th>Model</Th>
                      {showVisibility ? <Th>Visibility</Th> : null}
                      <Th modifier="fitContent">Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {group.instances.map((model) => (
                      <Tr key={model.id} resetOffset id={`${rowId}-model-${model.id}`}>
                        <Td dataLabel="Model">
                          <MaasModelIdentity
                            id={`${rowId}-model-${model.id}-identity`}
                            displayName={model.displayName}
                            modelRefId={model.maasModelRefId}
                            description={model.description}
                          />
                        </Td>
                        {showVisibility ? (
                          <Td dataLabel="Visibility">{model.tenantLabel}</Td>
                        ) : null}
                        <Td dataLabel="Status" modifier="fitContent">
                          <Label color="green" isCompact>
                            Ready
                          </Label>
                        </Td>
                      </Tr>
                    ))}
                    {group.externalModels.map((model) => (
                      <Tr key={model.name} resetOffset id={`${rowId}-model-${model.name}`}>
                        <Td dataLabel="Model">
                          <MaasModelIdentity
                            id={`${rowId}-model-${model.name}-identity`}
                            displayName={model.displayName}
                            modelRefId={model.name}
                            description={model.description}
                            labels={[{ text: 'External', color: 'teal' }]}
                          />
                        </Td>
                        {showVisibility ? (
                          <Td dataLabel="Visibility">
                            {VISION_ORGS.find((organization) => organization.id === model.orgId)
                              ?.label ?? model.orgId}
                          </Td>
                        ) : null}
                        <Td dataLabel="Status" modifier="fitContent">
                          <ExternalModelPhaseLabel
                            phase={model.phase}
                            id={`${rowId}-model-${model.name}-status`}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </AlignedExpandableRow>
            </Tbody>
          )
        })}
      </Table>
    </>
  )
}

export default ModelDeploymentsAlternateTable
