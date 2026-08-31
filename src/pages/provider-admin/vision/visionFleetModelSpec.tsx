import type { ReactNode } from 'react'
import type { CatalogSpecRow } from '../../../catalog/catalogSpecs'
import { VisionGridClusterIdLabel } from './VisionGridClusterIdLabel'

export type VisionFleetSpecNode = {
  label: string
  value: ReactNode
}

export type VisionClusterPresentation = 'text' | 'label'

export const visionFleetModelSpecRows = ({
  clusterName,
  size,
  servedBy,
  includeCluster = true,
}: {
  clusterName: string
  size?: string
  servedBy?: string
  includeCluster?: boolean
}): CatalogSpecRow[] => {
  const rows: CatalogSpecRow[] = []
  if (size) {
    rows.push({ label: 'Size', value: size })
  }
  if (servedBy) {
    rows.push({ label: 'Served by', value: servedBy })
  }
  if (includeCluster) {
    rows.push({ label: 'Cluster', value: clusterName })
  }
  return rows
}

export const visionFleetSpecNodes = (
  rows: CatalogSpecRow[],
  {
    clusterPresentation = 'label',
    clusterVariant = 'outline',
    idPrefix,
  }: {
    clusterPresentation?: VisionClusterPresentation
    clusterVariant?: 'outline' | 'filled'
    idPrefix: string
  },
): VisionFleetSpecNode[] =>
  rows.map((row) => ({
    label: row.label,
    value:
      row.label === 'Cluster' && clusterPresentation === 'label' ? (
        <VisionGridClusterIdLabel
          id={`${idPrefix}-cluster`}
          clusterId={row.value}
          variant={clusterVariant}
        />
      ) : (
        row.value
      ),
  }))

export const visionFleetModelSpecNodes = ({
  idPrefix,
  clusterPresentation = 'label',
  clusterVariant = 'outline',
  ...rowOptions
}: {
  clusterName: string
  size?: string
  servedBy?: string
  includeCluster?: boolean
  idPrefix: string
  clusterPresentation?: VisionClusterPresentation
  clusterVariant?: 'outline' | 'filled'
}): VisionFleetSpecNode[] =>
  visionFleetSpecNodes(visionFleetModelSpecRows(rowOptions), {
    clusterPresentation,
    clusterVariant,
    idPrefix,
  })
