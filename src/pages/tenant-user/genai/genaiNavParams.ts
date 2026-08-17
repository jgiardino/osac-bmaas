/** Clear GenAI API keys drill-in query params (key/subscription details). GenAI-only helper. */
export const GENAI_API_KEYS_DETAIL_PARAMS = [
  'keyId',
  'subscriptionId',
  'subTab',
  'tab',
  'modal',
] as const

export function clearGenaiApiKeysDetailParams(params: URLSearchParams): void {
  for (const key of GENAI_API_KEYS_DETAIL_PARAMS) {
    params.delete(key)
  }
}
