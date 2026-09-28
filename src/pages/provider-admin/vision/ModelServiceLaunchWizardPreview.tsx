import { useState } from 'react'
import {
  Button,
  Content,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Form,
  FormGroup,
  Label,
  FormSelect,
  FormSelectOption,
  Radio,
  Stack,
  StackItem,
  TextArea,
  TextInput,
  Title,
  Wizard,
  WizardStep,
} from '@patternfly/react-core'
import {
  type DeployModelType,
  type ModelSettingId,
  type ModelSettingModes,
  type ServiceWizardVariation,
} from '../../../vision/modelAuthoringFlow'
import { ModelLaunchSettingField } from './ModelLaunchSettingField'

type ModelServiceLaunchWizardPreviewProps = {
  variation: ServiceWizardVariation
  settingModes: ModelSettingModes
  selectedModels: readonly string[]
  eligibleClusterIds: readonly string[]
}

type LaunchSettingValues = Record<ModelSettingId, string> & { modelFormat: string }

const DEFAULT_LAUNCH_SETTING_VALUES: LaunchSettingValues = {
  modelFormat: 'sklearn',
  servingMethod: 'LLM inference service',
  runtime: 'vLLM NVIDIA GPU config',
  cpu: '8 vCPU',
  memory: '32 GiB',
  gpu: '1 × NVIDIA L4 · 24 GiB',
  capacity: '1 replica',
  topology: 'Aggregated serving',
  routing: 'Gateway-managed routing',
  runtimeCustomization: 'Catalog defaults',
  lifecycle: 'Rolling update',
}

const LAUNCH_SETTING_OPTIONS: Record<ModelSettingId, readonly string[]> = {
  servingMethod: ['LLM inference service', 'LLM inference service with llm-d'],
  runtime: [
    'vLLM NVIDIA GPU config',
    'vLLM (function engine)',
    'vLLM NVIDIA GPU ServingRuntime for KServe',
    'Caikit Standalone ServingRuntime',
    'TGIS Standalone ServingRuntime',
    'OpenVINO Model Server',
  ],
  cpu: ['4 vCPU', '8 vCPU', '16 vCPU'],
  memory: ['16 GiB', '32 GiB', '64 GiB'],
  gpu: ['None', '1 × NVIDIA L4 · 24 GiB', '1 × NVIDIA A10G · 24 GiB'],
  capacity: ['1 replica', '2 replicas', '3 replicas'],
  topology: ['Aggregated serving', 'Disaggregated serving'],
  routing: ['Gateway-managed routing', 'Default routing'],
  runtimeCustomization: ['Catalog defaults', 'Customize arguments'],
  lifecycle: ['Rolling update', 'Recreate'],
}

const MODEL_FORMAT_OPTIONS = ['onnx - 1', 'pytorch', 'tensorflow', 'sklearn', 'openvino', 'caikit']

const getClusterCardClassName = (isSelected: boolean) =>
  `provider-setup-template__select-card provider-setup-template__select-card--instance-type${
    isSelected ? ' provider-setup-template__select-card--selected' : ''
  }`

