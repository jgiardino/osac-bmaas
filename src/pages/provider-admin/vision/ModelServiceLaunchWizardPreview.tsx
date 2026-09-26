import { useMemo, useState } from 'react'
import {
  Alert,
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
  Stack,
  StackItem,
  TextArea,
  TextInput,
  Title,
  Wizard,
  WizardStep,
} from '@patternfly/react-core'
import {
  DEMO_APPROVED_MODELS,
  getModelChoicePolicyLabel,
  type DeployModelType,
  type ModelChoicePolicy,
  type ModelSettingId,
  type ModelSettingModes,
} from '../../../vision/modelAuthoringFlow'
import { ModelLaunchSettingField } from './ModelLaunchSettingField'

type ModelServiceLaunchWizardPreviewProps = {
  modelChoicePolicy: ModelChoicePolicy
  settingModes: ModelSettingModes
  modelType: DeployModelType
  selectedModels: readonly string[]
  eligibleClusterIds: readonly string[]
}

type LaunchSettingValues = Record<ModelSettingId, string>

const DEFAULT_LAUNCH_SETTING_VALUES: LaunchSettingValues = {
  modelType: 'Generative AI model (including LLMs and multimodal models)',
  modelFormat: 'sklearn',
  servingMethod: 'LLMInferenceService',
  runtime: 'vLLM',
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
  modelType: [
    'Generative AI model (including LLMs and multimodal models)',
    'Predictive model',
  ],
  modelFormat: ['sklearn', 'ONNX', 'openvino'],
  servingMethod: ['LLMInferenceService', 'LLMInferenceService with llm-d'],
  runtime: ['vLLM', 'TGI', 'OpenVINO'],
  cpu: ['4 vCPU', '8 vCPU', '16 vCPU'],
  memory: ['16 GiB', '32 GiB', '64 GiB'],
  gpu: ['None', '1 × NVIDIA L4 · 24 GiB', '1 × NVIDIA A10G · 24 GiB'],
  capacity: ['1 replica', '2 replicas', '3 replicas'],
  topology: ['Aggregated serving', 'Disaggregated serving'],
  routing: ['Gateway-managed routing', 'Default routing'],
  runtimeCustomization: ['Catalog defaults', 'Customize arguments'],
  lifecycle: ['Rolling update', 'Recreate'],
}

const getClusterCardClassName = (isSelected: boolean) =>
  `provider-setup-template__select-card provider-setup-template__select-card--instance-type${
    isSelected ? ' provider-setup-template__select-card--selected' : ''
  }`

