export type DemoTenantId = 'northsummit' | 'evergreen'

export const DEMO_TENANT_LABEL: Record<DemoTenantId, string> = {
  northsummit: 'north-summit-bank',
  evergreen: 'bluesolace-financial-group',
}

/** Pre-Kubernetes-convention organization display names — matched when migrating stored orgs. */
export const LEGACY_DEMO_TENANT_LABEL: Record<DemoTenantId, string> = {
  northsummit: 'North Summit Bank',
  evergreen: 'BlueSolace Financial Group',
}

export function isDemoTenantId(value: string): value is DemoTenantId {
  return value === 'northsummit' || value === 'evergreen'
}

export const DEMO_VERTEXA_PROVIDER_LOGIN_EMAIL = 'alex.johnson@vertexacloud.com'

export const DEMO_TENANT_LOGIN_EMAIL_USER: Record<DemoTenantId, string> = {
  northsummit: 'cmorgan@northsummitbank.com',
  evergreen: 'ecruz@bluesolacefinancial.com',
}

export const DEMO_TENANT_LOGIN_EMAIL_ADMIN: Record<DemoTenantId, string> = {
  northsummit: 'pnair@northsummitbank.com',
  evergreen: 'marcus.chen@bluesolacefinancial.com',
}

/** Signed-in display name for tenant admin console (masthead; demo). */
export const DEMO_TENANT_DISPLAY_ADMIN: Record<DemoTenantId, string> = {
  northsummit: 'Priya Nair',
  evergreen: 'Marcus Chen',
}

/** Signed-in display name for tenant user workspace (masthead; demo). */
export const DEMO_TENANT_DISPLAY_USER: Record<DemoTenantId, string> = {
  northsummit: 'Chris Morgan',
  evergreen: 'Emerson Cruz',
}

export const DEMO_LOGIN_PREFILLED_PASSWORD = '*****************'

export const DEMO_PROVIDER_USERNAME = 'ajohnson'

export const DEMO_TENANT_USERNAME_USER: Record<DemoTenantId, string> = {
  northsummit: 'cmorgan',
  evergreen: 'ecruz',
}

export const DEMO_TENANT_USERNAME_ADMIN: Record<DemoTenantId, string> = {
  northsummit: 'pnair',
  evergreen: 'marcuschen',
}

export const demoUsernameFromPathname = (pathname: string): string => {
  if (pathname.startsWith('/provider')) {
    return DEMO_PROVIDER_USERNAME
  }
  const adminMatch = pathname.match(/^\/tenant-admin\/([^/]+)/)
  if (adminMatch && isDemoTenantId(adminMatch[1])) {
    return DEMO_TENANT_USERNAME_ADMIN[adminMatch[1]]
  }
  const userMatch = pathname.match(/^\/tenant-user\/([^/]+)/)
  if (userMatch && isDemoTenantId(userMatch[1])) {
    return DEMO_TENANT_USERNAME_USER[userMatch[1]]
  }
  return DEMO_PROVIDER_USERNAME
}
