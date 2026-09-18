import { Button, Card, CardBody, Content, Flex, FlexItem, Label, LabelGroup } from '@patternfly/react-core'
import { ActionsColumn } from '@patternfly/react-table'
import { getCatalogServiceIcon } from '../../catalog/serviceIcons'
import type { ExternalModelSeed } from '../../vision/externalModelSeed'
import { getVisionOrg } from '../../vision/fleetWorld'
import { CatalogSpecRowsList } from './CatalogSpecRowsList'
import { ExternalModelPhaseLabel } from './ExternalModelPhaseLabel'

type ExternalModelCardProps = {
  model: ExternalModelSeed
  showTenant?: boolean
  idPrefix?: string
}

export const ExternalModelCard = ({
  model,
  showTenant = false,
  idPrefix = 'external-model',
}: ExternalModelCardProps) => {
  const cardId = `${idPrefix}-${model.name}`
  const tenantLabel = getVisionOrg(model.orgId).label

  return (
    <Card id={cardId} className="tenant-user-instances__card">
      <CardBody>
        <div className="tenant-user-instances__card-header">
          <span className="tenant-user-instances__card-icon" aria-hidden>
            {getCatalogServiceIcon('models')}
          </span>
          <div className="tenant-user-instances__card-header-actions">
            <ExternalModelPhaseLabel phase={model.phase} id={`${cardId}-status`} />
            <ActionsColumn items={[{ title: 'View details' }]} />
          </div>
        </div>
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
                >
                  {model.displayName}
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
            {model.name}
          </Content>
        </div>
        <CatalogSpecRowsList
          rows={[{ label: 'Model', value: model.name }]}
          className="tenant-user-catalog__specs-list"
          rowClassName="tenant-user-catalog__spec-row"
          labelClassName="tenant-user-catalog__spec-label"
          valueClassName="tenant-user-catalog__spec-value"
          idPrefix={cardId}
          afterRows={
            <div className="tenant-user-catalog__spec-row">
              <dt className="tenant-user-catalog__spec-label">Served on</dt>
              <dd className="tenant-user-catalog__spec-value" id={`${cardId}-served-on`}>
                {model.providerRefs.length > 0 ? (
                  <LabelGroup id={`${cardId}-served-on-labels`} numLabels={4}>
                    {model.providerRefs.map((ref) => (
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
          }
        />
        <dl className="tenant-user-instances__card-footer">
          {showTenant ? (
            <div className="tenant-user-instances__card-footer-row">
              <dt>Tenant</dt>
              <dd>{tenantLabel}</dd>
            </div>
          ) : null}
          <div className="tenant-user-instances__card-footer-row">
            <dt>Project</dt>
            <dd>{model.projectName}</dd>
          </div>
        </dl>
        <div className="tenant-user-instances__card-console">
          <Button variant="primary" className="tenant-user-instances__console-button" id={`${cardId}-footer-action`}>
            View endpoints
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}
