import { useState } from 'react'
import {
  Content,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Stack,
  StackItem,
  Tab,
  TabTitleText,
  Tabs,
} from '@patternfly/react-core'
import { ProviderAdminWorkspacePageHeader } from '../../../components/provider-admin/ProviderAdminWorkspacePageHeader'
import {
  createInitialClusters,
  createInitialDeployments,
  getVisionOrg,
  getVisionPreset,
  VISION_GATEWAYS,
  VISION_OFF_PLATFORM_MODELS,
  type VisionDeployment,
  type VisionOffPlatformModel,
} from '../../../vision/fleetWorld'
import { VisionGridClusterIdLabel } from './VisionGridClusterIdLabel'
import { VisionGridCountHeading } from './VisionGridCountHeading'
import { VisionGridDrawerCard } from './VisionGridDrawerCard'
import {
  VisionGridGatewayRelationList,
  type VisionGatewayClusterReveal,
} from './VisionGridGatewayRelationList'
import { VisionGridModelListBadge } from './VisionGridModelListBadge'
import { VisionGridServingKindLabel } from './VisionGridServingKindLabel'
import { VisionGridUnassignedLabel } from './VisionGridUnassignedLabel'
import {
  visionFleetModelSpecNodes,
  type VisionClusterPresentation,
} from './visionFleetModelSpec'
import {
  gatewayRelationsForDeployment,
  gatewayRelationsForOffPlatform,
  visionAdminScopeFooter,
  visionClusterDisplayName,
  type VisionGatewayRelation,
} from './visionGridServiceMeta'

type PatternKey = 'live' | 'other-only' | 'grouped'
type PatternSubject =
  | { kind: 'deployment'; deployment: VisionDeployment }
  | { kind: 'off-platform'; model: VisionOffPlatformModel }

const PATTERN_CLUSTERS = createInitialClusters()
const PATTERN_DEPLOYMENTS = createInitialDeployments()
const PATTERN_SUBJECTS: PatternSubject[] = [
  ...PATTERN_DEPLOYMENTS.map((deployment) => ({ kind: 'deployment' as const, deployment })),
  ...VISION_OFF_PLATFORM_MODELS.map((model) => ({ kind: 'off-platform' as const, model })),
]

const GROUP_ORDER: Array<{
  id: 'on-cluster' | 'external-model' | 'none'
  title: string
}> = [
  { id: 'on-cluster', title: 'Cluster instances' },
  { id: 'external-model', title: 'External' },
  { id: 'none', title: 'Unassigned' },
]

const relationsForSubject = (subject: PatternSubject): VisionGatewayRelation[] =>
  subject.kind === 'deployment'
    ? gatewayRelationsForDeployment(subject.deployment, VISION_GATEWAYS)
    : gatewayRelationsForOffPlatform(subject.model, VISION_GATEWAYS)

const subjectId = (subject: PatternSubject) =>
  subject.kind === 'deployment' ? subject.deployment.id : subject.model.id

const subjectMatchesGroup = (
  subject: PatternSubject,
  groupId: 'on-cluster' | 'external-model' | 'none',
) => {
  const hasGateway = relationsForSubject(subject).length > 0
  if (groupId === 'none') {
    return !hasGateway
  }
  if (groupId === 'external-model') {
    return subject.kind === 'off-platform' && hasGateway
  }
  return subject.kind === 'deployment' && hasGateway
}

const PatternInstanceCard = ({
  subject,
  idPrefix,
  clusterReveal,
  clusterPresentation = 'label',
}: {
  subject: PatternSubject
  idPrefix: string
  clusterReveal: VisionGatewayClusterReveal
  clusterPresentation?: VisionClusterPresentation
}) => {
  const relations = relationsForSubject(subject)

  if (subject.kind === 'off-platform') {
    const { model } = subject
    return (
      <VisionGridDrawerCard
        id={idPrefix}
        name={model.displayName}
        secondary={model.modelId}
        specNodes={visionFleetModelSpecNodes({
          idPrefix,
          clusterName: visionClusterDisplayName(model.clusterId, PATTERN_CLUSTERS),
          servedBy: model.servedBy,
          clusterPresentation,
        })}
        extra={
          <VisionGridGatewayRelationList
            idPrefix={idPrefix}
            relations={relations}
            clusterReveal={clusterReveal}
            clusterPresentation={clusterPresentation}
          />
        }
        footerRows={visionAdminScopeFooter(getVisionOrg(model.orgId).label, model.projectName)}
        onSelect={() => undefined}
        badge={
          <VisionGridModelListBadge
            idPrefix={idPrefix}
            status="Ready"
            servingKind="external-model"
          />
        }
      />
    )
  }

  const { deployment } = subject
  const preset = getVisionPreset(deployment.presetId)
  return (
    <VisionGridDrawerCard
      id={idPrefix}
      name={preset?.displayName ?? deployment.presetId}
      secondary={preset?.modelId ?? deployment.presetId}
      specNodes={visionFleetModelSpecNodes({
        idPrefix,
        clusterName: visionClusterDisplayName(deployment.clusterId, PATTERN_CLUSTERS),
        size: deployment.replicas,
        clusterPresentation,
      })}
      extra={
        <VisionGridGatewayRelationList
          idPrefix={idPrefix}
          relations={relations}
          clusterReveal={clusterReveal}
          clusterPresentation={clusterPresentation}
        />
      }
      footerRows={visionAdminScopeFooter(
        getVisionOrg(deployment.orgId).label,
        deployment.projectName,
      )}
      onSelect={() => undefined}
      badge={<VisionGridModelListBadge idPrefix={idPrefix} status={deployment.status} />}
    />
  )
}

