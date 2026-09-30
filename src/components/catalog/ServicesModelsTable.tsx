import { Label, LabelGroup } from '@patternfly/react-core'
import { ActionsColumn, Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table'
import type { ExternalModelSeed } from '../../vision/externalModelSeed'
import { VISION_ORGS } from '../../vision/fleetWorld'
import {
  groupModelInstancesByModelId,
  type ModelInstanceSeedItem,
} from '../../vision/legacyModelInstanceSeed'
import { AlignedExpandableRow } from './AlignedExpandableRow'
import { ExternalModelPhaseLabel } from './ExternalModelPhaseLabel'
import { ExternalModelsExpandedProvidersTable } from './ExternalModelsExpandedProvidersTable'
import { InternalDeploymentsTable } from './InternalDeploymentsTable'
import { MaasModelIdentity } from './MaasModelIdentity'

type ServicesModelsTableProps = {
  instances: ModelInstanceSeedItem[]
  externalModels: ExternalModelSeed[]
  expandedIds: ReadonlySet<string>
  onToggleExpand: (id: string) => void
  showVisibility?: boolean
  showInternalLabels?: boolean
  idPrefix?: string
}

export const ServicesModelsTable = ({
  instances,
  externalModels,
  expandedIds,
  onToggleExpand,
  showVisibility = false,
  showInternalLabels = true,
  idPrefix = 'services-models-table',
}: ServicesModelsTableProps) => {
  const groups = groupModelInstancesByModelId(instances)
  const instanceRows = groups.map((group, index) => ({
    kind: 'internal' as const,
    id: group.modelId,
    group,
    rowIndex: index,
  }))
  const externalRows = externalModels.map((model, index) => ({
    kind: 'external' as const,
    id: model.name,
    model,
    rowIndex: groups.length + index,
  }))

  return (
    <Table variant="compact" isExpandable aria-label="Models" id={idPrefix}>
      <Thead>
        <Tr>
          <Th />
          <Th>Model</Th>
          <Th>Deployments</Th>
          {showVisibility ? <Th>Visibility</Th> : null}
          <Th modifier="fitContent">Status</Th>
          <Th modifier="fitContent" screenReaderText="Actions" />
        </Tr>
      </Thead>
      {instanceRows.map((row) => {
        const isExpanded = expandedIds.has(row.id)
        const rowId = `${idPrefix}-${row.id}`
        const { representative, instances: groupInstances, clusterIds } = row.group
        return (
          <Tbody key={row.id} isExpanded={isExpanded} id={`${rowId}-tbody`}>
            <Tr isContentExpanded={isExpanded} id={`${rowId}-row`}>
              <Td
                expand={{
                  rowIndex: row.rowIndex,
                  isExpanded,
                  onToggle: () => onToggleExpand(row.id),
                  expandId: `${rowId}-expand`,
                }}
                id={`${rowId}-expand-td`}
              />
              <Td dataLabel="Model" id={`${rowId}-model`}>
                <MaasModelIdentity
                  id={`${rowId}-identity`}
                  displayName={representative.displayName}
                  modelRefId={representative.maasModelRefId}
                  description={representative.description}
                  labels={showInternalLabels ? [{ text: 'Internal', color: 'orange' }] : []}
                />
              </Td>
              <Td dataLabel="Deployments" id={`${rowId}-deployments`}>
                <LabelGroup id={`${rowId}-deployment-labels`} numLabels={4}>
                  {clusterIds.map((clusterId) => (
                    <Label
                      key={clusterId}
                      color="grey"
                      isCompact
                      id={`${rowId}-label-${clusterId}`}
                    >
                      {clusterId}
                    </Label>
                  ))}
                </LabelGroup>
              </Td>
              {showVisibility ? (
                <Td dataLabel="Visibility" id={`${rowId}-visibility`}>
                  {representative.tenantLabel}
                </Td>
              ) : null}
              <Td dataLabel="Status" modifier="fitContent" id={`${rowId}-status`}>
                <Label color="green" isCompact id={`${rowId}-status-label`}>
                  Ready
                </Label>
              </Td>
              <Td isActionCell modifier="fitContent" id={`${rowId}-actions`}>
                <ActionsColumn items={[{ title: 'View details' }]} />
              </Td>
            </Tr>
            <AlignedExpandableRow
              isExpanded={isExpanded}
              colSpan={3 + (showVisibility ? 1 : 0)}
              id={`${rowId}-expanded`}
            >
              <InternalDeploymentsTable
                displayName={representative.displayName}
                idPrefix={`${rowId}-nested`}
                deployments={groupInstances.map((item) => ({
                  id: item.id,
                  clusterLabel: item.clusterId ?? '—',
                  status: 'Ready',
                }))}
              />
            </AlignedExpandableRow>
          </Tbody>
        )
      })}
      {externalRows.map((row) => {
        const isExpanded = expandedIds.has(row.id)
        const rowId = `${idPrefix}-${row.id}`
        return (
          <Tbody key={row.id} isExpanded={isExpanded} id={`${rowId}-tbody`}>
            <Tr isContentExpanded={isExpanded} id={`${rowId}-row`}>
              <Td
                expand={{
                  rowIndex: row.rowIndex,
                  isExpanded,
                  onToggle: () => onToggleExpand(row.id),
                  expandId: `${rowId}-expand`,
                }}
                id={`${rowId}-expand-td`}
              />
              <Td dataLabel="Model" id={`${rowId}-model`}>
                <MaasModelIdentity
                  id={`${rowId}-identity`}
                  displayName={row.model.displayName}
                  modelRefId={row.model.name}
                  description={row.model.description}
                  labels={[{ text: 'External', color: 'teal' }]}
                />
              </Td>
              <Td dataLabel="Deployments" id={`${rowId}-deployments`}>
                <LabelGroup id={`${rowId}-deployment-labels`} numLabels={4}>
                  {row.model.providerRefs.map((ref) => (
                    <Label
                      key={ref.providerName}
                      color="teal"
                      isCompact
                      id={`${rowId}-label-${ref.providerName}`}
                    >
                      {ref.displayName}
                    </Label>
                  ))}
                </LabelGroup>
              </Td>
              {showVisibility ? (
                <Td dataLabel="Visibility" id={`${rowId}-visibility`}>
                  {VISION_ORGS.find((organization) => organization.id === row.model.orgId)?.label ??
                    row.model.orgId}
                </Td>
              ) : null}
              <Td dataLabel="Status" modifier="fitContent" id={`${rowId}-status`}>
                <ExternalModelPhaseLabel phase={row.model.phase} id={`${rowId}-status-label`} />
              </Td>
              <Td isActionCell modifier="fitContent" id={`${rowId}-actions`}>
                <ActionsColumn items={[{ title: 'View details' }]} />
              </Td>
            </Tr>
            <AlignedExpandableRow
              isExpanded={isExpanded}
              colSpan={3 + (showVisibility ? 1 : 0)}
              id={`${rowId}-expanded`}
            >
              <ExternalModelsExpandedProvidersTable
                model={row.model}
                idPrefix={`${rowId}-nested`}
              />
            </AlignedExpandableRow>
          </Tbody>
        )
      })}
    </Table>
  )
}
