import type { ReactNode } from 'react'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Content,
  Flex,
  FlexItem,
} from '@patternfly/react-core'
import type { CatalogSpecRow } from '../../../catalog/catalogSpecs'
import { CatalogSpecRowsList } from '../../../components/catalog/CatalogSpecRowsList'
import { VisionGridKebab, type VisionGridKebabItem } from './VisionGridKebab'

type VisionGridDrawerCardFooterRow = {
  label: string
  value: string
}

type VisionGridDrawerCardProps = {
  id: string
  name: string
  onSelect: () => void
  onViewDetails?: () => void
  isSelected?: boolean
  badge?: ReactNode
  kebabItems?: VisionGridKebabItem[]
  secondary?: string
  specRows?: CatalogSpecRow[]
  footerRows?: VisionGridDrawerCardFooterRow[]
  meta?: string
}

export const VisionGridDrawerCard = ({
  id,
  name,
  onSelect,
  onViewDetails,
  isSelected = false,
  badge,
  kebabItems = [],
  secondary,
  specRows = [],
  footerRows = [],
  meta,
}: VisionGridDrawerCardProps) => {
  const titleId = `${id}-title`

  return (
    <Card
      id={id}
      className="vision-grid-drawer-card"
      isCompact
      isSelectable
      isSelected={isSelected}
      onClick={(event) => {
        const target = event.target as HTMLElement
        if (target.closest('button, a')) {
          return
        }
        onSelect()
      }}
    >
      <CardHeader
        actions={
          kebabItems.length > 0
            ? {
                actions: (
                  <VisionGridKebab id={`${id}-actions`} label={`Actions for ${name}`} items={kebabItems} />
                ),
                hasNoOffset: true,
              }
            : undefined
        }
      >
        <Flex
          spaceItems={{ default: 'spaceItemsSm' }}
          alignItems={{ default: 'alignItemsCenter' }}
          flexWrap={{ default: 'nowrap' }}
        >
          <FlexItem>
            <CardTitle id={titleId}>
              {onViewDetails ? (
                <Button
                  variant="link"
                  isInline
                  onClick={(event) => {
                    event.stopPropagation()
                    onViewDetails()
                  }}
                >
                  {name}
                </Button>
              ) : (
                name
              )}
            </CardTitle>
          </FlexItem>
          {badge ? <FlexItem>{badge}</FlexItem> : null}
        </Flex>
      </CardHeader>
      <CardBody>
        {secondary ? (
          <Content component="p" className="vision-grid-drawer-card__secondary">
            {secondary}
          </Content>
        ) : null}
        {specRows.length > 0 ? (
          <CatalogSpecRowsList
            rows={specRows}
            className="vision-grid-drawer-card__specs"
            rowClassName="vision-grid-drawer-card__spec-row"
            labelClassName="vision-grid-drawer-card__spec-label"
            valueClassName="vision-grid-drawer-card__spec-value"
          />
        ) : null}
        {meta && specRows.length === 0 ? <Content component="small">{meta}</Content> : null}
        {footerRows.length > 0 ? (
          <dl className="vision-grid-drawer-card__footer">
            {footerRows.map((row) => (
              <div key={row.label} className="vision-grid-drawer-card__footer-row">
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </CardBody>
    </Card>
  )
}
