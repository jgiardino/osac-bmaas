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
import type { VisionFleetSpecNode } from './visionFleetModelSpec'
import { VisionGridKebab, type VisionGridKebabItem } from './VisionGridKebab'

type VisionGridDrawerCardFooterRow = {
  label: string
  value: string
}

type VisionGridDrawerCardProps = {
  id: string
  name: string
  nameLabel?: string
  onSelect: () => void
  onViewDetails?: () => void
  isSelected?: boolean
  badge?: ReactNode
  kebabItems?: VisionGridKebabItem[]
  secondary?: string
  secondaryLabel?: string
  secondaryIsMono?: boolean
  specRows?: CatalogSpecRow[]
  specNodes?: VisionFleetSpecNode[]
  footerRows?: VisionGridDrawerCardFooterRow[]
  extra?: ReactNode
  extraLabel?: string
  meta?: string
}

export const VisionGridDrawerCard = ({
  id,
  name,
  nameLabel,
  onSelect,
  onViewDetails,
  isSelected = false,
  badge,
  kebabItems = [],
  secondary,
  secondaryLabel,
  secondaryIsMono = true,
  specRows = [],
  specNodes,
  footerRows = [],
  extra,
  extraLabel = 'Gateway',
  meta,
}: VisionGridDrawerCardProps) => {
  const titleId = `${id}-title`
  const resolvedNodes =
    specNodes ??
    (extra && specRows.length > 0
      ? specRows.map((row) => ({ label: row.label, value: row.value }))
      : specNodes)
  const hasCatalogSpecs = specRows.length > 0 && !resolvedNodes && !extra
  const hasNodeSpecs = Boolean(resolvedNodes && resolvedNodes.length > 0)
  const extraRow = extra ? (
    <div className="vision-grid-drawer-card__spec-row">
      <dt className="vision-grid-drawer-card__spec-label">{extraLabel}</dt>
      <dd className="vision-grid-drawer-card__spec-value">{extra}</dd>
    </div>
  ) : null

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
            {nameLabel ? (
              <Content component="small" className="vision-grid-drawer-card__field-label">
                {nameLabel}
              </Content>
            ) : null}
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
        {secondaryLabel ? (
          <Content component="small" className="vision-grid-drawer-card__field-label">
            {secondaryLabel}
          </Content>
        ) : null}
        {secondary ? (
          <Content
            component="p"
            className={
              secondaryIsMono
                ? 'vision-grid-drawer-card__secondary'
                : 'vision-grid-drawer-card__secondary vision-grid-drawer-card__secondary--plain'
            }
          >
            {secondary}
          </Content>
        ) : null}
        {hasNodeSpecs || extra ? (
          <dl className="vision-grid-drawer-card__specs">
            {resolvedNodes?.map((row) => (
              <div key={row.label} className="vision-grid-drawer-card__spec-row">
                <dt className="vision-grid-drawer-card__spec-label">{row.label}</dt>
                <dd className="vision-grid-drawer-card__spec-value">{row.value}</dd>
              </div>
            ))}
            {extraRow}
          </dl>
        ) : hasCatalogSpecs ? (
          <CatalogSpecRowsList
            rows={specRows}
            className="vision-grid-drawer-card__specs"
            rowClassName="vision-grid-drawer-card__spec-row"
            labelClassName="vision-grid-drawer-card__spec-label"
            valueClassName="vision-grid-drawer-card__spec-value"
          />
        ) : null}
        {meta && !hasCatalogSpecs && !hasNodeSpecs && !extra ? (
          <Content component="small">{meta}</Content>
        ) : null}
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
