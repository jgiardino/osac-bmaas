import { useCallback } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'

import { useApiKeysSurface } from './stubs'

/**
 * Ethan workspace uses ?nav= + detail query params (not /genai/... routes).
 * Keep nav=genai-api-keys and layer keyId / subscriptionId / tab / subTab / modal.
 */
export function useApiKeysPaths() {
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const surface = useApiKeysSurface()
  const isAdmin = surface === 'tenant-admin'
  const currentNav = searchParams.get('nav')
  const apiKeysNavId =
    currentNav === 'admin-api-keys' || currentNav === 'ai-admin-api-keys'
      ? currentNav
      : currentNav === 'api-keys' || currentNav === 'genai-api-keys'
        ? currentNav
        : isAdmin
          ? 'admin-api-keys'
          : 'genai-api-keys'

  const withApiKeysNav = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const next = new URLSearchParams(searchParams)
      next.set('nav', apiKeysNavId)
      mutate(next)
      return `${pathname}?${next.toString()}`
    },
    [apiKeysNavId, pathname, searchParams],
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
