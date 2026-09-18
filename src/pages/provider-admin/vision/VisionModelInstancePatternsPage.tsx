import { useState } from 'react'
import {
  Button,
  Content,
  Flex,
  FlexItem,
  FormGroup,
  Icon,
  Label,
  MenuToggle,
  Select,
  SelectList,
  SelectOption,
  Stack,
  StackItem,
  Title,
} from '@patternfly/react-core'
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon'
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table'
import { MaasModelIdentity } from '../../../components/catalog/MaasModelIdentity'
import { ModelsInstanceCard } from '../../../components/catalog/ModelsInstanceCard'
import {
  MODEL_INSTANCE_SEED,
  aiAssetModelIdentities,
  apiKeyModelIdentities,
  maasGovernanceIdentities,
  maasGovernanceInstances,
  maasGovernanceModelRows,
  gatewayAssignmentLabel,
  modelsOnCluster,
  modelsOnGateway,
  servicesModelInstances,
  type ModelInstanceSeedItem,
} from '../../../vision/modelInstanceSeed'

const listedOnApiKeys = (item: ModelInstanceSeedItem) =>
  maasGovernanceIdentities().some((entry) => entry.modelId === item.modelId)

const listedOnAssets = (item: ModelInstanceSeedItem) =>
  aiAssetModelIdentities().some((entry) => entry.modelId === item.modelId)

const presence = (ok: boolean) => (ok ? 'Yes' : '—')

const locationLine = (item: ModelInstanceSeedItem) =>
  item.locationKind === 'on-cluster'
    ? `${item.tenantLabel} · ${item.regionLabel}`
    : `${item.tenantLabel} · ${item.servedBy ?? 'Off-platform'}`

const coverageIsPending = (subscriptionCount: number, policyCount: number) =>
  subscriptionCount === 0 || policyCount === 0

const CoverageCount = ({
  count,
  id,
}: {
  count: number
  id: string
}) => (
  <Flex
    spaceItems={{ default: 'spaceItemsSm' }}
    alignItems={{ default: 'alignItemsCenter' }}
  >
    <FlexItem>{count}</FlexItem>
    {count === 0 ? (
      <FlexItem>
        <Icon status="warning" id={id}>
          <ExclamationTriangleIcon />
        </Icon>
      </FlexItem>
    ) : null}
  </Flex>
)

const CoverageStatusLabel = ({
  subscriptionCount,
  policyCount,
  id,
}: {
  subscriptionCount: number
  policyCount: number
  id: string
}) =>
  coverageIsPending(subscriptionCount, policyCount) ? (
    <Label color="purple" isCompact id={id}>
      Pending
    </Label>
  ) : (
    <Label color="green" isCompact id={id}>
      Ready
    </Label>
  )

const identityLabels = (
  item: ModelInstanceSeedItem,
  surface: 'maas' | 'assets' | 'keys',
) => {
  if (surface === 'maas') {
    return [
      {
        text: item.locationKind === 'off-platform' ? 'External' : 'Internal',
        color: (item.locationKind === 'off-platform' ? 'teal' : 'orange') as 'teal' | 'orange',
      },
    ]
  }
  if (surface === 'assets' && item.isMaas) {
    return [{ text: 'MaaS', color: 'blue' as const }]
  }
  return []
}

