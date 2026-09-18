import { Button, Card, CardBody, Content, Flex, FlexItem, Label, LabelGroup } from '@patternfly/react-core'
import { ActionsColumn, type IAction } from '@patternfly/react-table'
import type { CatalogSpecRow } from '../../catalog/catalogSpecs'
import { getCatalogServiceIcon } from '../../catalog/serviceIcons'
import {
  gatewayHostClusterId,
  type ModelInstanceSeedItem,
} from '../../vision/modelInstanceSeed'
import { CatalogSpecRowsList } from './CatalogSpecRowsList'

export type ModelsInstanceCardVariant = 'page' | 'compact'
export type ModelsInstanceCardParent = 'none' | 'cluster' | 'gateway'

type ModelsInstanceCardProps = {
  item: ModelInstanceSeedItem
  variant?: ModelsInstanceCardVariant
  parent?: ModelsInstanceCardParent
  showTenant?: boolean
  idPrefix?: string
  clusterLabel?: string
  clusterIds?: string[]
  gatewayLabel?: string
  onViewDetails?: () => void
}

const instanceSpecRows = (
  item: ModelInstanceSeedItem,
  parent: ModelsInstanceCardParent,
  clusterLabel: string | undefined,
  gatewayLabel: string | undefined,
  showGateway: boolean,
  showClusterText: boolean,
): CatalogSpecRow[] => {
  const rows: CatalogSpecRow[] = [{ label: 'Model', value: item.modelId }]

  if (item.locationKind === 'off-platform') {
    rows.push({ label: 'Served by', value: item.servedBy ?? '—' })
  } else {
    rows.push({ label: 'Size', value: item.size ?? '—' })
  }

  if (showClusterText && parent !== 'cluster') {
    const value = clusterLabel ?? item.clusterId
    if (value) {
      rows.push({ label: 'Cluster', value })
    }
  }

  if (showGateway && parent !== 'gateway') {
    if (gatewayLabel) {
      rows.push({
        label: 'Gateway',
        value: gatewayLabel,
        badge: item.isMaas && gatewayLabel !== 'Unassigned' ? { text: 'MaaS', color: 'blue' } : undefined,
      })
    } else if (!item.gatewayId) {
      rows.push({ label: 'Gateway', value: 'Unassigned' })
    } else {
      const hostCluster = gatewayHostClusterId(item.gatewayId) ?? item.clusterId ?? '—'
      rows.push({
        label: 'Gateway',
        value: `${hostCluster}: ${item.gatewayId}`,
        badge: item.isMaas ? { text: 'MaaS', color: 'blue' } : undefined,
      })
    }
  }

  return rows
}

