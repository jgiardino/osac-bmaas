import { Content, Grid, GridItem, Stack, StackItem, Title } from '@patternfly/react-core'
import { ModelsInstanceCard } from '../../../components/catalog/ModelsInstanceCard'
import { VISION_GATEWAYS, createInitialClusters } from '../../../vision/fleetWorld'
import {
  MODEL_INSTANCE_SEED,
  modelsOnCluster,
  modelsOnGateway,
} from '../../../vision/modelInstanceSeed'
import { VisionGridClusterCard } from './VisionGridClusterCard'
import { VisionGridGatewayCard } from './VisionGridGatewayCard'

const SAMPLE_CLUSTER_ID = 'ocp-us-east-1'
const SAMPLE_GATEWAY_ID = 'nsb-markets'
const SAMPLE_MODEL_ID = 'inst-granite-east'

const noop = () => undefined

export const VisionGridObjectCardPatterns = () => {
  const clusters = createInitialClusters()
  const cluster = clusters.find((entry) => entry.id === SAMPLE_CLUSTER_ID)
  const gateway = VISION_GATEWAYS.find((entry) => entry.id === SAMPLE_GATEWAY_ID)
  const model = MODEL_INSTANCE_SEED.find((entry) => entry.id === SAMPLE_MODEL_ID)
  const gatewayModelCount = modelsOnGateway(SAMPLE_GATEWAY_ID).length
  const clusterModelCount = modelsOnCluster(SAMPLE_CLUSTER_ID).length

  return (
    <Stack hasGutter>
      <StackItem>
        <Title headingLevel="h2" size="lg">
          AI Grid compact cards
        </Title>
        <Content component="p">
          Cluster and Model use the same compact chrome: service icon inline with the
          title and secondary line, status and kebab in the header, spec rows, then
          Project in the footer. Tenant, MaaS, Gateway, and Created are omitted because
          AI Grid views one tenant at a time and every model is MaaS. Model cards match
          Services → Models (Internal or External, Served on). Individual instances add
          Weight. Nested lists omit the parent object’s spec.
        </Content>
      </StackItem>
      <StackItem>
        <Title headingLevel="h3" size="md">
          Services list
        </Title>
        <Content component="p">
          Same width as the AI Grid Services drawer. This cluster has {clusterModelCount} models.
          This gateway has {gatewayModelCount} models.
        </Content>
      </StackItem>
      <StackItem>
        <Grid hasGutter id="vision-patterns-ai-grid-cards">
          <GridItem span={12} md={4}>
            <Title headingLevel="h3" size="md">
              Cluster
            </Title>
            {cluster ? (
              <VisionGridClusterCard
                id="pattern-ai-grid-cluster"
                cluster={cluster}
                isSelected={false}
                onSelect={noop}
                onViewDetails={noop}
              />
            ) : null}
          </GridItem>
          <GridItem span={12} md={4}>
            <Title headingLevel="h3" size="md">
              Gateway
            </Title>
            {gateway ? (
              <VisionGridGatewayCard
                id="pattern-ai-grid-gateway"
                gateway={gateway}
                clusters={clusters}
                modelCount={gatewayModelCount}
                isSelected={false}
                onSelect={noop}
                onViewDetails={noop}
              />
            ) : null}
          </GridItem>
          <GridItem span={12} md={4}>
            <Title headingLevel="h3" size="md">
              Model
            </Title>
            {model ? (
              <ModelsInstanceCard
                item={model}
                variant="compact"
                parent="none"
                idPrefix="pattern-ai-grid-model"
              />
            ) : null}
          </GridItem>
        </Grid>
      </StackItem>
      <StackItem>
        <Title headingLevel="h3" size="md">
          Nested on a cluster
        </Title>
        <Content component="p">
          Model omits Cluster (already implied by the parent). Gateway is not shown on
          model cards.
        </Content>
      </StackItem>
      <StackItem>
        <Grid hasGutter id="vision-patterns-ai-grid-cards-nested-cluster">
          <GridItem span={12} md={4}>
            <Title headingLevel="h3" size="md">
              Cluster
            </Title>
            <Content component="p">Parent list — not shown in the nested drawer.</Content>
          </GridItem>
          <GridItem span={12} md={4}>
            <Title headingLevel="h3" size="md">
              Gateway
            </Title>
            {gateway ? (
              <VisionGridGatewayCard
                id="pattern-ai-grid-gateway-nested-cluster"
                gateway={gateway}
                clusters={clusters}
                modelCount={gatewayModelCount}
                includeCluster={false}
                isSelected={false}
                onSelect={noop}
                onViewDetails={noop}
              />
            ) : null}
          </GridItem>
          <GridItem span={12} md={4}>
            <Title headingLevel="h3" size="md">
              Model
            </Title>
            {model ? (
              <ModelsInstanceCard
                item={model}
                variant="compact"
                parent="cluster"
                idPrefix="pattern-ai-grid-model-nested-cluster"
              />
            ) : null}
          </GridItem>
        </Grid>
      </StackItem>
      <StackItem>
        <Title headingLevel="h3" size="md">
          Nested on a gateway
        </Title>
        <Content component="p">
          Model omits Gateway. Served on and Internal stay; Weight is for drill-in
          instances of the same model.
        </Content>
      </StackItem>
      <StackItem>
        <Grid hasGutter id="vision-patterns-ai-grid-cards-nested-gateway">
          <GridItem span={12} md={4}>
            <Title headingLevel="h3" size="md">
              Cluster
            </Title>
            <Content component="p">Parent list — not shown in the nested drawer.</Content>
          </GridItem>
          <GridItem span={12} md={4}>
            <Title headingLevel="h3" size="md">
              Gateway
            </Title>
            <Content component="p">Parent list — not shown in the nested drawer.</Content>
          </GridItem>
          <GridItem span={12} md={4}>
            <Title headingLevel="h3" size="md">
              Model
            </Title>
            {model ? (
              <ModelsInstanceCard
                item={model}
                variant="compact"
                parent="gateway"
                idPrefix="pattern-ai-grid-model-nested-gateway"
              />
            ) : null}
          </GridItem>
        </Grid>
      </StackItem>
    </Stack>
  )
}
