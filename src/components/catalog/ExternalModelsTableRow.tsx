import { useState } from 'react'
import { Button, Content, Label, LabelGroup } from '@patternfly/react-core'
import { ActionsColumn, Tbody, Td, Tr } from '@patternfly/react-table'
import type { ExternalModelSeed } from '../../vision/externalModelSeed'
import { AlignedExpandableRow } from './AlignedExpandableRow'
import { ExternalModelPhaseLabel } from './ExternalModelPhaseLabel'
import { ExternalModelsExpandedProvidersTable } from './ExternalModelsExpandedProvidersTable'

export const EXTERNAL_MODEL_ROW_DATA_COLUMNS = 3

type ExternalModelsTableRowProps = {
  model: ExternalModelSeed
  rowIndex: number
  idPrefix: string
  isExpanded?: boolean
  onToggle?: () => void
  defaultExpanded?: boolean
}

export const ExternalModelsTableRow = ({
  model,
  rowIndex,
  idPrefix,
  isExpanded: isExpandedProp,
  onToggle,
  defaultExpanded = false,
}: ExternalModelsTableRowProps) => {
  const [uncontrolledExpanded, setUncontrolledExpanded] = useState(defaultExpanded)
  const isControlled = isExpandedProp !== undefined
  const isExpanded = isControlled ? isExpandedProp : uncontrolledExpanded
  const rowId = `${idPrefix}-${model.name}`

  const handleToggle = () => {
    if (onToggle) {
      onToggle()
      return
    }
    setUncontrolledExpanded((prev) => !prev)
  }

  return (
    <Tbody isExpanded={isExpanded} id={`${rowId}-tbody`}>
      <Tr isContentExpanded={isExpanded} id={`${rowId}-row`}>
        <Td
          expand={{
            rowIndex,
            isExpanded,
            onToggle: handleToggle,
            expandId: `${rowId}-expand`,
          }}
          id={`${rowId}-expand-td`}
        />
        <Td dataLabel="Model" id={`${rowId}-model`}>
          <Button variant="link" isInline id={`${rowId}-name`}>
            {model.displayName}
          </Button>
          <Content
            component="p"
            className="pf-v6-u-font-size-xs pf-v6-u-font-family-monospace pf-v6-u-text-color-subtle"
            id={`${rowId}-resource`}
          >
            Resource name: {model.name}
          </Content>
          <Content
            component="p"
            className="pf-v6-u-font-size-xs pf-v6-u-text-color-subtle"
            id={`${rowId}-desc`}
          >
            {model.description}
          </Content>
        </Td>
        <Td dataLabel="Deployments" id={`${rowId}-providers`}>
          <LabelGroup id={`${rowId}-provider-labels`} numLabels={4}>
            {model.providerRefs.map((ref) => (
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
          <ExternalModelPhaseLabel phase={model.phase} id={`${rowId}-status-label`} />
        </Td>
        <Td isActionCell modifier="fitContent" id={`${rowId}-actions`}>
          <ActionsColumn items={[{ title: 'View details' }]} />
        </Td>
      </Tr>
      <AlignedExpandableRow
        isExpanded={isExpanded}
        colSpan={EXTERNAL_MODEL_ROW_DATA_COLUMNS}
        id={`${rowId}-expanded`}
      >
        <ExternalModelsExpandedProvidersTable model={model} idPrefix={`${rowId}-nested`} />
      </AlignedExpandableRow>
    </Tbody>
  )
}
