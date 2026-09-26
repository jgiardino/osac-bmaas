import { Flex, FlexItem, FormGroup, FormSelect, FormSelectOption, Label } from '@patternfly/react-core'
import type { ModelSettingMode } from '../../../vision/modelAuthoringFlow'

type ModelLaunchSettingFieldProps = {
  id: string
  label: string
  value: string
  options: readonly string[]
  mode: ModelSettingMode
  onChange: (value: string) => void
}

export function ModelLaunchSettingField({
  id,
  label,
  value,
  options,
  mode,
  onChange,
}: ModelLaunchSettingFieldProps) {
  const isLocked = mode === 'locked'

  return (
    <FormGroup label={label} fieldId={id}>
      <Flex
        spaceItems={{ default: 'spaceItemsMd' }}
        alignItems={{ default: 'alignItemsCenter' }}
        flexWrap={{ default: 'wrap' }}
      >
        <FlexItem flex={{ default: 'flex_1' }}>
          <FormSelect
            id={id}
            value={value}
            isDisabled={isLocked}
            onChange={(_event, nextValue) => onChange(nextValue)}
            aria-label={label}
          >
            {options.map((option) => (
              <FormSelectOption key={option} value={option} label={option} />
            ))}
          </FormSelect>
        </FlexItem>
        <FlexItem>
          <Label color={isLocked ? 'grey' : 'purple'} isCompact>
            {isLocked ? 'Locked by catalog item' : 'Editable at launch'}
          </Label>
        </FlexItem>
      </Flex>
    </FormGroup>
  )
}
