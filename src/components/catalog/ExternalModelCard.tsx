import { Button, Card, CardBody, Content, Flex, FlexItem, Label, LabelGroup } from '@patternfly/react-core'
import { ActionsColumn, type IAction } from '@patternfly/react-table'
import { getCatalogServiceIcon } from '../../catalog/serviceIcons'
import type { ExternalModelSeed, ExternalProviderRef } from '../../vision/externalModelSeed'
import { getVisionOrg } from '../../vision/fleetWorld'
import { CatalogSpecRowsList } from './CatalogSpecRowsList'
import { ExternalModelPhaseLabel } from './ExternalModelPhaseLabel'

export type ExternalModelCardVariant = 'page' | 'compact'

type ExternalModelCardProps = {
  model: ExternalModelSeed
  variant?: ExternalModelCardVariant
  showTenant?: boolean
  idPrefix?: string
  focusProvider?: ExternalProviderRef
  weightLabel?: string
  onViewDetails?: () => void
}

export const ExternalModelCard = ({
  model,
  variant = 'page',
  showTenant = false,
  idPrefix = 'external-model',
  focusProvider,
  weightLabel,
  onViewDetails,
}: ExternalModelCardProps) => {
  const isCompact = variant === 'compact'
  const cardId = `${idPrefix}-${model.name}${focusProvider ? `-${focusProvider.providerName}` : ''}`
  const tenantLabel = getVisionOrg(model.orgId).label
  const specClass = isCompact ? 'vision-grid-drawer-card__specs' : 'tenant-user-catalog__specs-list'
  const specRowClass = isCompact ? 'vision-grid-drawer-card__spec-row' : 'tenant-user-catalog__spec-row'
  const specLabelClass = isCompact
    ? 'vision-grid-drawer-card__spec-label'
    : 'tenant-user-catalog__spec-label'
  const specValueClass = isCompact
    ? 'vision-grid-drawer-card__spec-value'
    : 'tenant-user-catalog__spec-value'
  const title = focusProvider ? focusProvider.displayName : model.displayName
  const secondary = focusProvider ? model.displayName : model.name
  const servedOnProviders = focusProvider ? [focusProvider] : model.providerRefs
  const phase = focusProvider?.phase ?? model.phase
  const kebabItems: IAction[] = isCompact
    ? [{ title: 'View details', onClick: onViewDetails }, { title: 'View endpoints' }]
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
              {title}
            </Button>
          </FlexItem>
          <FlexItem>
            <Label color="teal" variant="filled" isCompact id={`${cardId}-source`}>
              External
            </Label>
          </FlexItem>
        </Flex>
      </Content>
      <Content component="p" className="tenant-user-instances__secondary-cell">
        {secondary}
      </Content>
    </div>
  )

  const footerRows = [
    ...(showTenant && !isCompact ? [{ label: 'Tenant', value: tenantLabel }] : []),
    { label: 'Project', value: model.projectName },
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
              <ExternalModelPhaseLabel phase={phase} id={`${cardId}-status`} />
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
                <ExternalModelPhaseLabel phase={phase} id={`${cardId}-status`} />
                <ActionsColumn items={kebabItems} />
              </div>
            </div>
            {titleBlock}
          </>
        )}
        <CatalogSpecRowsList
          rows={[{ label: 'Model', value: focusProvider?.targetModel ?? model.name }]}
          className={specClass}
          rowClassName={specRowClass}
          labelClassName={specLabelClass}
          valueClassName={specValueClass}
          idPrefix={cardId}
          afterRows={
            <>
              <div className={specRowClass}>
                <dt className={specLabelClass}>Served on</dt>
                <dd className={specValueClass} id={`${cardId}-served-on`}>
                  {servedOnProviders.length > 0 ? (
                    <LabelGroup id={`${cardId}-served-on-labels`} numLabels={4}>
                      {servedOnProviders.map((ref) => (
                        <Label
                          key={ref.providerName}
                          color="teal"
                          isCompact
                          id={`${cardId}-served-on-${ref.providerName}`}
                        >
                          {ref.displayName}
                        </Label>
                      ))}
                    </LabelGroup>
                  ) : (
                    '—'
                  )}
                </dd>
              </div>
              {weightLabel ? (
                <div className={specRowClass}>
                  <dt className={specLabelClass}>Weight</dt>
                  <dd className={specValueClass} id={`${cardId}-weight`}>
                    {weightLabel}
                  </dd>
                </div>
              ) : null}
            </>
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
              View endpoints
            </Button>
          </div>
        ) : null}
      </CardBody>
    </Card>
  )
}
