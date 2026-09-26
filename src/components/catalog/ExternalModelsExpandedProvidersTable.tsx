import { Flex, Label } from '@patternfly/react-core'
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table'
import { formatProviderRefWeight, type ExternalModelSeed } from '../../vision/externalModelSeed'
import { ExternalModelPhaseLabel } from './ExternalModelPhaseLabel'

type ExternalModelsExpandedProvidersTableProps = {
  model: ExternalModelSeed
  idPrefix: string
}

export const ExternalModelsExpandedProvidersTable = ({
  model,
  idPrefix,
}: ExternalModelsExpandedProvidersTableProps) => (
  <Table
      aria-label={`Providers for ${model.displayName}`}
      variant="compact"
      isNested
      id={`${idPrefix}-providers`}
    >
      <Thead>
        <Tr resetOffset>
          <Th id={`${idPrefix}-th-provider`}>External provider</Th>
          <Th id={`${idPrefix}-th-format`}>API format</Th>
          <Th id={`${idPrefix}-th-target`}>Target model ID</Th>
          <Th id={`${idPrefix}-th-weight`}>Weight</Th>
          <Th modifier="fitContent" id={`${idPrefix}-th-status`}>
            Status
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {model.providerRefs.map((ref, index) => (
          <Tr key={ref.providerName} resetOffset id={`${idPrefix}-row-${ref.providerName}`}>
            <Td dataLabel="External provider" id={`${idPrefix}-provider-${ref.providerName}`}>
              <Label color="teal" id={`${idPrefix}-provider-label-${ref.providerName}`}>
                {ref.displayName}
              </Label>
            </Td>
            <Td dataLabel="API format" id={`${idPrefix}-format-${ref.providerName}`}>
              <Label
                color="grey"
                variant="outline"
                id={`${idPrefix}-format-label-${ref.providerName}`}
              >
                {ref.apiFormat}
              </Label>
            </Td>
            <Td dataLabel="Target model ID" id={`${idPrefix}-target-${ref.providerName}`}>
              {ref.targetModel}
            </Td>
            <Td dataLabel="Weight" id={`${idPrefix}-weight-${ref.providerName}`}>
              <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                <span>{formatProviderRefWeight(model.providerRefs, index)}</span>
              </Flex>
            </Td>
            <Td
              dataLabel="Status"
              modifier="fitContent"
              id={`${idPrefix}-status-${ref.providerName}`}
            >
              <ExternalModelPhaseLabel
                phase={ref.phase}
                id={`${idPrefix}-status-label-${ref.providerName}`}
              />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
)
