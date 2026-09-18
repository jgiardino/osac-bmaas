import { Label } from '@patternfly/react-core'
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table'
import { formatEqualSplitWeight } from '../../vision/modelInstanceSeed'

export type InternalDeploymentRow = {
  id: string
  clusterLabel: string
  status: 'Ready' | 'Failed' | 'Pending'
}

type InternalDeploymentsTableProps = {
  deployments: InternalDeploymentRow[]
  displayName: string
  idPrefix: string
}

const DeploymentStatusLabel = ({
  status,
  id,
}: {
  status: InternalDeploymentRow['status']
  id: string
}) => {
  if (status === 'Failed') {
    return (
      <Label id={id} color="red" isCompact>
        Failed
      </Label>
    )
  }
  if (status === 'Pending') {
    return (
      <Label id={id} color="purple" isCompact>
        Pending
      </Label>
    )
  }
  return (
    <Label id={id} color="green" isCompact>
      Ready
    </Label>
  )
}

export const InternalDeploymentsTable = ({
  deployments,
  displayName,
  idPrefix,
}: InternalDeploymentsTableProps) => (
  <Table
    aria-label={`Deployments for ${displayName}`}
    variant="compact"
    isNested
    id={`${idPrefix}-deployments`}
  >
      <Thead>
        <Tr resetOffset>
          <Th id={`${idPrefix}-th-cluster`}>Cluster</Th>
          <Th id={`${idPrefix}-th-weight`}>Weight</Th>
          <Th modifier="fitContent" id={`${idPrefix}-th-status`}>
            Status
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {deployments.map((deployment, index) => (
          <Tr key={deployment.id} resetOffset id={`${idPrefix}-row-${deployment.id}`}>
            <Td dataLabel="Cluster" id={`${idPrefix}-cluster-${deployment.id}`}>
              <Label color="grey" id={`${idPrefix}-cluster-label-${deployment.id}`}>
                {deployment.clusterLabel}
              </Label>
            </Td>
            <Td dataLabel="Weight" id={`${idPrefix}-weight-${deployment.id}`}>
              {formatEqualSplitWeight(deployments.length, index)}
            </Td>
            <Td dataLabel="Status" modifier="fitContent" id={`${idPrefix}-status-${deployment.id}`}>
              <DeploymentStatusLabel
                status={deployment.status}
                id={`${idPrefix}-status-label-${deployment.id}`}
              />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
)
