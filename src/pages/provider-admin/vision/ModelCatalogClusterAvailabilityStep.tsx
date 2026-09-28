import {
  Content,
  Form,
  FormGroup,
  FormSection,
  Grid,
  GridItem,
  Label,
  Title,
} from '@patternfly/react-core'
import type { RegisteredOrganization } from '../../../providerAdmin/organizations'
import type { ModelSettingMode } from '../../../vision/modelAuthoringFlow'
import { CatalogTenantAccessCards } from './CatalogTenantAccessCards'
import { getModelCatalogTenantClusters } from './modelCatalogClusters'

type ModelCatalogClusterAvailabilityStepProps = {
  organizations: readonly RegisteredOrganization[]
  visibleTenantIds: readonly string[]
  eligibleClusterIds: readonly string[]
  onEligibleClusterIdsChange: (clusterIds: readonly string[]) => void
  accessMode: ModelSettingMode
  onAccessModeChange: (mode: ModelSettingMode) => void
}

const getClusterCardClassName = (isSelected: boolean) =>
  `provider-setup-template__select-card provider-setup-template__select-card--instance-type${
    isSelected ? ' provider-setup-template__select-card--selected' : ''
  }`

export function ModelCatalogClusterAvailabilityStep({
  organizations,
  visibleTenantIds,
  eligibleClusterIds,
  onEligibleClusterIdsChange,
  accessMode,
  onAccessModeChange,
}: ModelCatalogClusterAvailabilityStepProps) {
  const visibleOrganizations = organizations.filter((organization) =>
    visibleTenantIds.includes(organization.tenantId),
  )

  const toggleCluster = (clusterId: string) => {
    const next = new Set(eligibleClusterIds)
    if (next.has(clusterId)) {
      next.delete(clusterId)
    } else {
      next.add(clusterId)
    }
    onEligibleClusterIdsChange([...next])
  }

  return (
    <Form autoComplete="off" className="provider-setup-template__publish-hardware-step">
      <FormSection>
        <p>Choose tenant access and the eligible clusters for this catalog item.</p>
        <CatalogTenantAccessCards
          fieldId="model-catalog-cluster-access"
          label="Tenant access to clusters"
          mode={accessMode}
          onChange={onAccessModeChange}
        />
      </FormSection>
      <FormSection title="Clusters" titleElement="h3">
        <p>Cluster selection is per tenant.</p>
        {visibleOrganizations.map((organization) => {
          const tenantClusters = getModelCatalogTenantClusters(organization.tenantId)
          const fieldId = `model-catalog-clusters-${organization.tenantId}`

          return (
            <FormGroup
              key={organization.tenantId}
              label={organization.name}
              fieldId={fieldId}
              role="group"
              isRequired={tenantClusters.length > 0}
            >
              <Grid hasGutter>
                {tenantClusters.map((cluster) => {
                  const isSelected = eligibleClusterIds.includes(cluster.id)
                  return (
                    <GridItem key={cluster.id} span={12} md={6} lg={4}>
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={isSelected}
                        className={getClusterCardClassName(isSelected)}
                        onClick={() => toggleCluster(cluster.id)}
                      >
                        {isSelected ? (
                          <Label
                            color="grey"
                            isCompact
                            className="provider-setup-template__select-card-selected-badge"
                          >
                            Selected
                          </Label>
                        ) : null}
                        <Title
                          headingLevel="h4"
                          size="md"
                          className="provider-setup-template__select-card-title"
                        >
                          {cluster.name}
                        </Title>
                        <Content
                          component="p"
                          className="provider-setup-template__select-card-detail"
                        >
                          {cluster.region} · {cluster.platform} · {cluster.nodeCount} workers
                        </Content>
                        <Content
                          component="p"
                          className="provider-setup-template__select-card-accelerator"
                        >
                          {cluster.gpuCount} GPUs
                        </Content>
                      </button>
                    </GridItem>
                  )
                })}
              </Grid>
            </FormGroup>
          )
        })}
      </FormSection>
    </Form>
  )
}
