import type { ReactNode } from 'react'
import { Content, Flex, FlexItem, Label, Title } from '@patternfly/react-core'

type TenantUserPageChromeProps = {
  /**
   * Optional page-specific modifier (e.g. tenant-admin-maas-governance).
   * Shared chrome styles live on `tenant-genai-page`.
   */
  pageClassName?: string
  title: string
  description?: string
  children?: ReactNode
  className?: string
  /** Optional section label above the title (e.g. Networking / AI). */
  kicker?: string
  /** Optional actions aligned with the title row (catalog pattern). */
  actions?: ReactNode
}

/**
 * First-level GenAI / AI page chrome: shared `tenant-genai-page` + PF Flex md gap
 * (same spacing pattern as Catalog / Projects & teams headers).
 */
export function TenantUserPageChrome({
  pageClassName,
  title,
  description,
  children,
  className,
  kicker,
  actions,
}: TenantUserPageChromeProps) {
  return (
    <div
      className={['tenant-user-workspace-page', 'tenant-genai-page', pageClassName, className]
        .filter(Boolean)
        .join(' ')}
    >
      <Flex
        className="tenant-genai-page__page-header"
        alignItems={{ default: 'alignItemsFlexStart' }}
        justifyContent={{ default: 'justifyContentSpaceBetween' }}
        gap={{ default: 'gapMd' }}
      >
        <FlexItem>
          {kicker ? (
            <Label color="grey" className="tenant-genai-page__kicker">
              {kicker}
            </Label>
          ) : null}
          <Title headingLevel="h1" size="3xl" className="tenant-genai-page__title">
            {title}
          </Title>
          {description ? (
            <Content component="p" className="tenant-genai-page__lede">
              {description}
            </Content>
          ) : null}
        </FlexItem>
        {actions ? (
          <FlexItem alignSelf={{ default: 'alignSelfFlexStart' }}>{actions}</FlexItem>
        ) : null}
      </Flex>
      {children ? (
        <Flex
          direction={{ default: 'column' }}
          gap={{ default: 'gapMd' }}
          className="tenant-genai-page__body"
        >
          {children}
        </Flex>
      ) : null}
    </div>
  )
}
