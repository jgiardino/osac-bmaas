import type { ReactNode } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarsIcon } from '@patternfly/react-icons/dist/esm/icons/bars-icon'
import { CogIcon } from '@patternfly/react-icons/dist/esm/icons/cog-icon'
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon'
import { UserIcon } from '@patternfly/react-icons/dist/esm/icons/user-icon'
import {
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownList,
  Label,
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadLogo,
  MastheadMain,
  MastheadToggle,
  MenuToggle,
  Nav,
  NavExpandable,
  NavItem,
  NavList,
  Page,
  PageSection,
  PageSidebar,
  PageSidebarBody,
  PageToggleButton,
  Spinner,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core'
import {
  PROVIDER_ADMIN_ADMINISTRATION_NAV_ITEMS,
  PROVIDER_ADMIN_AI_NAV_ITEMS,
  PROVIDER_ADMIN_MODEL_DEPLOYMENT_MVP_AI_NAV_ITEMS,
  PROVIDER_ADMIN_NETWORKING_NAV_ID,
  PROVIDER_ADMIN_NETWORKING_NAV_LABEL,
  resolveProviderAdminNavId,
  isAdministrationNavId,
  isProviderAiNavId,
  isNetworkingNavId,
  type ProviderAdminNavId,
} from '../../providerAdmin/constants'
import { clearProviderOnboardingState } from '../../providerSetup/storage'
import type { WorkspaceTransition } from '../../providerAdmin/workspace'
import { UserPreferencesModal } from '../shared/UserPreferencesModal'
import { VertexaCloudMastheadLogo } from './VertexaCloudMastheadLogo'

type ProviderAdminShellProps = {
  children: ReactNode
  showNavigation?: boolean
  activeNavId?: ProviderAdminNavId
  onNavChange?: (navId: ProviderAdminNavId) => void
  workspaceTransition?: WorkspaceTransition
  isModelDeploymentMvp?: boolean
}

export function ProviderAdminShell({
  children,
  showNavigation = false,
  activeNavId = 'overview',
  onNavChange,
  workspaceTransition = 'idle',
  isModelDeploymentMvp = false,
}: ProviderAdminShellProps) {
  const navigate = useNavigate()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false)
  const [expandedNavGroups, setExpandedNavGroups] = useState<Set<string>>(
    () => new Set(isProviderAiNavId(activeNavId) ? ['ai'] : []),
  )
  const providerAiNavItems = isModelDeploymentMvp
    ? PROVIDER_ADMIN_MODEL_DEPLOYMENT_MVP_AI_NAV_ITEMS
    : PROVIDER_ADMIN_AI_NAV_ITEMS
  const isContentFilled = activeNavId === 'ai-grid'
  const aiNavigation = (
    <NavExpandable
      id="provider-admin-ai-nav"
      title="AI"
      isExpanded={expandedNavGroups.has('ai')}
      isActive={isProviderAiNavId(activeNavId)}
      onExpand={(_event, isExpanded) => {
        setExpandedNavGroups((current) => {
          const next = new Set(current)
          if (isExpanded) {
            next.add('ai')
          } else {
            next.delete('ai')
          }
          return next
        })
      }}
    >
      {providerAiNavItems.map((item) => (
        <NavItem
          key={item.id}
          itemId={item.id}
          isActive={activeNavId === item.id}
          to="#"
          preventDefault
        >
          {item.label}
        </NavItem>
      ))}
    </NavExpandable>
  )

  const header = (
    <Masthead>
      <MastheadMain>
        <MastheadToggle>
          <PageToggleButton variant="plain" aria-label="Global navigation">
            <BarsIcon />
          </PageToggleButton>
        </MastheadToggle>
        <MastheadBrand>
          <MastheadLogo className="vertexa-masthead-logo">
            <VertexaCloudMastheadLogo />
          </MastheadLogo>
        </MastheadBrand>
      </MastheadMain>

      <MastheadContent className="provider-admin-masthead-content">
        <span className="provider-admin-masthead-content__spacer" aria-hidden />

        <Toolbar ouiaId="provider-admin-masthead-utilities" className="provider-admin-masthead-utilities">
          <ToolbarContent alignItems="center">
            <ToolbarGroup
              align={{ default: 'alignEnd' }}
              variant="action-group-plain"
              gap={{ default: 'gapSm' }}
            >
              <ToolbarItem>
                <Button variant="plain" aria-label="Help">
                  <OutlinedQuestionCircleIcon />
                </Button>
              </ToolbarItem>
              <ToolbarItem>
                <Dropdown
                  isOpen={isUserMenuOpen}
                  onOpenChange={setIsUserMenuOpen}
                  onSelect={() => setIsUserMenuOpen(false)}
                  popperProps={{ position: 'right' }}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      isExpanded={isUserMenuOpen}
                      onClick={() => setIsUserMenuOpen((open) => !open)}
                      icon={<UserIcon />}
                      className="provider-admin-masthead-account-toggle"
                      aria-label="Alex Johnson, Provider Admin"
                    >
                      <span className="provider-admin-masthead-account">
                        <span className="provider-admin-masthead-account__name">Alex Johnson</span>
                        <Label color="grey" isCompact className="provider-admin-masthead-account__role">
                          Provider Admin
                        </Label>
                      </span>
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem
                      value="user-preferences"
                      icon={<CogIcon />}
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        setIsPreferencesModalOpen(true)
                      }}
                    >
                      User preferences
                    </DropdownItem>
                    <Divider />
                    <DropdownItem
                      value="logout"
                      onClick={() => {
                        clearProviderOnboardingState()
                        navigate('/')
                      }}
                    >
                      Log out
                    </DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      </MastheadContent>
    </Masthead>
  )

  const sidebar = showNavigation ? (
    <PageSidebar>
      <PageSidebarBody isFilled>
        <Nav
          aria-label="Provider admin"
          onSelect={(_event, item) => {
            const navId = resolveProviderAdminNavId(String(item.itemId) as ProviderAdminNavId)
            onNavChange?.(navId)
          }}
        >
          <NavList>
            <NavItem
              itemId="overview"
              isActive={activeNavId === 'overview'}
              to="#"
              preventDefault
            >
              Overview
            </NavItem>
            <NavItem itemId="catalog" isActive={activeNavId === 'catalog'} to="#" preventDefault>
              Catalog
            </NavItem>
            {aiNavigation}
            <NavExpandable
              id="provider-admin-administration-nav"
              title="Administration"
              isExpanded={expandedNavGroups.has('administration')}
              isActive={isAdministrationNavId(activeNavId)}
              onExpand={(_event, isExpanded) => {
                setExpandedNavGroups((current) => {
                  const next = new Set(current)
                  if (isExpanded) {
                    next.add('administration')
                  } else {
                    next.delete('administration')
                  }
                  return next
                })
              }}
            >
              {PROVIDER_ADMIN_ADMINISTRATION_NAV_ITEMS.map((item) => (
                <NavItem
                  key={item.id}
                  itemId={item.id}
                  isActive={
                    activeNavId === item.id ||
                    (activeNavId === 'provider-ai-model-catalog-settings' &&
                      item.id === 'provider-ai-models')
                  }
                  to="#"
                  preventDefault
                >
                  {item.label}
                </NavItem>
              ))}
            </NavExpandable>
            <NavItem
              itemId={PROVIDER_ADMIN_NETWORKING_NAV_ID}
              isActive={isNetworkingNavId(activeNavId)}
              to="#"
              preventDefault
            >
              {PROVIDER_ADMIN_NETWORKING_NAV_LABEL}
            </NavItem>
            <NavItem itemId="secrets" isActive={activeNavId === 'secrets'} to="#" preventDefault>
              Secrets
            </NavItem>
          </NavList>
        </Nav>
      </PageSidebarBody>
    </PageSidebar>
  ) : undefined

  return (
    <>
      <Page
        masthead={header}
        sidebar={sidebar}
        isManagedSidebar={showNavigation}
        isContentFilled={isContentFilled}
        className={[
          showNavigation ? 'provider-admin-shell-page' : undefined,
          workspaceTransition === 'entering' ? 'provider-admin-shell-page--entering' : undefined,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <PageSection
          isFilled={isContentFilled}
          isWidthLimited={!showNavigation}
          isCenterAligned={!showNavigation}
          className="provider-admin-shell__main"
        >
          {workspaceTransition !== 'idle' ? (
            <div
              className={`provider-admin-publishing-overlay provider-admin-publishing-overlay--${workspaceTransition}`}
              aria-live="polite"
              aria-busy="true"
            >
              <Spinner size="xl" aria-label="Publishing catalog item" />
            </div>
          ) : null}
          <div className="provider-admin-shell__content">{children}</div>
        </PageSection>
      </Page>
      <UserPreferencesModal
        isOpen={isPreferencesModalOpen}
        onClose={() => setIsPreferencesModalOpen(false)}
      />
    </>
  )
}
