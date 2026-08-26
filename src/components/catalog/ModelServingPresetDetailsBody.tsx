import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Label,
  Title,
} from '@patternfly/react-core'
import type { ReactNode } from 'react'
import { CatalogPublishScopeIcon } from '../provider-admin/CatalogPublishScopeIcon'
import type { PublishCatalogScope } from '../../providerSetup/templateDemo'
import { GRANITE_3B_STABLE_NAME } from '../../vision/modelFleet'

export type ModelServingPresetDetailsContent = {
  service: string
  statusLabel: string
  statusColor: 'green' | 'grey' | 'blue'
  rateSummary: string
  scope: PublishCatalogScope
  visibilityLabel: string
  createdAtLabel: string
  stableModelName: string
  servingSize: string
  artifact: string
}

type ModelServingPresetDetailsBodyProps = {
  content: ModelServingPresetDetailsContent
  publishingExtras?: ReactNode
}

export const ModelServingPresetDetailsBody = ({
  content,
  publishingExtras,
}: ModelServingPresetDetailsBodyProps) => {
  return (
    <div className="provider-admin-catalog-item-details__columns">
      <div className="provider-admin-catalog-item-details__column">
        <Title
          headingLevel="h2"
          size="lg"
          className="provider-admin-catalog-item-details__section-title"
        >
          Model serving preset
        </Title>
        <DescriptionList
          isCompact
          className="provider-admin-catalog-item-details__dl"
          aria-label="Model serving preset details"
        >
          <DescriptionListGroup>
            <DescriptionListTerm>Kind</DescriptionListTerm>
            <DescriptionListDescription>
              OSAC catalog service item for a model — predefined serving config, not a VM or
              bare-metal SKU.
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Stable model name</DescriptionListTerm>
            <DescriptionListDescription>{content.stableModelName}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Artifact</DescriptionListTerm>
            <DescriptionListDescription>{content.artifact}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Serving defaults</DescriptionListTerm>
            <DescriptionListDescription>{content.servingSize}</DescriptionListDescription>
          </DescriptionListGroup>
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
      <div className="provider-admin-catalog-item-details__column">
        <Title
          headingLevel="h2"
          size="lg"
          className="provider-admin-catalog-item-details__section-title"
        >
          Publishing
        </Title>
        <DescriptionList
          isCompact
          className="provider-admin-catalog-item-details__dl"
          aria-label="Catalog item publishing details"
        >
          <DescriptionListGroup>
            <DescriptionListTerm>Visibility</DescriptionListTerm>
            <DescriptionListDescription>
              <span className="provider-admin-catalog-items__scope">
                <CatalogPublishScopeIcon
                  scope={content.scope}
                  className="provider-admin-catalog__scope-icon"
                />
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
        <p className="provider-admin-catalog-item-details__lede">
          Place this preset on the AI Grid to instantiate {GRANITE_3B_STABLE_NAME} at selected
          sites. A serving specialist authored these defaults; the Provider Admin does not design
          the SKU on the map.
        </p>
      </div>
    </div>
  )
}