const PatternSampleList = ({
  pattern,
  clusterReveal,
  clusterPresentation = 'label',
}: {
  pattern: string
  clusterReveal: VisionGatewayClusterReveal
  clusterPresentation?: VisionClusterPresentation
}) => (
  <Stack hasGutter className="vision-model-list-patterns__samples">
    {PATTERN_SUBJECTS.map((subject) => (
      <StackItem key={subjectId(subject)}>
        <PatternInstanceCard
          subject={subject}
          idPrefix={`vision-pattern-${pattern}-${subjectId(subject)}`}
          clusterReveal={clusterReveal}
          clusterPresentation={clusterPresentation}
        />
      </StackItem>
    ))}
  </Stack>
)

const GroupedSampleList = () => (
  <Stack hasGutter className="vision-model-list-patterns__samples">
    {GROUP_ORDER.map((group, index) => {
      const items = PATTERN_SUBJECTS.filter((subject) => subjectMatchesGroup(subject, group.id))
      return (
        <StackItem key={group.id}>
          <Stack hasGutter>
            <StackItem>
              <VisionGridCountHeading
                id={`vision-pattern-group-${group.id}`}
                title={group.title}
                count={items.length}
                showDivider={index > 0}
              />
            </StackItem>
            {items.length === 0 ? (
              <StackItem>
                <Content component="p">No instances in this group.</Content>
              </StackItem>
            ) : (
              items.map((subject) => (
                <StackItem key={subjectId(subject)}>
                  <PatternInstanceCard
                    subject={subject}
                    idPrefix={`vision-pattern-grouped-${group.id}-${subjectId(subject)}`}
                    clusterReveal="always"
                  />
                </StackItem>
              ))
            )}
          </Stack>
        </StackItem>
      )
    })}
  </Stack>
)

