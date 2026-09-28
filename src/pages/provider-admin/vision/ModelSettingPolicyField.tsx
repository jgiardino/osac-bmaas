import type { ReactNode } from 'react'
import { Content, FormGroup, Label, Title } from '@patternfly/react-core'
import { LockIcon } from '@patternfly/react-icons/dist/esm/icons/lock-icon'
import { UnlockIcon } from '@patternfly/react-icons/dist/esm/icons/unlock-icon'
import type { ModelSettingId, ModelSettingMode } from '../../../vision/modelAuthoringFlow'

type ModelSettingPolicyFieldProps = {
  id: ModelSettingId
  label: string
  value: string
  mode: ModelSettingMode
  onModeChange: (mode: ModelSettingMode) => void
  children?: ReactNode
}

export function ModelSettingPolicyField({
  id,
  label,
  value,
  mode,
  onModeChange,
  children,
}: ModelSettingPolicyFieldProps) {
  const fieldId = `catalog-policy-${id}`

  return (
    <FormGroup label={label} fieldId={fieldId}>
      {children}
      <div
        id={fieldId}
        className="provider-setup-template__cluster-version-mode-options"
        role="radiogroup"
        aria-label={`${label} lock policy`}
      >
        <button
          type="button"
          role="radio"
          aria-checked={mode === 'locked'}
          className={`provider-setup-template__cluster-version-mode-card${
            mode === 'locked' ? ' provider-setup-template__cluster-version-mode-card--selected' : ''
          }`}
          onClick={() => onModeChange('locked')}
        >
          {mode === 'locked' ? (
            <Label
              color="grey"
              isCompact
              className="provider-setup-template__select-card-selected-badge"
            >
              Selected
            </Label>
          ) : null}
          <span className="provider-setup-template__cluster-version-mode-icon" aria-hidden>
            <LockIcon />
          </span>
          <span className="provider-setup-template__cluster-version-mode-copy">
            <Title
              headingLevel="h3"
              size="md"
              className="provider-setup-template__select-card-title"
            >
              Locked
            </Title>
            <Content component="p" className="provider-setup-template__select-card-detail">
              Tenants cannot change it. Value: {value}
            </Content>
          </span>
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={mode === 'editable'}
          className={`provider-setup-template__cluster-version-mode-card${
            mode === 'editable'
              ? ' provider-setup-template__cluster-version-mode-card--selected'
              : ''
          }`}
          onClick={() => onModeChange('editable')}
        >
          {mode === 'editable' ? (
            <Label
              color="grey"
              isCompact
              className="provider-setup-template__select-card-selected-badge"
            >
              Selected
            </Label>
          ) : null}
          <span className="provider-setup-template__cluster-version-mode-icon" aria-hidden>
            <UnlockIcon />
          </span>
          <span className="provider-setup-template__cluster-version-mode-copy">
            <Title
              headingLevel="h3"
              size="md"
              className="provider-setup-template__select-card-title"
            >
              Editable at provisioning
            </Title>
            <Content component="p" className="provider-setup-template__select-card-detail">
              Tenants can change it at launch. Default: {value}
            </Content>
          </span>
        </button>
      </div>
    </FormGroup>
  )
}
