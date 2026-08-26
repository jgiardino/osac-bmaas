import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Label,
  Title,
} from '@patternfly/react-core'
import {
  getVisionGateway,
  getVisionOrg,
  getVisionPreset,
  getVisionSite,
  type VisionCluster,
  type VisionDeployment,
} from '../../../vision/fleetWorld'

type VisionClusterInspectorProps = {
  cluster: VisionCluster | null
  deployments: VisionDeployment[]
}

export const VisionClusterInspector = ({ cluster, deployments }: VisionClusterInspectorProps) => {
  if (!cluster) {
    return (
      <section className="vision-grid-panel__section" aria-labelledby="vision-cluster-inspector-title">
        <Title headingLevel="h2" size="md" id="vision-cluster-inspector-title">
          Selected cluster
        </Title>
        <p className="vision-grid-panel__hint">Select a cluster on the map to inspect it.</p>
      </section>
    )
  }

  const site = getVisionSite(cluster.siteId)
  const org = getVisionOrg(cluster.orgId)
  const gateway = getVisionGateway(cluster.gatewayId)
  const isAvailable = cluster.health === 'available'

  return (
    <section className="vision-grid-panel__section" aria-labelledby="vision-cluster-inspector-title">
      <Title headingLevel="h2" size="md" id="vision-cluster-inspector-title">
        {cluster.name}
      </Title>
      <div className="vision-cluster-inspector__status">
        <Label color={isAvailable ? 'green' : 'red'} isCompact>
          {isAvailable ? 'Available' : 'Unavailable'}
        </Label>
        <span>
          {cluster.nodesReady}/{cluster.nodeCount} nodes ready
        </span>
      </div>
      <DescriptionList isCompact aria-label={`${cluster.name} details`}>
        <DescriptionListGroup>
          <DescriptionListTerm>Site</DescriptionListTerm>
          <DescriptionListDescription>
            {site.label} · {site.regionLabel}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Platform</DescriptionListTerm>
          <DescriptionListDescription>
            {cluster.platform} · {cluster.region}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>OpenShift</DescriptionListTerm>
          <DescriptionListDescription>{cluster.openshiftVersion}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>GPUs</DescriptionListTerm>
          <DescriptionListDescription>
            {cluster.gpuCount} · {cluster.gpuUtilPercent}% utilized
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Organization</DescriptionListTerm>
          <DescriptionListDescription>{org.label}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Gateway</DescriptionListTerm>
          <DescriptionListDescription>
            {gateway.label} · {gateway.hostname}
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
      <Title headingLevel="h3" size="md" className="vision-cluster-inspector__subhead">
        Running models ({deployments.length})
      </Title>
      {deployments.length === 0 ? (
        <p className="vision-grid-panel__hint">No models running on this cluster.</p>
      ) : (
        <ul className="vision-grid-panel__list">
          {deployments.map((deployment) => {
            const preset = getVisionPreset(deployment.presetId)
            return (
              <li key={deployment.id} className="vision-grid-panel__card">
                <span className="vision-grid-panel__card-name">
                  {preset?.stableName ?? deployment.presetId}
                </span>
                <span className="vision-grid-panel__card-meta">
                  {deployment.status} · {deployment.replicas} · {deployment.reqPerMin} req/min
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
