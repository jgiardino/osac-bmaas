import type { ReactNode } from 'react'
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Label,
  Title,
} from '@patternfly/react-core'
import type { CatalogSpecRow } from '../../catalog/catalogSpecs'
import { getCatalogSpecsSectionLabel } from '../../catalog/catalogSpecs'
import { CatalogPublishScopeIcon } from '../provider-admin/CatalogPublishScopeIcon'
import type { PublishCatalogScope } from '../../providerSetup/templateDemo'
import { CatalogSpecValueWithBadge } from './CatalogSpecValueWithBadge'

export type ModelCatalogDetailsVariant = 'entity' | 'provider'

export type ModelServingPresetDetailsContent = {
  service: string
  statusLabel: string
  statusColor: 'green' | 'grey' | 'blue'
  rateSummary: string
  scope: PublishCatalogScope
  visibilityLabel: string
  createdAtLabel: string
  specRows: CatalogSpecRow[]
}

type ModelServingPresetDetailsBodyProps = {
  content: ModelServingPresetDetailsContent
  variant?: ModelCatalogDetailsVariant
  publishingExtras?: ReactNode
}

const getClassPrefix = (variant: ModelCatalogDetailsVariant): string =>
  variant === 'entity' ? 'entity-details-page' : 'provider-admin-catalog-item-details'

const renderSpecRowValue = (row: CatalogSpecRow) => (
  <CatalogSpecValueWithBadge value={row.value} badge={row.badge} />
)

export const ModelServingPresetDetailsBody = ({
  content,
  variant = 'provider',
  publishingExtras,
}: ModelServingPresetDetailsBodyProps) => {
  const prefix = getClassPrefix(variant)
  const specsSectionLabel = getCatalogSpecsSectionLabel('models')
  const scopeWrapClass =
    variant === 'entity' ? 'tenant-admin-catalog-manager__scope' : 'provider-admin-catalog-items__scope'
  const scopeIconClass =
    variant === 'entity'
      ? 'tenant-admin-catalog-manager__scope-icon'
      : 'provider-admin-catalog__scope-icon'

  return (
    <div className={`${prefix}__columns`}>
      <div className={`${prefix}__column`}>
        <Title headingLevel="h2" size="lg" className={`${prefix}__section-title`}>
          Overview
        </Title>
        <DescriptionList isCompact className={`${prefix}__dl`} aria-label="Catalog item overview">
          <DescriptionListGroup>
            <DescriptionListTerm>Service</DescriptionListTerm>
            <DescriptionListDescription>{content.service}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Status</DescriptionListTerm>
            <DescriptionListDescription>
              <Label color={content.statusColor} isCompact>
                {content.statusLabel}
              </Label>
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Rate</DescriptionListTerm>
            <DescriptionListDescription>{content.rateSummary}</DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </div>
      <div className={`${prefix}__column`}>
        <Title headingLevel="h2" size="lg" className={`${prefix}__section-title`}>
          Publishing
        </Title>
        <DescriptionList
          isCompact
          className={`${prefix}__dl`}
          aria-label="Catalog item publishing details"
        >
          <DescriptionListGroup>
            <DescriptionListTerm>Visibility</DescriptionListTerm>
            <DescriptionListDescription>
              <span className={scopeWrapClass}>
                <CatalogPublishScopeIcon scope={content.scope} className={scopeIconClass} />
                <span>{content.visibilityLabel}</span>
              </span>
            </DescriptionListDescription>
          </DescriptionListGroup>
          {publishingExtras}
          <DescriptionListGroup>
            <DescriptionListTerm>Created</DescriptionListTerm>
            <DescriptionListDescription>{content.createdAtLabel}</DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </div>
      {content.specRows.length > 0 ? (
        <div
          className={[
            `${prefix}__column`,
            `${prefix}__column--config`,
            `${prefix}__column--span-rows`,
          ].join(' ')}
        >
          <Title
            headingLevel="h2"
            size="md"
            className={`${prefix}__section-title ${prefix}__section-title--config`}
          >
            {specsSectionLabel}
          </Title>
          <DescriptionList isCompact className={`${prefix}__dl`} aria-label={specsSectionLabel}>
            {content.specRows.map((row) => (
              <DescriptionListGroup key={row.label}>
                <DescriptionListTerm>{row.label}</DescriptionListTerm>
                <DescriptionListDescription>{renderSpecRowValue(row)}</DescriptionListDescription>
              </DescriptionListGroup>
            ))}
          </DescriptionList>
        </div>
      ) : null}
    </div>
  )
}
