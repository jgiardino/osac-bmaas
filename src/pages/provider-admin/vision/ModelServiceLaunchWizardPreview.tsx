import { MinusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/minus-circle-icon'
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon'
import { useState } from 'react'
import {
  Button,
  Checkbox,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Form,
  FormGroup,
  FormGroupLabelHelp,
  FormHelperText,
  FormSection,
  FormSelect,
  FormSelectOption,
  Grid,
  GridItem,
  HelperText,
  HelperTextItem,
  Label,
  MenuToggle,
  NumberInput,
  Popover,
  Progress,
  Radio,
  Select,
  SelectList,
  SelectOption,
  Stack,
  StackItem,
  TextArea,
  TextInput,
  Title,
  Wizard,
  WizardStep,
} from '@patternfly/react-core'
import type {
  DeployModelType,
  ModelSettingId,
  ModelSettingModes,
  ServiceWizardVariation,
} from '../../../vision/modelAuthoringFlow'
import { getCatalogServiceIcon } from '../../../catalog/serviceIcons'
import { DEMO_TENANT_PROJECT_NAME, DEMO_TENANT_PROJECT_NAME_02 } from '../../../tenantAdmin/projects'
import { createInitialClusters } from '../../../vision/fleetWorld'
import {
  ACCELERATOR_CONFIGURATIONS,
  DEPLOYMENT_METHODS,
  HARDWARE_PROFILES,
  ROUTING_OPTIONS,
  SERVING_RUNTIMES,
  TOPOLOGIES,
  TOPOLOGY_CONFIGURATIONS,
} from './modelWizardOptions'

type ModelServiceLaunchWizardPreviewProps = {
  variation: ServiceWizardVariation
  settingModes: ModelSettingModes
  selectedModels: readonly string[]
  eligibleClusterIds: readonly string[]
}

type EnvironmentVariable = { id: number; key: string; value: string }
type RuntimeSelection = 'auto' | 'manual'

const MODEL_TYPES: readonly DeployModelType[] = [
  'Predictive model',
  'Generative AI model (including LLMs and multimodal models)',
]

const MODEL_FORMATS = ['onnx - 1', 'pytorch', 'tensorflow', 'sklearn', 'openvino', 'caikit']

const MODEL_LOCATIONS = [
  'Existing connection',
  'S3 object storage',
  'OCI compliant registry',
  'URI',
]

const MODEL_SOURCE_SECRETS = [
  'model-source-credentials',
  's3-model-storage',
  'oci-registry-access',
]

const NEW_SECRET_OPTION = 'Specify new secret'

const INSTRUCT_MODEL_DESCRIPTIONS: Record<string, string> = {
  'gemma-4-31B-it':
    'Instruction-tuned Gemma 4 31B multimodal model by Google DeepMind.',
  'Qwen3-VL-30B-A3B-Instruct':
    'Meet Qwen3-VL — the most powerful vision-language model in the Qwen series to date.',
  'Devstral-Small-2-24B-Instruct-2512':
    'Devstral is an agentic LLM for software engineering tasks.',
}

const getOptionClassName = (isSelected: boolean) =>
  `provider-setup-template__select-card provider-setup-template__select-card--instance-type${
    isSelected ? ' provider-setup-template__select-card--selected' : ''
  }`

const getModelOptionClassName = (isSelected: boolean) =>
  `provider-setup-template__select-card${
    isSelected ? ' provider-setup-template__select-card--selected' : ''
  }`

const fieldActionRowClassName = [
  'pf-v6-u-display-flex',
  'pf-v6-u-align-items-center',
  'pf-v6-u-justify-content-space-between',
  'pf-v6-u-mb-sm',
].join(' ')

const isLockedForVariation = (
  variation: ServiceWizardVariation,
  settingId: ModelSettingId,
  settingModes: ModelSettingModes,
) =>
  (variation === 'llm-tool-calling' &&
    (settingId === 'runtime' || settingId === 'runtimeCustomization')) ||
  (variation === 'llm-instruct' && settingId === 'runtimeCustomization') ||
  settingModes[settingId] === 'locked'

const ModelServiceLaunchWizardPreview = ({
  variation,
  settingModes,
  selectedModels,
  eligibleClusterIds,
}: ModelServiceLaunchWizardPreviewProps) => {
  const [settings, setSettings] = useState({
    deploymentMethod: 'LLM inference service',
    modelFormat: 'sklearn',
    hardwareProfile: 'default',
    replicas: 1,
    topology: 'single-node',
    topologyConfiguration: 'Single node (default)',
    acceleratorConfiguration: 'default',
    routing: 'Default optimized routing',
    decodeReplicas: 1,
    prefillReplicas: 1,
    deploymentStrategy: 'Rolling update',
  })
  const [clusterId, setClusterId] = useState(eligibleClusterIds[0] ?? '')
  const [modelChoice, setModelChoice] = useState(selectedModels[0] ?? '')
  const [modelType, setModelType] = useState<DeployModelType>('Predictive model')
  const [showAllModels, setShowAllModels] = useState(false)
  const [isModelLocationOpen, setIsModelLocationOpen] = useState(false)
  const [project, setProject] = useState('ml-project')
  const [deploymentName, setDeploymentName] = useState('')
  const [description, setDescription] = useState('')
  const [modelLocation, setModelLocation] = useState('')
  const [secretName, setSecretName] = useState('')
  const [secretSelection, setSecretSelection] = useState('')
  const [isSecretSelectionOpen, setIsSecretSelectionOpen] = useState(false)
  const [isNewSecret, setIsNewSecret] = useState(false)
  const [runtimeSelection, setRuntimeSelection] = useState<RuntimeSelection>('auto')
  const [servingRuntime, setServingRuntime] = useState('')
  const [isServingRuntimeOpen, setIsServingRuntimeOpen] = useState(false)
  const [runtimeArguments, setRuntimeArguments] = useState('')
  const [addCustomRuntimeEnvironmentVariables, setAddCustomRuntimeEnvironmentVariables] =
    useState(true)
  const [environmentVariables, setEnvironmentVariables] = useState<EnvironmentVariable[]>([
    { id: 1, key: 'POD_NAME', value: '' },
    { id: 2, key: 'POD_NAMESPACE', value: '' },
    { id: 3, key: 'POD_IP', value: '' },
  ])
  const inputId = (name: string) => `launch-${variation}-${name}`

  const isByom = variation === 'predictive'
  const isFixedModel = variation === 'llm-tool-calling'
  const modelOptions = selectedModels
  const selectedModel = modelOptions.includes(modelChoice) ? modelChoice : modelOptions[0] ?? ''
  const selectedClusterId = eligibleClusterIds.includes(clusterId)
    ? clusterId
    : (eligibleClusterIds[0] ?? '')
  const clusters = createInitialClusters().filter(
    (cluster) =>
      cluster.health === 'available' && eligibleClusterIds.includes(cluster.id),
  )
  const selectedCluster = clusters.find((cluster) => cluster.id === selectedClusterId)
  const isPredictive = isByom && modelType === 'Predictive model'
  const canConfigureLlm = !isByom || modelType === MODEL_TYPES[1]
  const showTopology =
    canConfigureLlm && settings.deploymentMethod === 'LLM inference service with llm-d'
  const modelRuntimeLocked = isLockedForVariation(variation, 'runtime', settingModes)
  const runtimeCustomizationLocked = isLockedForVariation(
    variation,
    'runtimeCustomization',
    settingModes,
  )
  const replicasLocked = settingModes.capacity === 'locked'
  const topologyLocked = settingModes.topology === 'locked'
  const lifecycleLocked = settingModes.lifecycle === 'locked'
  const deploymentMethodLocked = settingModes.servingMethod === 'locked'
  const shownModels = showAllModels ? modelOptions : modelOptions.slice(0, 3)
  const chosenServingRuntime =
    servingRuntime ||
    (variation === 'llm-tool-calling' ? 'vLLM (function engine)' : 'vLLM NVIDIA GPU config')

  const updateSetting = <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) =>
    setSettings((current) => ({ ...current, [key]: value }))

  const updateEnvironmentVariable = (
    id: number,
    key: 'key' | 'value',
    value: string,
  ) => {
    setEnvironmentVariables((current) =>
      current.map((variable) => (variable.id === id ? { ...variable, [key]: value } : variable)),
    )
  }

  const modelSummary = isByom
    ? [modelType, isPredictive ? settings.modelFormat : undefined, modelLocation, secretName]
        .filter(Boolean)
        .join(' · ')
    : isFixedModel
      ? 'Fixed in catalog item'
      : selectedModel

  const servingSummary = [
    canConfigureLlm ? settings.deploymentMethod : undefined,
    chosenServingRuntime,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="vision-model-flow-preview">
      <Wizard
        className="vision-model-flow-preview__wizard"
        height="46rem"
        navAriaLabel="Launch model instance steps"
      >
        <WizardStep name="General" id={`model-launch-${variation}-general`}>
          <Form autoComplete="off" className="provider-setup-template__publish-display-form">
            <FormGroup label="Project or namespace" fieldId={`launch-${variation}-project`} isRequired>
              <FormSelect
                id={`launch-${variation}-project`}
                value={project}
                onChange={(_event, value) => setProject(value)}
              >
                <FormSelectOption
                  value={DEMO_TENANT_PROJECT_NAME}
                  label={DEMO_TENANT_PROJECT_NAME}
                />
                <FormSelectOption
                  value={DEMO_TENANT_PROJECT_NAME_02}
                  label={DEMO_TENANT_PROJECT_NAME_02}
                />
              </FormSelect>
            </FormGroup>
            <FormGroup label="Model deployment name" fieldId={`launch-${variation}-name`} isRequired>
              <TextInput
                id={`launch-${variation}-name`}
                value={deploymentName}
                onChange={(_event, value) => setDeploymentName(value)}
              />
            </FormGroup>
            <FormGroup label="Description" fieldId={`launch-${variation}-description`}>
              <TextArea
                id={`launch-${variation}-description`}
                value={description}
                onChange={(_event, value) => setDescription(value)}
                resizeOrientation="vertical"
              />
            </FormGroup>
          </Form>
        </WizardStep>

        <WizardStep name="Cluster" id={`model-launch-${variation}-cluster`}>
          <Form autoComplete="off" className="provider-setup-template__publish-hardware-step">
            <p className="provider-setup-template__publish-step-lede">
              Select the cluster before loading compatible resources.
            </p>
            <FormGroup
              label="Eligible clusters"
              fieldId={inputId('clusters')}
              isRequired
              role="radiogroup"
            >
              <Grid
                id={inputId('clusters')}
                hasGutter
                role="radiogroup"
                aria-label="Eligible clusters"
              >
                {clusters.map((cluster) => {
                  const isSelected = cluster.id === selectedClusterId
                  return (
                    <GridItem key={cluster.id} span={12} md={6} lg={4}>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        className={getOptionClassName(isSelected)}
                        onClick={() => setClusterId(cluster.id)}
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
                          {cluster.name}
                        </Title>
                        <p className="provider-setup-template__select-card-detail">
                          {cluster.region} · {cluster.platform} · {cluster.nodeCount} workers
                        </p>
                        <p className="provider-setup-template__select-card-accelerator">
                          {cluster.gpuCount} GPUs
                        </p>
                      </button>
                    </GridItem>
                  )
                })}
              </Grid>
            </FormGroup>
          </Form>
        </WizardStep>

        <WizardStep name="Configure" id={`model-launch-${variation}-configure`}>
          <Form autoComplete="off" className="provider-setup-template__publish-hardware-step">
            <FormSection title="Model" titleElement="h3">
              {isByom ? (
                <>
                  <FormGroup label="Model location" fieldId={inputId('model-location')} isRequired>
                    <Select
                      id={inputId('model-location')}
                      isOpen={isModelLocationOpen}
                      selected={modelLocation}
                      onSelect={(_event, value) => {
                        setModelLocation(value as string)
                        setIsModelLocationOpen(false)
                      }}
                      onOpenChange={setIsModelLocationOpen}
                      toggle={(toggleRef) => (
                        <MenuToggle
                          ref={toggleRef}
                          isInForm
                          isFullWidth
                          onClick={() => setIsModelLocationOpen((isOpen) => !isOpen)}
                          isExpanded={isModelLocationOpen}
                          id={inputId('model-location-toggle')}
                        >
                          {modelLocation || 'Select a location'}
                        </MenuToggle>
                      )}
                      shouldFocusToggleOnSelect
                    >
                      <SelectList>
                        {MODEL_LOCATIONS.map((location, index) => (
                          <SelectOption
                            key={location}
                            id={inputId(`model-location-${index}`)}
                            value={location}
                          >
                            {location}
                          </SelectOption>
                        ))}
                      </SelectList>
                    </Select>
                  </FormGroup>
                  <FormGroup label="Secret" fieldId={inputId('model-secret')} isRequired>
                    <Select
                      id={inputId('model-secret')}
                      isOpen={isSecretSelectionOpen}
                      selected={secretSelection}
                      onSelect={(_event, value) => {
                        const selection = value as string
                        setSecretSelection(selection)
                        setIsNewSecret(selection === NEW_SECRET_OPTION)
                        setSecretName(
                          selection === NEW_SECRET_OPTION ? '' : selection,
                        )
                        setIsSecretSelectionOpen(false)
                      }}
                      onOpenChange={setIsSecretSelectionOpen}
                      toggle={(toggleRef) => (
                        <MenuToggle
                          ref={toggleRef}
                          isInForm
                          isFullWidth
                          onClick={() => setIsSecretSelectionOpen((isOpen) => !isOpen)}
                          isExpanded={isSecretSelectionOpen}
                          id={inputId('model-secret-toggle')}
                        >
                          {secretSelection || 'Select a secret'}
                        </MenuToggle>
                      )}
                      shouldFocusToggleOnSelect
                    >
                      <SelectList>
                        {MODEL_SOURCE_SECRETS.map((secret, index) => (
                          <SelectOption
                            key={secret}
                            id={inputId(`model-secret-${index}`)}
                            value={secret}
                          >
                            {secret}
                          </SelectOption>
                        ))}
                        <SelectOption
                          id={inputId('model-secret-new')}
                          value={NEW_SECRET_OPTION}
                        >
                          {NEW_SECRET_OPTION}
                        </SelectOption>
                      </SelectList>
                    </Select>
                    {isNewSecret ? (
                      <TextInput
                        id={inputId('model-secret-new-name')}
                        value={secretName}
                        aria-label="New secret name"
                        onChange={(_event, value) => setSecretName(value)}
                      />
                    ) : null}
                  </FormGroup>
                </>
              ) : isFixedModel ? (
                <FormGroup label="Model" fieldId={inputId('model-fixed')}>
                  <TextInput
                    id={inputId('model-fixed')}
                    value="Fixed in catalog item"
                    isDisabled
                    aria-label="Model fixed in catalog item"
                  />
                </FormGroup>
              ) : variation === 'llm-instruct' ? (
                <FormGroup label="Model" fieldId={inputId('model-choice')} isRequired>
                  <Grid
                    id={inputId('model-choice')}
                    hasGutter
                    role="radiogroup"
                    aria-label="Model"
                  >
                    {shownModels.map((model) => {
                      const isSelected = selectedModel === model
                      return (
                        <GridItem key={model} span={12} md={6}>
                          <button
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            className={getModelOptionClassName(isSelected)}
                            onClick={() => setModelChoice(model)}
                          >
                            <div
                              className="provider-setup-template__service-card-icon-wrap"
                              aria-hidden
                            >
                              {getCatalogServiceIcon('models')}
                            </div>
                            <Title
                              headingLevel="h4"
                              size="md"
                              className="provider-setup-template__select-card-title"
                            >
                              {model}
                            </Title>
                            <p className="provider-setup-template__select-card-detail">
                              {INSTRUCT_MODEL_DESCRIPTIONS[model] ??
                                'Instruction-tuned model available from the catalog.'}
                            </p>
                          </button>
                        </GridItem>
                      )
                    })}
                  </Grid>
                  {modelOptions.length > 3 ? (
                    <Button
                      variant="link"
                      isInline
                      onClick={() => setShowAllModels((current) => !current)}
                    >
                      {showAllModels ? 'Show fewer options' : 'View options'}
                    </Button>
                  ) : null}
                </FormGroup>
              ) : (
                <FormGroup label="Model" fieldId={inputId('model-choice')} isRequired>
                  <Stack
                    id={inputId('model-choice')}
                    hasGutter
                    role="radiogroup"
                    aria-label="Model"
                  >
                    {shownModels.map((model, index) => (
                      <StackItem key={model}>
                        <Radio
                          id={inputId(`model-choice-${index}`)}
                          name={inputId('model-choice')}
                          label={model}
                          isChecked={selectedModel === model}
                          onChange={() => setModelChoice(model)}
                        />
                      </StackItem>
                    ))}
                  </Stack>
                  {selectedModels.length > 3 ? (
                    <Button
                      variant="link"
                      isInline
                      onClick={() => setShowAllModels((current) => !current)}
                    >
                      {showAllModels ? 'Show fewer options' : 'View options'}
                    </Button>
                  ) : null}
                </FormGroup>
              )}
            </FormSection>

            <FormSection title="Serving method and runtime" titleElement="h3">
              {isByom ? (
                <FormGroup label="Model type" fieldId={inputId('model-type')} isRequired>
                  <FormSelect
                    id={inputId('model-type')}
                    value={modelType}
                    isDisabled={variation === 'predictive'}
                    onChange={(_event, value) => setModelType(value as DeployModelType)}
                  >
                    {MODEL_TYPES.map((type) => (
                      <FormSelectOption key={type} value={type} label={type} />
                    ))}
                  </FormSelect>
                </FormGroup>
              ) : null}

              {isPredictive ? (
                <FormGroup label="Model format" fieldId={inputId('model-format')} isRequired>
                  <FormSelect
                    id={inputId('model-format')}
                    value={settings.modelFormat}
                    onChange={(_event, value) => updateSetting('modelFormat', value)}
                  >
                    {MODEL_FORMATS.map((format) => (
                      <FormSelectOption key={format} value={format} label={format} />
                    ))}
                  </FormSelect>
                </FormGroup>
              ) : null}

              {canConfigureLlm ? (
                <FormGroup
                  label="Deployment method"
                  fieldId={inputId('deployment-method-options')}
                  isRequired
                >
                  <div
                    id={inputId('deployment-method-options')}
                    className="provider-setup-template__card-group provider-setup-template__card-group--instance-types provider-setup-template__card-group--instance-types-fill"
                    role="radiogroup"
                    aria-label="Deployment method"
                  >
                    {DEPLOYMENT_METHODS.map(({ id, label, description: detail }) => {
                      const value = id === 'llm-d' ? 'LLM inference service with llm-d' : 'LLM inference service'
                      const isSelected = settings.deploymentMethod === value
                      return (
                        <button
                          key={id}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          className={getOptionClassName(isSelected)}
                          disabled={deploymentMethodLocked}
                          onClick={() => updateSetting('deploymentMethod', value)}
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
                          <Title headingLevel="h4" size="md">
                            {label}
                          </Title>
                          <p className="provider-setup-template__select-card-detail">{detail}</p>
                        </button>
                      )
                    })}
                  </div>
                </FormGroup>
              ) : null}

              {canConfigureLlm ? (
                <FormGroup
                  label="Accelerator configuration"
                  fieldId={inputId('serving-runtime-toggle')}
                  isRequired
                >
                  {modelRuntimeLocked ? (
                    <TextInput
                      id={inputId('serving-runtime-toggle')}
                      value={chosenServingRuntime}
                      isDisabled
                      aria-label="Serving runtime fixed by catalog item"
                    />
                  ) : (
                    <>
                      <div className="pf-v6-u-mb-md">
                        <Radio
                          id={inputId('runtime-automatic')}
                          name={inputId('runtime-selection')}
                          label={
                            <>
                              <strong>Automatic selection:</strong> Automatically select the best
                              accelerator configuration for my model based on the selected hardware
                              profile.
                            </>
                          }
                          isChecked={runtimeSelection === 'auto'}
                          onChange={() => setRuntimeSelection('auto')}
                        />
                        {runtimeSelection === 'auto' ? (
                          <div className="pf-v6-u-ml-lg pf-v6-u-mt-sm">
                            <TextInput
                              id={inputId('serving-runtime-toggle')}
                              value="vLLM NVIDIA GPU config"
                              isDisabled
                              aria-label="Automatically selected accelerator configuration"
                            />
                          </div>
                        ) : null}
                      </div>
                      <Radio
                        id={inputId('runtime-manual')}
                        name={inputId('runtime-selection')}
                        label={
                          <>
                            <strong>Manual selection:</strong> Manually select an accelerator
                            configuration from a list of preconfigured and custom accelerator
                            configurations.
                          </>
                        }
                        isChecked={runtimeSelection === 'manual'}
                        onChange={() => setRuntimeSelection('manual')}
                      />
                      {runtimeSelection === 'manual' ? (
                        <div className="pf-v6-u-ml-lg pf-v6-u-mt-sm">
                          <Select
                            id={inputId('serving-runtime-select')}
                            isOpen={isServingRuntimeOpen}
                            selected={servingRuntime}
                            onSelect={(_event, value) => {
                              setServingRuntime(value as string)
                              setIsServingRuntimeOpen(false)
                            }}
                            onOpenChange={setIsServingRuntimeOpen}
                            toggle={(toggleRef) => (
                              <MenuToggle
                                ref={toggleRef}
                                isInForm
                                isFullWidth
                                onClick={() => setIsServingRuntimeOpen((isOpen) => !isOpen)}
                                isExpanded={isServingRuntimeOpen}
                                id={inputId('serving-runtime-toggle')}
                              >
                                {servingRuntime || 'Select an accelerator configuration'}
                              </MenuToggle>
                            )}
                            shouldFocusToggleOnSelect
                          >
                            <SelectList>
                              {SERVING_RUNTIMES.map(({ id, value, version }) => (
                                <SelectOption key={id} id={id} value={value}>
                                  <span className="pf-v6-u-display-flex pf-v6-u-align-items-center">
                                    {value}
                                    <Label color="blue" isCompact className="pf-v6-u-ml-sm">
                                      {version}
                                    </Label>
                                  </span>
                                </SelectOption>
                              ))}
                            </SelectList>
                          </Select>
                        </div>
                      ) : null}
                    </>
                  )}
                </FormGroup>
              ) : null}
            </FormSection>

            <FormSection title="Compute" titleElement="h3">
              <FormGroup label="Hardware profile" fieldId={inputId('hardware-profile')} isRequired>
                <Select
                  id={inputId('hardware-profile')}
                  isOpen={false}
                  selected={settings.hardwareProfile}
                  onSelect={(_event, value) =>
                    updateSetting('hardwareProfile', value as string)
                  }
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      isInForm
                      isFullWidth
                      isDisabled
                      id={inputId('hardware-profile-toggle')}
                    >
                      {settings.hardwareProfile}
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    {HARDWARE_PROFILES.map((profile, index) => (
                      <SelectOption
                        key={profile}
                        id={inputId(`hardware-profile-${index}`)}
                        value={profile}
                      >
                        {profile}
                      </SelectOption>
                    ))}
                  </SelectList>
                </Select>
              </FormGroup>
              <FormGroup label="Number of replicas to deploy" fieldId={inputId('replicas')}>
                <NumberInput
                  id={inputId('replicas')}
                  inputName="replicas"
                  inputAriaLabel="Number of replicas to deploy"
                  minusBtnAriaLabel="Decrease replica count"
                  plusBtnAriaLabel="Increase replica count"
                  min={1}
                  value={settings.replicas}
                  isDisabled={replicasLocked}
                  onMinus={() => updateSetting('replicas', Math.max(1, settings.replicas - 1))}
                  onPlus={() => updateSetting('replicas', settings.replicas + 1)}
                  onChange={(event) => {
                    const value = Number((event.target as HTMLInputElement).value)
                    if (Number.isFinite(value) && value >= 1) {
                      updateSetting('replicas', value)
                    }
                  }}
                />
              </FormGroup>
            </FormSection>

            {showTopology ? (
              <FormSection title="Node topology" titleElement="h3">
                <FormGroup label="Topology type" fieldId={inputId('topology-type')}>
                  <Grid
                    id={inputId('topology-type')}
                    hasGutter
                    role="radiogroup"
                    aria-label="Topology type"
                  >
                    {TOPOLOGIES.map(({ id, label, description: detail }) => {
                      const isSelected = settings.topology === id
                      return (
                        <GridItem key={id} span={12} md={6}>
                          <button
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            className={getOptionClassName(isSelected)}
                            disabled={topologyLocked}
                            onClick={() => updateSetting('topology', id)}
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
                            <Title headingLevel="h4" size="md">
                              {label}
                            </Title>
                            <p className="provider-setup-template__select-card-detail">{detail}</p>
                          </button>
                        </GridItem>
                      )
                    })}
                  </Grid>
                </FormGroup>
                <FormGroup
                  label="Topology configuration"
                  fieldId={inputId('topology-configuration')}
                >
                  <FormSelect
                    id={inputId('topology-configuration')}
                    value={settings.topologyConfiguration}
                    isDisabled={topologyLocked}
                    onChange={(_event, value) => updateSetting('topologyConfiguration', value)}
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
                <FormGroup
                  label="Accelerator configuration"
                  fieldId={inputId('topology-accelerator')}
                >
                  <FormSelect
                    id={inputId('topology-accelerator')}
                    value={settings.acceleratorConfiguration}
                    isDisabled={topologyLocked}
                    onChange={(_event, value) =>
                      updateSetting('acceleratorConfiguration', value)
                    }
                  >
                    {ACCELERATOR_CONFIGURATIONS.map((configuration) => (
                      <FormSelectOption
                        key={configuration}
                        value={configuration}
                        label={configuration}
                      />
                    ))}
                  </FormSelect>
                </FormGroup>
                <FormGroup label="Routing" fieldId={inputId('routing')}>
                  <FormSelect
                    id={inputId('routing')}
                    value={settings.routing}
                    isDisabled={topologyLocked}
                    onChange={(_event, value) => updateSetting('routing', value)}
                  >
                    {ROUTING_OPTIONS.map((option) => (
                      <FormSelectOption key={option} value={option} label={option} />
                    ))}
                  </FormSelect>
                </FormGroup>
                {settings.topology.includes('disaggregated') ? (
                  <>
                    <FormGroup label="Decode replicas" fieldId={inputId('decode-replicas')}>
                      <NumberInput
                        id={inputId('decode-replicas')}
                        inputName="decode-replicas"
                        inputAriaLabel="Decode replicas"
                        minusBtnAriaLabel="Decrease decode replicas"
                        plusBtnAriaLabel="Increase decode replicas"
                        min={1}
                        value={settings.decodeReplicas}
                        isDisabled={topologyLocked}
                        onMinus={() =>
                          updateSetting('decodeReplicas', Math.max(1, settings.decodeReplicas - 1))
                        }
                        onPlus={() => updateSetting('decodeReplicas', settings.decodeReplicas + 1)}
                        onChange={(event) => {
                          const value = Number((event.target as HTMLInputElement).value)
                          if (Number.isFinite(value) && value >= 1) {
                            updateSetting('decodeReplicas', value)
                          }
                        }}
                      />
                    </FormGroup>
                    <FormGroup label="Prefill replicas" fieldId={inputId('prefill-replicas')}>
                      <NumberInput
                        id={inputId('prefill-replicas')}
                        inputName="prefill-replicas"
                        inputAriaLabel="Prefill replicas"
                        minusBtnAriaLabel="Decrease prefill replicas"
                        plusBtnAriaLabel="Increase prefill replicas"
                        min={1}
                        value={settings.prefillReplicas}
                        isDisabled={topologyLocked}
                        onMinus={() =>
                          updateSetting('prefillReplicas', Math.max(1, settings.prefillReplicas - 1))
                        }
                        onPlus={() => updateSetting('prefillReplicas', settings.prefillReplicas + 1)}
                        onChange={(event) => {
                          const value = Number((event.target as HTMLInputElement).value)
                          if (Number.isFinite(value) && value >= 1) {
                            updateSetting('prefillReplicas', value)
                          }
                        }}
                      />
                    </FormGroup>
                  </>
                ) : null}
              </FormSection>
            ) : null}

            <FormSection title="Runtime customization" titleElement="h3">
              {runtimeCustomizationLocked ? (
                <p className="provider-setup-template__publish-step-lede">
                  Runtime customization is locked for this model.
                </p>
              ) : null}
              <FormGroup
                role="group"
                isStack
                label="Configuration parameters"
                fieldId={inputId('configuration-parameters')}
              >
                <FormGroup fieldId={inputId('runtime-arguments')}>
                  <div className={fieldActionRowClassName}>
                    <div className="pf-v6-u-display-flex pf-v6-u-align-items-center">
                      <label
                        className="pf-v6-c-form__label pf-v6-u-mb-0"
                        htmlFor={inputId('runtime-arguments')}
                      >
                        <span className="pf-v6-c-form__label-text">
                          Additional runtime arguments
                        </span>
                      </label>
                      <Popover
                        headerContent="Runtime arguments"
                        bodyContent="Serving runtime arguments define how the deployed model behaves. Overwriting predefined arguments only affects this model deployment."
                      >
                        <FormGroupLabelHelp
                          aria-label="More info about runtime arguments"
                          className="pf-v6-u-ml-sm"
                          id={inputId('runtime-arguments-help')}
                        />
                      </Popover>
                    </div>
                    <Button variant="link" isInline isDisabled>
                      View predefined arguments
                    </Button>
                  </div>
                  <TextArea
                    id={inputId('runtime-arguments')}
                    value={runtimeArguments}
                    placeholder={'--arg\n--arg2=value2\n--arg3 value3'}
                    isDisabled={runtimeCustomizationLocked}
                    onChange={(_event, value) => setRuntimeArguments(value)}
                    resizeOrientation="vertical"
                    rows={3}
                  />
                  <FormHelperText>
                    <HelperText>
                      <HelperTextItem>
                        Overwriting the runtime&apos;s predefined listening port or model location
                        will likely result in a failed deployment.
                      </HelperTextItem>
                    </HelperText>
                  </FormHelperText>
                </FormGroup>
                <div className={fieldActionRowClassName}>
                  <div className="pf-v6-u-display-flex pf-v6-u-align-items-center">
                    <Checkbox
                      id={inputId('custom-environment-variables')}
                      label="Add custom runtime environment variables"
                      isChecked={addCustomRuntimeEnvironmentVariables}
                      isDisabled={runtimeCustomizationLocked}
                      onChange={(_event, checked) =>
                        setAddCustomRuntimeEnvironmentVariables(checked)
                      }
                    />
                    <Popover
                      headerContent="Environment variables"
                      bodyContent="Environment variables can be predefined by the selected serving runtime. Overwriting predefined variables only affects this model deployment."
                    >
                      <FormGroupLabelHelp
                        aria-label="More info about environment variables"
                        className="pf-v6-u-ml-sm"
                        id={inputId('environment-variables-help')}
                      />
                    </Popover>
                  </div>
                  <Button variant="link" isInline isDisabled>
                    View predefined variables
                  </Button>
                </div>
                {addCustomRuntimeEnvironmentVariables ? (
                  <Stack hasGutter>
                    {environmentVariables.map((variable, index) => (
                      <StackItem key={variable.id}>
                        <div className="vision-model-flow-preview__runtime-environment-row">
                          <TextInput
                            aria-label={`Environment variable ${index + 1} key`}
                            value={variable.key}
                            isDisabled={runtimeCustomizationLocked}
                            onChange={(_event, value) =>
                              updateEnvironmentVariable(variable.id, 'key', value)
                            }
                          />
                          <TextInput
                            aria-label={`Environment variable ${index + 1} value`}
                            value={variable.value}
                            isDisabled={runtimeCustomizationLocked}
                            onChange={(_event, value) =>
                              updateEnvironmentVariable(variable.id, 'value', value)
                            }
                          />
                          <Button
                            variant="plain"
                            icon={<MinusCircleIcon />}
                            aria-label={`Remove environment variable ${index + 1}`}
                            isDisabled={runtimeCustomizationLocked}
                            onClick={() =>
                              setEnvironmentVariables((current) =>
                                current.filter((entry) => entry.id !== variable.id),
                              )
                            }
                          />
                        </div>
                      </StackItem>
                    ))}
                    <StackItem>
                      <Button
                        variant="link"
                        icon={<PlusCircleIcon />}
                        isInline
                        isDisabled={runtimeCustomizationLocked}
                        onClick={() =>
                          setEnvironmentVariables((current) => [
                            ...current,
                            {
                              id: Math.max(0, ...current.map((variable) => variable.id)) + 1,
                              key: '',
                              value: '',
                            },
                          ])
                        }
                      >
                        Add variable
                      </Button>
                    </StackItem>
                  </Stack>
                ) : null}
              </FormGroup>
            </FormSection>

            {!isByom ? (
              <FormSection title="Lifecycle" titleElement="h3">
                <FormGroup
                  label="Deployment strategy"
                  fieldId={inputId('deployment-strategy-options')}
                >
                  <Stack
                    id={inputId('deployment-strategy-options')}
                    hasGutter
                    role="radiogroup"
                    aria-label="Deployment strategy"
                  >
                    {[
                      {
                        label: 'Rolling update',
                        detail:
                          'Existing inference service pods are terminated after new ones are started. This ensures zero downtime and continuous availability.',
                      },
                      {
                        label: 'Recreate',
                        detail:
                          'All existing inference service pods are terminated before any new ones are started. This saves resources but guarantees a period of downtime.',
                      },
                    ].map(({ label, detail }) => {
                      const isSelected = settings.deploymentStrategy === label
                      return (
                        <StackItem key={label}>
                          <button
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            className={getOptionClassName(isSelected)}
                            disabled={lifecycleLocked}
                            onClick={() => updateSetting('deploymentStrategy', label)}
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
                            <Title headingLevel="h4" size="md">
                              {label}
                            </Title>
                            <p className="provider-setup-template__select-card-detail">{detail}</p>
                          </button>
                        </StackItem>
                      )
                    })}
                  </Stack>
                </FormGroup>
              </FormSection>
            ) : null}
          </Form>
        </WizardStep>

        <WizardStep name="Review" id={`model-launch-${variation}-review`}>
          <DescriptionList isCompact>
            <DescriptionListGroup>
              <DescriptionListTerm>Project or namespace</DescriptionListTerm>
              <DescriptionListDescription>{project}</DescriptionListDescription>
            </DescriptionListGroup>
            {deploymentName ? (
              <DescriptionListGroup>
                <DescriptionListTerm>Model deployment name</DescriptionListTerm>
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
              <DescriptionListTerm>Model</DescriptionListTerm>
              <DescriptionListDescription>{modelSummary || 'Not selected'}</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Cluster</DescriptionListTerm>
              <DescriptionListDescription>
                {selectedCluster
                  ? `${selectedCluster.name} · ${selectedCluster.region} · ${selectedCluster.platform}`
                  : 'Not selected'}
              </DescriptionListDescription>
            </DescriptionListGroup>
            {canConfigureLlm ? (
              <DescriptionListGroup>
                <DescriptionListTerm>Serving method and runtime</DescriptionListTerm>
                <DescriptionListDescription>{servingSummary}</DescriptionListDescription>
              </DescriptionListGroup>
            ) : null}
            <DescriptionListGroup>
              <DescriptionListTerm>Hardware profile</DescriptionListTerm>
              <DescriptionListDescription>{settings.hardwareProfile}</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Number of replicas to deploy</DescriptionListTerm>
              <DescriptionListDescription>{settings.replicas}</DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </WizardStep>

        <WizardStep name="Provisioning" id={`model-launch-${variation}-provisioning`}>
          <Progress
            value={0}
            title="Provisioning model instance"
            aria-label="Model instance provisioning"
          />
        </WizardStep>
      </Wizard>
    </div>
  )
}

export { ModelServiceLaunchWizardPreview }
