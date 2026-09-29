import type { ReactNode } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Content,
  Flex,
  FlexItem,
  Title,
} from '@patternfly/react-core'
import { useNavigate } from 'react-router-dom'

type ResourceDetailHeaderProps = {
  parentTo: string
  parentLabel: string
  /** Preferred title field from osac-ux header. */
  resourceName?: string
  title?: string
  description?: ReactNode
  actions?: ReactNode
  status?: ReactNode
  titleAddon?: ReactNode
}

/** Stand-in for osac-ux ResourceDetailHeader (breadcrumb + title). */
export function ResourceDetailHeader({
  parentTo,
  parentLabel,
  resourceName,
  title,
  description,
  actions,
  status,
  titleAddon,
}: ResourceDetailHeaderProps) {
  const navigate = useNavigate()
  const heading = resourceName ?? title ?? 'Details'

  return (
    <div className="tenant-user-genai-resource-detail-header">
      <Breadcrumb>
        <BreadcrumbItem
          to="#"
          onClick={(event) => {
            event.preventDefault()
            navigate(parentTo)
          }}
        >
          {parentLabel}
        </BreadcrumbItem>
        <BreadcrumbItem isActive>{heading}</BreadcrumbItem>
      </Breadcrumb>
      <Flex
        alignItems={{ default: 'alignItemsFlexStart' }}
        justifyContent={{ default: 'justifyContentSpaceBetween' }}
        gap={{ default: 'gapMd' }}
        className="pf-v6-u-mt-md"
      >
        <FlexItem>
          <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
            <FlexItem>
              <Title headingLevel="h1" size="2xl">
                {heading}
              </Title>
            </FlexItem>
            {titleAddon ? <FlexItem>{titleAddon}</FlexItem> : null}
            {status ? <FlexItem>{status}</FlexItem> : null}
          </Flex>
          {description ? (
            <Content component="p" className="pf-v6-u-mt-sm pf-v6-u-text-color-subtle">
              {description}
            </Content>
          ) : null}
        </FlexItem>
        {actions ? <FlexItem>{actions}</FlexItem> : null}
      </Flex>
    </div>
  )
}

type ResourceDetailsPageErrorProps = {
  parentTo: string
  parentLabel: string
  resourceLabel: string
  variant?: string
}

export function ResourceDetailsPageError({
  parentTo,
  parentLabel,
  resourceLabel,
}: ResourceDetailsPageErrorProps) {
  const navigate = useNavigate()

  return (
    <div className="tenant-user-workspace-page">
      <Title headingLevel="h1" size="2xl">
        {resourceLabel} not found
      </Title>
      <Content component="p" className="pf-v6-u-mt-sm">
        The requested {resourceLabel} could not be found.
      </Content>
      <Button variant="link" isInline className="pf-v6-u-mt-md" onClick={() => navigate(parentTo)}>
        Back to {parentLabel}
      </Button>
    </div>
  )
}
