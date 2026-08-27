import { useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  Content,
  Label,
  SearchInput,
  Stack,
  StackItem,
} from '@patternfly/react-core'
import type { CatalogSpecRow } from '../../../catalog/catalogSpecs'
import {
  getVisionOrg,
  getVisionPreset,
  getVisionSite,
  type VisionCluster,
  type VisionDeployment,
} from '../../../vision/fleetWorld'
import {
  toggleVisionAccordion,
  type VisionDrawerSelection,
  type VisionGridAccordionSection,
} from '../../../vision/visionDrawer'
import { VisionClusterInspector } from './VisionClusterInspector'
import { VisionGridDrawerCard } from './VisionGridDrawerCard'
import { VisionServiceModelInspector } from './VisionServiceModelInspector'

type VisionGridServicesTabProps = {
  mode: 'list' | 'detail'
  selection: VisionDrawerSelection
  highlight: VisionDrawerSelection
  selectedCluster: VisionCluster | null
  clusterDeployments: VisionDeployment[]
  deployments: VisionDeployment[]
  clusters: VisionCluster[]
  openSection: VisionGridAccordionSection | null
  onOpenSection: (section: VisionGridAccordionSection | null) => void
  onHighlightCluster: (clusterId: string) => void
  onHighlightDeployment: (deploymentId: string) => void
  onViewCluster: (clusterId: string) => void
  onViewDeployment: (deploymentId: string) => void
}

const clusterSpecRows = (cluster: VisionCluster): CatalogSpecRow[] => [
  { label: 'Cluster version', value: cluster.openshiftVersion },
  { label: 'Platform', value: `${cluster.platform} · ${cluster.region}` },
  { label: 'Host type', value: cluster.gpuCount > 0 ? 'GPU' : 'CPU' },
]

const deploymentSpecRows = (
  deployment: VisionDeployment,
  clusterName: string,
  stableName: string,
): CatalogSpecRow[] => [
  { label: 'Model', value: stableName },
  { label: 'Size', value: deployment.replicas },
  { label: 'Cluster', value: clusterName },
]

