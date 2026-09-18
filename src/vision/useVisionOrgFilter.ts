import { useCallback } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'

import { VISION_ORGS, type VisionOrgId } from './fleetWorld'
import { visionOrgFilterFromPathname } from './modelInstanceSeed'

export const VISION_ORG_SEARCH_PARAM = 'org'

const isVisionOrgId = (value: string | null): value is VisionOrgId =>
  VISION_ORGS.some((org) => org.id === value)

/**
 * One tenant at a time, matching MaaS governance / AI Grid.
 * Platform admin: `?org=` (defaults to North Summit Bank).
 * Tenant workspaces: locked to the workspace tenant.
 */
export const useVisionOrgFilter = () => {
  const { pathname } = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const isPlatformAdmin = pathname.startsWith('/provider')
  const pathOrg = visionOrgFilterFromPathname(pathname)
  const paramOrg = searchParams.get(VISION_ORG_SEARCH_PARAM)
  const orgId: VisionOrgId = isPlatformAdmin
    ? isVisionOrgId(paramOrg)
      ? paramOrg
      : 'nsb'
    : pathOrg === 'all'
      ? 'nsb'
      : pathOrg

  const setOrgId = useCallback(
    (nextOrgId: VisionOrgId) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current)
          next.set(VISION_ORG_SEARCH_PARAM, nextOrgId)
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  return { orgId, setOrgId, isPlatformAdmin, showTenantSelect: isPlatformAdmin }
}
