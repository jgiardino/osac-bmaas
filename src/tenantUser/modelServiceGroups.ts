import type { TenantInstance } from './instances'

export interface ModelServiceGroup {
  modelId: string
  displayName: string
  catalogItemDisplayName: string
  instances: TenantInstance[]
}

const getInstanceRowValue = (instance: TenantInstance, label: string): string | undefined =>
  instance.specRows?.find((row) => row.label === label)?.value

export const groupModelServiceInstances = (
  instances: readonly TenantInstance[],
): ModelServiceGroup[] => {
  const groups = new Map<string, ModelServiceGroup>()

  instances.forEach((instance) => {
    const modelId = getInstanceRowValue(instance, 'Model ID') ?? instance.name
    const group = groups.get(modelId)

    if (group) {
      group.instances.push(instance)
      return
    }

    groups.set(modelId, {
      modelId,
      displayName: getInstanceRowValue(instance, 'Model file') ?? instance.name,
      catalogItemDisplayName: instance.catalogItemDisplayName,
      instances: [instance],
    })
  })

  return Array.from(groups.values())
}

export const getModelServiceInstanceRowValue = getInstanceRowValue
