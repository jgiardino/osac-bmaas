import { FormGroup, FormSelect, FormSelectOption } from '@patternfly/react-core'
import type { ModelSettingId, ModelSettingMode } from '../../../vision/modelAuthoringFlow'

type ModelSettingPolicyFieldProps = {
  id: ModelSettingId
  label: string
  value: string
  mode: ModelSettingMode
  onModeChange: (mode: ModelSettingMode) => void
}

export function ModelSettingPolicyField({
  id,
  label,
  value,
  mode,
  onModeChange,
}: ModelSettingPolicyFieldProps) {
  const inputId = `catalog-policy-${id}`

  return (
    <FormGroup label={label} fieldId={inputId}>
      <FormSelect
        id={inputId}
        value={mode}
        onChange={(_event, nextValue) => onModeChange(nextValue as ModelSettingMode)}
        aria-label={`${label} tenant choice policy`}
      >
        <FormSelectOption value="locked" label={`Locked — ${value}`} />
        <FormSelectOption value="editable" label={`Editable at launch — default: ${value}`} />
      </FormSelect>
    </FormGroup>
  )
}
