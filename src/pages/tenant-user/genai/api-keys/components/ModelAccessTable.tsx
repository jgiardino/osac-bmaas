import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  AlertVariant,
  Button,
  ClipboardCopy,
  Content,
  ContentVariants,
  Flex,
  FlexItem,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  ModalVariant,
  Pagination,
  Popover,
  SearchInput,
  ToggleGroup,
  ToggleGroupItem,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import KeyIcon from '@patternfly/react-icons/dist/esm/icons/key-icon';
import OutlinedQuestionCircleIcon from '@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon';
import { ExpandableRowContent, Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import { mockApiKeysEngineerV34 } from '../mockDataV34';
import { mockMaaSModels, mockSubscriptions } from '../subscriptions/mockData';
import type { Subscription, TokenRateLimit } from '../subscriptions/types';
import { useApiKeysPaths } from '../useApiKeysPaths';

export type ModelStatus = 'available' | 'unavailable';

interface ConsumerModel {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  status: ModelStatus;
}

const modelStatusMap: Record<string, ModelStatus> = {
  'granite-3b-instruct': 'available',
  'llama-3-1-8b-instruct': 'available',
  'gpt-4-turbo': 'unavailable',
  'mistral-7b-instruct': 'available',
  'claude-3-sonnet': 'available',
};

const consumerModels: ConsumerModel[] = mockMaaSModels
  .filter((m) => mockSubscriptions.some((s) => s.modelRefs.some((ref) => ref.name === m.id)))
  .map((m) => ({
    id: m.id,
    name: m.id,
    displayName: m.name,
    description: m.description,
    status: modelStatusMap[m.id] ?? 'available',
  }));

const formatTokenLimit = (n: number): string => {
  if (n >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(1)}M`;
  }
  if (n >= 1_000) {
    return `${(n / 1_000).toFixed(0)}K`;
  }
  return n.toLocaleString();
};

const formatWindow = (window: string): string => {
  if (window === '24h') {
    return '24 hours';
  }
  if (window === '1h') {
    return '1 hour';
  }
  if (window.endsWith('h')) {
    return `${window.replace('h', '')} hours`;
  }
  if (window.endsWith('m')) {
    return `${window.replace('m', '')} minutes`;
  }
  return window;
};

const TokenLimitsDisplay: React.FC<{ tokenRateLimits: TokenRateLimit | TokenRateLimit[] }> = ({
  tokenRateLimits,
}) => {
  const primary = Array.isArray(tokenRateLimits) ? tokenRateLimits[0] : tokenRateLimits;
  return (
    <>
      {formatTokenLimit(primary.limit)} / {formatWindow(primary.window)}
    </>
  );
};

const ModelInfoPopover: React.FC<{
  model: ConsumerModel;
  tokenRateLimits?: TokenRateLimit | TokenRateLimit[];
  idPrefix: string;
}> = ({ model, tokenRateLimits, idPrefix }) => (
  <Popover
    id={`${idPrefix}-model-info-popover-${model.id}`}
    headerContent={model.displayName}
    bodyContent={
      <Flex direction={{ default: 'column' }} gap={{ default: 'gapMd' }}>
        <FlexItem>
          <Content component={ContentVariants.small}>Model ID</Content>
          <ClipboardCopy
            isReadOnly
            hoverTip="Copy"
            clickTip="Copied"
            id={`${idPrefix}-model-id-copy-${model.id}`}
          >
            {model.name}
          </ClipboardCopy>
        </FlexItem>
        <FlexItem>
          <Content component={ContentVariants.small}>Description</Content>
          <Content component={ContentVariants.p}>
            {model.description || 'No description available'}
          </Content>
        </FlexItem>
        {tokenRateLimits && Array.isArray(tokenRateLimits) && tokenRateLimits.length > 1 && (
          <FlexItem>
            <Content component={ContentVariants.small}>Rate limits</Content>
            {tokenRateLimits.map((limit, idx) => (
              <Content component={ContentVariants.p} key={idx}>
                {formatTokenLimit(limit.limit)} / {formatWindow(limit.window)}
              </Content>
            ))}
          </FlexItem>
        )}
      </Flex>
    }
  >
    <Button
      variant="plain"
      isInline
      size="sm"
      id={`${idPrefix}-model-info-btn-${model.id}`}
      aria-label={`Info about ${model.displayName}`}
    >
      <OutlinedQuestionCircleIcon color="var(--pf-t--global--icon--color--subtle)" />
    </Button>
  </Popover>
);

const UnavailableModelLabel: React.FC<{ model: ConsumerModel; idPrefix: string }> = ({
  model,
  idPrefix,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  if (model.status !== 'unavailable') {
    return null;
  }

  const modalTitleId = `${idPrefix}-unavailable-modal-title-${model.id}`;
  const modalBodyId = `${idPrefix}-unavailable-modal-body-${model.id}`;

  return (
    <>
      <Label
        isCompact
        variant="filled"
        status="warning"
        id={`${idPrefix}-unavailable-label-${model.id}`}
        onClick={() => setIsModalOpen(true)}
        style={{ cursor: 'pointer' }}
      >
        Unavailable
      </Label>
      <Modal
        variant={ModalVariant.small}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        id={`${idPrefix}-unavailable-modal-${model.id}`}
        aria-labelledby={modalTitleId}
        aria-describedby={modalBodyId}
      >
        <ModalHeader
          labelId={modalTitleId}
          title={
            <span>
              {model.displayName}{' '}
              <Label
                variant="outline"
                status="warning"
                id={`${idPrefix}-unavailable-modal-badge-${model.id}`}
              >
                Unavailable
              </Label>
            </span>
          }
        />
        <ModalBody id={modalBodyId}>
          <Alert
            variant={AlertVariant.warning}
            isInline
            title="Model temporarily unavailable"
            id={`${idPrefix}-unavailable-modal-alert-${model.id}`}
          >
            <Content component={ContentVariants.p}>
              This model is currently experiencing issues and may not respond to requests. Other
              models in your subscription are not affected. Try using an alternative model. Contact
              your platform admin if this persists.
            </Content>
          </Alert>
        </ModalBody>
      </Modal>
    </>
  );
};

type GroupBy = 'model' | 'subscription';

interface ModelAccessTableProps {
  defaultGroup?: GroupBy;
}

const ModelAccessTable: React.FC<ModelAccessTableProps> = ({ defaultGroup = 'subscription' }) => {
  const navigate = useNavigate();
  const { subscriptionDetailsPath } = useApiKeysPaths();
  const [groupBy, setGroupBy] = useState<GroupBy>(defaultGroup);
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [expandedModels, setExpandedModels] = useState<Set<string>>(new Set());

  const userSubscriptions = useMemo(
    () => mockSubscriptions.filter((s) => s.status === 'Active'),
    [],
  );

  const modelToSubscriptions = useMemo(() => {
    const map = new Map<
      string,
      Array<{ sub: Subscription; tokenRateLimits: TokenRateLimit | TokenRateLimit[] }>
    >();
    for (const sub of userSubscriptions) {
      for (const ref of sub.modelRefs) {
        const existing = map.get(ref.name) ?? [];
        existing.push({ sub, tokenRateLimits: ref.tokenRateLimits });
        map.set(ref.name, existing);
      }
    }
    return map;
  }, [userSubscriptions]);

  const allUniqueModels = useMemo(() => {
    const seen = new Set<string>();
    const result: ConsumerModel[] = [];
    for (const sub of userSubscriptions) {
      for (const ref of sub.modelRefs) {
        if (!seen.has(ref.name)) {
          seen.add(ref.name);
          const found = consumerModels.find((m) => m.id === ref.name);
          if (found) {
            result.push(found);
          }
        }
      }
    }
    return result;
  }, [userSubscriptions]);

  const toggleModel = (id: string) => {
    setExpandedModels((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredModels = useMemo(() => {
    if (!searchValue) {
      return allUniqueModels;
    }
    const q = searchValue.toLowerCase();
    return allUniqueModels.filter(
      (m) => m.displayName.toLowerCase().includes(q) || m.name.toLowerCase().includes(q),
    );
  }, [allUniqueModels, searchValue]);

  const sortedModels = useMemo(
    () => [...filteredModels].sort((a, b) => a.displayName.localeCompare(b.displayName)),
    [filteredModels],
  );

  const paginatedModels = useMemo(
    () => sortedModels.slice((page - 1) * perPage, page * perPage),
    [sortedModels, page, perPage],
  );

  const getActiveKeyCount = (subId: string) =>
    mockApiKeysEngineerV34.filter((k) => k.subscriptionId === subId && k.status === 'active')
      .length;

  const navigateToSubDetail = (subId: string) => {
    navigate(subscriptionDetailsPath(subId));
  };

  const itemCount = groupBy === 'model' ? filteredModels.length : userSubscriptions.length;

  return (
    <>
      <Toolbar
        id="subs-access-toolbar"
        clearAllFilters={() => {
          setSearchValue('');
          setPage(1);
        }}
      >
        <ToolbarContent>
          <ToolbarItem>
            <SearchInput
              placeholder="Search models..."
              value={searchValue}
              onChange={(_e, val) => {
                setSearchValue(val);
                setPage(1);
              }}
              onClear={() => {
                setSearchValue('');
                setPage(1);
              }}
              id="subs-access-search"
            />
          </ToolbarItem>
          <ToolbarItem>
            <ToggleGroup aria-label="Group by" id="subs-group-by-toggle">
              <ToggleGroupItem
                text="Subscription view"
                buttonId="subs-group-by-subscription"
                isSelected={groupBy === 'subscription'}
                onChange={() => {
                  setGroupBy('subscription');
                  setPage(1);
                }}
              />
              <ToggleGroupItem
                text="Model view"
                buttonId="subs-group-by-model"
                isSelected={groupBy === 'model'}
                onChange={() => {
                  setGroupBy('model');
                  setPage(1);
                }}
              />
            </ToggleGroup>
          </ToolbarItem>
          <ToolbarGroup align={{ default: 'alignEnd' }}>
            <ToolbarItem>
              <Pagination
                itemCount={itemCount}
                perPage={perPage}
                page={page}
                onSetPage={(_e, p) => setPage(p)}
                onPerPageSelect={(_e, pp) => {
                  setPerPage(pp);
                  setPage(1);
                }}
                isCompact
                id="subs-access-pagination-top"
              />
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>

      <Table aria-label="Model access" variant="compact" id="subs-access-table">
        <Thead>
          <Tr>
            <Th id="subs-expand-all-th" />
            <Th>{groupBy === 'model' ? 'Model' : 'Subscription'}</Th>
          </Tr>
        </Thead>

        {groupBy === 'model' &&
          paginatedModels.map((model, rowIndex) => {
            const subs = modelToSubscriptions.get(model.id) ?? [];
            const isExpanded = expandedModels.has(model.id);
            return (
              <Tbody key={model.id} isExpanded={isExpanded}>
                <Tr>
                  <Td
                    expand={{
                      rowIndex,
                      isExpanded,
                      onToggle: () => toggleModel(model.id),
                      expandId: `subs-model-expand-${model.id}`,
                    }}
                  />
                  <Td dataLabel="Model">
                    <Flex gap={{ default: 'gapXs' }} alignItems={{ default: 'alignItemsCenter' }}>
                      <FlexItem>
                        {model.displayName}
                      </FlexItem>
                      <FlexItem>
                        <ModelInfoPopover model={model} idPrefix="model-view" />
                      </FlexItem>
                      <FlexItem>
                        <UnavailableModelLabel model={model} idPrefix="model-view" />
                      </FlexItem>
                    </Flex>
                    <Content
                      component={ContentVariants.small}
                      style={{ color: 'var(--pf-t--global--text--color--subtle)' }}
                    >
                      {model.name}
                    </Content>
                  </Td>
                </Tr>
                <Tr isExpanded={isExpanded}>
                  <Td />
                  <Td noPadding>
                    <ExpandableRowContent>
                      <Table
                        variant="compact"
                        isNested
                        aria-label={`Subscriptions for ${model.displayName}`}
                        id={`subs-model-expand-table-${model.id}`}
                      >
                        <Thead>
                          <Tr>
                            <Th width={45}>Subscription</Th>
                            <Th width={30}>API keys</Th>
                            <Th width={25}>Token limits</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {subs.map(({ sub, tokenRateLimits }) => {
                            const keyCount = getActiveKeyCount(sub.id);
                            return (
                              <Tr key={`${model.id}-${sub.id}`}>
                                <Td dataLabel="Subscription">
                                  <Button
                                    variant="link"
                                    isInline
                                    onClick={() => navigateToSubDetail(sub.id)}
                                    id={`subs-model-sub-link-${model.id}-${sub.id}`}
                                  >
                                    {sub.displayName}
                                  </Button>
                                </Td>
                                <Td dataLabel="API keys">
                                  {keyCount > 0 ? (
                                    <Label
                                      isCompact
                                      color="green"
                                      icon={<KeyIcon />}
                                      id={`subs-model-sub-key-${model.id}-${sub.id}`}
                                    >
                                      {keyCount} active key{keyCount !== 1 ? 's' : ''}
                                    </Label>
                                  ) : (
                                    <Label
                                      isCompact
                                      color="grey"
                                      id={`subs-model-sub-nokey-${model.id}-${sub.id}`}
                                    >
                                      0 active keys
                                    </Label>
                                  )}
                                </Td>
                                <Td dataLabel="Token limits">
                                  <TokenLimitsDisplay tokenRateLimits={tokenRateLimits} />
                                </Td>
                              </Tr>
                            );
                          })}
                        </Tbody>
                      </Table>
                    </ExpandableRowContent>
                  </Td>
                </Tr>
              </Tbody>
            );
          })}

        {groupBy === 'subscription' &&
          userSubscriptions.map((sub, rowIndex) => {
            const isExpanded = expandedGroups.has(sub.id);
            const subModels = sub.modelRefs
              .map((ref) => consumerModels.find((m) => m.id === ref.name))
              .filter((m): m is ConsumerModel => !!m)
              .filter((m) => filteredModels.some((fm) => fm.id === m.id));
            if (subModels.length === 0 && searchValue) {
              return null;
            }
            const keyCount = getActiveKeyCount(sub.id);
            return (
              <Tbody key={sub.id} isExpanded={isExpanded}>
                <Tr>
                  <Td
                    expand={{
                      rowIndex,
                      isExpanded,
                      onToggle: () => toggleGroup(sub.id),
                      expandId: `subs-expand-toggle-${sub.id}`,
                    }}
                  />
                  <Td dataLabel="Subscription">
                    <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                      <FlexItem>
                        <Button
                          variant="link"
                          isInline
                          onClick={() => navigateToSubDetail(sub.id)}
                          id={`subs-group-link-${sub.id}`}
                        >
                          {sub.displayName}
                        </Button>
                      </FlexItem>
                      <FlexItem>
                        {keyCount > 0 ? (
                          <Label
                            isCompact
                            color="green"
                            icon={<KeyIcon />}
                            id={`subs-key-count-${sub.id}`}
                          >
                            {keyCount} active key{keyCount !== 1 ? 's' : ''}
                          </Label>
                        ) : (
                          <Label isCompact color="grey" id={`subs-no-key-${sub.id}`}>
                            0 active keys
                          </Label>
                        )}
                      </FlexItem>
                    </Flex>
                    {sub.description && (
                      <div style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                        {sub.description}
                      </div>
                    )}
                  </Td>
                </Tr>
                <Tr isExpanded={isExpanded}>
                  <Td />
                  <Td noPadding>
                    <ExpandableRowContent>
                      <Table
                        variant="compact"
                        isNested
                        aria-label={`Models in ${sub.displayName}`}
                        id={`subs-expand-table-${sub.id}`}
                      >
                        <Thead>
                          <Tr resetOffset>
                            <Th width={60}>Model name</Th>
                            <Th width={40}>Token limits</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {subModels.map((model) => {
                            const ref = sub.modelRefs.find((r) => r.name === model.id);
                            return (
                              <Tr key={model.id} resetOffset>
                                <Td dataLabel="Model">
                                  <Flex
                                    gap={{ default: 'gapXs' }}
                                    alignItems={{ default: 'alignItemsCenter' }}
                                  >
                                    <FlexItem>
                                      {model.displayName}
                                    </FlexItem>
                                    <FlexItem>
                                      <ModelInfoPopover
                                        model={model}
                                        tokenRateLimits={ref?.tokenRateLimits}
                                        idPrefix={`subs-nested-${sub.id}`}
                                      />
                                    </FlexItem>
                                    <FlexItem>
                                      <UnavailableModelLabel
                                        model={model}
                                        idPrefix={`subs-nested-${sub.id}`}
                                      />
                                    </FlexItem>
                                  </Flex>
                                  <Content
                                    component={ContentVariants.small}
                                    style={{
                                      color: 'var(--pf-t--global--text--color--subtle)',
                                      display: 'block',
                                    }}
                                  >
                                    {model.name}
                                  </Content>
                                </Td>
                                <Td dataLabel="Token limits">
                                  {ref ? (
                                    <TokenLimitsDisplay tokenRateLimits={ref.tokenRateLimits} />
                                  ) : (
                                    '—'
                                  )}
                                </Td>
                              </Tr>
                            );
                          })}
                        </Tbody>
                      </Table>
                    </ExpandableRowContent>
                  </Td>
                </Tr>
              </Tbody>
            );
          })}
      </Table>

      <Pagination
        itemCount={itemCount}
        perPage={perPage}
        page={page}
        onSetPage={(_e, p) => setPage(p)}
        onPerPageSelect={(_e, pp) => {
          setPerPage(pp);
          setPage(1);
        }}
        variant="bottom"
        id="subs-access-pagination-bottom"
      />
    </>
  );
};

export { ModelAccessTable, UnavailableModelLabel };
