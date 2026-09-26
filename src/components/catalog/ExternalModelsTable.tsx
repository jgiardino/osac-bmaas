import { Table, Th, Thead, Tr } from '@patternfly/react-table'
import type { ExternalModelSeed } from '../../vision/externalModelSeed'
import { ExternalModelsTableRow } from './ExternalModelsTableRow'

type ExternalModelsTableProps = {
  models: ExternalModelSeed[]
  idPrefix: string
  expandedIds?: ReadonlySet<string>
  onToggleExpand?: (id: string) => void
}

export const ExternalModelsTable = ({
  models,
  idPrefix,
  expandedIds,
  onToggleExpand,
}: ExternalModelsTableProps) => (
  <Table variant="compact" isExpandable aria-label="External models" id={idPrefix}>
    <Thead>
      <Tr>
        <Th />
        <Th>Model</Th>
        <Th>Deployments</Th>
        <Th modifier="fitContent">Status</Th>
        <Th modifier="fitContent" screenReaderText="Actions" />
      </Tr>
    </Thead>
    {models.map((model, rowIndex) => (
      <ExternalModelsTableRow
        key={model.name}
        model={model}
        rowIndex={rowIndex}
        idPrefix={idPrefix}
        isExpanded={expandedIds?.has(model.name)}
        onToggle={onToggleExpand ? () => onToggleExpand(model.name) : undefined}
        defaultExpanded={expandedIds?.has(model.name)}
      />
    ))}
  </Table>
)
