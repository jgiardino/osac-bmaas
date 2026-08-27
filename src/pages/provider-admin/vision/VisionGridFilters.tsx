import {
  FormGroup,
  FormSelect,
  FormSelectOption,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core'
import {
  VISION_ORGS,
  gatewaysForOrgFilter,
  type VisionGatewayFilter,
  type VisionOrgFilter,
} from '../../../vision/fleetWorld'

type VisionGridFiltersProps = {
  orgFilter: VisionOrgFilter
  gatewayFilter: VisionGatewayFilter
  onOrgChange: (value: VisionOrgFilter) => void
  onGatewayChange: (value: VisionGatewayFilter) => void
}

export const VisionGridFilters = ({
  orgFilter,
  gatewayFilter,
  onOrgChange,
  onGatewayChange,
}: VisionGridFiltersProps) => {
  const gateways = gatewaysForOrgFilter(orgFilter)

  return (
    <Toolbar id="vision-grid-toolbar" inset={{ default: 'insetMd' }}>
      <ToolbarContent>
        <ToolbarGroup variant="filter-group">
          <ToolbarItem>
            <FormGroup label="Tenant" fieldId="vision-filter-org">
              <FormSelect
                id="vision-filter-org"
                value={orgFilter}
                onChange={(_event, value) => onOrgChange(value as VisionOrgFilter)}
                aria-label="Filter by tenant"
              >
                <FormSelectOption value="all" label="All tenants" />
                {VISION_ORGS.map((org) => (
                  <FormSelectOption key={org.id} value={org.id} label={org.label} />
                ))}
              </FormSelect>
            </FormGroup>
          </ToolbarItem>
          <ToolbarItem>
            <FormGroup label="Gateway" fieldId="vision-filter-gateway">
              <FormSelect
                id="vision-filter-gateway"
                value={gatewayFilter}
                onChange={(_event, value) => onGatewayChange(value as VisionGatewayFilter)}
                aria-label="Filter by gateway"
              >
                <FormSelectOption value="all" label="All gateways" />
                {gateways.map((gateway) => (
                  <FormSelectOption
                    key={gateway.id}
                    value={gateway.id}
                    label={`${gateway.label} (${gateway.hostname})`}
                  />
                ))}
              </FormSelect>
            </FormGroup>
          </ToolbarItem>
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  )
}
