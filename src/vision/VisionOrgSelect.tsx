import { useState } from 'react'
import {
  FormSelect,
  FormSelectOption,
  MenuToggle,
  Select,
  SelectList,
  SelectOption,
} from '@patternfly/react-core'

import { VISION_ORGS, type VisionOrgId } from './fleetWorld'

type VisionOrgSelectProps = {
  id: string
  value: VisionOrgId
  onChange: (orgId: VisionOrgId) => void
  menuToggle?: boolean
}

const VisionOrgSelect = ({ id, value, onChange, menuToggle = false }: VisionOrgSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)

  if (!menuToggle) {
    return (
      <FormSelect
        id={id}
        value={value}
        onChange={(_event, next) => onChange(next as VisionOrgId)}
        aria-label="Filter by tenant"
      >
        {VISION_ORGS.map((org) => (
          <FormSelectOption key={org.id} value={org.id} label={org.label} />
        ))}
      </FormSelect>
    )
  }

  const selectedOrg = VISION_ORGS.find((org) => org.id === value)

  return (
    <Select
      id={id}
      isOpen={isOpen}
      selected={value}
      onSelect={(_event, next) => {
        if (next != null) {
          onChange(next as VisionOrgId)
        }
        setIsOpen(false)
      }}
      onOpenChange={setIsOpen}
      toggle={(toggleRef) => (
        <MenuToggle
          ref={toggleRef}
          id={`${id}-toggle`}
          isExpanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          aria-label={`Filter by tenant: ${selectedOrg?.label ?? value}`}
          className="vision-org-select__toggle pf-v6-u-py-sm"
        >
          {selectedOrg?.label ?? value}
        </MenuToggle>
      )}
    >
      <SelectList>
        {VISION_ORGS.map((org) => (
          <SelectOption key={org.id} value={org.id} isSelected={org.id === value}>
            {org.label}
          </SelectOption>
        ))}
      </SelectList>
    </Select>
  )
}

export default VisionOrgSelect
