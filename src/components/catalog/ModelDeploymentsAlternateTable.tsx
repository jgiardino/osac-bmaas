import { useState } from 'react'
import { EmptyState, EmptyStateBody, Label, LabelGroup } from '@patternfly/react-core'
import { ActionsColumn, Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table'
import { AlignedExpandableRow } from './AlignedExpandableRow'
import { MaasModelIdentity } from './MaasModelIdentity'
import { ServicesModelsTable } from './ServicesModelsTable'
import type { VisionOrgId } from '../../vision/fleetWorld'
import {
  servicesModelInstances,
  servicesModelsForOrg,
  type ModelInstanceSeedItem,
} from '../../vision/legacyModelInstanceSeed'
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
      !query ||
      model.displayName.toLocaleLowerCase().includes(query) ||
      model.maasModelRefId.toLocaleLowerCase().includes(query) ||
      model.description.toLocaleLowerCase().includes(query),
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

  if (internalModels.length === 0) {
    return (
      <EmptyState titleText="No internal model deployments for this tenant" headingLevel="h2">
        <EmptyStateBody>
          {showVisibility
            ? 'Select another tenant or choose All tenants to view model deployments.'
            : 'Deploy an internal model to see it here.'}
        </EmptyStateBody>
      </EmptyState>
    )
  }

  if (view === 'grouped-by-model') {
    return (
      <ServicesModelsTable
        instances={internalModels}
        externalModels={[]}
        expandedIds={expandedModelIds}
        onToggleExpand={toggleExpandedModel}
        showVisibility={showVisibility}
        showInternalLabels={false}
        idPrefix="model-deployments-grouped-by-model"
      />
    )
  }

  if (view === 'flat-list') {
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
  const clusterGroups: ClusterModelGroup[] = [...clustersById.entries()].map(
    ([id, instances]) => ({ id, instances }),
  )

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
                    {models.map(([modelId, displayName]) => (
                      <Label key={modelId} variant="outline" isCompact>
                        {displayName}
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
