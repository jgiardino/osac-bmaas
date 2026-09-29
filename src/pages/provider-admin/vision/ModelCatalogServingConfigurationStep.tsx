import { useState } from 'react'
import {
  Form,
  FormGroup,
  FormSection,
  Label,
  MenuToggle,
  Radio,
  Select,
  SelectList,
  SelectOption,
  TextInput,
  Title,
} from '@patternfly/react-core'
import type { ModelSettingId, ModelSettingMode, ModelSettingModes } from '../../../vision/modelAuthoringFlow'
import { DEPLOYMENT_METHODS, SERVING_RUNTIMES } from './modelWizardOptions'
import { CatalogTenantAccessCards } from './CatalogTenantAccessCards'

type ModelCatalogServingConfigurationStepProps = {
  llmOnly: boolean
  settingModes: ModelSettingModes
  onSettingModeChange: (id: ModelSettingId, mode: ModelSettingMode) => void
}

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
  const [servingRuntime, setServingRuntime] = useState('')
  const [servingRuntimeSelection, setServingRuntimeSelection] = useState<'auto' | 'manual'>('auto')
  const [isServingRuntimeOpen, setIsServingRuntimeOpen] = useState(false)

  return (
    <Form autoComplete="off" className="provider-setup-template__publish-hardware-step">
      <FormSection>
        <p>Choose the default deployment method and serving runtime.</p>
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
      </FormSection>

      {llmOnly ? (
        <FormSection>
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
                    <Title headingLevel="h3" size="md">
                      {label}
                    </Title>
                    <p className="provider-setup-template__select-card-detail">{description}</p>
                  </button>
                )
              })}
            </div>
          </FormGroup>
        </FormSection>
      ) : null}

      <FormSection>
        <FormGroup
          label="Accelerator configuration"
          fieldId="model-catalog-serving-runtime"
          isRequired
        >
          <div className="pf-v6-u-mb-md">
            <Radio
              id="model-catalog-auto-accelerator"
              name="model-catalog-accelerator-selection"
              label={
                <>
                  <strong>Automatic selection:</strong> Automatically select the best accelerator
                  configuration for my model based on the selected hardware profile.
                </>
              }
              isChecked={servingRuntimeSelection === 'auto'}
              onChange={() => setServingRuntimeSelection('auto')}
            />
            {servingRuntimeSelection === 'auto' ? (
              <div className="pf-v6-u-ml-lg pf-v6-u-mt-sm">
                <TextInput
                  value="vLLM NVIDIA GPU config"
                  isDisabled
                  aria-label="Automatically selected accelerator configuration"
                />
              </div>
            ) : null}
          </div>
          <Radio
            id="model-catalog-manual-accelerator"
            name="model-catalog-accelerator-selection"
            label={
              <>
                <strong>Manual selection:</strong> Manually select an accelerator configuration
                from a list of preconfigured and custom accelerator configurations.
              </>
            }
            isChecked={servingRuntimeSelection === 'manual'}
            onChange={() => setServingRuntimeSelection('manual')}
          />
          {servingRuntimeSelection === 'manual' ? (
            <div className="pf-v6-u-ml-lg pf-v6-u-mt-sm">
              <Select
                id="model-catalog-serving-runtime-select"
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
                    id="model-catalog-serving-runtime-toggle"
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
        </FormGroup>
      </FormSection>
    </Form>
  )
}
