import { useCallback } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'

import { useApiKeysSurface } from './stubs'

/**
 * Ethan workspace uses ?nav= + detail query params (not /genai/... routes).
 * Keep the selected API keys menu item and layer details query params over it.
 */
export function useApiKeysPaths() {
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const surface = useApiKeysSurface()
  const isAdmin = surface === 'tenant-admin'

  const withApiKeysNav = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const next = new URLSearchParams(searchParams)
      next.set('nav', isAdmin ? 'admin-api-keys' : 'api-keys')
      mutate(next)
      return `${pathname}?${next.toString()}`
    },
    [isAdmin, pathname, searchParams],
  )

  const listPath = withApiKeysNav((next) => {
    next.delete('keyId')
    next.delete('subscriptionId')
    next.delete('subTab')
    next.delete('tab')
    next.delete('modal')
  })

  const subscriptionsListPath = withApiKeysNav((next) => {
    next.delete('keyId')
    next.delete('subscriptionId')
    next.delete('subTab')
    next.delete('modal')
    next.set('tab', 'subscriptions')
  })

  return {
    isAdmin,
    listPath,
    subscriptionsListPath,
    keyDetailsPath: (keyId: string) =>
      withApiKeysNav((next) => {
        next.set('keyId', keyId)
        next.delete('subscriptionId')
        next.delete('subTab')
        next.delete('tab')
        next.delete('modal')
      }),
    subscriptionDetailsPath: (subscriptionId: string, tab?: string) =>
      withApiKeysNav((next) => {
        next.set('subscriptionId', subscriptionId)
        next.delete('keyId')
        next.delete('modal')
        next.set('tab', 'subscriptions')
        if (tab) {
          next.set('subTab', tab)
        } else {
          next.delete('subTab')
        }
      }),
  }
}

export type { ApiKeysSurface } from './stubs'
