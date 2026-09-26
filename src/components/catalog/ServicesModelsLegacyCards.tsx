import { Button, Card, CardBody, Content, Label, LabelGroup } from '@patternfly/react-core'
import { ActionsColumn } from '@patternfly/react-table'
import { getCatalogServiceIcon } from '../../catalog/serviceIcons'
import { groupModelServiceInstances } from '../../tenantUser/modelServiceGroups'
import type { TenantInstance } from '../../tenantUser/instances'

interface ServicesModelsLegacyCardsProps {
  instances: readonly TenantInstance[]
  onViewDetails: (instance: TenantInstance) => void
}

export const ServicesModelsLegacyCards = ({
  instances,
  onViewDetails,
}: ServicesModelsLegacyCardsProps) => {
  const groups = groupModelServiceInstances(instances)

  return (
    <div className="catalog-card-grid tenant-user-instances__grid">
      {groups.map((group) => {
        const representative = group.instances[0]!
        const clusters = group.instances.map(
          (instance) =>
            instance.specRows?.find((row) => row.label === 'Cluster')?.value ?? instance.name,
        )

        return (
          <Card key={group.modelId} className="tenant-user-instances__card">
            <CardBody>
              <div className="tenant-user-instances__card-header">
                <span className="tenant-user-instances__card-icon" aria-hidden>
                  {getCatalogServiceIcon('models')}
                </span>
                <div className="tenant-user-instances__card-header-actions">
                  <Label color="green" isCompact>
                    Ready
                  </Label>
                  <ActionsColumn items={[{ title: 'View deployments' }]} />
                </div>
              </div>
              <div className="tenant-user-instances__card-title-block">
                <Content component="p" className="tenant-user-instances__primary-cell">
                  <strong>{group.displayName}</strong>
                </Content>
                <Content component="p" className="tenant-user-instances__secondary-cell">
                  {group.catalogItemDisplayName} · {group.modelId}
                </Content>
              </div>
              <dl className="tenant-user-catalog__specs-list">
                <div className="tenant-user-catalog__spec-row">
                  <dt className="tenant-user-catalog__spec-label">Model</dt>
                  <dd className="tenant-user-catalog__spec-value">{group.modelId}</dd>
                </div>
                <div className="tenant-user-catalog__spec-row">
                  <dt className="tenant-user-catalog__spec-label">Size</dt>
                  <dd className="tenant-user-catalog__spec-value">
                    {representative.hardwareProfile}
                  </dd>
                </div>
                <div className="tenant-user-catalog__spec-row">
                  <dt className="tenant-user-catalog__spec-label">Served on</dt>
                  <dd className="tenant-user-catalog__spec-value">
                    <LabelGroup numLabels={4}>
                      {clusters.map((cluster) => (
                        <Label key={cluster} color="grey" isCompact>
                          {cluster}
                        </Label>
                      ))}
                    </LabelGroup>
                  </dd>
                </div>
              </dl>
              <div className="tenant-user-instances__legacy-model-deployments">
                {group.instances.map((instance) => (
                  <Button
                    key={instance.id}
                    variant="link"
                    isInline
                    onClick={() => onViewDetails(instance)}
                  >
                    {instance.name}
                  </Button>
                ))}
              </div>
              <dl className="tenant-user-instances__card-footer">
                <div className="tenant-user-instances__card-footer-row">
                  <dt>Project</dt>
                  <dd>{representative.projectName}</dd>
                </div>
                <div className="tenant-user-instances__card-footer-row">
                  <dt>Deployment count</dt>
                  <dd>{group.instances.length}</dd>
                </div>
              </dl>
            </CardBody>
          </Card>
        )
      })}
    </div>
  )
}
