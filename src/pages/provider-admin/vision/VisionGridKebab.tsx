import { useState } from 'react'
import { EllipsisVIcon } from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon'
import {
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
} from '@patternfly/react-core'

export type VisionGridKebabItem = {
  id: string
  label: string
  onClick: () => void
}

type VisionGridKebabProps = {
  id: string
  label: string
  items: VisionGridKebabItem[]
}

export const VisionGridKebab = ({ id, label, items }: VisionGridKebabProps) => {
  const [isOpen, setIsOpen] = useState(false)

  if (items.length === 0) {
    return null
  }

  return (
    <Dropdown
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      onSelect={() => setIsOpen(false)}
      popperProps={{ position: 'right' }}
      toggle={(toggleRef) => (
        <MenuToggle
          ref={toggleRef}
          id={id}
          variant="plain"
          isExpanded={isOpen}
          onClick={(event) => {
            event.stopPropagation()
            setIsOpen((open) => !open)
          }}
          icon={<EllipsisVIcon />}
          aria-label={label}
        />
      )}
    >
      <DropdownList>
        {items.map((item) => (
          <DropdownItem
            key={item.id}
            value={item.id}
            onClick={(event) => {
              event.stopPropagation()
              item.onClick()
            }}
          >
            {item.label}
          </DropdownItem>
        ))}
      </DropdownList>
    </Dropdown>
  )
}
