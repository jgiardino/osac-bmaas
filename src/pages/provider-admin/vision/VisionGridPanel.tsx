import { Button, Label, Title } from '@patternfly/react-core'
import {
  VISION_CLUSTER_OFFERINGS,
  VISION_MODEL_PRESETS,
  getVisionOrg,
  type VisionCluster,
  type VisionDeployment,
} from '../../../vision/fleetWorld'
import { VisionClusterInspector } from './VisionClusterInspector'

type VisionGridPanelProps = {
  selectedPresetId: string | null
  selectedOfferingId: string | null
  selectedCluster: VisionCluster | null
  deployments: VisionDeployment[]
  clusterDeployments: VisionDeployment[]
  clusters: VisionCluster[]
  onSelectPreset: (presetId: string) => void
  onSelectOffering: (offeringId: string) => void
  onPlacePreset: (presetId: string) => void
  onAddOffering: (offeringId: string) => void
  onOpenCatalogPreset: (catalogItemId: string) => void
}

export const VisionGridPanel = ({
  selectedPresetId,
  selectedOfferingId,
  selectedCluster,
  deployments,
  clusterDeployments,
  clusters,
  onSelectPreset,
  onSelectOffering,
  onPlacePreset,
  onAddOffering,
  onOpenCatalogPreset,
}: VisionGridPanelProps) => {
  const deployedByPreset = VISION_MODEL_PRESETS.map((preset) => {
    const placed = deployments.filter((deployment) => deployment.presetId === preset.id)
    return { preset, placed }
  }).filter((entry) => entry.placed.length > 0)

  return (
    <div className="vision-grid-panel">
      <section className="vision-grid-panel__section" aria-labelledby="vision-presets-title">
        <Title headingLevel="h2" size="md" id="vision-presets-title">
          Model presets
        </Title>
        <p className="vision-grid-panel__hint">
          Select a preset to highlight its clusters. Use Place to choose where it runs.
        </p>
        <ul className="vision-grid-panel__list">
          {VISION_MODEL_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id
            return (
              <li key={preset.id}>
                <div
                  className={[
                    'vision-grid-panel__card',
                    'vision-grid-panel__card--action',
                    isSelected ? 'vision-grid-panel__card--selected' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <button
                    type="button"
                    className="vision-grid-panel__card-button"
                    aria-pressed={isSelected}
                    onClick={() => onSelectPreset(preset.id)}
                  >
                    <span className="vision-grid-panel__card-name">{preset.displayName}</span>
                    <span className="vision-grid-panel__card-meta">
                      {preset.stableName} · {preset.gpuRequirement}
                    </span>
                  </button>
                  <div className="vision-grid-panel__card-actions">
                    <Button variant="secondary" size="sm" onClick={() => onPlacePreset(preset.id)}>
                      Place
                    </Button>
                    {preset.catalogItemId ? (
                      <Button
                        variant="link"
                        isInline
                        size="sm"
                        onClick={() => onOpenCatalogPreset(preset.catalogItemId as string)}
                      >
                        Catalog
                      </Button>
                    ) : null}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="vision-grid-panel__section" aria-labelledby="vision-offerings-title">
        <Title headingLevel="h2" size="md" id="vision-offerings-title">
          Cluster offerings
        </Title>
        <p className="vision-grid-panel__hint">Spin up the clusters models will run on.</p>
        <ul className="vision-grid-panel__list">
          {VISION_CLUSTER_OFFERINGS.map((offering) => {
            const isSelected = selectedOfferingId === offering.id
            return (
              <li key={offering.id}>
                <div
                  className={[
                    'vision-grid-panel__card',
                    'vision-grid-panel__card--action',
                    isSelected ? 'vision-grid-panel__card--selected' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <button
                    type="button"
                    className="vision-grid-panel__card-button"
                    aria-pressed={isSelected}
                    onClick={() => onSelectOffering(offering.id)}
                  >
                    <span className="vision-grid-panel__card-name">{offering.name}</span>
                    <span className="vision-grid-panel__card-meta">{offering.summary}</span>
                  </button>
                  <div className="vision-grid-panel__card-actions">
                    <Button variant="secondary" size="sm" onClick={() => onAddOffering(offering.id)}>
                      Add cluster
                    </Button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="vision-grid-panel__section" aria-labelledby="vision-deployed-title">
        <Title headingLevel="h2" size="md" id="vision-deployed-title">
          Deployed on the grid
        </Title>
        {deployedByPreset.length === 0 ? (
          <p className="vision-grid-panel__hint">No models placed in the current filter.</p>
        ) : (
          <ul className="vision-grid-panel__list">
            {deployedByPreset.map(({ preset, placed }) => {
              const clusterNames = placed
                .map((deployment) => clusters.find((cluster) => cluster.id === deployment.clusterId)?.name)
                .filter(Boolean)
                .join(', ')
              const orgLabel = getVisionOrg(placed[0].orgId).label
              return (
                <li key={preset.id} className="vision-grid-panel__card">
                  <span className="vision-grid-panel__card-name">{preset.stableName}</span>
                  <span className="vision-grid-panel__card-meta">
                    {orgLabel} · {clusterNames}
                  </span>
                  <Label color="green" isCompact>
                    {placed.length} cluster{placed.length === 1 ? '' : 's'}
                  </Label>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <VisionClusterInspector cluster={selectedCluster} deployments={clusterDeployments} />
    </div>
  )
}
