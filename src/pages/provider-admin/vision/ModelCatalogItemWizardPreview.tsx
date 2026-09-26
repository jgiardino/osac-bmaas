import { useState } from 'react'
import {
  Alert,
  Card,
  CardBody,
  Checkbox,
  Content,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Icon,
  Label,
  Radio,
  Stack,
  StackItem,
  TextArea,
  TextInput,
  Title,
  Wizard,
  WizardStep,
} from '@patternfly/react-core'
import { CatalogIcon } from '@patternfly/react-icons/dist/esm/icons/catalog-icon'
import { CatalogPublishScopeIcon } from '../../../components/provider-admin/CatalogPublishScopeIcon'
import { KubernetesResourceNameField } from '../../../components/shared/KubernetesResourceNameHelper'
import {
  DEMO_APPROVED_MODELS,
  getModelChoicePolicyLabel,
  type DeployModelType,
  type ModelChoicePolicy,
  type ModelSettingId,
  type ModelSettingMode,
  type ModelSettingModes,
} from '../../../vision/modelAuthoringFlow'
import { ModelSettingPolicyField } from './ModelSettingPolicyField'

const getClusterCardClassName = (isSelected: boolean) =>
  `provider-setup-template__select-card provider-setup-template__select-card--instance-type${
    isSelected ? ' provider-setup-template__select-card--selected' : ''
  }`

type ModelCatalogItemWizardPreviewProps = {
  modelChoicePolicy: ModelChoicePolicy
  onModelChoicePolicyChange: (policy: ModelChoicePolicy) => void
  modelType: DeployModelType
  onModelTypeChange: (modelType: DeployModelType) => void
  selectedModels: readonly string[]
  onSelectedModelsChange: (models: readonly string[]) => void
  eligibleClusterIds: readonly string[]
  onEligibleClusterIdsChange: (clusterIds: readonly string[]) => void
  settingModes: ModelSettingModes
  onSettingModeChange: (id: ModelSettingId, mode: ModelSettingMode) => void
}

