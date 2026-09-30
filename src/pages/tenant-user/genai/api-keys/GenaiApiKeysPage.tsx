import { useSearchParams } from 'react-router-dom'

import { APIKeyDetailsV34 } from './APIKeyDetailsV34'
import { APIKeysV34 } from './APIKeysV34'
import { ApiKeysSurfaceProvider, type ApiKeysSurface } from './stubs'
import { SubscriptionDetails } from './subscriptions'

type GenaiApiKeysPageProps = {
  surface?: ApiKeysSurface
  /** Section label above the title (e.g. AI for admin API keys). */
  kicker?: string
}

/**
 * GenAI API keys list + key/subscription details via ?keyId / ?subscriptionId
 * while staying on nav=genai-api-keys or nav=ai-admin-api-keys.
 */
export function GenaiApiKeysPage({ surface = 'tenant-user', kicker }: GenaiApiKeysPageProps) {
  const [searchParams] = useSearchParams()
  const keyId = searchParams.get('keyId')
  const subscriptionId = searchParams.get('subscriptionId')

  let content = <APIKeysV34 kicker={kicker} />
  if (keyId) {
    content = <APIKeyDetailsV34 />
  } else if (subscriptionId) {
    content = <SubscriptionDetails />
  }

  return <ApiKeysSurfaceProvider surface={surface}>{content}</ApiKeysSurfaceProvider>
}
