import { EXTERNAL_MODEL_SEED } from './externalModelSeed'
import { MODEL_SERVICE_INSTANCE_SEED } from './modelInstanceSeed'
import { VISION_ORGS, visionOrgIdForTenantSlug, type VisionOrgId } from './fleetWorld'

export type ModelInstanceLocationKind = 'on-cluster' | 'off-platform'

export interface MaaSModelIdentity {
  id: string
  modelId: string
  maasModelRefId: string
  displayName: string
  description: string
  locationKind: ModelInstanceLocationKind
  tenantId: VisionOrgId
  tenantLabel: string
  projectName: string
}

export interface MaasGovernanceModelRow extends MaaSModelIdentity {
  instanceId: string
  clusterLabel: string
  gatewayId: string | null
  subscriptionCount: number
  policyCount: number
}

const getSpecValue = (
  specRows: readonly { label: string; value: string }[] | undefined,
  label: string,
) => specRows?.find((row) => row.label === label)?.value ?? ''

const getTenantLabel = (tenantId: VisionOrgId) =>
  VISION_ORGS.find((org) => org.id === tenantId)?.label ?? tenantId

const internalModelRows: MaasGovernanceModelRow[] = MODEL_SERVICE_INSTANCE_SEED.flatMap(
  ({ tenantSlug, instance }) => {
    if (getSpecValue(instance.specRows, 'MaaS') !== 'Published') {
      return []
    }

    const tenantId = visionOrgIdForTenantSlug(tenantSlug)
    const modelId = getSpecValue(instance.specRows, 'Model ID') || instance.id
    const gatewayValue = getSpecValue(instance.specRows, 'Gateway')

    return [
      {
        id: instance.id,
        instanceId: instance.id,
        modelId,
        maasModelRefId: modelId,
        displayName: getSpecValue(instance.specRows, 'Model file') || instance.catalogItemDisplayName,
        description: instance.description ?? '',
        locationKind: 'on-cluster',
        tenantId,
        tenantLabel: getTenantLabel(tenantId),
        projectName: instance.projectName,
        clusterLabel: getSpecValue(instance.specRows, 'Cluster') || '—',
        gatewayId: gatewayValue && gatewayValue !== 'Unassigned' ? gatewayValue : null,
        subscriptionCount: 0,
        policyCount: 0,
      },
    ]
  },
)

const externalModelRows: MaasGovernanceModelRow[] = EXTERNAL_MODEL_SEED.map((model) => ({
  id: model.name,
  instanceId: model.name,
  modelId: model.name,
  maasModelRefId: model.name,
  displayName: model.displayName,
  description: model.description,
  locationKind: 'off-platform',
  tenantId: model.orgId,
  tenantLabel: getTenantLabel(model.orgId),
  projectName: model.projectName,
  clusterLabel: 'Off-platform',
  gatewayId: null,
  subscriptionCount: 0,
  policyCount: 0,
}))

/** Serving instances that are currently published through MaaS. */
export const maasGovernanceModelRows = (): MaasGovernanceModelRow[] => [
  ...internalModelRows,
  ...externalModelRows,
]

/** Unique MaaS model identities shared by governance and API key flows. */
export const maasGovernanceIdentities = (
  orgId: VisionOrgId | 'all' = 'all',
): MaaSModelIdentity[] => {
  const seen = new Set<string>()

  return maasGovernanceModelRows().filter((row) => {
    const identityKey = `${row.tenantId}:${row.maasModelRefId}`
    if ((orgId !== 'all' && row.tenantId !== orgId) || seen.has(identityKey)) {
      return false
    }
    seen.add(identityKey)
    return true
  })
}

export const apiKeyModelIdentities = maasGovernanceIdentities
