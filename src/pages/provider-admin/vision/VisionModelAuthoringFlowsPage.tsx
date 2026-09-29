import { useState } from 'react'
import { Tab, TabTitleText, Tabs } from '@patternfly/react-core'
import '../../../model-authoring-flows.css'
import {
  DEMO_APPROVED_MODELS,
  DEFAULT_MODEL_SETTING_MODES,
  type ModelSettingId,
  type ModelSettingMode,
  type ModelSettingModes,
} from '../../../vision/modelAuthoringFlow'
import { ModelCatalogItemWizardPreview } from './ModelCatalogItemWizardPreview'
import { ModelServiceLaunchWizardPreview } from './ModelServiceLaunchWizardPreview'

export function VisionModelAuthoringFlowsPage() {
  const [activeFlow, setActiveFlow] = useState<
    'catalog-item' | 'predictive' | 'llm-instruct' | 'llm-tool-calling'
  >('catalog-item')
  const selectedModels = DEMO_APPROVED_MODELS
  const [eligibleClusterIds, setEligibleClusterIds] = useState<readonly string[]>([
    'ocp-us-east-1',
    'ocp-eu-west-1',
  ])
  const [settingModes, setSettingModes] = useState<ModelSettingModes>(() => ({
    ...DEFAULT_MODEL_SETTING_MODES,
  }))

  const changeSettingMode = (id: ModelSettingId, mode: ModelSettingMode) => {
    setSettingModes((current) => ({ ...current, [id]: mode }))
  }

  return (
    <div className="vision-model-authoring-flows">
      <Tabs
        activeKey={activeFlow}
        onSelect={(_event, key) =>
          setActiveFlow(key as 'catalog-item' | 'predictive' | 'llm-instruct' | 'llm-tool-calling')
        }
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
            eligibleClusterIds={eligibleClusterIds}
            onEligibleClusterIdsChange={setEligibleClusterIds}
            settingModes={settingModes}
            onSettingModeChange={changeSettingMode}
          />
        </Tab>
        <Tab
          eventKey="predictive"
          title={<TabTitleText>Launch instance: predictive</TabTitleText>}
          id="vision-model-authoring-flow-tab-predictive"
        >
          <ModelServiceLaunchWizardPreview
            variation="predictive"
            settingModes={settingModes}
            selectedModels={selectedModels}
            eligibleClusterIds={eligibleClusterIds}
          />
        </Tab>
        <Tab
          eventKey="llm-instruct"
          title={<TabTitleText>Launch instance: llm-instruct</TabTitleText>}
          id="vision-model-authoring-flow-tab-llm-instruct"
        >
          <ModelServiceLaunchWizardPreview
            variation="llm-instruct"
            settingModes={settingModes}
            selectedModels={selectedModels}
            eligibleClusterIds={eligibleClusterIds}
          />
        </Tab>
        <Tab
          eventKey="llm-tool-calling"
          title={<TabTitleText>Launch instance: llm-tool-calling</TabTitleText>}
          id="vision-model-authoring-flow-tab-llm-tool-calling"
        >
          <ModelServiceLaunchWizardPreview
            variation="llm-tool-calling"
            settingModes={settingModes}
            selectedModels={selectedModels}
            eligibleClusterIds={eligibleClusterIds}
          />
        </Tab>
      </Tabs>
    </div>
  )
}