const PatternFieldLegend = () => (
  <DescriptionList isCompact isHorizontal aria-label="What each text block on a card maps to">
    <DescriptionListGroup>
      <DescriptionListTerm>Bold title</DescriptionListTerm>
      <DescriptionListDescription>
        Display name. Example: Granite 3B instruct, Titan Text Express.
      </DescriptionListDescription>
    </DescriptionListGroup>
    <DescriptionListGroup>
      <DescriptionListTerm>Monospace secondary</DescriptionListTerm>
      <DescriptionListDescription>
        Model ID. Example: granite-3b, titan-express. Catalog offer cards use catalog item ID
        here instead.
      </DescriptionListDescription>
    </DescriptionListGroup>
    <DescriptionListGroup>
      <DescriptionListTerm>Filled Ready</DescriptionListTerm>
      <DescriptionListDescription>
        Instance or custom resource status. Not serving kind.
      </DescriptionListDescription>
    </DescriptionListGroup>
    <DescriptionListGroup>
      <DescriptionListTerm>
        <VisionGridServingKindLabel id="vision-pattern-legend-external" kind="external-model" />
      </DescriptionListTerm>
      <DescriptionListDescription>
        Serving kind for an external model custom resource. Inference is a remote provider. Cluster
        instances have no serving-kind chip; Cluster is a property instead.
      </DescriptionListDescription>
    </DescriptionListGroup>
    <DescriptionListGroup>
      <DescriptionListTerm>Cluster</DescriptionListTerm>
      <DescriptionListDescription>
        Where this object lives. Fleet lists always show it, after Size or Served by, before
        Gateway. Omit it when you are already inside that cluster’s details.
      </DescriptionListDescription>
    </DescriptionListGroup>
    <DescriptionListGroup>
      <DescriptionListTerm>Size</DescriptionListTerm>
      <DescriptionListDescription>
        Realized serving capacity of an on-cluster instance (replicas × accelerator). External
        models show Served by first instead.
      </DescriptionListDescription>
    </DescriptionListGroup>
    <DescriptionListGroup>
      <DescriptionListTerm>Gateway</DescriptionListTerm>
      <DescriptionListDescription>
        How the object is reachable. Value column aligns with Size and Cluster. Grey cluster id
        labels use the body font, not monospace. Outline = same cluster as the model. Filled =
        another cluster. MaaS means published as a service. Unassigned when there is no gateway.
      </DescriptionListDescription>
    </DescriptionListGroup>
    <DescriptionListGroup>
      <DescriptionListTerm>
        <VisionGridClusterIdLabel
          id="vision-pattern-legend-cluster-outline"
          clusterId="ocp-us-east-1"
          variant="outline"
        />
      </DescriptionListTerm>
      <DescriptionListDescription>
        Cluster label: grey outline for the model’s own cluster, and for a gateway on that same
        cluster. Body font.
      </DescriptionListDescription>
    </DescriptionListGroup>
    <DescriptionListGroup>
      <DescriptionListTerm>
        <VisionGridClusterIdLabel
          id="vision-pattern-legend-cluster-filled"
          clusterId="ocp-eu-west-1"
          variant="filled"
        />
      </DescriptionListTerm>
      <DescriptionListDescription>
        Cluster label: grey filled when a gateway lives on a different cluster than the model.
        Body font.
      </DescriptionListDescription>
    </DescriptionListGroup>
    <DescriptionListGroup>
      <DescriptionListTerm>
        <VisionGridUnassignedLabel id="vision-pattern-legend-unassigned" />
      </DescriptionListTerm>
      <DescriptionListDescription>
        Not added to a gateway. Sits in the Gateway value column.
      </DescriptionListDescription>
    </DescriptionListGroup>
  </DescriptionList>
)

export const VisionModelListPatternsPage = ({
  embedded = false,
}: {
  embedded?: boolean
}) => {
  const [activeTab, setActiveTab] = useState<PatternKey>('live')

  const body = (
      <Stack hasGutter>
        <StackItem>
          <PatternFieldLegend />
        </StackItem>
        <StackItem>
          <Tabs
            activeKey={activeTab}
            onSelect={(_event, key) => setActiveTab(key as PatternKey)}
            aria-label="Model list pattern variations"
            id="vision-model-list-patterns-tabs"
          >
            <Tab
              eventKey="live"
              title={<TabTitleText>Cluster id labels (live)</TabTitleText>}
              id="vision-pattern-tab-live"
            >
              <Stack hasGutter>
                <StackItem>
                  <Content component="p">
                    What AI Grid Services uses now. Size or Served by, then Cluster (outline grey
                    label), then Gateway. Every gateway line includes a cluster id label: outline
                    when that gateway is on the model’s cluster, filled when it is not. Body font
                    on gateway cluster ids.
                  </Content>
                </StackItem>
                <StackItem>
                  <PatternSampleList pattern="live" clusterReveal="always" />
                </StackItem>
              </Stack>
            </Tab>
            <Tab
              eventKey="other-only"
              title={<TabTitleText>Cluster when different</TabTitleText>}
              id="vision-pattern-tab-other-only"
            >
              <Stack hasGutter>
                <StackItem>
                  <Content component="p">
                    Same labels, but a gateway on the model’s cluster shows name only. Use this
                    when Cluster is already on the card or page (for example cluster details).
                  </Content>
                </StackItem>
                <StackItem>
                  <PatternSampleList pattern="other-only" clusterReveal="other-only" />
                </StackItem>
              </Stack>
            </Tab>
            <Tab
              eventKey="grouped"
              title={<TabTitleText>Grouped by object and assignment</TabTitleText>}
              id="vision-pattern-tab-grouped"
            >
              <Stack hasGutter>
                <StackItem>
                  <Content component="p">
                    Cluster instances with a gateway, External models with a gateway, then
                    Unassigned (Granite 8B on cluster and Claude as an external model).
                  </Content>
                </StackItem>
                <StackItem>
                  <GroupedSampleList />
                </StackItem>
              </Stack>
            </Tab>
          </Tabs>
        </StackItem>
      </Stack>
  )

  if (embedded) {
    return body
  }

  return (
    <div className="provider-admin-workspace-page vision-model-list-patterns">
      <ProviderAdminWorkspacePageHeader
        kicker="AI Grid"
        title="Model list patterns"
        lede="AI Grid uses grey cluster id labels. Outline is this cluster; filled is another cluster. Gateway cluster ids use the body font."
      />
      {body}
    </div>
  )
}
