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

/** MaaS governance drill-in / wizard query params (Tenant Admin AI). */
export const MAAS_GOVERNANCE_DETAIL_PARAMS = [
  'maasWizard',
  'maasSubId',
  'maasPolId',
  'edit',
  'prefillModel',
  'prefillGroup',
  'from',
  'view',
  'tab',
] as const

export function clearMaasGovernanceDetailParams(params: URLSearchParams): void {
  for (const key of MAAS_GOVERNANCE_DETAIL_PARAMS) {
    params.delete(key)
  }
}

export function isGenaiApiKeysNavId(navId: string): boolean {
  return navId === 'genai-api-keys' || navId === 'ai-admin-api-keys'
}