const CoverageMatrix = () => {
  const servicesIds = new Set(servicesModelInstances().map((item) => item.id))
  const maasIds = new Set(maasGovernanceInstances().map((item) => item.id))

  return (
    <Table aria-label="Keep-set coverage by page" variant="compact" id="pattern-instance-coverage">
      <Thead>
        <Tr>
          <Th>Object</Th>
          <Th>Services / AI Grid Services</Th>
          <Th>MaaS governance</Th>
          <Th>API keys</Th>
          <Th>AI assets / Playground</Th>
        </Tr>
      </Thead>
      <Tbody>
        {MODEL_INSTANCE_SEED.map((item) => (
          <Tr key={item.id}>
            <Td dataLabel="Object">
              <strong>{item.displayName}</strong>
              <div className="pf-v6-u-font-size-sm pf-v6-u-text-color-subtle">{locationLine(item)}</div>
            </Td>
            <Td dataLabel="Services">{presence(servicesIds.has(item.id))}</Td>
            <Td dataLabel="MaaS governance">{presence(maasIds.has(item.id))}</Td>
            <Td dataLabel="API keys">
              {listedOnApiKeys(item) ? `Yes · ${item.maasModelRefId} once` : '—'}
            </Td>
            <Td dataLabel="AI assets / Playground">
              {listedOnAssets(item) ? `Yes · ${item.maasModelRefId} once` : '—'}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

const PatternMaasTable = () => (
  <Table aria-label="MaaS governance models" variant="compact" id="pattern-maas-table">
    <Thead>
      <Tr>
        <Th>Model</Th>
        <Th>Tenant</Th>
        <Th>Project</Th>
        <Th>Cluster</Th>
        <Th>Gateway</Th>
        <Th>Status</Th>
        <Th>Subscriptions</Th>
        <Th>Authorization policies</Th>
      </Tr>
    </Thead>
    <Tbody>
      {maasGovernanceModelRows().map((row) => (
        <Tr key={row.instanceId}>
          <Td dataLabel="Model">
            <MaasModelIdentity
              id={`pattern-maas-identity-${row.instanceId}`}
              displayName={row.displayName}
              modelRefId={row.maasModelRefId}
              description={row.description}
              labels={[
                {
                  text: row.locationKind === 'off-platform' ? 'External' : 'Internal',
                  color: row.locationKind === 'off-platform' ? 'teal' : 'orange',
                },
              ]}
            />
          </Td>
          <Td dataLabel="Tenant">{row.tenantLabel}</Td>
          <Td dataLabel="Project">{row.projectName}</Td>
          <Td dataLabel="Cluster">{row.clusterLabel}</Td>
          <Td dataLabel="Gateway">
            {row.gatewayId ? gatewayAssignmentLabel(row.gatewayId) : 'Unassigned'}
          </Td>
          <Td dataLabel="Status">
            <CoverageStatusLabel
              subscriptionCount={row.subscriptionCount}
              policyCount={row.policyCount}
              id={`pattern-maas-status-${row.instanceId}`}
            />
          </Td>
          <Td dataLabel="Subscriptions">
            <CoverageCount count={row.subscriptionCount} id={`pattern-maas-subs-warn-${row.instanceId}`} />
          </Td>
          <Td dataLabel="Authorization policies">
            <CoverageCount count={row.policyCount} id={`pattern-maas-pols-warn-${row.instanceId}`} />
          </Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
)

const PatternApiKeysTable = () => (
  <Table aria-label="API keys models" variant="compact" id="pattern-api-keys-table">
    <Thead>
      <Tr>
        <Th>Model</Th>
        <Th>Token limits</Th>
      </Tr>
    </Thead>
    <Tbody>
      {apiKeyModelIdentities().map((item) => (
        <Tr key={item.modelId}>
          <Td dataLabel="Model">
            <MaasModelIdentity
              id={`pattern-keys-identity-${item.modelId}`}
              displayName={item.displayName}
              modelRefId={item.maasModelRefId}
              description={item.description}
            />
          </Td>
          <Td dataLabel="Token limits">80K / 24 hours</Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
)

const PatternAssetTable = () => (
  <Table aria-label="AI asset endpoints" variant="compact" id="pattern-assets-table">
    <Thead>
      <Tr>
        <Th>Model</Th>
        <Th>Use case</Th>
        <Th>Status</Th>
        <Th>Playground</Th>
      </Tr>
    </Thead>
    <Tbody>
      {aiAssetModelIdentities().map((item) => (
        <Tr key={item.modelId}>
          <Td dataLabel="Model">
            <MaasModelIdentity
              id={`pattern-asset-identity-${item.modelId}`}
              displayName={item.displayName}
              modelRefId={item.maasModelRefId}
              description={item.description}
              labels={identityLabels(item, 'assets')}
            />
          </Td>
          <Td dataLabel="Use case">{item.useCase}</Td>
          <Td dataLabel="Status">
            <Label color="green" isCompact id={`pattern-asset-status-${item.modelId}`}>
              Ready
            </Label>
          </Td>
          <Td dataLabel="Playground">
            <Button variant="secondary" id={`pattern-asset-playground-${item.modelId}`}>
              Try in playground
            </Button>
          </Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
)

const PatternPlaygroundPicker = () => {
  const options = aiAssetModelIdentities()
  const [selectedId, setSelectedId] = useState(options[0]?.modelId ?? '')
  const [isOpen, setIsOpen] = useState(false)
  const selected = options.find((item) => item.modelId === selectedId)

  return (
    <FormGroup fieldId="pattern-playground-model" label="Model">
      <Select
        id="pattern-playground-model-select"
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        selected={selectedId}
        onSelect={(_event, value) => {
          if (typeof value === 'string') {
            setSelectedId(value)
          }
          setIsOpen(false)
        }}
        toggle={(toggleRef) => (
          <MenuToggle
            ref={toggleRef}
            onClick={() => setIsOpen(!isOpen)}
            isExpanded={isOpen}
            id="pattern-playground-model-toggle"
          >
            {selected ? selected.displayName : 'Select a model'}
          </MenuToggle>
        )}
      >
        <SelectList>
          {options.map((item) => (
            <SelectOption key={item.modelId} value={item.modelId}>
              <MaasModelIdentity
                id={`pattern-playground-option-${item.modelId}`}
                displayName={item.displayName}
                modelRefId={item.maasModelRefId}
                description={item.description}
                labels={identityLabels(item, 'assets')}
              />
            </SelectOption>
          ))}
        </SelectList>
      </Select>
    </FormGroup>
  )
}

export const VisionModelInstancePatternsPage = () => {
  const services = servicesModelInstances()
  const clusterEastModels = modelsOnCluster('ocp-us-east-1')
  const gatewayMarketsModels = modelsOnGateway('nsb-markets')
  const gatewayWestModels = modelsOnGateway('nsb-west')

  return (
    <Stack hasGutter>
      <StackItem>
        <Title headingLevel="h2" size="lg">
          2.8 keep-set across list views
        </Title>
        <Content component="p">
          One seed, filtered per page. Live Catalog, Services, MaaS governance, API keys, AI asset
          endpoints, and Playground lists use this keep-set. Tenant on instance cards is
          shown here because Patterns is viewed as platform admin; Tenant is omitted for tenant
          admin and tenant user. Later discussions with Myriam should use tenant admin as the
          persona who sees the whole organization fleet. Granite pairing is story A (regional
          doors). Mistral 7B on nsb-west is the cross-cluster gateway example.
        </Content>
      </StackItem>
      <StackItem>
        <CoverageMatrix />
      </StackItem>

      <StackItem>
        <Title headingLevel="h2" size="lg">
          Services → Models
        </Title>
        <Content component="p">
          {services.length} on-cluster instances. Same card chrome as Ethan’s Services cards, plus
          a footer action: View subscriptions for MaaS, View endpoints otherwise. Created only on
          this page card. Externals are not on this list.
        </Content>
        <div className="catalog-card-grid tenant-user-instances__grid">
          {services.map((item) => (
            <ModelsInstanceCard
              key={item.id}
              item={item}
              showTenant
              idPrefix="pattern-services"
            />
          ))}
        </div>
      </StackItem>

      <StackItem>
        <Title headingLevel="h2" size="lg">
          AI Grid Services → Models
        </Title>
        <Content component="p">
          Same {services.length} instances and properties as Services, without Tenant,
          MaaS, Gateway, or Created. Compact AI Grid card: small icon inline with the
          title link; secondary text is the catalog item name. Served on uses cluster
          chips. Footer action lives in the kebab.
        </Content>
        <Stack hasGutter>
          {services.map((item) => (
            <StackItem key={item.id}>
              <ModelsInstanceCard
                item={item}
                variant="compact"
                idPrefix="pattern-fleet"
              />
            </StackItem>
          ))}
        </Stack>
      </StackItem>

      <StackItem>
        <Title headingLevel="h2" size="lg">
          AI Grid · models on cluster ocp-us-east-1
        </Title>
        <Content component="p">
          Nested on cluster details: Cluster is omitted. Includes on-cluster instances (Granite,
          Mistral 7B, Credit-risk scorer).
        </Content>
        <Stack hasGutter>
          {clusterEastModels.map((item) => (
            <StackItem key={item.id}>
              <ModelsInstanceCard
                item={item}
                variant="compact"
                parent="cluster"
                idPrefix="pattern-cluster-east"
              />
            </StackItem>
          ))}
        </Stack>
      </StackItem>

      <StackItem>
        <Title headingLevel="h2" size="lg">
          AI Grid · models on gateway nsb-markets
        </Title>
        <Content component="p">
          Nested on gateway details: Gateway is omitted. Includes Granite on US East.
        </Content>
        <Stack hasGutter>
          {gatewayMarketsModels.map((item) => (
            <StackItem key={item.id}>
              <ModelsInstanceCard
                item={item}
                variant="compact"
                parent="gateway"
                idPrefix="pattern-gateway-markets"
              />
            </StackItem>
          ))}
        </Stack>
      </StackItem>

      <StackItem>
        <Title headingLevel="h2" size="lg">
          AI Grid · models on gateway nsb-west
        </Title>
        <Content component="p">
          Cross-cluster example: nsb-west lives on ocp-us-west-1 and serves Mistral 7B on US West,
          US East, and EU West. Gateway is omitted; Served on shows the cluster.
        </Content>
        <Stack hasGutter>
          {gatewayWestModels.map((item) => (
            <StackItem key={item.id}>
              <ModelsInstanceCard
                item={item}
                variant="compact"
                parent="gateway"
                idPrefix="pattern-gateway-west"
              />
            </StackItem>
          ))}
        </Stack>
      </StackItem>

      <StackItem>
        <Title headingLevel="h2" size="lg">
          MaaS governance
        </Title>
        <Content component="p">
          Model column is display name, MaaS model ref id, and description. Filled Internal /
          External labels. One row per serving instance. Columns: Tenant, Project, Cluster,
          Gateway, Status, Subscriptions, Authorization policies. Llama 4 Scout is assigned with
          subscriptions and 0 policies (Pending).
        </Content>
        <PatternMaasTable />
      </StackItem>

      <StackItem>
        <Title headingLevel="h2" size="lg">
          API keys → Subscriptions → Models
        </Title>
        <Content component="p">
          Same Model column layout. Unique by model identity on a subscription the user can
          access. Unassigned MaaS models are not on subscriptions, so they are not listed.
        </Content>
        <PatternApiKeysTable />
      </StackItem>

      <StackItem>
        <Title headingLevel="h2" size="lg">
          AI asset endpoints
        </Title>
        <Content component="p">
          Same Model column. Filled MaaS label when the asset is a published MaaS model.
          Credit-risk scorer is the non-MaaS asset.
        </Content>
        <PatternAssetTable />
      </StackItem>

      <StackItem>
        <Title headingLevel="h2" size="lg">
          Playground picker
        </Title>
        <Content component="p">
          Menu options use the same stacked identity as AI asset endpoints, including the MaaS
          label. The toggle shows only the selected display name.
        </Content>
        <PatternPlaygroundPicker />
      </StackItem>
    </Stack>
  )
}
