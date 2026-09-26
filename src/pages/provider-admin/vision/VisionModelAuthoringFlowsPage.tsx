import { useState } from 'react'
import { Alert, Content, Tab, TabTitleText, Tabs } from '@patternfly/react-core'
import {
  DEMO_APPROVED_MODELS,
  DEFAULT_MODEL_SETTING_MODES,
  type DeployModelType,
  type ModelChoicePolicy,
  type ModelSettingId,
  type ModelSettingMode,
  type ModelSettingModes,
} from '../../../vision/modelAuthoringFlow'
import { ModelCatalogItemWizardPreview } from './ModelCatalogItemWizardPreview'
import { ModelServiceLaunchWizardPreview } from './ModelServiceLaunchWizardPreview'

export function VisionModelAuthoringFlowsPage() {
  const [activeFlow, setActiveFlow] = useState<'catalog-item' | 'service-instance'>(
    'catalog-item',
  )
  const [modelChoicePolicy, setModelChoicePolicy] =
    useState<ModelChoicePolicy>('specific-models')
  const [modelType, setModelType] = useState<DeployModelType>(
    'Generative AI model (including LLMs and multimodal models)',
  )
  const [selectedModels, setSelectedModels] = useState<readonly string[]>(() =>
    DEMO_APPROVED_MODELS.slice(0, 2),
  )
  const [eligibleClusterIds, setEligibleClusterIds] = useState<readonly string[]>([
    'east-gpu',
    'west-gpu',
  ])
  const [settingModes, setSettingModes] = useState<ModelSettingModes>(() => ({
    ...DEFAULT_MODEL_SETTING_MODES,
  }))

  const changeSettingMode = (id: ModelSettingId, mode: ModelSettingMode) => {
    setSettingModes((current) => ({ ...current, [id]: mode }))
  }

  return (
    <div className="vision-model-authoring-flows">
      <Content component="p">
        Explore the provider-admin catalog item flow and the tenant launch flow. Model-choice and lock policies carry from the catalog preview into the launch preview.
      </Content>
      <Alert
        isInline
        variant="info"
        title="Illustrative prototype based on the Deploy Model property map."
        className="vision-model-authoring-flows__alert"
      >
        Model names, cluster inventory, and Secret references are sample content. The credential and Secret workflow remains an open design question. View or specify YAML remains a follow-up; neither wizard exposes YAML yet.
      </Alert>
      <Tabs
        activeKey={activeFlow}
        onSelect={(_event, key) => setActiveFlow(key as 'catalog-item' | 'service-instance')}
        aria-label="Deploy Model prototype flows"
        id="vision-model-authoring-flow-tabs"
        mountOnEnter
        unmountOnExit={false}
      >
        <Tab
          eventKey="catalog-item"
          title={<TabTitleText>Create catalog item</TabTitleText>}
          id="vision-model-authoring-flow-tab-catalog"
        >
          <ModelCatalogItemWizardPreview
            modelChoicePolicy={modelChoicePolicy}
            onModelChoicePolicyChange={setModelChoicePolicy}
            modelType={modelType}
            onModelTypeChange={setModelType}
            selectedModels={selectedModels}
            onSelectedModelsChange={setSelectedModels}
            eligibleClusterIds={eligibleClusterIds}
            onEligibleClusterIdsChange={setEligibleClusterIds}
            settingModes={settingModes}
            onSettingModeChange={changeSettingMode}
          />
        </Tab>
        <Tab
          eventKey="service-instance"
          title={<TabTitleText>Launch instance for model</TabTitleText>}
          id="vision-model-authoring-flow-tab-instance"
        >
          <ModelServiceLaunchWizardPreview
            modelChoicePolicy={modelChoicePolicy}
            settingModes={settingModes}
            modelType={modelType}
            selectedModels={selectedModels}
            eligibleClusterIds={eligibleClusterIds}
          />
        </Tab>
      </Tabs>
    </div>
  )
}