export const ModelsInstanceCard = ({
  item,
  variant = 'page',
  parent = 'none',
  showTenant = false,
  idPrefix = 'models-instance',
  clusterLabel,
  clusterIds,
  gatewayLabel,
  onViewDetails,
}: ModelsInstanceCardProps) => {
  const cardId = `${idPrefix}-${item.id}`
  const isCompact = variant === 'compact'
  const specClass = isCompact ? 'vision-grid-drawer-card__specs' : 'tenant-user-catalog__specs-list'
  const specRowClass = isCompact ? 'vision-grid-drawer-card__spec-row' : 'tenant-user-catalog__spec-row'
  const specLabelClass = isCompact
    ? 'vision-grid-drawer-card__spec-label'
    : 'tenant-user-catalog__spec-label'
  const specValueClass = isCompact
    ? 'vision-grid-drawer-card__spec-value'
    : 'tenant-user-catalog__spec-value'
  const footerActionLabel = item.isMaas ? 'View subscriptions' : 'View endpoints'
  const kebabItems: IAction[] = isCompact
    ? [{ title: 'View details', onClick: onViewDetails }, { title: footerActionLabel }]
    : [{ title: 'View details', onClick: onViewDetails }]

  const titleBlock = (
    <div className="tenant-user-instances__card-title-block">
      <Content component="p" className="tenant-user-instances__primary-cell">
        <Flex
          spaceItems={{ default: 'spaceItemsSm' }}
          alignItems={{ default: 'alignItemsCenter' }}
          flexWrap={{ default: 'wrap' }}
        >
          <FlexItem>
            <Button
              variant="link"
              isInline
              className="tenant-user-instances__name-link catalog-item-name-link"
              id={`${cardId}-name`}
              onClick={onViewDetails}
            >
              {item.displayName}
            </Button>
          </FlexItem>
          {variant === 'page' ? (
            <FlexItem>
              <Label
                color={item.locationKind === 'off-platform' ? 'teal' : 'orange'}
                variant="filled"
                isCompact
                id={`${cardId}-source`}
              >
                {item.locationKind === 'off-platform' ? 'External' : 'Internal'}
              </Label>
            </FlexItem>
          ) : null}
          {parent === 'gateway' && item.isMaas ? (
            <FlexItem>
              <Label color="blue" variant="filled" isCompact id={`${cardId}-maas`}>
                MaaS
              </Label>
            </FlexItem>
          ) : null}
        </Flex>
      </Content>
      {item.catalogSkuName ? (
        <Content component="p" className="tenant-user-instances__secondary-cell">
          {item.catalogSkuName}
        </Content>
      ) : null}
    </div>
  )

  const statusLabel = (
    <Label color="green" isCompact id={`${cardId}-status`}>
      Ready
    </Label>
  )

  const servedOnIds =
    clusterIds && clusterIds.length > 0
      ? clusterIds
      : clusterLabel
        ? clusterLabel.split(', ').filter(Boolean)
        : item.clusterId
          ? [item.clusterId]
          : []
  const showServedOn = !isCompact && parent !== 'cluster' && servedOnIds.length > 0

  const footerRows = [
    ...(showTenant ? [{ label: 'Tenant', value: item.tenantLabel }] : []),
    { label: 'Project', value: item.projectName },
    ...(!isCompact ? [{ label: 'Created', value: item.createdAtLabel }] : []),
  ]

  return (
    <Card
      id={cardId}
      isCompact={isCompact}
      className={
        isCompact
          ? 'vision-grid-drawer-card tenant-user-instances__card'
          : 'tenant-user-instances__card'
      }
    >
      <CardBody>
        {isCompact ? (
          <div className="tenant-user-instances__card-header">
            <div className="models-instance-card__title-row">
              <span
                className="tenant-user-instances__card-icon models-instance-card__icon--compact"
                aria-hidden
              >
                {getCatalogServiceIcon('models')}
              </span>
              {titleBlock}
            </div>
            <div className="tenant-user-instances__card-header-actions">
              {statusLabel}
              <ActionsColumn items={kebabItems} />
            </div>
          </div>
        ) : (
          <>
            <div className="tenant-user-instances__card-header">
              <span className="tenant-user-instances__card-icon" aria-hidden>
                {getCatalogServiceIcon('models')}
              </span>
              <div className="tenant-user-instances__card-header-actions">
                {statusLabel}
                <ActionsColumn items={kebabItems} />
              </div>
            </div>
            {titleBlock}
          </>
        )}
        <CatalogSpecRowsList
          rows={instanceSpecRows(item, parent, clusterLabel, gatewayLabel, isCompact, isCompact)}
          className={specClass}
          rowClassName={specRowClass}
          labelClassName={specLabelClass}
          valueClassName={specValueClass}
          idPrefix={cardId}
          afterRows={
            showServedOn ? (
              <div className={specRowClass}>
                <dt className={specLabelClass}>Served on</dt>
                <dd className={specValueClass} id={`${cardId}-served-on`}>
                  <LabelGroup id={`${cardId}-served-on-labels`} numLabels={4}>
                    {servedOnIds.map((clusterId) => (
                      <Label
                        key={clusterId}
                        color="grey"
                        isCompact
                        id={`${cardId}-served-on-${clusterId}`}
                      >
                        {clusterId}
                      </Label>
                    ))}
                  </LabelGroup>
                </dd>
              </div>
            ) : null
          }
        />
        <dl className={isCompact ? 'vision-grid-drawer-card__footer' : 'tenant-user-instances__card-footer'}>
          {footerRows.map((row) => (
            <div
              key={row.label}
              className={
                isCompact
                  ? 'vision-grid-drawer-card__footer-row'
                  : 'tenant-user-instances__card-footer-row'
              }
            >
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
        {!isCompact ? (
          <div className="tenant-user-instances__card-console">
            <Button
              variant="primary"
              className="tenant-user-instances__console-button"
              id={`${cardId}-footer-action`}
            >
              {footerActionLabel}
            </Button>
          </div>
        ) : null}
      </CardBody>
    </Card>
  )
}