export function ModelCatalogItemWizardPreview({
  modelChoicePolicy,
  onModelChoicePolicyChange,
  modelType,
  onModelTypeChange,
  selectedModels,
  onSelectedModelsChange,
  eligibleClusterIds,
  onEligibleClusterIdsChange,
  settingModes,
  onSettingModeChange,
}: ModelCatalogItemWizardPreviewProps) {
  const [isPublished, setIsPublished] = useState(false)
  const [visibility, setVisibility] = useState<'global' | 'tenant'>('tenant')
  const [displayName, setDisplayName] = useState('llm-instruct')
  const [description, setDescription] = useState(
    'Instruction-tuned models for data pipelines and backend workflows.',
  )

  const toggleModel = (model: string, isChecked: boolean) => {
    if (modelChoicePolicy === 'fixed-model') {
      if (isChecked) {
        onSelectedModelsChange([model])
      }
      return
    }

    if (!isChecked && selectedModels.length === 1) {
      return
    }

    const next = new Set(selectedModels)
    if (isChecked) {
      next.add(model)
    } else {
      next.delete(model)
    }
    onSelectedModelsChange(Array.from(next))
  }

  const toggleCluster = (clusterId: string, isChecked: boolean) => {
    if (!isChecked && eligibleClusterIds.length === 1) {
      return
    }

    const next = new Set(eligibleClusterIds)
    if (isChecked) {
      next.add(clusterId)
    } else {
      next.delete(clusterId)
    }
    onEligibleClusterIdsChange(Array.from(next))
  }

  const settingPolicyField = (
    id: ModelSettingId,
    label: string,
    value: string,
  ) => (
    <ModelSettingPolicyField
      key={id}
      id={id}
      label={label}
      value={value}
      mode={settingModes[id]}
      onModeChange={(mode) => onSettingModeChange(id, mode)}
    />
  )

  return (
    <div className="vision-model-flow-preview">
      <Wizard
        className="vision-model-flow-preview__wizard"
        height="46rem"
        navAriaLabel="Create model catalog item steps"
        onSave={() => setIsPublished(true)}
      >
        <WizardStep name="Service" id="model-catalog-service">
          <Content component="p" className="provider-setup-template__publish-step-lede">
            The model service is selected for this catalog item.
          </Content>
          <Card
            isSelectable
            isSelected
            className="provider-setup-template__service-card"
            aria-labelledby="model-catalog-service-title"
          >
            <CardBody className="provider-setup-template__service-card-body">
              <Label
                color="grey"
                isCompact
                className="provider-setup-template__service-card-badge"
              >
                Selected
              </Label>
              <div className="provider-setup-template__service-card-icon-wrap">
                <Icon size="lg"><CatalogIcon /></Icon>
              </div>
              <Title
                id="model-catalog-service-title"
                headingLevel="h3"
                size="md"
                className="provider-setup-template__service-card-title"
              >
                Models as a Service
              </Title>
              <Content
                component="p"
                className="provider-setup-template__service-card-description"
              >
                Create a catalog item for a curated model endpoint.
              </Content>
            </CardBody>
          </Card>
        </WizardStep>

        <WizardStep name="General" id="model-catalog-general">
          <Content component="p" className="provider-setup-template__publish-step-lede">
            Set the name and description tenants see in the catalog.
          </Content>
          <Form className="provider-setup-template__publish-display-form">
            <FormGroup label="Name" fieldId="model-catalog-name" isRequired>
              <KubernetesResourceNameField
                id="model-catalog-name"
                value={displayName}
                onChange={setDisplayName}
                aria-label="Name"
                isRequired
              />
            </FormGroup>
            <FormGroup label="Description" fieldId="model-catalog-description">
              <TextArea
                id="model-catalog-description"
                value={description}
                onChange={(_event, value) => setDescription(value)}
                resizeOrientation="vertical"
              />
            </FormGroup>
          </Form>
        </WizardStep>

        <WizardStep name="Visibility" id="model-catalog-visibility">
          <Title headingLevel="h2" size="xl">
            Who should access it?
          </Title>
          <Content component="p">
            Choose the Tenant before restricting which clusters can serve this catalog item.
          </Content>
          <Form>
            <div
              className="provider-admin-catalog__scope-options"
              role="radiogroup"
              aria-label="Visibility"
            >
              <button
                type="button"
                className={`provider-admin-catalog__scope-card${
                  visibility === 'global' ? ' provider-admin-catalog__scope-card--selected' : ''
                }`}
                onClick={() => setVisibility('global')}
                role="radio"
                aria-checked={visibility === 'global'}
              >
                {visibility === 'global' ? (
                  <Label
                    color="grey"
                    isCompact
                    className="provider-admin-catalog__scope-selected-badge"
                  >
                    Selected
                  </Label>
                ) : null}
                <CatalogPublishScopeIcon
                  scope="global-public"
                  className="provider-admin-catalog__scope-icon"
                />
                <span className="provider-admin-catalog__scope-copy">
                  <span className="provider-admin-catalog__scope-title">Global public</span>
                  <span className="provider-admin-catalog__scope-detail">
                    Visible to all tenants.
                  </span>
                </span>
              </button>
              <div className="provider-admin-catalog__scope-vip-group">
                <button
                  type="button"
                  className={`provider-admin-catalog__scope-card${
                    visibility === 'tenant' ? ' provider-admin-catalog__scope-card--selected' : ''
                  }`}
                  onClick={() => setVisibility('tenant')}
                  role="radio"
                  aria-checked={visibility === 'tenant'}
                >
                  {visibility === 'tenant' ? (
                    <Label
                      color="grey"
                      isCompact
                      className="provider-admin-catalog__scope-selected-badge"
                    >
                      Selected
                    </Label>
                  ) : null}
                  <CatalogPublishScopeIcon
                    scope="vip-enterprise"
                    className="provider-admin-catalog__scope-icon"
                  />
                  <span className="provider-admin-catalog__scope-copy">
                    <span className="provider-admin-catalog__scope-title">Selected tenants</span>
                    <span className="provider-admin-catalog__scope-detail">
                      Visible only to selected tenants.
                    </span>
                  </span>
                </button>
                {visibility === 'tenant' ? (
                  <div className="provider-admin-catalog__scope-vip-nested">
                    <FormGroup label="Tenant" fieldId="model-catalog-tenant" isRequired>
                      <FormSelect id="model-catalog-tenant" value="northsummit">
                        <FormSelectOption value="northsummit" label="North Summit Bank" />
                        <FormSelectOption value="all-tenants" label="All tenants" />
                      </FormSelect>
                    </FormGroup>
                  </div>
                ) : null}
              </div>
            </div>
          </Form>
          <Alert
            isInline
            variant="info"
            title="For the MVP, deployed service access is through MaaS subscriptions."
          >
            Project access for a tenant team is a future enhancement.
          </Alert>
        </WizardStep>

        <WizardStep name="Cluster availability" id="model-catalog-clusters">
          <Title headingLevel="h2" size="xl">
            Where do you want to run it?
          </Title>
          <Content component="p">
            Restrict this offering to clusters available to the selected Tenant.
          </Content>
          <Form>
            <FormGroup label="Eligible clusters" fieldId="model-catalog-clusters">
              <div
                className={[
                  'provider-setup-template__card-group',
                  'provider-setup-template__card-group--instance-types',
                  'vision-model-flow-preview__cluster-cards',
                ].join(' ')}
                role="group"
                aria-label="Eligible clusters"
              >
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={eligibleClusterIds.includes('east-gpu')}
                  className={getClusterCardClassName(eligibleClusterIds.includes('east-gpu'))}
                  onClick={() => toggleCluster('east-gpu', !eligibleClusterIds.includes('east-gpu'))}
                >
                  {eligibleClusterIds.includes('east-gpu') ? (
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
                    East GPU cluster
                  </Title>
                  <Content component="p" className="provider-setup-template__select-card-detail">
                    us-east-1 · 4 worker nodes
                  </Content>
                  <Content
                    component="p"
                    className="provider-setup-template__select-card-accelerator"
                  >
                    NVIDIA L4 · 24 GiB
                  </Content>
                </button>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={eligibleClusterIds.includes('west-gpu')}
                  className={getClusterCardClassName(eligibleClusterIds.includes('west-gpu'))}
                  onClick={() => toggleCluster('west-gpu', !eligibleClusterIds.includes('west-gpu'))}
                >
                  {eligibleClusterIds.includes('west-gpu') ? (
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
                    West general-purpose cluster
                  </Title>
                  <Content component="p" className="provider-setup-template__select-card-detail">
                    us-west-2 · CPU and accelerator worker pools
                  </Content>
                  <Content
                    component="p"
                    className="provider-setup-template__select-card-accelerator"
                  >
                    NVIDIA A10G · 24 GiB
                  </Content>
                </button>
              </div>
            </FormGroup>
          </Form>
          <Label color="blue" isCompact>
            Tenant cluster choices are limited to this set
          </Label>
        </WizardStep>

        <WizardStep name="Model source" id="model-catalog-source">
          <Title headingLevel="h2" size="xl">
            What do you want to run?
          </Title>
          <Content component="p">
            Set how much model choice the person launching this offering will have.
          </Content>
          <Form>
            <FormGroup label="Model choice" fieldId="model-catalog-model-choice">
              <Stack hasGutter>
                <StackItem>
                  <Radio
                    id="model-policy-fixed"
                    name="model-policy"
                    label="One specific model"
                    isChecked={modelChoicePolicy === 'fixed-model'}
                    onChange={() => onModelChoicePolicyChange('fixed-model')}
                  />
                  <Content component="small">
                    Lock the catalog item to a model. The admin supplies its source location and credentials.
                  </Content>
                </StackItem>
                <StackItem>
                  <Radio
                    id="model-policy-limited"
                    name="model-policy"
                    label="A predefined set of models"
                    isChecked={modelChoicePolicy === 'limited-catalog'}
                    onChange={() => onModelChoicePolicyChange('limited-catalog')}
                  />
                  <Content component="small">
                    Let the person launching choose from models selected by the admin.
                  </Content>
                </StackItem>
                <StackItem>
                  <Radio
                    id="model-policy-catalog"
                    name="model-policy"
                    label="Any model in the configured catalog"
                    isChecked={modelChoicePolicy === 'configured-catalog'}
                    onChange={() => onModelChoicePolicyChange('configured-catalog')}
                  />
                  <Content component="small">
                    The person launching can choose any model from the configured catalog.
                  </Content>
                </StackItem>
                <StackItem>
                  <Radio
                    id="model-policy-byom"
                    name="model-policy"
                    label="Bring your own model (BYOM)"
                    isChecked={modelChoicePolicy === 'byom'}
                    onChange={() => onModelChoicePolicyChange('byom')}
                  />
                  <Content component="small">
                    The person launching supplies the model source location and credentials.
                  </Content>
                </StackItem>
              </Stack>
            </FormGroup>

            {modelChoicePolicy === 'fixed-model' ? (
              <FormGroup label="Model" fieldId="model-catalog-fixed-model" isRequired>
                <FormSelect
                  id="model-catalog-fixed-model"
                  value={selectedModels[0] ?? ''}
                  onChange={(_event, model) => onSelectedModelsChange([model])}
                >
                  {DEMO_APPROVED_MODELS.map((model) => (
                    <FormSelectOption key={model} value={model} label={model} />
                  ))}
                </FormSelect>
              </FormGroup>
            ) : null}

            {modelChoicePolicy === 'limited-catalog' ? (
              <FormGroup label="Available model choices" fieldId="model-catalog-approved-models">
                <Stack hasGutter>
                  {DEMO_APPROVED_MODELS.map((model) => (
                    <StackItem key={model}>
                      <Checkbox
                        id={`approved-${model.replaceAll(/[^a-z0-9]+/gi, '-')}`}
                        label={model}
                        isChecked={selectedModels.includes(model)}
                        onChange={(_event, checked) => toggleModel(model, checked)}
                      />
                    </StackItem>
                  ))}
                </Stack>
              </FormGroup>
            ) : null}

            {modelChoicePolicy !== 'byom' ? (
              <FormGroup label="Model source catalog" fieldId="model-catalog-source-list">
                <FormSelect id="model-catalog-source-list" value="rhoai-catalog">
                  <FormSelectOption value="rhoai-catalog" label="RHOAI model catalog · Small LLMs" />
                  <FormSelectOption value="team-models" label="North Summit approved models" />
                </FormSelect>
              </FormGroup>
            ) : null}

            {modelChoicePolicy === 'fixed-model' ? (
              <FormGroup label="Model source location" fieldId="model-catalog-model-location" isRequired>
                <TextInput
                  id="model-catalog-model-location"
                  defaultValue="s3://northsummit-models/approved-small-models/"
                />
                <Content component="small">
                    The admin supplies the location for this fixed model.
                </Content>
              </FormGroup>
            ) : null}

            {modelChoicePolicy === 'limited-catalog' ||
            modelChoicePolicy === 'configured-catalog' ? (
              <Content component="small">
                The person launching chooses the model and supplies its source location and credentials.
              </Content>
            ) : null}

            {modelChoicePolicy === 'fixed-model' ? (
              <FormGroup label="Source credentials" fieldId="model-catalog-secret">
                <FormSelect id="model-catalog-secret" value="small-model-source-secret">
                  <FormSelectOption
                    value="small-model-source-secret"
                    label="model-source-credentials · Secret reference"
                  />
                </FormSelect>
              </FormGroup>
            ) : null}
          </Form>
          <Alert isInline variant="warning" title="Credential and source handling needs confirmation.">
            Whoever supplies a model source location supplies its credentials. RHOAI uses Connections; OSAC appears to use Secrets, and the Secret flow remains unresolved.
          </Alert>
        </WizardStep>

        <WizardStep name="Serving configuration" id="model-catalog-serving">
          <Title headingLevel="h2" size="xl">
            Serving method and runtime
          </Title>
          <Content component="p">
            Choose the values and decide whether tenants can change them at launch.
          </Content>
          <Stack hasGutter>
            <FormGroup label="Model type default" fieldId="model-catalog-model-type" isRequired>
              <FormSelect
                id="model-catalog-model-type"
                value={modelType}
                onChange={(_event, value) => onModelTypeChange(value as DeployModelType)}
              >
                <FormSelectOption
                  value="Generative AI model (including LLMs and multimodal models)"
                  label="Generative AI model (including LLMs and multimodal models)"
                />
                <FormSelectOption value="Predictive model" label="Predictive model" />
              </FormSelect>
            </FormGroup>
            {settingPolicyField('modelType', 'Model type choice', modelType)}
            {modelType === 'Predictive model'
              ? settingPolicyField('modelFormat', 'Model format', 'ONNX')
              : null}
            {settingPolicyField('servingMethod', 'Serving method', 'LLMInferenceService')}
            {settingPolicyField('runtime', 'Serving runtime', 'vLLM')}
          </Stack>
        </WizardStep>

        <WizardStep name="Resources" id="model-catalog-resources">
          <Content component="p" className="provider-setup-template__publish-step-lede">
            Set resource defaults and whether tenants can adjust them at launch.
          </Content>
          <Stack hasGutter>
            <StackItem>
              <Title headingLevel="h3" size="lg">Compute</Title>
              {settingPolicyField('cpu', 'CPU', '8 vCPU')}
              {settingPolicyField('memory', 'Memory', '32 GiB')}
              {settingPolicyField('gpu', 'GPU', '1 × NVIDIA L4 · 24 GiB')}
              {settingPolicyField('capacity', 'Replica capacity', '1–3 replicas')}
            </StackItem>
            <StackItem>
              <Title headingLevel="h3" size="lg">Node topology</Title>
              <Content component="p">Configure for offerings that use llm-d.</Content>
              {settingPolicyField('topology', 'llm-d topology', 'Aggregated serving')}
              {settingPolicyField('routing', 'Routing configuration', 'Gateway-managed routing')}
            </StackItem>
            <StackItem>
              <Title headingLevel="h3" size="lg">Runtime customization</Title>
              {settingPolicyField(
                'runtimeCustomization',
                'Runtime arguments and environment',
                'Catalog defaults',
              )}
            </StackItem>
            <StackItem>
              <Title headingLevel="h3" size="lg">Lifecycle</Title>
              {settingPolicyField('lifecycle', 'Deployment strategy', 'Rolling update')}
            </StackItem>
          </Stack>
          <Alert isInline variant="info" title="Catalog display category: Hidden / not editable">
            No model properties are assigned to this category yet. Which properties, if any,
            should be omitted from catalog item creation remains to be decided.
          </Alert>
        </WizardStep>

        <WizardStep name="Review" id="model-catalog-review">
          <Title headingLevel="h2" size="xl">
            Review catalog item
          </Title>
          <DescriptionList isCompact>
            <DescriptionListGroup>
              <DescriptionListTerm>Service</DescriptionListTerm>
              <DescriptionListDescription>Model</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Tenant visibility</DescriptionListTerm>
              <DescriptionListDescription>
                {visibility === 'tenant' ? 'North Summit Bank' : 'Global public'}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Cluster availability</DescriptionListTerm>
              <DescriptionListDescription>
                {eligibleClusterIds
                  .map((id) =>
                    id === 'east-gpu' ? 'East GPU cluster' : 'West general-purpose cluster',
                  )
                  .join('; ')}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Model type</DescriptionListTerm>
              <DescriptionListDescription>{modelType}</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Model choice</DescriptionListTerm>
              <DescriptionListDescription>
                {getModelChoicePolicyLabel(modelChoicePolicy)}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Model choices</DescriptionListTerm>
              <DescriptionListDescription>
                {modelChoicePolicy === 'fixed-model'
                  ? selectedModels[0] ?? 'Select one model'
                  : modelChoicePolicy === 'limited-catalog'
                    ? selectedModels.join(', ') || 'Select at least one model'
                    : modelChoicePolicy === 'byom'
                      ? 'Person launching supplies the model source'
                      : 'Any model in the configured catalog'}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Tenant model access</DescriptionListTerm>
              <DescriptionListDescription>Through MaaS subscriptions</DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
          {isPublished ? (
            <Alert
              isInline
              variant="success"
              title="Preview complete."
              className="vision-model-flow-preview__success"
            >
              This prototype illustrates the catalog item; it does not publish a live offering.
            </Alert>
          ) : null}
          <Alert
            isInline
            variant="info"
            title="No hidden properties have been identified for this item yet."
          >
            Confirm whether any model settings should be hidden when the field inventory is finalized.
          </Alert>
        </WizardStep>
      </Wizard>
    </div>
  )
}
