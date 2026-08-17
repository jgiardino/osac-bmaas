import type { ReactNode } from 'react'

import { TenantUserPageChrome } from '../TenantUserPageChrome'

/** Stand-in for osac-ux ListPage — first-level tenant page chrome. */
export function ListPage({
  title,
  description,
  children,
  className,
}: {
  title: string
  description?: string
  children?: ReactNode
  className?: string
}) {
  return (
    <TenantUserPageChrome
      pageClassName="tenant-user-genai-api-keys"
      title={title}
      description={description}
      className={className}
    >
      {children}
    </TenantUserPageChrome>
  )
}

export default ListPage
