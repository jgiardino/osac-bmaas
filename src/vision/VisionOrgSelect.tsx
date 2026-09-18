import { FormSelect, FormSelectOption } from '@patternfly/react-core'

import { VISION_ORGS, type VisionOrgId } from './fleetWorld'

type VisionOrgSelectProps = {
  id: string
  value: VisionOrgId
  onChange: (orgId: VisionOrgId) => void
}

const VisionOrgSelect = ({ id, value, onChange }: VisionOrgSelectProps) => (
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

export default VisionOrgSelect
