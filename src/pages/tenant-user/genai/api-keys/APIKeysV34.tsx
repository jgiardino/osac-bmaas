import * as React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Alert,
  AlertActionCloseButton,
  AlertGroup,
  AlertVariant,
  Badge,
  Button,
  Content,
  ContentVariants,
  Dropdown,
  DropdownItem,
  DropdownList,
  InputGroup,
  InputGroupItem,
  Label,
  MenuToggle,
  Pagination,
  Popover,
  Select,
  SelectList,
  SelectOption,
  Split,
  SplitItem,
  Tab,
  TabTitleText,
  Tabs,
  TextInput,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import BanIcon from '@patternfly/react-icons/dist/esm/icons/ban-icon';
import EllipsisVIcon from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon';
import OutlinedClockIcon from '@patternfly/react-icons/dist/esm/icons/outlined-clock-icon';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import type { ThProps } from '@patternfly/react-table';

import ListPage from '../osacStubs/ListPage';
import { GenaiPageStack } from '../GenaiPageStack';

import { addDynamicKey, getDynamicKeys } from './apiKeysStoreV34';
import { CreateAPIKeyModalV34 } from './components/CreateAPIKeyModalV34';
import { ModelAccessTable } from './components/ModelAccessTable';
import { RevokeAllAPIKeysModal, type RevokeAllTargetKind, type RevokePreviewMode } from './components/RevokeAllAPIKeysModal';
import { mockApiKeysAdminV34, mockApiKeysEngineerV34, mockHeavyUserKeysV34 } from './mockDataV34';
import { useModalFromURL, useUserProfile } from './stubs';
import type { ApiKeyStatusV34, ApiKeyV34 } from './typesV34';
import { useApiKeysPaths } from './useApiKeysPaths';

const ALL_STATUSES: ApiKeyStatusV34[] = ['active', 'revoked', 'expired'];
const DEFAULT_VISIBLE_STATUSES: ApiKeyStatusV34[] = ['active'];

interface APIKeysV34Props {
  revokePreviewMode?: RevokePreviewMode;
  maxExpirationDays?: number;
  simulateExpiryServerError?: number;
  modelDisplayStyle?: 'chips' | 'flat' | 'table';
  kicker?: string;
}

