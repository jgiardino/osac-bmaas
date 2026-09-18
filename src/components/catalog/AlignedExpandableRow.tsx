import type { ReactNode } from 'react'
import { ExpandableRowContent, Td, Tr } from '@patternfly/react-table'

type AlignedExpandableRowProps = {
  isExpanded: boolean
  /**
   * Columns the nested content occupies: after the expand cell, before the
   * trailing empty actions cell. On Services → Models this is 3 (Model,
   * Deployments, Status), not 4.
   */
  colSpan: number
  id: string
  children: ReactNode
}

/** Nested expand content aligned to the first data column, matching API keys → Subscriptions. */
export const AlignedExpandableRow = ({
  isExpanded,
  colSpan,
  id,
  children,
}: AlignedExpandableRowProps) => (
  <Tr isExpanded={isExpanded} id={id}>
    <Td />
    <Td noPadding colSpan={colSpan} id={`${id}-td`}>
      <ExpandableRowContent>
        <div className="pf-v6-u-pb-lg">{children}</div>
      </ExpandableRowContent>
    </Td>
    <Td />
  </Tr>
)
