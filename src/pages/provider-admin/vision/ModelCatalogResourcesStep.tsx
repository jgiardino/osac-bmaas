import { useState } from 'react'
import {
  Button,
  Form,
  FormGroup,
  FormSection,
  FormSelect,
  FormSelectOption,
  Grid,
  GridItem,
  Label,
  NumberInput,
  Radio,
  Stack,
  StackItem,
  TextArea,
  TextInput,
  Title,
} from '@patternfly/react-core'
import type {
  ModelSettingId,
  ModelSettingMode,
  ModelSettingModes,
} from '../../../vision/modelAuthoringFlow'
import {
  ACCELERATOR_CONFIGURATIONS,
  HARDWARE_PROFILES,
  ROUTING_OPTIONS,
  TOPOLOGIES,
  TOPOLOGY_CONFIGURATIONS,
} from './modelWizardOptions'
import ModelCatalogResourceSection from './ModelCatalogResourceSection'

type ModelCatalogResourcesStepProps = {
  settingModes: ModelSettingModes
  onSettingModeChange: (id: ModelSettingId, mode: ModelSettingMode) => void
}

type EnvironmentVariable = { id: number; key: string; value: string }

const getOptionClassName = (selected: boolean) =>
  `provider-setup-template__select-card provider-setup-template__select-card--instance-type${
    selected ? ' provider-setup-template__select-card--selected' : ''
  }`

