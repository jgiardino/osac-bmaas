import { Content, FormGroup, Label, Title } from '@patternfly/react-core'
import { LockIcon } from '@patternfly/react-icons/dist/esm/icons/lock-icon'
import { UnlockIcon } from '@patternfly/react-icons/dist/esm/icons/unlock-icon'
import type { ModelSettingMode } from '../../../vision/modelAuthoringFlow'

type CatalogTenantAccessCardsProps = {
  fieldId: string
  label: string
  mode: ModelSettingMode
  onChange: (mode: ModelSettingMode) => void
}

export function CatalogTenantAccessCards({
  fieldId,
  label,
  mode,
  onChange,
}: CatalogTenantAccessCardsProps) {
  return (
    <FormGroup label={label} fieldId={fieldId} role="radiogroup">
      <div className="provider-setup-template__cluster-version-mode-options">
        <button
          type="button"
          role="radio"
          aria-checked={mode === 'locked'}
          className={`provider-setup-template__cluster-version-mode-card${
            mode === 'locked' ? ' provider-setup-template__cluster-version-mode-card--selected' : ''
          }`}
          onClick={() => onChange('locked')}
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
              headingLevel="h4"
              size="md"
              className="provider-setup-template__select-card-title"
            >
              Locked
            </Title>
            <Content component="p" className="provider-setup-template__select-card-detail">
              Tenants cannot change it.
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
          onClick={() => onChange('editable')}
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
              headingLevel="h4"
              size="md"
              className="provider-setup-template__select-card-title"
            >
              Editable at provisioning
            </Title>
            <Content component="p" className="provider-setup-template__select-card-detail">
              Tenants can change at launch.
            </Content>
          </span>
        </button>
      </div>
    </FormGroup>
  )
}
