import { Label, LabelGroup } from '@patternfly/react-core'
import { ActionsColumn, Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table'
import type { ExternalModelSeed } from '../../vision/externalModelSeed'
import {
  groupModelInstancesByModelId,
  type ModelInstanceSeedItem,
} from '../../vision/modelInstanceSeed'
import { AlignedExpandableRow } from './AlignedExpandableRow'
import { ExternalModelPhaseLabel } from './ExternalModelPhaseLabel'
import { ExternalModelsExpandedProvidersTable } from './ExternalModelsExpandedProvidersTable'
import { InternalDeploymentsTable } from './InternalDeploymentsTable'
import { MaasModelIdentity } from './MaasModelIdentity'

const SERVICES_MODEL_DATA_COLUMNS = 3

type ServicesModelsTableProps = {
  instances: ModelInstanceSeedItem[]
  externalModels: ExternalModelSeed[]
  expandedIds: ReadonlySet<string>
  onToggleExpand: (id: string) => void
  idPrefix?: string
}

export const ServicesModelsTable = ({
  instances,
  externalModels,
  expandedIds,
  onToggleExpand,
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
                  labels={[{ text: 'Internal', color: 'orange' }]}
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
              colSpan={SERVICES_MODEL_DATA_COLUMNS}
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
              <Td dataLabel="Status" modifier="fitContent" id={`${rowId}-status`}>
                <ExternalModelPhaseLabel phase={row.model.phase} id={`${rowId}-status-label`} />
              </Td>
              <Td isActionCell modifier="fitContent" id={`${rowId}-actions`}>
                <ActionsColumn items={[{ title: 'View details' }]} />
              </Td>
            </Tr>
            <AlignedExpandableRow
              isExpanded={isExpanded}
              colSpan={SERVICES_MODEL_DATA_COLUMNS}
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
