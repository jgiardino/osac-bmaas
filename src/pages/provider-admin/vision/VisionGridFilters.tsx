import { useLayoutEffect, useRef } from 'react'
import {
  FormSelect,
  FormSelectOption,
  ToggleGroup,
  ToggleGroupItem,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Tooltip,
} from '@patternfly/react-core'
import { VISION_ORGS, type VisionOrgFilter } from '../../../vision/fleetWorld'
import type { VisionDrawerTab } from '../../../vision/visionDrawer'

type VisionGridFiltersProps = {
  orgFilter: VisionOrgFilter
  view: VisionDrawerTab
  onOrgChange: (value: VisionOrgFilter) => void
  onViewChange: (view: VisionDrawerTab) => void
  showTenantFilter?: boolean
}

export const VisionGridFilters = ({
  orgFilter,
  view,
  onOrgChange,
  onViewChange,
  showTenantFilter = true,
}: VisionGridFiltersProps) => {
  const catalogTriggerRef = useRef<HTMLElement>(null)
  const servicesTriggerRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    catalogTriggerRef.current = document.getElementById('vision-view-catalog')
    servicesTriggerRef.current = document.getElementById('vision-view-services')
  }, [])

  return (
    <Toolbar id="vision-grid-toolbar" hasNoPadding>
      <ToolbarContent>
        {showTenantFilter ? (
          <ToolbarGroup variant="filter-group">
            <ToolbarItem>
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
            </ToolbarItem>
          </ToolbarGroup>
        ) : null}
        <ToolbarGroup align={{ default: 'alignEnd' }} variant="action-group">
          <ToolbarItem>
            <Tooltip
              content="Browse available offerings in the catalog to launch."
              triggerRef={catalogTriggerRef}
              position="bottom"
              enableFlip={false}
              maxWidth="calc(8ch + 3rem)"
              className="vision-grid-view-tooltip"
            />
            <Tooltip
              content="Monitor and manage services across the grid."
              triggerRef={servicesTriggerRef}
              position="bottom"
              enableFlip={false}
              maxWidth="calc(8ch + 3rem)"
              className="vision-grid-view-tooltip"
            />
            <ToggleGroup aria-label="Catalog or services" id="vision-view-toggle">
              <ToggleGroupItem
                text="Catalog"
                buttonId="vision-view-catalog"
                isSelected={view === 'catalog'}
                onChange={() => onViewChange('catalog')}
              />
              <ToggleGroupItem
                text="Services"
                buttonId="vision-view-services"
                isSelected={view === 'services'}
                onChange={() => onViewChange('services')}
              />
            </ToggleGroup>
          </ToolbarItem>
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  )
}