export function ModelCatalogResourcesStep({
  settingModes,
  onSettingModeChange,
}: ModelCatalogResourcesStepProps) {
  const [hardwareProfile, setHardwareProfile] = useState('default')
  const [replicas, setReplicas] = useState(1)
  const [topology, setTopology] = useState<(typeof TOPOLOGIES)[number]['id']>('single-node')
  const [topologyConfig, setTopologyConfig] = useState('Single node (default)')
  const [acceleratorConfig, setAcceleratorConfig] = useState('default')
  const [routing, setRouting] = useState('Default optimized routing')
  const [decodeReplicas, setDecodeReplicas] = useState(1)
  const [prefillReplicas, setPrefillReplicas] = useState(1)
  const [runtimeArgs, setRuntimeArgs] = useState('')
  const [environmentVariables, setEnvironmentVariables] = useState<EnvironmentVariable[]>([])
  const [deploymentStrategy, setDeploymentStrategy] = useState<'rolling' | 'recreate'>('rolling')
  const isDisaggregated = topology.includes('disaggregated')

  const addEnvironmentVariable = () => {
    setEnvironmentVariables((current) => [...current, { id: Date.now(), key: '', value: '' }])
  }

  const updateEnvironmentVariable = (id: number, key: 'key' | 'value', value: string) => {
    setEnvironmentVariables((current) =>
      current.map((entry) => (entry.id === id ? { ...entry, [key]: value } : entry)),
    )
  }

  return (
    <Form autoComplete="off" className="provider-setup-template__publish-hardware-step">
      <FormSection><p>Choose the resources available for this catalog item.</p></FormSection>
      <ModelCatalogResourceSection
        title="Compute"
        accessLabel="Tenant access to compute"
        settingId="cpu"
        mode={settingModes.cpu}
        onModeChange={onSettingModeChange}
      >
        <FormGroup label="Hardware profile" fieldId="model-catalog-hardware-profile" isRequired>
          <FormSelect
            id="model-catalog-hardware-profile"
            value={hardwareProfile}
            onChange={(_event, value) => setHardwareProfile(value)}
          >
            {HARDWARE_PROFILES.map((profile) => (
              <FormSelectOption key={profile} value={profile} label={profile} />
            ))}
          </FormSelect>
        </FormGroup>
        <FormGroup label="Number of replicas to deploy" fieldId="model-catalog-replicas">
          <NumberInput
            id="model-catalog-replicas"
            inputName="replicas"
            inputAriaLabel="Number of replicas to deploy"
            minusBtnAriaLabel="Decrease replica count"
            plusBtnAriaLabel="Increase replica count"
            min={1}
            value={replicas}
            onMinus={() => setReplicas((current) => Math.max(1, current - 1))}
            onPlus={() => setReplicas((current) => current + 1)}
            onChange={(event) => {
              const value = Number((event.target as HTMLInputElement).value)
              if (Number.isFinite(value) && value >= 1) {
                setReplicas(value)
              }
            }}
          />
        </FormGroup>
      </ModelCatalogResourceSection>

      <ModelCatalogResourceSection
        title="Node topology"
        accessLabel="Tenant access to node topology"
        settingId="topology"
        mode={settingModes.topology}
        onModeChange={onSettingModeChange}
      >
        <FormGroup label="Topology type" fieldId="model-catalog-topology-type" role="radiogroup">
          <Grid hasGutter>
            {TOPOLOGIES.map(({ id, label, description }) => {
              const selected = topology === id
              return (
                <GridItem key={id} span={12} md={6}>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    className={getOptionClassName(selected)}
                    onClick={() => setTopology(id)}
                  >
                    {selected ? (
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
                      {label}
                    </Title>
                    <p className="provider-setup-template__select-card-detail">
                      {description}
                    </p>
                  </button>
                </GridItem>
              )
            })}
          </Grid>
        </FormGroup>
        <FormGroup label="Topology configuration" fieldId="model-catalog-topology-config">
          <FormSelect
            id="model-catalog-topology-config"
            value={topologyConfig}
            onChange={(_event, value) => setTopologyConfig(value)}
          >
            {TOPOLOGY_CONFIGURATIONS.map((configuration) => (
              <FormSelectOption
                key={configuration}
                value={configuration}
                label={configuration}
              />
            ))}
          </FormSelect>
        </FormGroup>
        <FormGroup label="Accelerator configuration" fieldId="model-catalog-accelerator-config">
          <FormSelect
            id="model-catalog-accelerator-config"
            value={acceleratorConfig}
            onChange={(_event, value) => setAcceleratorConfig(value)}
          >
            {ACCELERATOR_CONFIGURATIONS.map((option) => (
              <FormSelectOption key={option} value={option} label={option} />
            ))}
          </FormSelect>
        </FormGroup>
        <FormGroup label="Routing" fieldId="model-catalog-routing">
          <FormSelect
            id="model-catalog-routing"
            value={routing}
            onChange={(_event, value) => setRouting(value)}
          >
            {ROUTING_OPTIONS.map((option) => (
              <FormSelectOption key={option} value={option} label={option} />
            ))}
          </FormSelect>
        </FormGroup>
        {isDisaggregated ? (
          <Grid hasGutter>
            <GridItem span={12} md={6}>
              <FormGroup label="Decode replicas" fieldId="model-catalog-decode-replicas">
                <NumberInput
                  id="model-catalog-decode-replicas"
                  inputName="decode-replicas"
                  inputAriaLabel="Decode replicas"
                  minusBtnAriaLabel="Decrease decode replicas"
                  plusBtnAriaLabel="Increase decode replicas"
                  min={1}
                  value={decodeReplicas}
                  onMinus={() => setDecodeReplicas((current) => Math.max(1, current - 1))}
                  onPlus={() => setDecodeReplicas((current) => current + 1)}
                  onChange={(event) => {
                    const value = Number((event.target as HTMLInputElement).value)
                    if (Number.isFinite(value) && value >= 1) {
                      setDecodeReplicas(value)
                    }
                  }}
                />
              </FormGroup>
            </GridItem>
            <GridItem span={12} md={6}>
              <FormGroup label="Prefill replicas" fieldId="model-catalog-prefill-replicas">
                <NumberInput
                  id="model-catalog-prefill-replicas"
                  inputName="prefill-replicas"
                  inputAriaLabel="Prefill replicas"
                  minusBtnAriaLabel="Decrease prefill replicas"
                  plusBtnAriaLabel="Increase prefill replicas"
                  min={1}
                  value={prefillReplicas}
                  onMinus={() => setPrefillReplicas((current) => Math.max(1, current - 1))}
                  onPlus={() => setPrefillReplicas((current) => current + 1)}
                  onChange={(event) => {
                    const value = Number((event.target as HTMLInputElement).value)
                    if (Number.isFinite(value) && value >= 1) {
                      setPrefillReplicas(value)
                    }
                  }}
                />
              </FormGroup>
            </GridItem>
          </Grid>
        ) : null}
      </ModelCatalogResourceSection>

      <ModelCatalogResourceSection
        title="Runtime customization"
        accessLabel="Tenant access to runtime customization"
        settingId="runtimeCustomization"
        mode={settingModes.runtimeCustomization}
        onModeChange={onSettingModeChange}
      >
        <FormGroup label="Additional runtime arguments" fieldId="model-catalog-runtime-args">
          <TextArea
            id="model-catalog-runtime-args"
            placeholder="Enter runtime arguments"
            value={runtimeArgs}
            onChange={(_event, value) => setRuntimeArgs(value)}
            resizeOrientation="vertical"
            rows={4}
          />
        </FormGroup>
        <FormGroup
          label="Serving runtime environment variables"
          fieldId="model-catalog-environment-variables"
        >
          <Stack hasGutter>
            {environmentVariables.map((entry, index) => (
              <StackItem key={entry.id}>
                <div className="vision-model-flow-preview__environment-row">
                  <TextInput
                    aria-label={`Environment variable ${index + 1} key`}
                    placeholder="Key"
                    value={entry.key}
                    onChange={(_event, value) => updateEnvironmentVariable(entry.id, 'key', value)}
                  />
                  <TextInput
                    aria-label={`Environment variable ${index + 1} value`}
                    placeholder="Value"
                    value={entry.value}
                    onChange={(_event, value) =>
                      updateEnvironmentVariable(entry.id, 'value', value)
                    }
                  />
                  <Button
                    variant="link"
                    isDanger
                    isInline
                    onClick={() =>
                      setEnvironmentVariables((current) =>
                        current.filter((variable) => variable.id !== entry.id),
                      )
                    }
                  >
                    Remove
                  </Button>
                </div>
              </StackItem>
            ))}
          </Stack>
          <Button variant="link" isInline onClick={addEnvironmentVariable}>
            Add variable
          </Button>
        </FormGroup>
      </ModelCatalogResourceSection>

      <ModelCatalogResourceSection
        title="Lifecycle"
        accessLabel="Tenant access to lifecycle"
        settingId="lifecycle"
        mode={settingModes.lifecycle}
        onModeChange={onSettingModeChange}
      >
        <FormGroup
          label="Deployment strategy"
          fieldId="model-catalog-deployment-strategy"
          role="radiogroup"
        >
          <Stack hasGutter>
            <StackItem>
              <Radio
                id="model-catalog-deployment-strategy-rolling"
                name="model-catalog-deployment-strategy"
                label={
                  <>
                    <strong>Rolling update</strong>
                    <p className="provider-setup-template__select-card-detail">
                      Existing inference service pods are terminated after new ones are started.
                      This ensures zero downtime and continuous availability.
                    </p>
                  </>
                }
                isChecked={deploymentStrategy === 'rolling'}
                onChange={() => setDeploymentStrategy('rolling')}
              />
            </StackItem>
            <StackItem>
              <Radio
                id="model-catalog-deployment-strategy-recreate"
                name="model-catalog-deployment-strategy"
                label={
                  <>
                    <strong>Recreate</strong>
                    <p className="provider-setup-template__select-card-detail">
                      All existing inference service pods are terminated before any new ones are
                      started. This saves resources but guarantees a period of downtime.
                    </p>
                  </>
                }
                isChecked={deploymentStrategy === 'recreate'}
                onChange={() => setDeploymentStrategy('recreate')}
              />
            </StackItem>
          </Stack>
        </FormGroup>
      </ModelCatalogResourceSection>
    </Form>
  )
}
