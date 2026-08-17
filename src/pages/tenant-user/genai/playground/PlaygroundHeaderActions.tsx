import { useState } from 'react';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Tooltip,
} from '@patternfly/react-core';
import CodeIcon from '@patternfly/react-icons/dist/esm/icons/code-icon';
import CogIcon from '@patternfly/react-icons/dist/esm/icons/cog-icon';
import ColumnsIcon from '@patternfly/react-icons/dist/esm/icons/columns-icon';
import EllipsisVIcon from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon';
import PlusIcon from '@patternfly/react-icons/dist/esm/icons/plus-icon';


interface PlaygroundHeaderActionsProps {
  isSettingsOpen: boolean;
  onSettingsClick: () => void;
  onNewChat: () => void;
  onCompareChat: () => void;
  onViewCode: () => void;
  onUpdatePlayground: () => void;
  onDeletePlayground: () => void;
}

/**
 * Mirrors odh-dashboard ChatbotHeaderActions (ready-state actions).
 * Agent load/save items are omitted until feature-flag decision (agentConfigManagement).
 */
const PlaygroundHeaderActions = ({
  isSettingsOpen,
  onSettingsClick,
  onNewChat,
  onCompareChat,
  onViewCode,
  onUpdatePlayground,
  onDeletePlayground,
}: PlaygroundHeaderActionsProps) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  return (
    <Toolbar inset={{ default: 'insetNone' }} className="pf-m-full-width">
      <ToolbarContent className="pf-v6-u-flex-nowrap">
        <ToolbarItem>
          <Button
            variant="link"
            icon={<ColumnsIcon />}
            onClick={onCompareChat}
            id="playground-compare-chat"
          >
            {'Compare chat'}
          </Button>
        </ToolbarItem>
        <ToolbarItem>
          <Button variant="link" icon={<PlusIcon />} onClick={onNewChat} id="playground-new-chat">
            {'New chat'}
          </Button>
        </ToolbarItem>
        <ToolbarItem>
          <Tooltip content={'Please input a message and select a model to generate code'}>
            <Button
              variant="link"
              icon={<CodeIcon />}
              isAriaDisabled
              onClick={onViewCode}
              id="playground-view-code"
            >
              {'View code'}
            </Button>
          </Tooltip>
        </ToolbarItem>
        <ToolbarItem variant="separator" />
        <ToolbarItem>
          <Button
            variant="link"
            icon={<CogIcon />}
            aria-expanded={isSettingsOpen}
            onClick={onSettingsClick}
            id="playground-settings"
          >
            {'Settings'}
          </Button>
        </ToolbarItem>
        <ToolbarItem>
          <Dropdown
            isOpen={isDropdownOpen}
            onOpenChange={setDropdownOpen}
            onSelect={() => setDropdownOpen(false)}
            toggle={(toggleRef) => (
              <MenuToggle
                ref={toggleRef}
                variant="plain"
                isExpanded={isDropdownOpen}
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                aria-label={'Playground actions'}
                id="playground-header-kebab"
              >
                <EllipsisVIcon />
              </MenuToggle>
            )}
          >
            <DropdownList>
              <DropdownItem onClick={onUpdatePlayground}>{'Update playground'}</DropdownItem>
              <DropdownItem onClick={onDeletePlayground}>{'Delete playground'}</DropdownItem>
            </DropdownList>
          </Dropdown>
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
};

export default PlaygroundHeaderActions;
