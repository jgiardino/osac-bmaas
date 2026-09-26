import { Flex, FlexItem, Label } from '@patternfly/react-core'
import type { ReactNode } from 'react'
import type { CatalogSpecRow } from '../../catalog/catalogSpecs'

type CatalogSpecValueWithBadgeProps = {
  value: ReactNode
  badge?: CatalogSpecRow['badge']
  id?: string
}

export const CatalogSpecValueWithBadge = ({
  value,
  badge,
  id,
}: CatalogSpecValueWithBadgeProps): ReactNode => {
  if (!badge) {
    return value
  }
  return (
    <Flex
      spaceItems={{ default: 'spaceItemsSm' }}
      alignItems={{ default: 'alignItemsCenter' }}
      flexWrap={{ default: 'wrap' }}
    >
      <FlexItem>{value}</FlexItem>
      <FlexItem>
        <Label color={badge.color} variant="filled" isCompact id={id}>
          {badge.text}
        </Label>
      </FlexItem>
    </Flex>
  )
}