export const VisionGridServicesTab = ({
  mode,
  selection,
  highlight,
  selectedCluster,
  clusterDeployments,
  deployments,
  clusters,
  openSection,
  onOpenSection,
  onHighlightCluster,
  onHighlightDeployment,
  onViewCluster,
  onViewDeployment,
}: VisionGridServicesTabProps) => {
  const [search, setSearch] = useState('')

  if (mode === 'detail') {
    if (selection.kind === 'cluster') {
      return (
        <VisionClusterInspector
          cluster={selectedCluster}
          deployments={clusterDeployments}
          highlight={highlight}
          onHighlightDeployment={onHighlightDeployment}
          onViewDeployment={onViewDeployment}
        />
      )
    }
    if (selection.kind === 'deployment') {
      return (
        <VisionServiceModelInspector
          deploymentId={selection.deploymentId}
          deployments={deployments}
          clusters={clusters}
          highlight={highlight}
          onHighlightDeployment={onHighlightDeployment}
          onViewCluster={onViewCluster}
          onViewDeployment={onViewDeployment}
        />
      )
    }
    if (selection.kind === 'preset') {
      const first = deployments.find((deployment) => deployment.presetId === selection.presetId)
      if (first) {
        return (
          <VisionServiceModelInspector
            deploymentId={first.id}
            deployments={deployments}
            clusters={clusters}
            highlight={highlight}
            onHighlightDeployment={onHighlightDeployment}
            onViewCluster={onViewCluster}
            onViewDeployment={onViewDeployment}
          />
        )
      }
    }
    return (
      <Content component="p">This service is not available in the current filter.</Content>
    )
  }

  const query = search.trim().toLowerCase()
  const matches = (value: string) => !query || value.toLowerCase().includes(query)
  const visibleClusters = clusters.filter((cluster) => {
    const site = getVisionSite(cluster.siteId)
    const org = getVisionOrg(cluster.orgId)
    return matches(cluster.name) || matches(site.regionLabel) || matches(org.label)
  })
  const visibleDeployments = deployments.filter((deployment) => {
    const cluster = clusters.find((entry) => entry.id === deployment.clusterId)
    const preset = getVisionPreset(deployment.presetId)
    const org = getVisionOrg(deployment.orgId)
    return (
      matches(preset?.stableName ?? '') ||
      matches(preset?.displayName ?? '') ||
      matches(cluster?.name ?? '') ||
      matches(org.label)
    )
  })

  return (
    <Stack hasGutter>
      <StackItem>
        <Content component="p">Monitor and manage services across the grid.</Content>
      </StackItem>
      <StackItem>
        <SearchInput
          id="vision-services-search"
          placeholder="Search instances"
          value={search}
          onChange={(_event, value) => setSearch(value)}
          onClear={() => setSearch('')}
          aria-label="Search instances"
        />
      </StackItem>
      <StackItem>
        <Accordion headingLevel="h2" id="vision-services-accordion">
          <AccordionItem isExpanded={openSection === 'clusters'}>
            <AccordionToggle
              id="vision-services-clusters-toggle"
              onClick={() => onOpenSection(toggleVisionAccordion(openSection, 'clusters'))}
            >
              Clusters
            </AccordionToggle>
            <AccordionContent id="vision-services-clusters-content">
              <Stack hasGutter>
                {visibleClusters.length === 0 ? (
                  <StackItem>
                    <Content component="p">No clusters in the current filter.</Content>
                  </StackItem>
                ) : (
                  visibleClusters.map((cluster) => {
                    const site = getVisionSite(cluster.siteId)
                    const org = getVisionOrg(cluster.orgId)
                    const isAvailable = cluster.health === 'available'
                    return (
                      <StackItem key={cluster.id}>
                        <VisionGridDrawerCard
                          id={`vision-service-cluster-${cluster.id}`}
                          name={cluster.name}
                          secondary={site.regionLabel}
                          specRows={clusterSpecRows(cluster)}
                          footerRows={[{ label: 'Tenant', value: org.label }]}
                          isSelected={
                            highlight.kind === 'cluster' && highlight.clusterId === cluster.id
                          }
                          onSelect={() => onHighlightCluster(cluster.id)}
                          onViewDetails={() => onViewCluster(cluster.id)}
                          badge={
                            <Label color={isAvailable ? 'green' : 'red'} isCompact>
                              {isAvailable ? 'Available' : 'Unavailable'}
                            </Label>
                          }
                        />
                      </StackItem>
                    )
                  })
                )}
              </Stack>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem isExpanded={openSection === 'models'}>
            <AccordionToggle
              id="vision-services-models-toggle"
              onClick={() => onOpenSection(toggleVisionAccordion(openSection, 'models'))}
            >
              Models
            </AccordionToggle>
            <AccordionContent id="vision-services-models-content">
              <Stack hasGutter>
                {visibleDeployments.length === 0 ? (
                  <StackItem>
                    <Content component="p">No model instances running in the current filter.</Content>
                  </StackItem>
                ) : (
                  visibleDeployments.map((deployment) => {
                    const cluster = clusters.find((entry) => entry.id === deployment.clusterId)
                    const org = getVisionOrg(deployment.orgId)
                    const preset = getVisionPreset(deployment.presetId)
                    const stableName = preset?.stableName ?? deployment.presetId
                    return (
                      <StackItem key={deployment.id}>
                        <VisionGridDrawerCard
                          id={`vision-service-model-${deployment.id}`}
                          name={`${stableName} on ${cluster?.name ?? deployment.clusterId}`}
                          secondary={preset?.displayName}
                          specRows={deploymentSpecRows(
                            deployment,
                            cluster?.name ?? deployment.clusterId,
                            stableName,
                          )}
                          footerRows={[{ label: 'Tenant', value: org.label }]}
                          isSelected={
                            highlight.kind === 'deployment' &&
                            highlight.deploymentId === deployment.id
                          }
                          onSelect={() => onHighlightDeployment(deployment.id)}
                          onViewDetails={() => onViewDeployment(deployment.id)}
                          badge={
                            <Label color="green" isCompact>
                              {deployment.status}
                            </Label>
                          }
                        />
                      </StackItem>
                    )
                  })
                )}
              </Stack>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </StackItem>
    </Stack>
  )
}
