import type { ReactNode } from 'react'
import { Content, Title } from '@patternfly/react-core'

type TenantUserPageChromeProps = {
  /** BEM block, e.g. tenant-user-ai-asset-endpoints */
  pageClassName: string
  title: string
  description?: string
  children?: ReactNode
  className?: string
  /** Optional actions aligned with the title row (catalog pattern). */
  actions?: ReactNode
}

/**
 * First-level Tenant User / Admin page chrome matching Catalog / Services / Activity log:
 * page root → page-header (title + lede) → body.
 */
export function TenantUserPageChrome({
  pageClassName,
  title,
  description,
  children,
  className,
  actions,
}: TenantUserPageChromeProps) {
  return (
    <div
      className={['tenant-user-workspace-page', pageClassName, className].filter(Boolean).join(' ')}
    >
      <div className={`${pageClassName}__page-header`}>
        <div className={`${pageClassName}__page-header-main`}>
          <Title headingLevel="h1" size="3xl" className={`${pageClassName}__title`}>
            {title}
          </Title>
          {description ? (
            <Content component="p" className={`${pageClassName}__lede`}>
              {description}
            </Content>
          ) : null}
        </div>
        {actions ? <div className={`${pageClassName}__page-header-actions`}>{actions}</div> : null}
      </div>
      {children ? <div className={`${pageClassName}__body`}>{children}</div> : null}
    </div>
  )
}
