import { useState } from 'react'
import { Content, FormGroup, Label, Title } from '@patternfly/react-core'
import type { ModelSettingId, ModelSettingMode, ModelSettingModes } from '../../../vision/modelAuthoringFlow'
import { CatalogTenantAccessCards } from './CatalogTenantAccessCards'

type ModelCatalogServingConfigurationStepProps = {
  llmOnly: boolean
  settingModes: ModelSettingModes
  onSettingModeChange: (id: ModelSettingId, mode: ModelSettingMode) => void
}

const DEPLOYMENT_METHODS = [
  {
    id: 'standard',
    label: 'LLM inference service',
    description: 'Deploy a large language model using the standard LLM inference service.',
  },
  {
    id: 'llm-d',
    label: 'LLM inference service with llm-d',
    description:
      'Deploy a large language model with llm-d for additional scheduling and routing capabilities.',
  },
] as const

const SERVING_RUNTIMES = [
  'vLLM NVIDIA GPU config',
  'vLLM Intel Gaudi Accelerator config',
  'vLLM Spyre on x86 config',
  'vLLM AMD GPU config',
  'vLLM CPU (ppc64le/s390x) config',
  'vLLM CPU (amd 64-EXPERIMENTAL) config',
  'vLLM Spyre s390x config',
] as const

const getOptionClassName = (selected: boolean) =>
  `provider-setup-template__select-card provider-setup-template__select-card--instance-type${
    selected ? ' provider-setup-template__select-card--selected' : ''
  }`

export function ModelCatalogServingConfigurationStep({
  llmOnly,
  settingModes,
  onSettingModeChange,
}: ModelCatalogServingConfigurationStepProps) {
  const [deploymentMethod, setDeploymentMethod] = useState('standard')
  const [servingRuntime, setServingRuntime] = useState<string>(SERVING_RUNTIMES[0])

  return (
    <div className="provider-setup-template__publish-hardware-step">
      <Content component="p" className="provider-setup-template__publish-step-lede">
        Choose the default deployment method and serving runtime.
      </Content>
      <CatalogTenantAccessCards
        fieldId="model-catalog-serving-configuration-access"
        label="Tenant access to serving method and runtime"
        mode={
          settingModes.servingMethod === 'locked' && settingModes.runtime === 'locked'
            ? 'locked'
            : 'editable'
        }
        onChange={(mode) => {
          onSettingModeChange('servingMethod', mode)
          onSettingModeChange('runtime', mode)
        }}
      />

      {llmOnly ? (
        <FormGroup label="Deployment method" fieldId="model-catalog-deployment-method">
            <div
              id="model-catalog-deployment-method"
              className="provider-setup-template__card-group provider-setup-template__card-group--instance-types provider-setup-template__card-group--instance-types-fill"
              role="radiogroup"
              aria-label="Deployment method"
            >
              {DEPLOYMENT_METHODS.map(({ id, label, description }) => {
                const selected = deploymentMethod === id
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    className={getOptionClassName(selected)}
                    onClick={() => setDeploymentMethod(id)}
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
                      headingLevel="h3"
                      size="md"
                      className="provider-setup-template__select-card-title"
                    >
                      {label}
                    </Title>
                    <Content component="p" className="provider-setup-template__select-card-detail">
                      {description}
                    </Content>
                  </button>
                )
              })}
            </div>
        </FormGroup>
      ) : null}

      <FormGroup label="Serving runtime" fieldId="model-catalog-serving-runtime">
        <div
          id="model-catalog-serving-runtime"
          className="provider-setup-template__card-group provider-setup-template__card-group--instance-types provider-setup-template__card-group--instance-types-fill"
          role="radiogroup"
          aria-label="Serving runtime"
        >
          {SERVING_RUNTIMES.map((runtime) => {
            const selected = servingRuntime === runtime
            return (
              <button
                key={runtime}
                type="button"
                role="radio"
                aria-checked={selected}
                className={getOptionClassName(selected)}
                onClick={() => setServingRuntime(runtime)}
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
                  headingLevel="h3"
                  size="md"
                  className="provider-setup-template__select-card-title"
                >
                  {runtime}
                </Title>
              </button>
            )
          })}
        </div>
      </FormGroup>
    </div>
  )
}