export function ModelServiceLaunchWizardPreview({
  modelChoicePolicy,
  settingModes,
  modelType,
  selectedModels,
  eligibleClusterIds,
}: ModelServiceLaunchWizardPreviewProps) {
  const [settings, setSettings] = useState<LaunchSettingValues>(DEFAULT_LAUNCH_SETTING_VALUES)
  const [clusterId, setClusterId] = useState('east-gpu')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [modelChoice, setModelChoice] = useState<string>(DEMO_APPROVED_MODELS[0])
  const [userModelType, setUserModelType] = useState<DeployModelType | null>(null)

  const changeSetting = (id: ModelSettingId, value: string) => {
    setSettings((current) => ({ ...current, [id]: value }))
  }

  const settingField = (id: ModelSettingId, label: string) => (
    <ModelLaunchSettingField
      key={id}
      id={`launch-${id}`}
      label={label}
      value={settings[id]}
      options={LAUNCH_SETTING_OPTIONS[id]}
      mode={settingModes[id]}
      onChange={(value) => changeSetting(id, value)}
    />
  )

  const isOpenChoice = modelChoicePolicy === 'open-choice'
  const modelOptions = useMemo(
    () =>
      modelChoicePolicy === 'specific-models'
        ? selectedModels
        : DEMO_APPROVED_MODELS,
    [modelChoicePolicy, selectedModels],
  )
  const selectedClusterId = eligibleClusterIds.includes(clusterId)
    ? clusterId
    : (eligibleClusterIds[0] ?? '')
  const selectedModelChoice = modelOptions.includes(modelChoice)
    ? modelChoice
    : (modelOptions[0] ?? '')
  const selectedModelType =
    settingModes.modelType === 'editable' && userModelType ? userModelType : modelType

  const clusterLabel = (id: string) =>
    id === 'east-gpu'
      ? 'East GPU cluster · us-east-1'
      : 'West general-purpose cluster · us-west-2'

  return (
    <div className="vision-model-flow-preview">
      <Wizard
        className="vision-model-flow-preview__wizard"
        height="46rem"
        navAriaLabel="Launch model instance steps"
        onSave={() => setIsSubmitted(true)}
      >
        <WizardStep name="General" id="model-launch-general">
          <Title headingLevel="h2" size="xl">
            General
          </Title>
          <Content component="p">
            Set the project and identity for this deployed model instance.
          </Content>
          <Form>
            <FormGroup label="Project or namespace" fieldId="launch-model-project" isRequired>
              <FormSelect id="launch-model-project" value="data-science">
                <FormSelectOption value="data-science" label="data-science" />
                <FormSelectOption value="ml-platform" label="ml-platform" />
              </FormSelect>
            </FormGroup>
            <FormGroup label="Deployment name" fieldId="launch-model-name" isRequired>
              <TextInput id="launch-model-name" defaultValue="small-model-demo" />
            </FormGroup>
            <FormGroup label="Description" fieldId="launch-model-description">
              <TextArea
                id="launch-model-description"
                defaultValue="Model endpoint for the data science team."
                resizeOrientation="vertical"
              />
            </FormGroup>
          </Form>
          <Alert isInline variant="info" title="Access is provided through a MaaS subscription.">
            Project access for the tenant team is a future enhancement.
          </Alert>
        </WizardStep>

        <WizardStep name="Cluster availability" id="model-launch-cluster">
          <Title headingLevel="h2" size="xl">
            Where do you want to run it?
          </Title>
          <Content component="p">
            Choose an eligible cluster first. Its available resources determine the options in Configure.
          </Content>
          <Form>
            <FormGroup label="Available clusters" fieldId="launch-model-cluster" isRequired>
              <div
                id="launch-model-cluster"
                className={[
                  'provider-setup-template__card-group',
                  'provider-setup-template__card-group--instance-types',
                  'vision-model-flow-preview__cluster-cards',
                ].join(' ')}
                role="radiogroup"
                aria-label="Available clusters"
              >
                {eligibleClusterIds.map((id) => {
                  const isSelected = id === selectedClusterId
                  const isEast = id === 'east-gpu'
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
                        {isEast ? 'East GPU cluster' : 'West general-purpose cluster'}
                      </Title>
                      <Content
                        component="p"
                        className="provider-setup-template__select-card-detail"
                      >
                        {isEast
                          ? 'us-east-1 · 4 worker nodes'
                          : 'us-west-2 · CPU and accelerator worker pools'}
                      </Content>
                      <Content
                        component="p"
                        className="provider-setup-template__select-card-accelerator"
                      >
                        {isEast ? 'NVIDIA L4 · 24 GiB' : 'NVIDIA A10G · 24 GiB'}
                      </Content>
                    </button>
                  )
                })}
              </div>
            </FormGroup>
          </Form>
          <Alert isInline variant="success" title="Resources available on this cluster">
            {selectedClusterId === 'east-gpu'
              ? 'NVIDIA L4 (24 GiB), 8–64 vCPU, 16–256 GiB memory'
              : 'NVIDIA A10G (24 GiB), 8–48 vCPU, 32–192 GiB memory'}
          </Alert>
        </WizardStep>

        <WizardStep name="Configure" id="model-launch-configure">
          <Title headingLevel="h2" size="xl">
            Configure model instance
          </Title>
          <Stack hasGutter>
            <StackItem>
              <Title headingLevel="h3" size="lg">
                What do you want to run?
              </Title>
              <Content component="p">
                Catalog policy: <strong>{getModelChoicePolicyLabel(modelChoicePolicy)}</strong>
              </Content>
              {isOpenChoice ? (
                <Form>
                  <FormGroup label="Model source location" fieldId="launch-model-source" isRequired>
                    <TextInput
                      id="launch-model-source"
                      placeholder="s3://bucket/path or OCI model reference"
                    />
                  </FormGroup>
                  <FormGroup label="Connection / Secret" fieldId="launch-model-connection" isRequired>
                    <FormSelect id="launch-model-connection" value="new-connection">
                      <FormSelectOption value="new-connection" label="Select or create a connection" />
                      <FormSelectOption value="team-model-source" label="team-model-source · Secret reference" />
                    </FormSelect>
                  </FormGroup>
                  <Alert isInline variant="warning" title="Credential handling needs confirmation.">
                    This preview represents the tenant providing source details and credentials; OSAC Secret ownership is unresolved.
                  </Alert>
                </Form>
              ) : (
                <Form>
                  <FormGroup label="Model" fieldId="launch-model-choice" isRequired>
                    <FormSelect
                      id="launch-model-choice"
                      value={selectedModelChoice}
                      onChange={(_event, nextValue) => setModelChoice(nextValue)}
                    >
                      {modelOptions.length > 0 ? modelOptions.map((model) => (
                        <FormSelectOption key={model} value={model} label={model} />
                      )) : <FormSelectOption value="" label="No approved models selected" />}
                    </FormSelect>
                  </FormGroup>
                  <Content component="small">
                    The person launching chooses only from the models allowed by the catalog item.
                  </Content>
                </Form>
              )}
            </StackItem>

            <StackItem>
              <Title headingLevel="h3" size="lg">
                Serving method and runtime
              </Title>
              <ModelLaunchSettingField
                id="launch-model-type"
                label="Model type"
                value={selectedModelType}
                options={[
                  'Generative AI model (including LLMs and multimodal models)',
                  'Predictive model',
                ]}
                mode={settingModes.modelType}
                onChange={(value) => {
                  setUserModelType(value as DeployModelType)
                  changeSetting('modelType', value)
                }}
              />
              {selectedModelType === 'Predictive model'
                ? settingField('modelFormat', 'Model format')
                : null}
              {settingField('servingMethod', 'Serving method')}
              {settingField('runtime', 'Runtime')}
            </StackItem>

            <StackItem>
              <Title headingLevel="h3" size="lg">Compute</Title>
              {settingField('cpu', 'CPU')}
              {settingField('memory', 'Memory')}
              {settingField('gpu', 'GPU')}
              {settingField('capacity', 'Replica capacity')}
            </StackItem>

            <StackItem>
              <Title headingLevel="h3" size="lg">Node topology</Title>
              {settingField('topology', 'llm-d topology')}
              {settingField('routing', 'Routing configuration')}
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
              <DescriptionListDescription>data-science</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Model choice</DescriptionListTerm>
              <DescriptionListDescription>
                {isOpenChoice ? 'Source supplied by the person launching' : selectedModelChoice}
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
                {selectedModelType}
                {selectedModelType === 'Predictive model' ? ` · ${settings.modelFormat}` : ''}
                {' · '}
                {settings.servingMethod} · {settings.runtime} · {settings.gpu}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Service access</DescriptionListTerm>
              <DescriptionListDescription>MaaS subscription</DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
          {isSubmitted ? (
            <Alert
              isInline
              variant="success"
              title="Preview complete."
              className="vision-model-flow-preview__success"
            >
              This prototype illustrates the launch settings; it does not create a live model instance.
            </Alert>
          ) : null}
        </WizardStep>

        <WizardStep name="Provisioning" id="model-launch-provisioning">
          <Title headingLevel="h2" size="xl">
            Provisioning
          </Title>
          {isSubmitted ? (
            <Alert isInline variant="success" title="Launch preview complete.">
              The live model instance would appear under Services after provisioning.
            </Alert>
          ) : (
            <Alert isInline variant="info" title="After launch, follow instance progress in Services.">
              Review and provisioning are service-specific completion steps outside the Deploy Model property groups.
            </Alert>
          )}
        </WizardStep>
      </Wizard>
    </div>
  )
}
