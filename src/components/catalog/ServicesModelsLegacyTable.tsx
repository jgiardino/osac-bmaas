import { useState } from 'react'
import { Label, LabelGroup } from '@patternfly/react-core'
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
import { groupModelServiceInstances } from '../../tenantUser/modelServiceGroups'
import type { TenantInstance } from '../../tenantUser/instances'

interface ServicesModelsLegacyTableProps {
  instances: readonly TenantInstance[]
}

export const ServicesModelsLegacyTable = ({ instances }: ServicesModelsLegacyTableProps) => {
  const groups = groupModelServiceInstances(instances)
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<string>>(() => new Set())

  const toggleExpanded = (modelId: string) => {
    setExpandedIds((current) => {
      const next = new Set(current)
      if (next.has(modelId)) {
        next.delete(modelId)
      } else {
        next.add(modelId)
      }
      return next
    })
  }

  return (
    <Table variant="compact" isExpandable aria-label="Models">
      <Thead>
        <Tr>
          <Th />
          <Th>Model</Th>
          <Th>Deployments</Th>
          <Th modifier="fitContent">Status</Th>
          <Th modifier="fitContent" screenReaderText="Actions" />
        </Tr>
      </Thead>
      {groups.map((group, rowIndex) => {
        const isExpanded = expandedIds.has(group.modelId)
        const rowId = `models-original-${group.modelId}`

        return (
        <Tbody key={group.modelId} isExpanded={isExpanded}>
          <Tr>
            <Td
              expand={{
                rowIndex,
                isExpanded,
                onToggle: () => toggleExpanded(group.modelId),
                expandId: `${rowId}-expand`,
              }}
            />
            <Td dataLabel="Model">
              <strong>{group.displayName}</strong>
              <br />
              <span>{group.modelId}</span>
            </Td>
            <Td dataLabel="Deployments">
              <LabelGroup numLabels={4}>
                {group.instances.map((instance) => {
                  const cluster = instance.specRows?.find((row) => row.label === 'Cluster')?.value
                  return (
                    <Label key={instance.id} color="grey" isCompact>
                      {cluster ?? instance.name}
                    </Label>
                  )
                })}
              </LabelGroup>
            </Td>
            <Td dataLabel="Status">
              <Label color="green" isCompact>
                Ready
              </Label>
            </Td>
            <Td isActionCell>
              <ActionsColumn
                items={[
                  {
                    title: isExpanded ? 'Hide deployments' : 'View deployments',
                    onClick: () => toggleExpanded(group.modelId),
                  },
                ]}
              />
            </Td>
          </Tr>
          <Tr isExpanded={isExpanded} id={`${rowId}-expanded`}>
            <Td />
            <Td noPadding colSpan={3}>
              <ExpandableRowContent>
                <Table
                  aria-label={`Deployments for ${group.displayName}`}
                  variant="compact"
                  isNested
                >
                  <Thead>
                    <Tr resetOffset>
                      <Th>Instance</Th>
                      <Th>Cluster</Th>
                      <Th>Region</Th>
                      <Th>Created</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {group.instances.map((instance) => {
                      const getValue = (label: string) =>
                        instance.specRows?.find((row) => row.label === label)?.value ?? '—'

                      return (
                        <Tr key={instance.id} resetOffset>
                          <Td dataLabel="Instance">{instance.name}</Td>
                          <Td dataLabel="Cluster">{getValue('Cluster')}</Td>
                          <Td dataLabel="Region">{getValue('Region')}</Td>
                          <Td dataLabel="Created">{instance.createdAt.slice(0, 10)}</Td>
                        </Tr>
                      )
                    })}
                  </Tbody>
                </Table>
              </ExpandableRowContent>
            </Td>
            <Td />
          </Tr>
        </Tbody>
        )
      })}
    </Table>
  )
}