export function ModelServiceLaunchWizardPreview({
  variation,
  settingModes,
  selectedModels,
  eligibleClusterIds,
}: ModelServiceLaunchWizardPreviewProps) {
  const [settings, setSettings] = useState<LaunchSettingValues>(() => ({
    ...DEFAULT_LAUNCH_SETTING_VALUES,
    runtime: variation === 'llm-tool-calling' ? 'vLLM (function engine)' : 'vLLM NVIDIA GPU config',
  }))
  const [clusterId, setClusterId] = useState('ocp-us-east-1')
  const [modelChoice, setModelChoice] = useState<string>(selectedModels[0] ?? '')
  const [userModelType, setUserModelType] = useState<DeployModelType>('Predictive model')
  const [showAllModels, setShowAllModels] = useState(false)
  const [project, setProject] = useState('ml-project')
  const [deploymentName, setDeploymentName] = useState('')
  const [description, setDescription] = useState('')
  const [connectionType, setConnectionType] = useState('S3')
  const [modelPath, setModelPath] = useState('')
  const [secretId, setSecretId] = useState('')

  const changeSetting = (id: ModelSettingId, value: string) => {
    setSettings((current) => ({ ...current, [id]: value }))
  }

  const settingField = (
    id: ModelSettingId,
    label: string,
    options: readonly string[] = LAUNCH_SETTING_OPTIONS[id],
    mode = settingModes[id],
  ) => (
    <ModelLaunchSettingField
      key={id}
      id={`launch-${id}`}
      label={label}
      value={settings[id]}
      options={options}
      mode={mode}
      onChange={(value) => changeSetting(id, value)}
    />
  )

  const isByom = variation === 'predictive'
  const isFixedModel = variation === 'llm-tool-calling'
  const requiresModelType = isByom
  const modelOptions = selectedModels
  const selectedClusterId = eligibleClusterIds.includes(clusterId)
    ? clusterId
    : (eligibleClusterIds[0] ?? '')
  const selectedModelChoice = modelOptions.includes(modelChoice)
    ? modelChoice
    : (modelOptions[0] ?? '')
  const selectedModelType = requiresModelType
    ? userModelType
    : 'Generative AI model (including LLMs and multimodal models)'
  const isPredictive = selectedModelType === 'Predictive model'
  const modelSummary = isByom
    ? 'BYOM'
    : isFixedModel
      ? 'Specified model'
      : selectedModelChoice
  const servingSummary = [
    selectedModelType,
    isPredictive ? settings.modelFormat : undefined,
    !isPredictive && variation !== 'predictive' ? settings.servingMethod : undefined,
    settings.runtime,
    settings.gpu,
  ]
    .filter(Boolean)
    .join(' · ')
  const modelOptionsToShow = showAllModels ? modelOptions : modelOptions.slice(0, 3)
  const clusterResources =
    selectedClusterId === 'ocp-us-east-1'
      ? {
          cpu: ['8 vCPU', '16 vCPU', '32 vCPU', '64 vCPU'],
          memory: ['16 GiB', '32 GiB', '64 GiB', '128 GiB'],
          gpu: ['None', '1 × NVIDIA L4 · 24 GiB', '1 × NVIDIA A10G · 24 GiB'],
        }
      : {
          cpu: ['8 vCPU', '16 vCPU', '32 vCPU'],
          memory: ['16 GiB', '32 GiB', '64 GiB'],
          gpu: ['None', '1 × NVIDIA A10G · 24 GiB'],
        }

  const clusterLabel = (id: string) =>
    id === 'ocp-us-east-1' ? 'ocp-us-east-1 · US East' : 'ocp-eu-west-1 · EU West'

  return (
    <div className="vision-model-flow-preview">
      <Wizard
        className="vision-model-flow-preview__wizard"
        height="46rem"
        navAriaLabel="Launch model instance steps"
      >
        <WizardStep name="General" id="model-launch-general">
          <Title headingLevel="h2" size="xl">
            General
          </Title>
          <Form>
            <FormGroup label="Project or namespace" fieldId="launch-model-project" isRequired>
              <FormSelect
                id="launch-model-project"
                value={project}
                onChange={(_event, value) => setProject(value)}
              >
                <FormSelectOption value="ml-project" label="ml-project" />
                <FormSelectOption value="ml-platform" label="ml-platform" />
              </FormSelect>
            </FormGroup>
            <FormGroup label="Deployment name" fieldId="launch-model-name" isRequired>
              <TextInput
                id="launch-model-name"
                value={deploymentName}
                onChange={(_event, value) => setDeploymentName(value)}
              />
            </FormGroup>
            <FormGroup label="Description" fieldId="launch-model-description">
              <TextArea
                id="launch-model-description"
                value={description}
                onChange={(_event, value) => setDescription(value)}
                resizeOrientation="vertical"
              />
            </FormGroup>
          </Form>
        </WizardStep>

        <WizardStep name="Cluster" id="model-launch-cluster">
          <Title headingLevel="h2" size="xl">
            Cluster
          </Title>
          <Form>
            <FormGroup label="Cluster" fieldId="launch-model-cluster" isRequired>
              <div
                id="launch-model-cluster"
                className={[
                  'provider-setup-template__card-group',
                  'provider-setup-template__card-group--instance-types',
                  'vision-model-flow-preview__cluster-cards',
                ].join(' ')}
                role="radiogroup"
                aria-label="Cluster"
              >
                {eligibleClusterIds.map((id) => {
                  const isSelected = id === selectedClusterId
                  const isUsEast = id === 'ocp-us-east-1'
                  return (
                    <button
                      key={id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      className={getClusterCardClassName(isSelected)}
                      onClick={() => setClusterId(id)}
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
                        headingLevel="h3"
                        size="md"
                        className="provider-setup-template__select-card-title"
                      >
                        {id}
                      </Title>
                      <Content
                        component="p"
                        className="provider-setup-template__select-card-detail"
                      >
                        {isUsEast
                          ? 'US East · AWS us-east-1 · 3 worker nodes'
                          : 'EU West · Azure westeurope · 3 worker nodes'}
                      </Content>
                      <Content
                        component="p"
                        className="provider-setup-template__select-card-accelerator"
                      >
                        {isUsEast ? '4 GPUs available' : '2 GPUs available'}
                      </Content>
                    </button>
                  )
                })}
              </div>
            </FormGroup>
          </Form>
        </WizardStep>

        <WizardStep name="Configure" id="model-launch-configure">
          <Stack hasGutter>
            <StackItem>
              <Title headingLevel="h3" size="lg">
                Model
              </Title>
              {isByom ? (
                <Form>
                  <FormGroup label="Connection type" fieldId="launch-model-connection-type" isRequired>
                    <FormSelect
                      id="launch-model-connection-type"
                      value={connectionType}
                      onChange={(_event, value) => setConnectionType(value)}
                    >
                      <FormSelectOption value="S3" label="S3-compatible storage" />
                      <FormSelectOption value="OCI" label="OCI registry" />
                      <FormSelectOption value="Cluster storage" label="Cluster storage" />
                    </FormSelect>
                  </FormGroup>
                  <FormGroup label="Model path" fieldId="launch-model-path" isRequired>
                    <TextInput
                      id="launch-model-path"
                      value={modelPath}
                      onChange={(_event, value) => setModelPath(value)}
                    />
                  </FormGroup>
                  <FormGroup label="Secret" fieldId="launch-model-secret" isRequired>
                    <FormSelect
                      id="launch-model-secret"
                      value={secretId}
                      onChange={(_event, value) => setSecretId(value)}
                    >
                      <FormSelectOption value="" label="Select a Secret" />
                    </FormSelect>
                  </FormGroup>
                </Form>
              ) : isFixedModel ? null : (
                <Form>
                  <FormGroup label="Model" fieldId="launch-model-choice" isRequired>
                    <Stack hasGutter>
                      {modelOptionsToShow.length > 0
                        ? modelOptionsToShow.map((model) => (
                            <StackItem key={model}>
                              <Radio
                                id={`launch-model-${model.replaceAll(/[^a-z0-9]+/gi, '-')}`}
                                name="launch-model-choice"
                                label={model}
                                isChecked={selectedModelChoice === model}
                                onChange={() => setModelChoice(model)}
                              />
                            </StackItem>
                          ))
                        : null}
                    </Stack>
                    {modelOptions.length > 3 ? (
                      <Button
                        variant="link"
                        isInline
                        onClick={() => setShowAllModels((current) => !current)}
                      >
                        {showAllModels
                          ? 'Show fewer options'
                          : `View options (${modelOptions.length - 3} more)`}
                      </Button>
                    ) : null}
                  </FormGroup>
                </Form>
              )}
            </StackItem>

            <StackItem>
              <Title headingLevel="h3" size="lg">
                Serving method and runtime
              </Title>
              {requiresModelType ? (
                <FormGroup label="Model type" fieldId="launch-model-type" isRequired>
                  <FormSelect
                    id="launch-model-type"
                    value={selectedModelType}
                    onChange={(_event, value) => setUserModelType(value as DeployModelType)}
                  >
                    <FormSelectOption
                      value="Generative AI model (including LLMs and multimodal models)"
                      label="Generative AI model (including LLMs and multimodal models)"
                    />
                    <FormSelectOption value="Predictive model" label="Predictive model" />
                  </FormSelect>
                </FormGroup>
              ) : null}
              {isPredictive ? (
                <FormGroup label="Model format" fieldId="launch-model-format" isRequired>
                  <FormSelect
                    id="launch-model-format"
                    value={settings.modelFormat}
                    onChange={(_event, value) =>
                      setSettings((current) => ({ ...current, modelFormat: value }))
                    }
                  >
                    {MODEL_FORMAT_OPTIONS.map((format) => (
                      <FormSelectOption key={format} value={format} label={format} />
                    ))}
                  </FormSelect>
                </FormGroup>
              ) : null}
              {variation !== 'predictive'
                ? settingField('servingMethod', 'Deployment method')
                : null}
              {settingField(
                'runtime',
                'Serving runtime',
                LAUNCH_SETTING_OPTIONS.runtime,
                isFixedModel ? 'locked' : settingModes.runtime,
              )}
            </StackItem>

            <StackItem>
              <Title headingLevel="h3" size="lg">Compute</Title>
              {settingField('cpu', 'CPU', clusterResources.cpu)}
              {settingField('memory', 'Memory', clusterResources.memory)}
              {settingField('gpu', 'GPU', clusterResources.gpu)}
              {settingField('capacity', 'Number of replicas to deploy')}
            </StackItem>

            <StackItem>
              <Title headingLevel="h3" size="lg">Node topology</Title>
              {settings.servingMethod === 'LLM inference service with llm-d' ? (
                <>
                  {settingField('topology', 'llm-d topology')}
                  {settingField('routing', 'Routing configuration')}
                </>
              ) : null}
            </StackItem>

            <StackItem>
              <Title headingLevel="h3" size="lg">Runtime customization</Title>
              {settingField('runtimeCustomization', 'Runtime arguments and environment')}
            </StackItem>

            <StackItem>
              <Title headingLevel="h3" size="lg">Lifecycle</Title>
              {settingField('lifecycle', 'Deployment strategy')}
            </StackItem>
          </Stack>
        </WizardStep>

        <WizardStep name="Review" id="model-launch-review">
          <Title headingLevel="h2" size="xl">
            Review model instance
          </Title>
          <DescriptionList isCompact>
            <DescriptionListGroup>
              <DescriptionListTerm>Project</DescriptionListTerm>
              <DescriptionListDescription>{project}</DescriptionListDescription>
            </DescriptionListGroup>
            {deploymentName ? (
              <DescriptionListGroup>
                <DescriptionListTerm>Deployment name</DescriptionListTerm>
                <DescriptionListDescription>{deploymentName}</DescriptionListDescription>
              </DescriptionListGroup>
            ) : null}
            {description ? (
              <DescriptionListGroup>
                <DescriptionListTerm>Description</DescriptionListTerm>
                <DescriptionListDescription>{description}</DescriptionListDescription>
              </DescriptionListGroup>
            ) : null}
            <DescriptionListGroup>
              <DescriptionListTerm>Model choice</DescriptionListTerm>
              <DescriptionListDescription>
                {modelSummary}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Cluster</DescriptionListTerm>
              <DescriptionListDescription>
                {clusterLabel(selectedClusterId)}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Serving</DescriptionListTerm>
              <DescriptionListDescription>
                {servingSummary}
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </WizardStep>

        <WizardStep name="Provisioning" id="model-launch-provisioning">
          <Title headingLevel="h2" size="xl">
            Provisioning
          </Title>
        </WizardStep>
      </Wizard>
    </div>
  )
}
