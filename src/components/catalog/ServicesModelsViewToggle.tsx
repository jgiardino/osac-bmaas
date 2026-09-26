import { ToggleGroup, ToggleGroupItem } from '@patternfly/react-core'
import { ListIcon } from '@patternfly/react-icons/dist/esm/icons/list-icon'
import { ThIcon } from '@patternfly/react-icons/dist/esm/icons/th-icon'

export type ServicesModelsViewMode =
  | 'current-cards'
  | 'current-table'
  | 'original-cards'
  | 'original-table'

interface ServicesModelsViewToggleProps {
  viewMode: ServicesModelsViewMode
  onChange: (viewMode: ServicesModelsViewMode) => void
}

export const ServicesModelsViewToggle = ({
  viewMode,
  onChange,
}: ServicesModelsViewToggleProps) => (
  <ToggleGroup aria-label="Models display">
    <ToggleGroupItem
      icon={<ThIcon />}
      text="Current cards"
      aria-label="Current cards view"
      buttonId="models-view-current-cards"
      isSelected={viewMode === 'current-cards'}
      onChange={() => onChange('current-cards')}
    />
    <ToggleGroupItem
      icon={<ListIcon />}
      text="Current table"
      aria-label="Current table view"
      buttonId="models-view-current-table"
      isSelected={viewMode === 'current-table'}
      onChange={() => onChange('current-table')}
    />
    <ToggleGroupItem
      icon={<ThIcon />}
      text="Original cards"
      aria-label="Original cards view"
      buttonId="models-view-original-cards"
      isSelected={viewMode === 'original-cards'}
      onChange={() => onChange('original-cards')}
    />
    <ToggleGroupItem
      icon={<ListIcon />}
      text="Original table"
      aria-label="Original table view"
      buttonId="models-view-original-table"
      isSelected={viewMode === 'original-table'}
      onChange={() => onChange('original-table')}
    />
  </ToggleGroup>
)