const APIKeysV34: React.FunctionComponent<APIKeysV34Props> = ({
  revokePreviewMode = 'capped',
  maxExpirationDays,
  simulateExpiryServerError,
  modelDisplayStyle = 'chips',
  kicker,
}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { userProfile } = useUserProfile();
  const { isAdmin: isAdminSurface, keyDetailsPath, subscriptionDetailsPath } = useApiKeysPaths();
  const isAdmin = userProfile === 'AI Admin';

  const getInitialKeys = React.useCallback(() => {
    const mock = isAdmin
      ? [...mockApiKeysAdminV34, ...mockHeavyUserKeysV34]
      : mockApiKeysEngineerV34;
    return [...getDynamicKeys(), ...mock];
  }, [isAdmin]);

  const [apiKeys, setApiKeys] = React.useState<ApiKeyV34[]>(getInitialKeys);

  React.useEffect(() => {
    setApiKeys(getInitialKeys());
  }, [getInitialKeys]);

  const {
    isOpen: isCreateModalOpen,
    open: openCreateModal,
    close: closeCreateModal,
  } = useModalFromURL('create');
  const [isRevokeAllModalOpen, setIsRevokeAllModalOpen] = React.useState(false);
  const [revokeTargetKind, setRevokeTargetKind] = React.useState<RevokeAllTargetKind>('user');
  const [openKebabMenus, setOpenKebabMenus] = React.useState<Set<string>>(new Set());
  const [isPageActionsOpen, setIsPageActionsOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [submittedSearch, setSubmittedSearch] = React.useState('');

  // Status filter
  const [statusFilters, setStatusFilters] = React.useState<Set<ApiKeyStatusV34>>(
    new Set(DEFAULT_VISIBLE_STATUSES),
  );
  const [isStatusFilterOpen, setIsStatusFilterOpen] = React.useState(false);

  // Pagination
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(20);

  // Toast alerts
  const [toastAlerts, setToastAlerts] = React.useState<React.ReactElement[]>([]);

  // Sorting
  const [activeSortIndex, setActiveSortIndex] = React.useState<number | null>(null);
  const [activeSortDirection, setActiveSortDirection] = React.useState<'asc' | 'desc'>('desc');

  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: activeSortIndex ?? undefined,
      direction: activeSortDirection,
    },
    onSort: (_event, index, direction) => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
    },
    columnIndex,
  });

  const filteredApiKeys = React.useMemo(() => {
    let result = apiKeys;

    // Status filter
    if (statusFilters.size < ALL_STATUSES.length) {
      result = result.filter((key) => statusFilters.has(key.status));
    }

    // Keyword search (submit-based, not typeahead — API requires explicit search)
    if (submittedSearch.trim()) {
      const searchLower = submittedSearch.toLowerCase();
      result = result.filter(
        (key) =>
          key.name.toLowerCase().includes(searchLower) ||
          (key.description && key.description.toLowerCase().includes(searchLower)) ||
          key.username.toLowerCase().includes(searchLower),
      );
    }

    // Sorting (aligned to API: name, created_at, expires_at, last_used_at)
    if (activeSortIndex !== null) {
      result = [...result].sort((a, b) => {
        let aVal: string | number | undefined;
        let bVal: string | number | undefined;

        switch (activeSortIndex) {
          case 0: // Name
            aVal = a.name.toLowerCase();
            bVal = b.name.toLowerCase();
            break;
          case 1: // Status
            aVal = a.status;
            bVal = b.status;
            break;
          case 2: // Owner
            aVal = a.username.toLowerCase();
            bVal = b.username.toLowerCase();
            break;
          case 3: // Subscription
            aVal = (a.subscriptionName ?? '').toLowerCase();
            bVal = (b.subscriptionName ?? '').toLowerCase();
            break;
          case 4: // Created
            aVal = a.creationDate.getTime();
            bVal = b.creationDate.getTime();
            break;
          case 5: // Last used
            aVal = a.lastUsedAt?.getTime() ?? 0;
            bVal = b.lastUsedAt?.getTime() ?? 0;
            break;
          case 6: // Expiration
            aVal = a.expirationDate?.getTime() ?? Infinity;
            bVal = b.expirationDate?.getTime() ?? Infinity;
            break;
          default:
            return 0;
        }

        if (aVal === undefined || bVal === undefined) {
          return 0;
        }

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          const cmp = aVal.localeCompare(bVal);
          return activeSortDirection === 'asc' ? cmp : -cmp;
        }

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return activeSortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }

        return 0;
      });
    }

    return result;
  }, [apiKeys, submittedSearch, statusFilters, activeSortIndex, activeSortDirection]);

  const paginatedApiKeys = React.useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredApiKeys.slice(start, start + perPage);
  }, [filteredApiKeys, page, perPage]);

  React.useEffect(() => {
    setPage(1);
  }, [submittedSearch, statusFilters]);

  const getCurrentUsername = (): string => {
    switch (userProfile) {
      case 'AI Admin':
        return 'admin';
      case 'AI Engineer':
        return 'celtan';
      case 'Data Scientist':
        return 'datascientist';
      default:
        return 'user';
    }
  };

  const handleKeyCreated = (newKey: ApiKeyV34) => {
    addDynamicKey(newKey);
    setApiKeys((prev) => [newKey, ...prev]);
    addToast(`API key "${newKey.name}" created`);
  };

  const toggleKebabMenu = (id: string) => {
    setOpenKebabMenus((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getStatusLabel = (status: ApiKeyStatusV34) => {
    if (status === 'active') {
      return (
        <Label id="status-active" variant="outline" status="success">
          Ready
        </Label>
      );
    }

    if (status === 'revoked') {
      return (
        <Popover
          aria-label="Revoked status information"
          headerContent="Revoked API key"
          bodyContent="This API key has been revoked and can no longer be used for authentication."
        >
          <Label
            id="status-revoked"
            variant="outline"
            status="danger"
            icon={<BanIcon />}
            style={{ cursor: 'pointer' }}
          >
            Revoked
          </Label>
        </Popover>
      );
    }

    return (
      <Label id="status-expired" variant="outline" color="grey" icon={<OutlinedClockIcon />}>
        Expired
      </Label>
    );
  };

  const formatDate = (date?: Date): string => {
    if (!date) {
      return '';
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleRowClick = (keyId: string) => {
    navigate(keyDetailsPath(keyId));
  };

  const removeToastAlert = (alertKey: React.Key) => {
    setToastAlerts((prev) => prev.filter((a) => a.key !== alertKey));
  };

  const addToast = (title: string) => {
    const alertKey = `toast-${Date.now()}`;
    const newAlert = (
      <Alert
        id={`api-key-toast-${alertKey}`}
        variant={AlertVariant.success}
        title={title}
        timeout
        actionClose={
          <AlertActionCloseButton
            id={`close-toast-${alertKey}`}
            onClose={() => removeToastAlert(alertKey)}
          />
        }
        onTimeout={() => removeToastAlert(alertKey)}
        key={alertKey}
      />
    );
    setToastAlerts((prev) => [newAlert, ...prev]);
  };

  const handleRevokeSingle = (apiKey: ApiKeyV34) => {
    setApiKeys((prev) =>
      prev.map((k) => (k.id === apiKey.id ? { ...k, status: 'revoked' as ApiKeyStatusV34 } : k)),
    );
    addToast(`API key "${apiKey.name}" revoked`);
  };

  const handleRevokeAll = (target: string, kind: RevokeAllTargetKind) => {
    const needle = target.toLowerCase();
    setApiKeys((prev) =>
      prev.map((k) => {
        if (k.status !== 'active') {
          return k;
        }
        if (kind === 'subscription') {
          const matches =
            (k.subscriptionName ?? '').toLowerCase() === needle ||
            (k.subscriptionId ?? '').toLowerCase() === needle;
          return matches ? { ...k, status: 'revoked' as ApiKeyStatusV34 } : k;
        }
        if (k.username.toLowerCase() !== needle) {
          return k;
        }
        return { ...k, status: 'revoked' as ApiKeyStatusV34 };
      }),
    );

    const msg =
      kind === 'subscription'
        ? `All active keys for subscription "${target}" revoked`
        : isAdmin
          ? `All active keys for "${target}" revoked`
          : 'All your active API keys revoked';
    addToast(msg);
  };

  const handleStatusFilterSelect = (
    _event: React.MouseEvent | undefined,
    value: string | number | undefined,
  ) => {
    const status = value as ApiKeyStatusV34;
    setStatusFilters((prev) => {
      const next = new Set(prev);
      if (next.has(status)) {
        next.delete(status);
      } else {
        next.add(status);
      }
      return next;
    });
  };

  const tabFromUrl = searchParams.get('tab');
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(
    tabFromUrl === 'subscriptions' ? 'subscriptions' : 'api-keys',
  );

  React.useEffect(() => {
    setActiveTabKey(tabFromUrl === 'subscriptions' ? 'subscriptions' : 'api-keys');
  }, [tabFromUrl]);

  const handlePageTabSelect = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    key: string | number,
  ) => {
    setActiveTabKey(key);
    const next = new URLSearchParams(searchParams);
    if (key === 'subscriptions') {
      next.set('tab', 'subscriptions');
    } else {
      next.delete('tab');
    }
    setSearchParams(next, { replace: true });
  };

  const apiKeysPanel = (
    <>
        <GenaiPageStack>
        <Toolbar id="api-keys-toolbar-v34" hasNoPadding>
          <ToolbarContent>
            <ToolbarGroup>
              <ToolbarItem>
                <Select
                  id="api-keys-status-filter-v34"
                  isOpen={isStatusFilterOpen}
                  selected={Array.from(statusFilters)}
                  onSelect={handleStatusFilterSelect}
                  onOpenChange={(isOpen) => setIsStatusFilterOpen(isOpen)}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsStatusFilterOpen(!isStatusFilterOpen)}
                      isExpanded={isStatusFilterOpen}
                      id="api-keys-status-filter-toggle-v34"
                    >
                      <Split hasGutter>
                        <SplitItem isFilled>Status</SplitItem>
                        {statusFilters.size < ALL_STATUSES.length && (
                          <SplitItem>
                            <Badge isRead id="status-filter-badge-v34">
                              {statusFilters.size}
                            </Badge>
                          </SplitItem>
                        )}
                      </Split>
                    </MenuToggle>
                  )}
                >
                  <SelectList id="api-keys-status-filter-list-v34">
                    {ALL_STATUSES.map((status) => (
                      <SelectOption
                        key={status}
                        value={status}
                        hasCheckbox
                        isSelected={statusFilters.has(status)}
                        id={`status-filter-v34-${status}`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectOption>
                    ))}
                  </SelectList>
                </Select>
              </ToolbarItem>
              {isAdmin && (
                <ToolbarItem>
                  <InputGroup>
                    <InputGroupItem isFill>
                      <TextInput
                        id="api-keys-search-v34"
                        aria-label="Search username"
                        placeholder="Search username"
                        value={searchValue}
                        onChange={(_event, value) => setSearchValue(value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setSubmittedSearch(searchValue);
                          }
                        }}
                        type="text"
                      />
                    </InputGroupItem>
                    {searchValue && (
                      <InputGroupItem>
                        <Button
                          variant="plain"
                          aria-label="Clear search"
                          onClick={() => {
                            setSearchValue('');
                            setSubmittedSearch('');
                          }}
                          id="api-keys-search-clear-v34"
                        >
                          <TimesIcon />
                        </Button>
                      </InputGroupItem>
                    )}
                    <InputGroupItem>
                      <Button
                        variant="control"
                        aria-label="Search"
                        onClick={() => setSubmittedSearch(searchValue)}
                        id="api-keys-search-button-v34"
                      >
                        <SearchIcon />
                      </Button>
                    </InputGroupItem>
                  </InputGroup>
                </ToolbarItem>
              )}
            </ToolbarGroup>
            <ToolbarItem>
              <Button
                variant="primary"
                onClick={() => openCreateModal()}
                id="create-api-key-button-v34"
              >
                Create API key
              </Button>
            </ToolbarItem>
            <ToolbarItem>
              <Dropdown
                isOpen={isPageActionsOpen}
                onOpenChange={(isOpen) => setIsPageActionsOpen(isOpen)}
                popperProps={{ position: 'right' }}
                toggle={(toggleRef) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setIsPageActionsOpen(!isPageActionsOpen)}
                    variant="plain"
                    aria-label="Page actions"
                    isExpanded={isPageActionsOpen}
                    id="page-actions-toggle-v34"
                  >
                    <EllipsisVIcon />
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  {isAdmin ? (
                    <>
                      <DropdownItem
                        key="revoke-all-user"
                        onClick={() => {
                          setRevokeTargetKind('user');
                          setIsRevokeAllModalOpen(true);
                          setIsPageActionsOpen(false);
                        }}
                        isDanger
                        id="revoke-all-keys-action-v34"
                        tooltipProps={{
                          content: 'You will select the user in the next step',
                          position: 'left',
                        }}
                      >
                        Revoke all keys for a single user
                      </DropdownItem>
                      <DropdownItem
                        key="revoke-all-subscription"
                        onClick={() => {
                          setRevokeTargetKind('subscription');
                          setIsRevokeAllModalOpen(true);
                          setIsPageActionsOpen(false);
                        }}
                        isDanger
                        id="revoke-all-keys-subscription-action-v34"
                        tooltipProps={{
                          content: 'You will select the subscription in the next step',
                          position: 'left',
                        }}
                      >
                        Revoke all keys for a single subscription
                      </DropdownItem>
                    </>
                  ) : (
                    <DropdownItem
                      key="revoke-all"
                      onClick={() => {
                        setRevokeTargetKind('user');
                        setIsRevokeAllModalOpen(true);
                        setIsPageActionsOpen(false);
                      }}
                      isDanger
                      id="revoke-all-keys-action-v34"
                    >
                      Revoke all my keys
                    </DropdownItem>
                  )}
                </DropdownList>
              </Dropdown>
            </ToolbarItem>
            <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
              <Pagination
                itemCount={filteredApiKeys.length}
                perPage={perPage}
                page={page}
                onSetPage={(_event, newPage) => setPage(newPage)}
                onPerPageSelect={(_event, newPerPage) => {
                  setPerPage(newPerPage);
                  setPage(1);
                }}
                perPageOptions={[
                  { title: '10', value: 10 },
                  { title: '20', value: 20 },
                  { title: '50', value: 50 },
                ]}
                id="api-keys-pagination-top-v34"
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>

        <Table aria-label="API Keys table" id="api-keys-table-v34">
          <Thead>
            <Tr>
              <Th sort={getSortParams(0)}>Name</Th>
              <Th sort={getSortParams(1)}>Status</Th>
              <Th sort={getSortParams(2)}>Owner</Th>
              <Th sort={getSortParams(3)}>Subscription</Th>
              <Th sort={getSortParams(4)}>Created</Th>
              <Th sort={getSortParams(5)}>Last used</Th>
              <Th sort={getSortParams(6)}>Expiration</Th>
              <Th screenReaderText="Actions" />
            </Tr>
          </Thead>
          <Tbody>
            {paginatedApiKeys.map((apiKey) => (
              <Tr key={apiKey.id}>
                <Td dataLabel="Name">
                  <div>
                    <Button
                      variant="link"
                      isInline
                      onClick={() => handleRowClick(apiKey.id)}
                      id={`api-key-link-v34-${apiKey.id}`}
                    >
                      {apiKey.name}
                    </Button>
                    {apiKey.description && (
                      <div style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                        {apiKey.description}
                      </div>
                    )}
                  </div>
                </Td>
                <Td dataLabel="Status">{getStatusLabel(apiKey.status)}</Td>
                <Td dataLabel="Owner">{apiKey.username}</Td>
                <Td dataLabel="Subscription">
                  {apiKey.subscriptionId ? (
                    <Button
                      variant="link"
                      isInline
                      onClick={() => {
                        const subscriptionId = apiKey.subscriptionId;
                        if (subscriptionId) {
                          navigate(subscriptionDetailsPath(subscriptionId));
                        }
                      }}
                      id={`subscription-link-${apiKey.id}`}
                    >
                      {apiKey.subscriptionName}
                    </Button>
                  ) : (
                    '—'
                  )}
                </Td>
                <Td dataLabel="Created">{formatDate(apiKey.creationDate)}</Td>
                <Td dataLabel="Last used">
                  {apiKey.lastUsedAt ? formatDate(apiKey.lastUsedAt) : '—'}
                </Td>
                <Td dataLabel="Expiration">
                  {apiKey.expirationDate ? formatDate(apiKey.expirationDate) : 'Never'}
                </Td>
                <Td isActionCell>
                  <Dropdown
                    isOpen={openKebabMenus.has(apiKey.id)}
                    onOpenChange={(isOpen) => {
                      if (!isOpen) {
                        setOpenKebabMenus((prev) => {
                          const next = new Set(prev);
                          next.delete(apiKey.id);
                          return next;
                        });
                      }
                    }}
                    popperProps={{ position: 'right' }}
                    toggle={(toggleRef) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => toggleKebabMenu(apiKey.id)}
                        variant="plain"
                        aria-label={`Actions for ${apiKey.name}`}
                        isExpanded={openKebabMenus.has(apiKey.id)}
                        id={`api-key-actions-v34-${apiKey.id}`}
                      >
                        <EllipsisVIcon />
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem
                        key="revoke"
                        onClick={() => {
                          handleRevokeSingle(apiKey);
                          toggleKebabMenu(apiKey.id);
                        }}
                        id={`revoke-key-v34-${apiKey.id}`}
                        isDisabled={apiKey.status !== 'active'}
                        isDanger
                      >
                        Revoke
                      </DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Pagination
          itemCount={filteredApiKeys.length}
          perPage={perPage}
          page={page}
          onSetPage={(_event, newPage) => setPage(newPage)}
          onPerPageSelect={(_event, newPerPage) => {
            setPerPage(newPerPage);
            setPage(1);
          }}
          perPageOptions={[
            { title: '10', value: 10 },
            { title: '20', value: 20 },
            { title: '50', value: 50 },
          ]}
          variant="bottom"
          id="api-keys-pagination-bottom-v34"
        />
        </GenaiPageStack>

        <CreateAPIKeyModalV34
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
          onKeyCreated={handleKeyCreated}
          currentUsername={getCurrentUsername()}
          maxExpirationDays={maxExpirationDays}
          simulateExpiryServerError={simulateExpiryServerError}
          modelDisplayStyle={modelDisplayStyle}
        />

        <RevokeAllAPIKeysModal
          isOpen={isRevokeAllModalOpen}
          onClose={() => setIsRevokeAllModalOpen(false)}
          onConfirm={(target, kind) => handleRevokeAll(target, kind)}
          allKeys={apiKeys}
          isAdmin={isAdmin}
          currentUsername={getCurrentUsername()}
          previewMode={revokePreviewMode}
          targetKind={revokeTargetKind}
        />
    </>
  );

  return (
    <ListPage
      title="API keys"
      description="Manage API keys used to authenticate with AI model endpoints."
      kicker={kicker}
    >
      <AlertGroup isToast isLiveRegion hasAnimations id="api-keys-toast-v34">
        {toastAlerts}
      </AlertGroup>

      {isAdminSurface ? (
        apiKeysPanel
      ) : (
        <Tabs activeKey={activeTabKey} onSelect={handlePageTabSelect} id="api-keys-page-tabs">
          <Tab eventKey="api-keys" title={<TabTitleText>API keys</TabTitleText>} id="api-keys-tab">
            {apiKeysPanel}
          </Tab>
          <Tab
            eventKey="subscriptions"
            title={<TabTitleText>Subscriptions</TabTitleText>}
            id="api-keys-subscriptions-tab"
          >
            <Content component={ContentVariants.p}>
              View your subscriptions and the models they give you access to.
            </Content>
            <ModelAccessTable defaultGroup="subscription" />
          </Tab>
        </Tabs>
      )}
    </ListPage>
  );

};

export { APIKeysV34 };
