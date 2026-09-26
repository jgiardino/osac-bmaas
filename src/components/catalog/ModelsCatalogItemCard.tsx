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
  Label,
  Tooltip,
} from '@patternfly/react-core'
import { ActionsColumn, type IAction } from '@patternfly/react-table'
import { CatalogSpecRowsList } from './CatalogSpecRowsList'
import { CatalogPublishScopeIcon } from '../provider-admin/CatalogPublishScopeIcon'
import { getCatalogServiceIcon } from '../../catalog/serviceIcons'
import { CATALOG_SERVICE_LABELS, formatRateCardSummary } from '../../providerSetup/templateDemo'
import { getCatalogItemStatus, type ProviderCatalogDraft } from '../../providerSetup/storage'
import { resolveCatalogSpecRows } from '../../catalog/catalogSpecs'

export type ModelsCatalogItemCardVariant = 'page' | 'compact'

type ModelsCatalogItemCardFooterRow = {
  label: string
  value: string
}

type ModelsCatalogItemCardProps = {
  item: ProviderCatalogDraft
  variant?: ModelsCatalogItemCardVariant
  id?: string
  kebabItems?: IAction[]
  headerActions?: ReactNode
  footer?: ReactNode
  footerRows?: ModelsCatalogItemCardFooterRow[]
  badge?: ReactNode
  isSelected?: boolean
  onSelect?: () => void
  onNameClick?: () => void
}

const visibilityLabel = (item: ProviderCatalogDraft): string =>
  item.scope === 'vip-enterprise' ? 'VIP enterprise' : 'Global public'

const visibilityTooltip = (item: ProviderCatalogDraft): string =>
  item.scope === 'vip-enterprise'
    ? 'Visible only to chosen tenants'
    : 'Visible to every tenant'

const StatusLabel = ({ item }: { item: ProviderCatalogDraft }) => {
  const isLive = getCatalogItemStatus(item) === 'live'
  return (
    <Label
      color={isLive ? 'green' : 'grey'}
      className="provider-admin-catalog-items__card-label provider-admin-catalog-items__status"
    >
      {isLive ? 'Live' : 'Unpublished'}
    </Label>
  )
}

const VisibilityFooter = ({ item }: { item: ProviderCatalogDraft }) => (
  <div className="provider-admin-catalog-items__card-footer" aria-label="Visibility">
    <Tooltip content={visibilityTooltip(item)} position="top" enableFlip={false}>
      <span className="provider-admin-catalog-items__scope">
        <CatalogPublishScopeIcon scope={item.scope} className="provider-admin-catalog__scope-icon" />
        <span>{visibilityLabel(item)}</span>
      </span>
    </Tooltip>
  </div>
)

export const ModelsCatalogItemCard = ({
  item,
  variant = 'page',
  id,
  kebabItems = [],
  headerActions,
  footer,
  footerRows,
  badge,
  isSelected = false,
  onSelect,
  onNameClick,
}: ModelsCatalogItemCardProps) => {
  const specRows = resolveCatalogSpecRows(item)
  const resolvedFooterRows =
    footerRows ??
    (item.rateCard ? [{ label: 'Rate', value: formatRateCardSummary(item.rateCard) }] : [])

  if (variant === 'compact') {
    const compactId = id ?? `models-catalog-card-${item.catalogItemId}`
    return (
      <Card
        id={compactId}
        className="vision-grid-drawer-card"
        isCompact
        isSelectable={Boolean(onSelect)}
        isSelected={isSelected}
        onClick={(event) => {
          if (!onSelect) {
            return
          }
          const target = event.target as HTMLElement
          if (target.closest('button, a')) {
            return
          }
          onSelect()
        }}
      >
        <CardHeader
          actions={
            kebabItems.length > 0 || headerActions
              ? {
                  actions: (
                    <>
                      {headerActions}
                      {kebabItems.length > 0 ? <ActionsColumn items={kebabItems} /> : null}
                    </>
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
              <CardTitle id={`${compactId}-title`}>
                {onNameClick ? (
                  <Button variant="link" isInline onClick={onNameClick}>
                    {item.displayName}
                  </Button>
                ) : (
                  item.displayName
                )}
              </CardTitle>
            </FlexItem>
            {badge ? <FlexItem>{badge}</FlexItem> : null}
          </Flex>
        </CardHeader>
        <CardBody>
          <CatalogSpecRowsList
            rows={specRows}
            className="vision-grid-drawer-card__specs"
            rowClassName="vision-grid-drawer-card__spec-row"
            labelClassName="vision-grid-drawer-card__spec-label"
            valueClassName="vision-grid-drawer-card__spec-value"
          />
          {resolvedFooterRows.length > 0 ? (
            <dl className="vision-grid-drawer-card__footer">
              {resolvedFooterRows.map((row) => (
                <div key={row.label} className="vision-grid-drawer-card__footer-row">
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {footer}
        </CardBody>
      </Card>
    )
  }

  return (
    <Card
      id={id}
      isCompact={false}
      className={[
        'provider-admin-catalog-items__card',
        getCatalogItemStatus(item) === 'unpublished'
          ? 'provider-admin-catalog-items__card--unpublished'
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <CardBody>
        <div className="provider-admin-catalog-items__card-header">
          <span className="provider-admin-catalog-items__card-icon" aria-hidden>
            {getCatalogServiceIcon('models')}
          </span>
          <div className="provider-admin-catalog-items__card-header-actions">
            {headerActions ?? (
              <>
                <Label color="blue" className="provider-admin-catalog-items__card-label">
                  {CATALOG_SERVICE_LABELS.models}
                </Label>
                <StatusLabel item={item} />
              </>
            )}
            {kebabItems.length > 0 ? <ActionsColumn items={kebabItems} /> : null}
          </div>
        </div>
        <Content component="p" className="provider-admin-catalog-items__primary-cell">
          {onNameClick ? (
            <Button
              variant="link"
              isInline
              className="provider-admin-catalog-items__name-link catalog-item-name-link"
              onClick={onNameClick}
            >
              {item.displayName}
            </Button>
          ) : (
            item.displayName
          )}
        </Content>
        <CatalogSpecRowsList rows={specRows} className="provider-admin-catalog-items__specs-list" />
        {resolvedFooterRows.length > 0 ? (
          <dl className="provider-admin-catalog-items__card-specs">
            {resolvedFooterRows.map((row) => (
              <div key={row.label} className="provider-admin-catalog-items__card-spec">
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {footer ?? <VisibilityFooter item={item} />}
      </CardBody>
    </Card>
  )
}
