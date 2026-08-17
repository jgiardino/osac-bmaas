import React from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardExpandableContent,
  CardHeader,
  CardTitle,
  Checkbox,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  EmptyState,
  EmptyStateBody,
  // eslint-disable-next-line no-restricted-imports -- confirm-delete modals; OsacForm grid wrapper breaks modal layout
  Form,
  FormGroup,
  Label,
  LabelGroup,
  MenuToggle,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  Pagination,
  Popover,
  SearchInput,
  Select,
  SelectList,
  SelectOption,
  Tab,
  TabAction,
  TabTitleText,
  Tabs,
  TextInput,
  Title,
  ToggleGroup,
  ToggleGroupItem,
  Toolbar,
  ToolbarContent,
  ToolbarFilter,
  ToolbarGroup,
  ToolbarItem,
  ToolbarToggleGroup,
  Tooltip,
} from '@patternfly/react-core';
import AngleDownIcon from '@patternfly/react-icons/dist/esm/icons/angle-down-icon';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import FilterIcon from '@patternfly/react-icons/dist/esm/icons/filter-icon';
import OutlinedQuestionCircleIcon from '@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon';
import {
  ActionsColumn,
  ExpandableRowContent,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table';
import type { IAction, TdProps, ThProps } from '@patternfly/react-table';

import { TenantUserPageChrome } from '../../../tenant-user/genai/TenantUserPageChrome';
import { GenaiPageStack } from '../../../tenant-user/genai/GenaiPageStack';


import {
  computeGovernanceGroups,
  computeGovernanceModels,
  deleteAuthPolicyFromStore,
  deleteSubscriptionFromStore,
  getDataVersion,
  mockAuthPoliciesList,
  mockSubscriptionsList,
  removeGroupFromPolicy,
  removeGroupFromSubscription,
} from './mockData';
import type {
  AuthPolicyListItem,
  AuthPolicyRef,
  GovernanceGroup,
  GovernanceModel,
  PhaseStatus,
  SubscriptionListItem,
  SubscriptionRef,
} from './mockData';
import {
  PhasePopoverLabel,
  getAuthPolicyPhaseMessage,
  getSubscriptionPhaseMessage,
} from './PopoverLabels';

type MainTab = 'overview' | 'subscriptions' | 'policies';
type OverviewView = 'model' | 'group';
type OverviewFilterAttribute = 'model' | 'group' | 'subscription' | 'policy' | 'modelType';
type ListFilterAttribute = 'keyword' | 'group' | 'model' | 'phase';
type SubExpandCol = 'groups' | 'models';
type PolicyExpandCol = 'groups' | 'models';

const ALL_PHASES: PhaseStatus[] = ['Active', 'Pending', 'Failed', 'Deleting', 'Degraded', 'Unhealthy', 'Unknown'];

const overviewFilterLabels: Record<OverviewFilterAttribute, string> = {
  model: 'Model name',
  group: 'Group name',
  subscription: 'Subscription name',
  policy: 'Authorization policy name',
  modelType: 'Model type',
};

const overviewFilterPlaceholders: Record<OverviewFilterAttribute, string> = {
  model: 'Filter by model name, model ID, or description',
  group: 'Filter by group name',
  subscription: 'Filter by subscription name',
  policy: 'Filter by authorization policy name',
  modelType: 'Filter by model type',
};

const listFilterLabels: Record<ListFilterAttribute, string> = {
  keyword: 'Keyword',
  group: 'Group name',
  model: 'Model name',
  phase: 'Status',
};

const listFilterPlaceholders: Record<ListFilterAttribute, string> = {
  keyword: 'Filter by name, resource name, or description',
  group: 'Filter by group name',
  model: 'Filter by model name',
  phase: 'Filter by status',
};

const modelViewFilterOptions: OverviewFilterAttribute[] = ['model', 'group', 'subscription', 'policy', 'modelType'];
const groupViewFilterOptions: OverviewFilterAttribute[] = ['group', 'model', 'subscription', 'policy'];
const listFilterOptions: ListFilterAttribute[] = ['keyword', 'group', 'model', 'phase'];


const useOverflowDetection = (ref: React.RefObject<HTMLElement | null>) => {
  const [isTruncated, setIsTruncated] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) {return;}
    const check = () => setIsTruncated(el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return isTruncated;
};

const TruncatedModelName: React.FC<{ name: string; id: string }> = ({ name, id }) => {
  const ref = React.useRef<HTMLElement>(null);
  const isTruncated = useOverflowDetection(ref);
  const content = (
    <strong ref={ref} style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} id={`${id}-name`}>
      {name}
    </strong>
  );
  if (!isTruncated) {return content;}
  return <Tooltip content={name} id={`${id}-name-tip`}>{content}</Tooltip>;
};

const TruncatedModelId: React.FC<{ modelId: string; id: string }> = ({ modelId, id }) => {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isTruncated = useOverflowDetection(ref);
  const content = (
    <span ref={ref} style={{ fontSize: 'var(--pf-t--global--font--size--sm)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} id={`${id}-code`}>
      {modelId}
    </span>
  );
  if (!isTruncated) {return content;}
  return <Tooltip content={modelId} id={`${id}-tip`}>{content}</Tooltip>;
};

const TruncatedDescription: React.FC<{ text: string; id: string }> = ({ text, id }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isTruncated = useOverflowDetection(ref);
  const content = (
    <div ref={ref} style={{ fontSize: 'var(--pf-t--global--font--size--sm)', color: 'var(--pf-t--global--text--color--subtle)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }} id={`${id}-desc`}>
      {text}
    </div>
  );
  if (!isTruncated) {return content;}
  return <Tooltip content={text} id={`${id}-desc-tip`}>{content}</Tooltip>;
};

const OVERVIEW_COL_COUNT = 5;
const SUB_COL_COUNT = 6;
const POLICY_COL_COUNT = 5;
const GROUP_COL_COUNT = 6;

const MaaSGovernancePage = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  const goMaas = (extra: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    next.set('nav', 'ai-maas-governance');
    Object.entries(extra).forEach(([key, value]) => {
      if (value === null) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    navigate(`${pathname}?${next.toString()}`);
  };
  const initialTab = (searchParams.get('tab') as MainTab) || 'overview';
  const initialView = (searchParams.get('view') as OverviewView) || 'model';
  const [activeTab, setActiveTab] = React.useState<MainTab>(initialTab);
  const [overviewView, setOverviewView] = React.useState<OverviewView>(initialView);
  const [dataVersion, setDataVersion] = React.useState(getDataVersion);

  const [expandedModels, setExpandedModels] = React.useState<Set<string>>(new Set());
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(new Set());
  const [expandedCards, setExpandedCards] = React.useState<Set<string>>(new Set());

  const [subExpanded, setSubExpanded] = React.useState<Record<string, SubExpandCol>>({});
  const [policyExpanded, setPolicyExpanded] = React.useState<Record<string, PolicyExpandCol>>({});

  const [modelPage, setModelPage] = React.useState(1);
  const [modelPerPage, setModelPerPage] = React.useState(10);
  const [groupPage, setGroupPage] = React.useState(1);
  const [groupPerPage, setGroupPerPage] = React.useState(10);
  const [subPage, setSubPage] = React.useState(1);
  const [subPerPage, setSubPerPage] = React.useState(10);
  const [polPage, setPolPage] = React.useState(1);
  const [polPerPage, setPolPerPage] = React.useState(10);

  const [removeGroupModalOpen, setRemoveGroupModalOpen] = React.useState(false);
  const [removeGroupTarget, setRemoveGroupTarget] = React.useState<GovernanceGroup | null>(null);
  const [removeGroupChecked, setRemoveGroupChecked] = React.useState<Record<string, boolean>>({});

  const [deleteSubModalOpen, setDeleteSubModalOpen] = React.useState(false);
  const [subToDelete, setSubToDelete] = React.useState<SubscriptionListItem | null>(null);
  const [deleteSubConfirmText, setDeleteSubConfirmText] = React.useState('');

  const [deletePolicyModalOpen, setDeletePolicyModalOpen] = React.useState(false);
  const [policyToDelete, setPolicyToDelete] = React.useState<AuthPolicyListItem | null>(null);
  const [deletePolicyConfirmText, setDeletePolicyConfirmText] = React.useState('');


  const toggleCard = (cardId: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) {next.delete(cardId);}
      else {next.add(cardId);}
      return next;
    });
  };

  const expandAllCards = (cardIds: string[]) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      cardIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const collapseAllCards = (cardIds: string[]) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      cardIds.forEach((id) => next.delete(id));
      return next;
    });
  };

  const [highlightedGroup, setHighlightedGroup] = React.useState<Record<string, string | null>>({});
  const [highlightedModel, setHighlightedModel] = React.useState<Record<string, string | null>>({});

  const [overviewFilterAttr, setOverviewFilterAttr] = React.useState<OverviewFilterAttribute>('model');
  const [overviewSearchValue, setOverviewSearchValue] = React.useState('');
  const [overviewFilters, setOverviewFilters] = React.useState<Partial<Record<OverviewFilterAttribute, string>>>({});
  const [isOverviewAttrOpen, setIsOverviewAttrOpen] = React.useState(false);
  const [isModelTypeSelectOpen, setIsModelTypeSelectOpen] = React.useState(false);

  const [subFilterAttr, setSubFilterAttr] = React.useState<ListFilterAttribute>('keyword');
  const [subSearchValue, setSubSearchValue] = React.useState('');
  const [subFilters, setSubFilters] = React.useState<Partial<Record<'keyword' | 'group' | 'model', string>>>({});
  const [subPhaseFilters, setSubPhaseFilters] = React.useState<Set<PhaseStatus>>(new Set());
  const [isSubAttrOpen, setIsSubAttrOpen] = React.useState(false);
  const [isSubPhaseOpen, setIsSubPhaseOpen] = React.useState(false);

  const [policyFilterAttr, setPolicyFilterAttr] = React.useState<ListFilterAttribute>('keyword');
  const [policySearchValue, setPolicySearchValue] = React.useState('');
  const [policyFilters, setPolicyFilters] = React.useState<Partial<Record<'keyword' | 'group' | 'model', string>>>({});
  const [policyPhaseFilters, setPolicyPhaseFilters] = React.useState<Set<PhaseStatus>>(new Set());
  const [isPolicyAttrOpen, setIsPolicyAttrOpen] = React.useState(false);
  const [isPolicyPhaseOpen, setIsPolicyPhaseOpen] = React.useState(false);

  const [modelSortIndex, setModelSortIndex] = React.useState<number | null>(null);
  const [modelSortDirection, setModelSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [groupSortIndex, setGroupSortIndex] = React.useState<number | null>(null);
  const [groupSortDirection, setGroupSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [subSortIndex, setSubSortIndex] = React.useState<number | null>(null);
  const [subSortDirection, setSubSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [policySortIndex, setPolicySortIndex] = React.useState<number | null>(null);
  const [policySortDirection, setPolicySortDirection] = React.useState<'asc' | 'desc'>('asc');

  const refreshData = () => setDataVersion(getDataVersion());
  // dataVersion busts memo when the in-memory mock store mutates
  const governanceModels = React.useMemo(() => {
    void dataVersion;
    return computeGovernanceModels();
  }, [dataVersion]);
  const governanceGroups = React.useMemo(() => {
    void dataVersion;
    return computeGovernanceGroups();
  }, [dataVersion]);

  const toggleSet = (_set: Set<string>, id: string, setter: React.Dispatch<React.SetStateAction<Set<string>>>) => {
    setter((prev) => { const next = new Set(prev); if (next.has(id)) {next.delete(id);} else {next.add(id);} return next; });
  };
  const expandAllIds = (ids: string[], setter: React.Dispatch<React.SetStateAction<Set<string>>>) => setter(new Set(ids));
  const collapseAll = (setter: React.Dispatch<React.SetStateAction<Set<string>>>) => setter(new Set());

  const toggleSubExpand = (id: string, col: SubExpandCol) => {
    setSubExpanded((prev) => {
      const next = { ...prev };
      if (prev[id] === col) {delete next[id];} else {next[id] = col;}
      return next;
    });
  };

  const togglePolicyExpand = (id: string, col: PolicyExpandCol) => {
    setPolicyExpanded((prev) => {
      const next = { ...prev };
      if (prev[id] === col) {delete next[id];} else {next[id] = col;}
      return next;
    });
  };

  const subCompoundExpand = (subId: string, column: SubExpandCol, rowIndex: number, columnIndex: number): TdProps['compoundExpand'] => ({
    isExpanded: subExpanded[subId] === column,
    onToggle: () => toggleSubExpand(subId, column),
    expandId: `j2-sub-expand-${subId}-${column}`,
    rowIndex,
    columnIndex,
  });

  const policyCompoundExpand = (policyId: string, column: PolicyExpandCol, rowIndex: number, columnIndex: number): TdProps['compoundExpand'] => ({
    isExpanded: policyExpanded[policyId] === column,
    onToggle: () => togglePolicyExpand(policyId, column),
    expandId: `j2-policy-expand-${policyId}-${column}`,
    rowIndex,
    columnIndex,
  });

  const getModelSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: { index: modelSortIndex ?? undefined, direction: modelSortDirection },
    onSort: (_event, index, direction) => { setModelSortIndex(index); setModelSortDirection(direction); },
    columnIndex,
  });

  const getGroupSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: { index: groupSortIndex ?? undefined, direction: groupSortDirection },
    onSort: (_event, index, direction) => { setGroupSortIndex(index); setGroupSortDirection(direction); },
    columnIndex,
  });

  const getSubSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: { index: subSortIndex ?? undefined, direction: subSortDirection },
    onSort: (_event, index, direction) => { setSubSortIndex(index); setSubSortDirection(direction); },
    columnIndex,
  });

  const getPolicySortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: { index: policySortIndex ?? undefined, direction: policySortDirection },
    onSort: (_event, index, direction) => { setPolicySortIndex(index); setPolicySortDirection(direction); },
    columnIndex,
  });

  const matchesOverviewFilter = (key: OverviewFilterAttribute, term: string, model: GovernanceModel): boolean => {
    const t = term.toLowerCase();
    switch (key) {
      case 'model':
        return model.name.toLowerCase().includes(t) || model.description.toLowerCase().includes(t) || model.modelId.toLowerCase().includes(t);
      case 'subscription':
        return model.subscriptions.some((s) => s.name.toLowerCase().includes(t));
      case 'policy':
        return model.policies.some((p) => p.name.toLowerCase().includes(t));
      case 'group':
        return model.subscriptions.some((s) => s.groups.some((g) => g.toLowerCase().includes(t))) || model.policies.some((p) => p.groups.some((g) => g.toLowerCase().includes(t)));
      case 'modelType':
        return model.source === t;
      default:
        return true;
    }
  };

  const matchesGroupOverviewFilter = (key: OverviewFilterAttribute, term: string, group: GovernanceGroup): boolean => {
    const t = term.toLowerCase();
    switch (key) {
      case 'group':
        return group.name.toLowerCase().includes(t);
      case 'model':
        return group.models.some((m) => m.modelName.toLowerCase().includes(t) || m.modelId.toLowerCase().includes(t));
      case 'subscription':
        return group.models.some((m) => m.subscriptions.some((s) => s.name.toLowerCase().includes(t)));
      case 'policy':
        return group.models.some((m) => m.policies.some((p) => p.name.toLowerCase().includes(t)));
      default:
        return true;
    }
  };

  const activeOverviewFilterEntries = Object.entries(overviewFilters).filter(([, v]) => v?.trim()) as [OverviewFilterAttribute, string][];

  const updateOverviewSearch = (value: string) => {
    setOverviewSearchValue(value);
    setOverviewFilters((prev) => {
      const next = { ...prev };
      if (value.trim()) {next[overviewFilterAttr] = value;}
      else {delete next[overviewFilterAttr];}
      return next;
    });
  };

  const updateSubSearch = (value: string) => {
    setSubSearchValue(value);
    if (subFilterAttr === 'phase') {return;}
    setSubFilters((prev) => {
      const next = { ...prev };
      if (value.trim()) {next[subFilterAttr] = value;}
      else {delete next[subFilterAttr];}
      return next;
    });
  };

  const updatePolicySearch = (value: string) => {
    setPolicySearchValue(value);
    if (policyFilterAttr === 'phase') {return;}
    setPolicyFilters((prev) => {
      const next = { ...prev };
      if (value.trim()) {next[policyFilterAttr] = value;}
      else {delete next[policyFilterAttr];}
      return next;
    });
  };

  const matchesSubListFilters = (sub: SubscriptionListItem): boolean => {
    for (const [key, value] of Object.entries(subFilters) as ['keyword' | 'group' | 'model', string][]) {
      if (!value?.trim()) {continue;}
      const term = value.toLowerCase();
      if (key === 'keyword') {
        if (!sub.name.toLowerCase().includes(term) && !sub.resourceName.toLowerCase().includes(term) && !(sub.description || '').toLowerCase().includes(term)) {return false;}
      } else if (key === 'group') {
        if (!sub.groups.some((g) => g.toLowerCase().includes(term))) {return false;}
      } else if (key === 'model') {
        if (!sub.models.some((mId) => {
          const gm = governanceModels.find((m) => m.id === mId);
          return (gm?.name ?? mId).toLowerCase().includes(term) || (gm?.modelId ?? mId).toLowerCase().includes(term);
        })) {return false;}
      }
    }
    if (subPhaseFilters.size > 0 && !subPhaseFilters.has(sub.phase)) {return false;}
    return true;
  };

  const matchesPolicyListFilters = (pol: AuthPolicyListItem): boolean => {
    for (const [key, value] of Object.entries(policyFilters) as ['keyword' | 'group' | 'model', string][]) {
      if (!value?.trim()) {continue;}
      const term = value.toLowerCase();
      if (key === 'keyword') {
        if (!pol.name.toLowerCase().includes(term) && !pol.resourceName.toLowerCase().includes(term) && !(pol.description || '').toLowerCase().includes(term)) {return false;}
      } else if (key === 'group') {
        if (!pol.groups.some((g) => g.toLowerCase().includes(term))) {return false;}
      } else if (key === 'model') {
        if (!pol.models.some((mId) => {
          const gm = governanceModels.find((m) => m.id === mId);
          return (gm?.name ?? mId).toLowerCase().includes(term) || (gm?.modelId ?? mId).toLowerCase().includes(term);
        })) {return false;}
      }
    }
    if (policyPhaseFilters.size > 0 && !policyPhaseFilters.has(pol.phase)) {return false;}
    return true;
  };

  // --- Filtering ---
  const filteredModels = React.useMemo(() => {
    let result = governanceModels;
    if (activeOverviewFilterEntries.length > 0) {
      result = result.filter((m) => activeOverviewFilterEntries.every(([key, term]) => matchesOverviewFilter(key, term, m)));
    }
    return result;
  }, [activeOverviewFilterEntries, governanceModels]);

  const filteredGroups = React.useMemo(() => {
    if (activeOverviewFilterEntries.length === 0) {return governanceGroups;}
    return governanceGroups.filter((g) => activeOverviewFilterEntries.every(([key, term]) => matchesGroupOverviewFilter(key, term, g)));
  }, [activeOverviewFilterEntries, governanceGroups]);

  const filteredSubscriptions = React.useMemo(() => {
    return mockSubscriptionsList.filter(matchesSubListFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subFilters, subPhaseFilters, dataVersion, governanceModels]);

  const filteredPolicies = React.useMemo(() => {
    return mockAuthPoliciesList.filter(matchesPolicyListFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyFilters, policyPhaseFilters, dataVersion, governanceModels]);

  const sortedModels = React.useMemo(() => {
    if (modelSortIndex === null) {return filteredModels;}
    const sorted = [...filteredModels];
    sorted.sort((a, b) => {
      let diff = 0;
      switch (modelSortIndex) {
        case 1: diff = a.name.localeCompare(b.name); break;
        case 2: diff = a.subscriptions.length - b.subscriptions.length; break;
        case 3: diff = a.policies.length - b.policies.length; break;
        default: return 0;
      }
      return modelSortDirection === 'asc' ? diff : -diff;
    });
    return sorted;
  }, [filteredModels, modelSortIndex, modelSortDirection]);

  const sortedGroups = React.useMemo(() => {
    if (groupSortIndex === null) {return filteredGroups;}
    const sorted = [...filteredGroups];
    sorted.sort((a, b) => {
      let diff = 0;
      switch (groupSortIndex) {
        case 1: diff = a.name.localeCompare(b.name); break;
        case 2: diff = a.modelCount - b.modelCount; break;
        case 3: diff = a.subscriptionCount - b.subscriptionCount; break;
        case 4: diff = a.policyCount - b.policyCount; break;
        default: return 0;
      }
      return groupSortDirection === 'asc' ? diff : -diff;
    });
    return sorted;
  }, [filteredGroups, groupSortIndex, groupSortDirection]);

  const sortedSubscriptions = React.useMemo(() => {
    if (subSortIndex === null) {return filteredSubscriptions;}
    const sorted = [...filteredSubscriptions];
    sorted.sort((a, b) => {
      let diff = 0;
      switch (subSortIndex) {
        case 0: diff = a.name.localeCompare(b.name); break;
        case 1: diff = a.phase.localeCompare(b.phase); break;
        case 2: diff = a.groups.length - b.groups.length; break;
        case 3: diff = a.models.length - b.models.length; break;
        case 4: diff = a.priority - b.priority; break;
        default: return 0;
      }
      return subSortDirection === 'asc' ? diff : -diff;
    });
    return sorted;
  }, [filteredSubscriptions, subSortIndex, subSortDirection]);

  const sortedPolicies = React.useMemo(() => {
    if (policySortIndex === null) {return filteredPolicies;}
    const sorted = [...filteredPolicies];
    sorted.sort((a, b) => {
      let diff = 0;
      switch (policySortIndex) {
        case 0: diff = a.name.localeCompare(b.name); break;
        case 1: diff = a.phase.localeCompare(b.phase); break;
        case 2: diff = a.groups.length - b.groups.length; break;
        case 3: diff = a.models.length - b.models.length; break;
        default: return 0;
      }
      return policySortDirection === 'asc' ? diff : -diff;
    });
    return sorted;
  }, [filteredPolicies, policySortIndex, policySortDirection]);

  const overviewFilterTerms = overviewFilters;
  const subNameFilterTerm = overviewFilterTerms.subscription?.toLowerCase();
  const polNameFilterTerm = overviewFilterTerms.policy?.toLowerCase();
  const groupFilterTerm = overviewFilterTerms.group?.toLowerCase();
  const modelFilterTerm = overviewFilterTerms.model?.toLowerCase();

  React.useEffect(() => {
    if (!subNameFilterTerm && !polNameFilterTerm && !groupFilterTerm && !modelFilterTerm) {return;}
    const cardIds: string[] = [];
    if (overviewView === 'model') {
      governanceModels.forEach((model) => {
        model.subscriptions.forEach((sub) => {
          if (subNameFilterTerm && sub.name.toLowerCase().includes(subNameFilterTerm)) {
            cardIds.push(`j2-mv-sub-${model.id}-card-${sub.id}`);
          }
          if (groupFilterTerm && sub.groups.some((g) => g.toLowerCase().includes(groupFilterTerm))) {
            cardIds.push(`j2-mv-sub-${model.id}-card-${sub.id}`);
          }
        });
        model.policies.forEach((pol) => {
          if (polNameFilterTerm && pol.name.toLowerCase().includes(polNameFilterTerm)) {
            cardIds.push(`j2-mv-pol-${model.id}-card-${pol.id}`);
          }
          if (groupFilterTerm && pol.groups.some((g) => g.toLowerCase().includes(groupFilterTerm))) {
            cardIds.push(`j2-mv-pol-${model.id}-card-${pol.id}`);
          }
        });
      });
    } else {
      governanceGroups.forEach((group) => {
        const allSubs = new Map<string, SubscriptionRef>();
        const allPols = new Map<string, AuthPolicyRef>();
        group.models.forEach((m) => {
          m.subscriptions.forEach((s) => { if (!allSubs.has(s.id)) {allSubs.set(s.id, s);} });
          m.policies.forEach((p) => { if (!allPols.has(p.id)) {allPols.set(p.id, p);} });
        });
        allSubs.forEach((sub) => {
          if (subNameFilterTerm && sub.name.toLowerCase().includes(subNameFilterTerm)) {
            cardIds.push(`j2-gv-sub-${group.id}-card-${sub.id}`);
          }
          if (groupFilterTerm && sub.groups.some((g) => g.toLowerCase().includes(groupFilterTerm))) {
            cardIds.push(`j2-gv-sub-${group.id}-card-${sub.id}`);
          }
          if (modelFilterTerm) {
            const fullSub = mockSubscriptionsList.find((s) => s.id === sub.id);
            if (fullSub?.models.some((mId) => {
              const gm = governanceModels.find((m) => m.id === mId);
              return (gm?.name ?? mId).toLowerCase().includes(modelFilterTerm) || (gm?.modelId ?? mId).toLowerCase().includes(modelFilterTerm);
            })) {
              cardIds.push(`j2-gv-sub-${group.id}-card-${sub.id}`);
            }
          }
        });
        allPols.forEach((pol) => {
          if (polNameFilterTerm && pol.name.toLowerCase().includes(polNameFilterTerm)) {
            cardIds.push(`j2-gv-pol-${group.id}-card-${pol.id}`);
          }
          if (groupFilterTerm && pol.groups.some((g) => g.toLowerCase().includes(groupFilterTerm))) {
            cardIds.push(`j2-gv-pol-${group.id}-card-${pol.id}`);
          }
          if (modelFilterTerm) {
            const fullPol = mockAuthPoliciesList.find((p) => p.id === pol.id);
            if (fullPol?.models.some((mId) => {
              const gm = governanceModels.find((m) => m.id === mId);
              return (gm?.name ?? mId).toLowerCase().includes(modelFilterTerm) || (gm?.modelId ?? mId).toLowerCase().includes(modelFilterTerm);
            })) {
              cardIds.push(`j2-gv-pol-${group.id}-card-${pol.id}`);
            }
          }
        });
      });
    }
    if (cardIds.length > 0) {expandAllCards(cardIds);}
  }, [subNameFilterTerm, polNameFilterTerm, groupFilterTerm, modelFilterTerm, overviewView, governanceModels, governanceGroups]);

  // --- Actions ---
  const getModelRowActions = (model: GovernanceModel): IAction[] => [
    { title: 'Create subscription', onClick: () => goMaas({ maasWizard: 'create-subscription', prefillModel: model.id, maasSubId: null, maasPolId: null }) },
    { title: 'Create authorization policy', onClick: () => goMaas({ maasWizard: 'create-auth-policy', prefillModel: model.id, maasSubId: null, maasPolId: null }) },
  ];

  const getSubRowActions = (sub: SubscriptionListItem): IAction[] => [
    { title: 'View details', onClick: () => goMaas({ maasSubId: sub.id, maasWizard: null, maasPolId: null }) },
    { title: 'Edit', onClick: () => goMaas({ maasWizard: 'create-subscription', edit: sub.id, maasSubId: null, maasPolId: null }) },
    { isSeparator: true },
    { title: 'Delete', onClick: () => { setSubToDelete(sub); setDeleteSubConfirmText(''); setDeleteSubModalOpen(true); } },
  ];

  const getPolicyRowActions = (pol: AuthPolicyListItem): IAction[] => [
    { title: 'View details', onClick: () => goMaas({ maasPolId: pol.id, maasWizard: null, maasSubId: null }) },
    { title: 'Edit', onClick: () => goMaas({ maasWizard: 'create-auth-policy', edit: pol.id, maasSubId: null, maasPolId: null }) },
    { isSeparator: true },
    { title: 'Delete', onClick: () => { setPolicyToDelete(pol); setDeletePolicyConfirmText(''); setDeletePolicyModalOpen(true); } },
  ];

  const openRemoveGroupModal = (group: GovernanceGroup) => {
    const subsMap = new Map<string, SubscriptionRef>();
    const polsMap = new Map<string, AuthPolicyRef>();
    group.models.forEach((m) => {
      m.subscriptions.forEach((s) => subsMap.set(s.id, s));
      m.policies.forEach((p) => polsMap.set(p.id, p));
    });
    const checked: Record<string, boolean> = {};
    subsMap.forEach((_, id) => { checked[`sub-${id}`] = true; });
    polsMap.forEach((_, id) => { checked[`pol-${id}`] = true; });
    setRemoveGroupChecked(checked);
    setRemoveGroupTarget(group);
    setRemoveGroupModalOpen(true);
  };

  const handleRemoveGroupAccess = () => {
    if (!removeGroupTarget) {return;}
    const subsToRemove = Object.entries(removeGroupChecked).filter(([key, val]) => key.startsWith('sub-') && val).map(([key]) => key.replace('sub-', ''));
    const polsToRemove = Object.entries(removeGroupChecked).filter(([key, val]) => key.startsWith('pol-') && val).map(([key]) => key.replace('pol-', ''));
    subsToRemove.forEach((subId) => {
      removeGroupFromSubscription(subId, removeGroupTarget.name);
    });
    polsToRemove.forEach((polId) => {
      removeGroupFromPolicy(polId, removeGroupTarget.name);
    });
    refreshData();
    setRemoveGroupModalOpen(false);
    setRemoveGroupTarget(null);
  };

  const getRemoveGroupSubs = (): SubscriptionRef[] => {
    if (!removeGroupTarget) {return [];}
    const subsMap = new Map<string, SubscriptionRef>();
    removeGroupTarget.models.forEach((m) => m.subscriptions.forEach((s) => subsMap.set(s.id, s)));
    return Array.from(subsMap.values());
  };

  const getRemoveGroupPols = (): AuthPolicyRef[] => {
    if (!removeGroupTarget) {return [];}
    const polsMap = new Map<string, AuthPolicyRef>();
    removeGroupTarget.models.forEach((m) => m.policies.forEach((p) => polsMap.set(p.id, p)));
    return Array.from(polsMap.values());
  };

  const clearOverviewFilter = (attr: OverviewFilterAttribute) => {
    setOverviewFilters((prev) => {
      const next = { ...prev };
      delete next[attr];
      return next;
    });
    if (overviewFilterAttr === attr) {setOverviewSearchValue('');}
  };

  const clearAllOverviewFilters = () => {
    setOverviewFilters({});
    setOverviewSearchValue('');
  };

  // --- Filter toolbar ---
  const renderOverviewFilterToolbar = (rightActions?: React.ReactNode) => (
    <Toolbar id="j2-overview-toolbar" clearAllFilters={clearAllOverviewFilters} hasNoPadding>
      <ToolbarContent>
        <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="xl" id="j2-overview-toggle-group">
          <ToolbarGroup variant="filter-group" id="j2-overview-filter-group">
            <ToolbarItem>
              <Select id="j2-overview-filter-attr" isOpen={isOverviewAttrOpen} selected={overviewFilterAttr}
                onSelect={(_e, value) => {
                  const attr = value as OverviewFilterAttribute;
                  setOverviewFilterAttr(attr);
                  setOverviewSearchValue(overviewFilters[attr] || '');
                  setIsOverviewAttrOpen(false);
                }}
                onOpenChange={setIsOverviewAttrOpen}
                toggle={(toggleRef: React.Ref<HTMLButtonElement>) => (
                  <MenuToggle ref={toggleRef} onClick={() => setIsOverviewAttrOpen(!isOverviewAttrOpen)} isExpanded={isOverviewAttrOpen} icon={<FilterIcon />} id="j2-overview-filter-toggle">
                    {overviewFilterLabels[overviewFilterAttr]}
                  </MenuToggle>
                )}
              >
                <SelectList id="j2-overview-filter-list">
                  {(overviewView === 'group' ? groupViewFilterOptions : modelViewFilterOptions).map((attr) => (
                    <SelectOption key={attr} value={attr} id={`j2-overview-opt-${attr}`}>{overviewFilterLabels[attr]}</SelectOption>
                  ))}
                </SelectList>
              </Select>
            </ToolbarItem>
            {(overviewView === 'group' ? groupViewFilterOptions : modelViewFilterOptions).map((attr) => (
              <ToolbarFilter
                key={attr}
                labels={overviewFilters[attr] ? [overviewFilters[attr]] : []}
                deleteLabel={() => clearOverviewFilter(attr)}
                deleteLabelGroup={() => clearOverviewFilter(attr)}
                categoryName={overviewFilterLabels[attr]}
                showToolbarItem={overviewFilterAttr === attr}
              >
                {attr === 'modelType' ? (
                  <Select
                    id="j2-overview-model-type-filter"
                    isOpen={isModelTypeSelectOpen}
                    selected={overviewFilters.modelType || undefined}
                    onSelect={(_e, value) => {
                      setOverviewFilters((prev) => ({ ...prev, modelType: value as string }));
                      setIsModelTypeSelectOpen(false);
                    }}
                    onOpenChange={setIsModelTypeSelectOpen}
                    toggle={(toggleRef: React.Ref<HTMLButtonElement>) => (
                      <MenuToggle ref={toggleRef} onClick={() => setIsModelTypeSelectOpen(!isModelTypeSelectOpen)} isExpanded={isModelTypeSelectOpen} id="j2-overview-model-type-toggle" style={{ minWidth: '160px' }}>
                        {overviewFilters.modelType ? (overviewFilters.modelType === 'internal' ? 'Internal' : 'External') : 'Filter by model type'}
                      </MenuToggle>
                    )}
                  >
                    <SelectList id="j2-overview-model-type-list">
                      <SelectOption value="internal" id="j2-overview-model-type-internal">Internal</SelectOption>
                      <SelectOption value="external" id="j2-overview-model-type-external">External</SelectOption>
                    </SelectList>
                  </Select>
                ) : (
                  <SearchInput id={`j2-overview-search-${attr}`} placeholder={overviewFilterPlaceholders[attr]} value={overviewFilterAttr === attr ? overviewSearchValue : ''} onChange={(_e, v) => updateOverviewSearch(v)} onClear={() => updateOverviewSearch('')} style={{ minWidth: '340px' }} />
                )}
              </ToolbarFilter>
            ))}
          </ToolbarGroup>
        </ToolbarToggleGroup>
        {rightActions}
      </ToolbarContent>
    </Toolbar>
  );

  const handlePhaseFilterSelect = (
    value: string | number | undefined,
    _phaseSet: Set<PhaseStatus>,
    setPhaseSet: React.Dispatch<React.SetStateAction<Set<PhaseStatus>>>,
  ) => {
    if (value === undefined) {return;}
    const phase = value as PhaseStatus;
    setPhaseSet((prev) => {
      const next = new Set(prev);
      if (next.has(phase)) {next.delete(phase);} else {next.add(phase);}
      return next;
    });
  };

  const renderListFilterToolbar = (
    idPrefix: string,
    filterAttr: ListFilterAttribute,
    setFilterAttr: (attr: ListFilterAttribute) => void,
    searchValue: string,
    setSearchValue: (val: string) => void,
    updateSearch: (val: string) => void,
    isAttrOpen: boolean,
    setIsAttrOpen: (open: boolean) => void,
    phaseFilters: Set<PhaseStatus>,
    setPhaseFilters: React.Dispatch<React.SetStateAction<Set<PhaseStatus>>>,
    isPhaseOpen: boolean,
    setIsPhaseOpen: (open: boolean) => void,
    storedFilters: Partial<Record<'keyword' | 'group' | 'model', string>>,
    leftActions?: React.ReactNode,
    rightActions?: React.ReactNode,
  ) => {
    const clearListFilter = (key: 'keyword' | 'group' | 'model') => {
      if (idPrefix === 'j2-subs') {
        setSubFilters((prev) => { const next = { ...prev }; delete next[key]; return next; });
      } else {
        setPolicyFilters((prev) => { const next = { ...prev }; delete next[key]; return next; });
      }
      if (filterAttr === key) {setSearchValue('');}
    };
    const clearAllListFilters = () => {
      if (idPrefix === 'j2-subs') {setSubFilters({});}
      else {setPolicyFilters({});}
      setPhaseFilters(new Set());
      setSearchValue('');
    };
    const textFilterKeys: ('keyword' | 'group' | 'model')[] = ['keyword', 'group', 'model'];
    return (
      <Toolbar id={`${idPrefix}-toolbar`} clearAllFilters={clearAllListFilters} hasNoPadding>
        <ToolbarContent>
          <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="xl" id={`${idPrefix}-toggle-group`}>
            <ToolbarGroup variant="filter-group" id={`${idPrefix}-filter-group`}>
              <ToolbarItem>
                <Select id={`${idPrefix}-filter-attr`} isOpen={isAttrOpen} selected={filterAttr}
                  onSelect={(_e, value) => {
                    const attr = value as ListFilterAttribute;
                    setFilterAttr(attr);
                    if (attr === 'phase') {
                      setSearchValue('');
                    } else {
                      setSearchValue(storedFilters[attr] || '');
                    }
                    setIsAttrOpen(false);
                  }}
                  onOpenChange={setIsAttrOpen}
                  toggle={(toggleRef: React.Ref<HTMLButtonElement>) => (
                    <MenuToggle ref={toggleRef} onClick={() => setIsAttrOpen(!isAttrOpen)} isExpanded={isAttrOpen} icon={<FilterIcon />} id={`${idPrefix}-filter-toggle`}>
                      {listFilterLabels[filterAttr]}
                    </MenuToggle>
                  )}
                >
                  <SelectList id={`${idPrefix}-filter-list`}>
                    {listFilterOptions.map((attr) => (
                      <SelectOption key={attr} value={attr} id={`${idPrefix}-opt-${attr}`}>{listFilterLabels[attr]}</SelectOption>
                    ))}
                  </SelectList>
                </Select>
              </ToolbarItem>
              {textFilterKeys.map((key) => (
                <ToolbarFilter
                  key={key}
                  labels={storedFilters[key]?.trim() ? [storedFilters[key]] : []}
                  deleteLabel={() => clearListFilter(key)}
                  deleteLabelGroup={() => clearListFilter(key)}
                  categoryName={listFilterLabels[key]}
                  showToolbarItem={filterAttr === key}
                >
                  <SearchInput id={`${idPrefix}-search-${key}`} placeholder={listFilterPlaceholders[key]} value={filterAttr === key ? searchValue : ''} onChange={(_e, v) => updateSearch(v)} onClear={() => updateSearch('')} style={{ minWidth: '340px' }} />
                </ToolbarFilter>
              ))}
              <ToolbarFilter
                labels={Array.from(phaseFilters)}
                deleteLabel={(_cat, label) => {
                  const phase = (typeof label === 'string' ? label : label.key) as PhaseStatus;
                  setPhaseFilters((prev) => { const next = new Set(prev); next.delete(phase); return next; });
                }}
                deleteLabelGroup={() => setPhaseFilters(new Set())}
                categoryName="Status"
                showToolbarItem={filterAttr === 'phase'}
              >
                <Select
                  id={`${idPrefix}-phase-filter`}
                  isOpen={isPhaseOpen}
                  selected={Array.from(phaseFilters)}
                  onSelect={(_e, value) => {
                    if (typeof value === 'string' || typeof value === 'number') {
                      handlePhaseFilterSelect(value, phaseFilters, setPhaseFilters);
                    }
                  }}
                  onOpenChange={setIsPhaseOpen}
                  toggle={(toggleRef: React.Ref<HTMLButtonElement>) => (
                    <MenuToggle ref={toggleRef} onClick={() => setIsPhaseOpen(!isPhaseOpen)} isExpanded={isPhaseOpen} id={`${idPrefix}-phase-toggle`}>
                      Filter by status{phaseFilters.size > 0 && <>{' '}<Badge isRead id={`${idPrefix}-phase-badge`}>{phaseFilters.size}</Badge></>}
                    </MenuToggle>
                  )}
                >
                  <SelectList id={`${idPrefix}-phase-list`}>
                    {ALL_PHASES.map((phase) => (
                      <SelectOption key={phase} value={phase} hasCheckbox isSelected={phaseFilters.has(phase)} id={`${idPrefix}-phase-opt-${phase.toLowerCase()}`}>
                        {phase}
                      </SelectOption>
                    ))}
                  </SelectList>
                </Select>
              </ToolbarFilter>
            </ToolbarGroup>
          </ToolbarToggleGroup>
          {leftActions}
          {rightActions && (
            <ToolbarGroup align={{ default: 'alignEnd' }} id={`${idPrefix}-right-actions`}>
              {rightActions}
            </ToolbarGroup>
          )}
        </ToolbarContent>
      </Toolbar>
    );
  };

  const hasActiveGroupFilter = !!groupFilterTerm;
  const hasActiveModelFilter = !!modelFilterTerm;

  React.useEffect(() => {
    setHighlightedGroup({});
    setExpandedCards(new Set());
  }, [hasActiveGroupFilter]);

  React.useEffect(() => {
    setHighlightedModel({});
    setExpandedCards(new Set());
  }, [hasActiveModelFilter]);

  // --- Side-by-side expanded content renderer ---
  const handleGroupClick = (contextKey: string, groupName: string) => {
    if (hasActiveGroupFilter) {return;}
    setHighlightedGroup((prev) => ({
      ...prev,
      [contextKey]: prev[contextKey] === groupName ? null : groupName,
    }));
    setExpandedCards(new Set());
  };

  const handleModelClick = (contextKey: string, modelId: string) => {
    if (hasActiveModelFilter) {return;}
    setHighlightedModel((prev) => ({
      ...prev,
      [contextKey]: prev[contextKey] === modelId ? null : modelId,
    }));
    setExpandedCards(new Set());
  };

  const renderWarningIcon = (bodyContent: React.ReactNode, id: string) => (
    <Popover
      headerContent="Configuration warning"
      bodyContent={bodyContent}
      id={`${id}-popover`}
    >
      <Button variant="plain" aria-label="Warning details" isInline style={{ padding: 0, marginLeft: '4px', color: 'var(--pf-t--global--icon--color--status--warning--default)' }} id={`${id}-btn`}>
        <ExclamationTriangleIcon />
      </Button>
    </Popover>
  );

  const renderGroupLabel = (contextKey: string, groupName: string, key: string) => {
    const clickHighlighted = highlightedGroup[contextKey] || null;
    const isClickHighlighted = clickHighlighted === groupName;
    const isFilterHighlighted = groupFilterTerm && groupName.toLowerCase().includes(groupFilterTerm);
    const isHighlighted = isClickHighlighted || !!isFilterHighlighted;
    return (
      <Label key={key} variant="filled" color={isHighlighted ? 'blue' : 'grey'} isCompact
        style={{ cursor: hasActiveGroupFilter ? 'default' : 'pointer', margin: '2px' }}
        onClick={() => handleGroupClick(contextKey, groupName)} id={`${key}-label`}
      >{groupName}</Label>
    );
  };

  const renderModelLabel = (contextKey: string, modelId: string, modelName: string, tokenText: string | null, key: string) => {
    const clickHighlighted = highlightedModel[contextKey] || null;
    const isClickHighlighted = clickHighlighted === modelId;
    const gm = governanceModels.find((m) => m.id === modelId);
    const isFilterHighlighted = modelFilterTerm && (
      modelName.toLowerCase().includes(modelFilterTerm) || (gm?.modelId ?? modelId).toLowerCase().includes(modelFilterTerm)
    );
    const isHighlighted = isClickHighlighted || !!isFilterHighlighted;
    return (
      <div key={key} style={{ marginBottom: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Label variant="filled" color={isHighlighted ? 'blue' : 'grey'} isCompact
            style={{ cursor: hasActiveModelFilter ? 'default' : 'pointer' }}
            onClick={() => handleModelClick(contextKey, modelId)} id={`${key}-label`}
          >{modelName}</Label>
          {gm?.source === 'external'
            ? <Label color="purple" variant="outline" isCompact id={`${key}-source`}>External</Label>
            : <Label color="orange" variant="outline" isCompact id={`${key}-source`}>Internal</Label>}
        </div>
        {tokenText && (
          <span style={{ fontSize: 'var(--pf-t--global--font--size--xs)', color: 'var(--pf-t--global--text--color--subtle)', display: 'block', marginTop: '2px', paddingLeft: '2px' }}>{tokenText}</span>
        )}
      </div>
    );
  };

  const formatCompactTokens = (n: number): string => n.toLocaleString();
  const formatCompactUnit = (unit: string): string => {
    const map: Record<string, string> = { minute: 'min', hour: 'hr', day: 'day', second: 'sec', week: 'wk', month: 'mo' };
    return map[unit.toLowerCase()] || unit;
  };
  const formatTokenLimits = (limits: { tokens: number; per: number; unit: string }[]): string | null => {
    if (!limits || limits.length === 0) {return null;}
    return limits.map((l) => `${formatCompactTokens(l.tokens)}/${l.per > 1 ? l.per : ''}${formatCompactUnit(l.unit)}`).join(' | ');
  };

  const renderSubCard = (
    sub: { id: string; name: string; phase: PhaseStatus; priority: number; groups: string[] },
    contextKey: string,
    fullSub: SubscriptionListItem | undefined,
    idPrefix: string,
    opts?: { showGroups?: boolean; showModels?: boolean; tokenLimitsForModelId?: string },
  ) => {
    const { showGroups = true, showModels = true, tokenLimitsForModelId } = opts || {};
    const modelTokenText = tokenLimitsForModelId && fullSub
      ? formatTokenLimits(fullSub.tokenLimits[tokenLimitsForModelId] || [])
      : null;
    const cardId = `${idPrefix}-card-${sub.id}`;
    const isNameMatch = subNameFilterTerm && sub.name.toLowerCase().includes(subNameFilterTerm);
    const isGroupMatch = groupFilterTerm && sub.groups.some((g) => g.toLowerCase().includes(groupFilterTerm));
    const clickedGroup = highlightedGroup[contextKey];
    const isClickGroupMatch = clickedGroup && sub.groups.includes(clickedGroup);
    const clickedModel = highlightedModel[contextKey];
    const isClickModelMatch = clickedModel && fullSub?.models.includes(clickedModel);
    const isModelFilterMatch = showModels && modelFilterTerm && fullSub?.models.some((mId) => {
      const gm = governanceModels.find((m) => m.id === mId);
      return (gm?.name ?? mId).toLowerCase().includes(modelFilterTerm) || (gm?.modelId ?? mId).toLowerCase().includes(modelFilterTerm);
    });
    const isCardSelected = !!isNameMatch || !!isGroupMatch || !!isClickGroupMatch || !!isClickModelMatch || !!isModelFilterMatch;
    const isCardExpanded = expandedCards.has(cardId) || isCardSelected;
    return (
      <Card key={sub.id} isCompact isExpanded={isCardExpanded} style={{ marginBottom: 'var(--pf-t--global--spacer--sm)', boxShadow: isCardSelected ? '0 0 0 2px #0066cc' : undefined }} id={cardId}>
        <CardHeader
          onExpand={() => toggleCard(cardId)}
          toggleButtonProps={{ id: `${cardId}-toggle`, 'aria-label': `${sub.name} details`, 'aria-labelledby': `${cardId}-title ${cardId}-toggle` }}
          id={`${cardId}-header`}
        >
          <CardTitle id={`${cardId}-title`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <Button variant="link" isInline onClick={() => goMaas({ maasSubId: sub.id, maasWizard: null, maasPolId: null, from: 'overview', view: overviewView })} id={`${cardId}-title-link`}>{sub.name}</Button>
              <PhasePopoverLabel phase={sub.phase} message={getSubscriptionPhaseMessage(sub.phase, fullSub?.models.length ?? 1)} id={`${idPrefix}-phase-${sub.id}`} />
            </div>
          </CardTitle>
        </CardHeader>
        <CardExpandableContent>
          <CardBody id={`${cardId}-body`}>
            <DescriptionList isHorizontal isFluid isCompact id={`${idPrefix}-dl-labels-${sub.id}`}>
              {tokenLimitsForModelId && (
                <DescriptionListGroup>
                  <DescriptionListTerm>Token limits</DescriptionListTerm>
                  <DescriptionListDescription>
                    {modelTokenText
                      ? <span style={{ fontSize: 'var(--pf-t--global--font--size--sm)' }}>{modelTokenText}</span>
                      : <span style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>—</span>
                    }
                  </DescriptionListDescription>
                </DescriptionListGroup>
              )}
              {showGroups && (
                <DescriptionListGroup>
                  <DescriptionListTerm>Groups</DescriptionListTerm>
                  <DescriptionListDescription>
                    {sub.groups.length === 0
                      ? <span style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>—</span>
                      : <LabelGroup numLabels={8} expandedText="Show less" collapsedText={`${Math.max(0, sub.groups.length - 8)} more`} isCompact id={`${idPrefix}-grp-lg-${sub.id}`}>{sub.groups.map((g) => renderGroupLabel(contextKey, g, `${idPrefix}-grp-${sub.id}-${g}`))}</LabelGroup>
                    }
                  </DescriptionListDescription>
                </DescriptionListGroup>
              )}
            </DescriptionList>
            {showModels && (
              <DescriptionList isCompact style={{ marginTop: 'var(--pf-t--global--spacer--sm)' }} id={`${idPrefix}-dl-models-${sub.id}`}>
                <DescriptionListGroup>
                  <DescriptionListTerm>Models</DescriptionListTerm>
                  <DescriptionListDescription>
                    {!fullSub || fullSub.models.length === 0
                      ? <span style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>—</span>
                      : <div style={{ display: 'flex', flexDirection: 'column' }}>
                          {fullSub.models.map((mId) => {
                            const gm = governanceModels.find((gmod) => gmod.id === mId);
                            const limits = fullSub.tokenLimits[mId] || [];
                            return renderModelLabel(contextKey, mId, gm?.name ?? mId, formatTokenLimits(limits), `${idPrefix}-model-${sub.id}-${mId}`);
                          })}
                        </div>
                    }
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            )}
          </CardBody>
        </CardExpandableContent>
      </Card>
    );
  };

  const renderPolCard = (
    pol: { id: string; name: string; phase: PhaseStatus; groups: string[] },
    contextKey: string,
    fullPol: AuthPolicyListItem | undefined,
    idPrefix: string,
    opts?: { showGroups?: boolean; showModels?: boolean },
  ) => {
    const { showGroups = true, showModels = true } = opts || {};
    const cardId = `${idPrefix}-card-${pol.id}`;
    const isNameMatch = polNameFilterTerm && pol.name.toLowerCase().includes(polNameFilterTerm);
    const isGroupMatch = groupFilterTerm && pol.groups.some((g) => g.toLowerCase().includes(groupFilterTerm));
    const clickedGroup = highlightedGroup[contextKey];
    const isClickGroupMatch = clickedGroup && pol.groups.includes(clickedGroup);
    const clickedModel = highlightedModel[contextKey];
    const isClickModelMatch = clickedModel && fullPol?.models.includes(clickedModel);
    const isModelFilterMatch = showModels && modelFilterTerm && fullPol?.models.some((mId) => {
      const gm = governanceModels.find((m) => m.id === mId);
      return (gm?.name ?? mId).toLowerCase().includes(modelFilterTerm) || (gm?.modelId ?? mId).toLowerCase().includes(modelFilterTerm);
    });
    const isCardSelected = !!isNameMatch || !!isGroupMatch || !!isClickGroupMatch || !!isClickModelMatch || !!isModelFilterMatch;
    const isCardExpanded = expandedCards.has(cardId) || isCardSelected;
    return (
      <Card key={pol.id} isCompact isExpanded={isCardExpanded} style={{ marginBottom: 'var(--pf-t--global--spacer--sm)', boxShadow: isCardSelected ? '0 0 0 2px #0066cc' : undefined }} id={cardId}>
        <CardHeader
          onExpand={() => toggleCard(cardId)}
          toggleButtonProps={{ id: `${cardId}-toggle`, 'aria-label': `${pol.name} details`, 'aria-labelledby': `${cardId}-title ${cardId}-toggle` }}
          id={`${cardId}-header`}
        >
          <CardTitle id={`${cardId}-title`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <Button variant="link" isInline onClick={() => goMaas({ maasPolId: pol.id, maasWizard: null, maasSubId: null, from: 'overview', view: overviewView })} id={`${cardId}-title-link`}>{pol.name}</Button>
              <PhasePopoverLabel phase={pol.phase} message={getAuthPolicyPhaseMessage(pol.phase, fullPol?.models.length ?? 0)} id={`${idPrefix}-phase-${pol.id}`} />
            </div>
          </CardTitle>
        </CardHeader>
        <CardExpandableContent>
          <CardBody id={`${cardId}-body`}>
            {showGroups && (
              <DescriptionList isHorizontal isFluid isCompact id={`${idPrefix}-dl-labels-${pol.id}`}>
                <DescriptionListGroup>
                  <DescriptionListTerm>Groups</DescriptionListTerm>
                  <DescriptionListDescription>
                    {pol.groups.length === 0
                      ? <span style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>—</span>
                      : <LabelGroup numLabels={8} expandedText="Show less" collapsedText={`${Math.max(0, pol.groups.length - 8)} more`} isCompact id={`${idPrefix}-grp-lg-${pol.id}`}>{pol.groups.map((g) => renderGroupLabel(contextKey, g, `${idPrefix}-grp-${pol.id}-${g}`))}</LabelGroup>
                    }
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            )}
            {showModels && (
              <DescriptionList isCompact style={{ marginTop: showGroups ? 'var(--pf-t--global--spacer--sm)' : undefined }} id={`${idPrefix}-dl-models-${pol.id}`}>
                <DescriptionListGroup>
                  <DescriptionListTerm>Models</DescriptionListTerm>
                  <DescriptionListDescription>
                    {!fullPol || fullPol.models.length === 0
                      ? <span style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>—</span>
                      : <div style={{ display: 'flex', flexDirection: 'column' }}>
                          {fullPol.models.map((mId) => {
                            const gm = governanceModels.find((gmod) => gmod.id === mId);
                            return renderModelLabel(contextKey, mId, gm?.name ?? mId, null, `${idPrefix}-model-${pol.id}-${mId}`);
                          })}
                        </div>
                    }
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            )}
          </CardBody>
        </CardExpandableContent>
      </Card>
    );
  };

  const isCardVisuallyExpanded = (cardId: string, groups: string[], modelIds: string[], contextKey: string) => {
    if (expandedCards.has(cardId)) {return true;}
    const clickedGroup = highlightedGroup[contextKey];
    if (clickedGroup && groups.includes(clickedGroup)) {return true;}
    const clickedModel = highlightedModel[contextKey];
    if (clickedModel && modelIds.includes(clickedModel)) {return true;}
    return false;
  };

  const renderLaneHeader = (label: string, _count: number, cardIds: string[], id: string, contextKey: string, items: { groups: string[]; modelIds: string[] }[]) => {
    const allExpanded = cardIds.length > 0 && cardIds.every((cid, i) => isCardVisuallyExpanded(cid, items[i].groups, items[i].modelIds, contextKey));
    const handleToggle = () => {
      if (allExpanded) {
        collapseAllCards(cardIds);
        setHighlightedGroup((prev) => ({ ...prev, [contextKey]: null }));
        setHighlightedModel((prev) => ({ ...prev, [contextKey]: null }));
      } else {
        expandAllCards(cardIds);
      }
    };
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--pf-t--global--spacer--sm)' }} id={id}>
        <Title headingLevel="h4" style={{ fontWeight: 'normal', fontSize: 'var(--pf-t--global--font--size--body--default)' }} id={`${id}-title`}>
          {label}
        </Title>
        {cardIds.length > 1 && (
          <Button
            variant="link"
            onClick={handleToggle}
            id={`${id}-expand-toggle`}
          >
            {allExpanded ? 'Collapse all' : 'Expand all'}
          </Button>
        )}
      </div>
    );
  };

  const renderSideBySideDetails = (model: GovernanceModel) => {
    const subCardIds = model.subscriptions.map((sub) => `j2-mv-sub-${model.id}-card-${sub.id}`);
    const polCardIds = model.policies.map((pol) => `j2-mv-pol-${model.id}-card-${pol.id}`);
    const subItems = model.subscriptions.map((sub) => {
      const fullSub = mockSubscriptionsList.find((s) => s.id === sub.id);
      return { groups: sub.groups, modelIds: fullSub?.models ?? [] };
    });
    const polItems = model.policies.map((pol) => {
      const fullPol = mockAuthPoliciesList.find((p) => p.id === pol.id);
      return { groups: pol.groups, modelIds: fullPol?.models ?? [] };
    });
    return (
      <ExpandableRowContent>
        <div style={{ display: 'flex' }} id={`j2-details-${model.id}`}>
          <div style={{ flex: 1, minWidth: 0, padding: 'var(--pf-t--global--spacer--md)', borderRight: '1px solid var(--pf-t--global--border--color--default)' }} id={`j2-subs-lane-${model.id}`}>
            {renderLaneHeader('Subscriptions', model.subscriptions.length, subCardIds, `j2-subs-lane-hdr-${model.id}`, model.id, subItems)}
            {model.subscriptions.length === 0 ? (
              <EmptyState headingLevel="h5" titleText="No subscriptions" variant="xs" id={`j2-no-subs-${model.id}`}>
                <EmptyStateBody>No rate limits configured for this model.</EmptyStateBody>
              </EmptyState>
            ) : (
              model.subscriptions.map((sub) => {
                const fullSub = mockSubscriptionsList.find((s) => s.id === sub.id);
                return renderSubCard(sub, model.id, fullSub, `j2-mv-sub-${model.id}`, { showModels: false, tokenLimitsForModelId: model.id });
              })
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0, padding: 'var(--pf-t--global--spacer--md)' }} id={`j2-pols-lane-${model.id}`}>
            {renderLaneHeader('Authorization policies', model.policies.length, polCardIds, `j2-pols-lane-hdr-${model.id}`, model.id, polItems)}
            {model.policies.length === 0 ? (
              <EmptyState headingLevel="h5" titleText="No authorization policies" variant="xs" id={`j2-no-pols-${model.id}`}>
                <EmptyStateBody>Access is denied by default.</EmptyStateBody>
              </EmptyState>
            ) : (
              model.policies.map((pol) => {
                const fullPol = mockAuthPoliciesList.find((p) => p.id === pol.id);
                return renderPolCard(pol, model.id, fullPol, `j2-mv-pol-${model.id}`, { showModels: false });
              })
            )}
          </div>
        </div>
      </ExpandableRowContent>
    );
  };

  // --- Group expanded content renderer (per-model side-by-side) ---
  const renderGroupSideBySideDetails = (group: GovernanceGroup) => {
    const allSubs = new Map<string, SubscriptionRef>();
    const allPols = new Map<string, AuthPolicyRef>();
    group.models.forEach((m) => {
      m.subscriptions.forEach((s) => { if (!allSubs.has(s.id)) {allSubs.set(s.id, s);} });
      m.policies.forEach((p) => { if (!allPols.has(p.id)) {allPols.set(p.id, p);} });
    });
    const uniqueSubs = Array.from(allSubs.values());
    const uniquePols = Array.from(allPols.values());
    const subCardIds = uniqueSubs.map((sub) => `j2-gv-sub-${group.id}-card-${sub.id}`);
    const polCardIds = uniquePols.map((pol) => `j2-gv-pol-${group.id}-card-${pol.id}`);
    const grpSubItems = uniqueSubs.map((sub) => {
      const fullSub = mockSubscriptionsList.find((s) => s.id === sub.id);
      return { groups: sub.groups, modelIds: fullSub?.models ?? [] };
    });
    const grpPolItems = uniquePols.map((pol) => {
      const fullPol = mockAuthPoliciesList.find((p) => p.id === pol.id);
      return { groups: pol.groups, modelIds: fullPol?.models ?? [] };
    });

    return (
      <ExpandableRowContent>
        {group.models.length === 0 ? (
          <EmptyState headingLevel="h4" titleText="No models" variant="xs" id={`j2-grp-no-models-${group.id}`}>
            <EmptyStateBody>This group has no model access configured.</EmptyStateBody>
          </EmptyState>
        ) : (
          <div style={{ display: 'flex' }} id={`j2-grp-details-${group.id}`}>
            <div style={{ flex: 1, minWidth: 0, padding: 'var(--pf-t--global--spacer--md)', borderRight: '1px solid var(--pf-t--global--border--color--default)' }} id={`j2-grp-subs-lane-${group.id}`}>
              {renderLaneHeader('Subscriptions', uniqueSubs.length, subCardIds, `j2-grp-subs-lane-hdr-${group.id}`, group.id, grpSubItems)}
              {uniqueSubs.length === 0 ? (
                <EmptyState headingLevel="h5" titleText="No subscriptions" variant="xs" id={`j2-grp-no-subs-${group.id}`}>
                  <EmptyStateBody>No rate limits configured for this group.</EmptyStateBody>
                </EmptyState>
              ) : (
                uniqueSubs.map((sub) => {
                  const fullSub = mockSubscriptionsList.find((s) => s.id === sub.id);
                  return renderSubCard(sub, group.id, fullSub, `j2-gv-sub-${group.id}`, { showGroups: false });
                })
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0, padding: 'var(--pf-t--global--spacer--md)' }} id={`j2-grp-pols-lane-${group.id}`}>
              {renderLaneHeader('Authorization policies', uniquePols.length, polCardIds, `j2-grp-pols-lane-hdr-${group.id}`, group.id, grpPolItems)}
              {uniquePols.length === 0 ? (
                <EmptyState headingLevel="h5" titleText="No authorization policies" variant="xs" id={`j2-grp-no-pols-${group.id}`}>
                  <EmptyStateBody>Access is denied by default for this group.</EmptyStateBody>
                </EmptyState>
              ) : (
                uniquePols.map((pol) => {
                  const fullPol = mockAuthPoliciesList.find((p) => p.id === pol.id);
                  return renderPolCard(pol, group.id, fullPol, `j2-gv-pol-${group.id}`, { showGroups: false });
                })
              )}
            </div>
          </div>
        )}
      </ExpandableRowContent>
    );
  };

  // --- Overview group view ---
  const allGroupIds = sortedGroups.map((g) => g.id);
  const areAllGroupsExpanded = sortedGroups.length > 0 && sortedGroups.every((g) => expandedGroups.has(g.id));

  const pagedGroups = sortedGroups.slice((groupPage - 1) * groupPerPage, groupPage * groupPerPage);

  const renderGroupViewTable = () => (
    <>
    <Pagination
      itemCount={sortedGroups.length}
      perPage={groupPerPage}
      page={groupPage}
      onSetPage={(_e, p) => setGroupPage(p)}
      onPerPageSelect={(_e, pp) => { setGroupPerPage(pp); setGroupPage(1); }}
      id="j2-groups-pagination-top"
    />
    <Table aria-label="MaaS governance groups" isExpandable id="j2-groups-table">
      <Thead>
        <Tr>
          <Th id="j2-grp-th-expand" style={{ width: '48px', padding: 0, verticalAlign: 'middle', textAlign: 'center' }}>
            <Button variant="plain" aria-label={areAllGroupsExpanded ? 'Collapse all' : 'Expand all'} onClick={() => areAllGroupsExpanded ? collapseAll(setExpandedGroups) : expandAllIds(allGroupIds, setExpandedGroups)} id="j2-grp-expand-all-btn" style={{ padding: 0 }}>
              <AngleDownIcon style={{ transition: 'transform 0.2s', transform: areAllGroupsExpanded ? undefined : 'rotate(-90deg)' }} />
            </Button>
          </Th>
          <Th sort={getGroupSortParams(1)} id="j2-grp-th-name">Group name</Th>
          <Th sort={getGroupSortParams(2)} id="j2-grp-th-models">Models</Th>
          <Th sort={getGroupSortParams(3)} id="j2-grp-th-subs">Subscriptions</Th>
          <Th sort={getGroupSortParams(4)} id="j2-grp-th-pols">Authorization policies</Th>
          <Th screenReaderText="Actions" id="j2-grp-th-actions" />
        </Tr>
      </Thead>
      {pagedGroups.length === 0 ? (
        <Tbody><Tr><Td colSpan={GROUP_COL_COUNT} id="j2-groups-empty">
          <EmptyState headingLevel="h3" titleText="No groups match this filter" id="j2-groups-empty-state"><EmptyStateBody>Try adjusting your filters or search term.</EmptyStateBody></EmptyState>
        </Td></Tr></Tbody>
      ) : (
        pagedGroups.map((group, rowIndex) => {
          const isRowExpanded = expandedGroups.has(group.id);
          return (
            <Tbody key={group.id} isExpanded={isRowExpanded} id={`j2-grp-tbody-${group.id}`}>
              <Tr isContentExpanded={isRowExpanded} id={`j2-grp-row-${group.id}`}>
                <Td expand={{ rowIndex, isExpanded: isRowExpanded, onToggle: () => toggleSet(expandedGroups, group.id, setExpandedGroups), expandId: `j2-grp-expand-${group.id}` }} id={`j2-grp-expand-td-${group.id}`} />
                <Td dataLabel="Group name" id={`j2-grp-name-${group.id}`}><strong>{group.name}</strong></Td>
                <Td dataLabel="Models" id={`j2-grp-models-cell-${group.id}`}>
                  {group.modelCount}{group.modelCount === 0 && renderWarningIcon(
                    <div>
                      <p>This group is not associated with any models. Members of this group cannot access any models through the MaaS gateway.</p>
                      <p style={{ marginTop: 'var(--pf-t--global--spacer--sm)', fontWeight: 600 }}>How to fix this:</p>
                      <ul style={{ marginTop: 'var(--pf-t--global--spacer--xs)', paddingLeft: 'var(--pf-t--global--spacer--md)' }}>
                        <li>Create a subscription and an authorization policy that both include this group and at least one model.</li>
                        <li>Or use the kebab menu on this row to create a subscription or policy with this group pre-filled.</li>
                      </ul>
                    </div>, `j2-grp-models-warn-${group.id}`)}
                </Td>
                <Td dataLabel="Subscriptions" id={`j2-grp-subs-cell-${group.id}`}>
                  {group.subscriptionCount}{group.subscriptionCount === 0 && renderWarningIcon(
                    <div>
                      <p>This group has no subscriptions. Without a subscription, no token rate limits are defined and this group cannot call models through the MaaS API gateway.</p>
                      <p style={{ marginTop: 'var(--pf-t--global--spacer--sm)', fontWeight: 600 }}>How to fix this:</p>
                      <ul style={{ marginTop: 'var(--pf-t--global--spacer--xs)', paddingLeft: 'var(--pf-t--global--spacer--md)' }}>
                        <li>Use the kebab menu to create a subscription for this group.</li>
                        <li>Or go to the Subscriptions tab and add this group to an existing subscription.</li>
                      </ul>
                      <p style={{ marginTop: 'var(--pf-t--global--spacer--sm)', fontStyle: 'italic', color: 'var(--pf-t--global--text--color--subtle)' }}>A subscription defines token rate limits. An authorization policy is also required to permit access.</p>
                    </div>, `j2-grp-subs-warn-${group.id}`)}
                </Td>
                <Td dataLabel="Authorization policies" id={`j2-grp-pols-cell-${group.id}`}>
                  {group.policyCount}{group.policyCount === 0 && renderWarningIcon(
                    <div>
                      <p>This group has no authorization policies. Without a policy, the MaaS gateway will deny all access for this group -- even if a subscription exists.</p>
                      <p style={{ marginTop: 'var(--pf-t--global--spacer--sm)', fontWeight: 600 }}>How to fix this:</p>
                      <ul style={{ marginTop: 'var(--pf-t--global--spacer--xs)', paddingLeft: 'var(--pf-t--global--spacer--md)' }}>
                        <li>Use the kebab menu to create an authorization policy for this group.</li>
                        <li>Or go to the Authorization policies tab and add this group to an existing policy.</li>
                      </ul>
                      <p style={{ marginTop: 'var(--pf-t--global--spacer--sm)', fontStyle: 'italic', color: 'var(--pf-t--global--text--color--subtle)' }}>Both a subscription and an authorization policy are required for a group to access a model.</p>
                    </div>, `j2-grp-pols-warn-${group.id}`)}
                </Td>
                <Td isActionCell id={`j2-grp-actions-${group.id}`}>
                  <ActionsColumn items={[
                    { title: 'Create subscription', onClick: () => goMaas({ maasWizard: 'create-subscription', prefillGroup: group.name, maasSubId: null, maasPolId: null }) },
                    { title: 'Create authorization policy', onClick: () => goMaas({ maasWizard: 'create-auth-policy', prefillGroup: group.name, maasSubId: null, maasPolId: null }) },
                    { isSeparator: true },
                    { title: 'Remove group access', onClick: () => openRemoveGroupModal(group) },
                  ]} popperProps={{ position: 'right' }} id={`j2-grp-kebab-${group.id}`} />
                </Td>
              </Tr>
              <Tr isExpanded={isRowExpanded} id={`j2-grp-expand-details-${group.id}`}>
                <Td colSpan={GROUP_COL_COUNT} id={`j2-grp-expand-details-td-${group.id}`}>
                  {renderGroupSideBySideDetails(group)}
                </Td>
              </Tr>
            </Tbody>
          );
        })
      )}
    </Table>
    <Pagination
      itemCount={sortedGroups.length}
      perPage={groupPerPage}
      page={groupPage}
      onSetPage={(_e, p) => setGroupPage(p)}
      onPerPageSelect={(_e, pp) => { setGroupPerPage(pp); setGroupPage(1); }}
      variant="bottom"
      id="j2-groups-pagination-bottom"
    />
    </>
  );

  // --- Overview model view ---
  const allModelIds = sortedModels.map((m) => m.id);
  const areAllModelsExpanded = sortedModels.length > 0 && sortedModels.every((m) => expandedModels.has(m.id));

  const pagedModels = sortedModels.slice((modelPage - 1) * modelPerPage, modelPage * modelPerPage);

  const renderModelViewTable = () => (
    <>
    <Pagination
      itemCount={sortedModels.length}
      perPage={modelPerPage}
      page={modelPage}
      onSetPage={(_e, p) => setModelPage(p)}
      onPerPageSelect={(_e, pp) => { setModelPerPage(pp); setModelPage(1); }}
      id="j2-models-pagination-top"
    />
    <Table aria-label="MaaS governance models" isExpandable id="j2-models-table">
      <Thead>
        <Tr>
          <Th id="j2-th-expand-models" style={{ width: '48px', padding: 0, verticalAlign: 'middle', textAlign: 'center' }}>
            <Button variant="plain" aria-label={areAllModelsExpanded ? 'Collapse all' : 'Expand all'} onClick={() => areAllModelsExpanded ? collapseAll(setExpandedModels) : expandAllIds(allModelIds, setExpandedModels)} id="j2-models-expand-all-btn" style={{ padding: 0 }}>
              <AngleDownIcon style={{ transition: 'transform 0.2s', transform: areAllModelsExpanded ? undefined : 'rotate(-90deg)' }} />
            </Button>
          </Th>
          <Th sort={getModelSortParams(1)} id="j2-th-model-name">Model</Th>
          <Th sort={getModelSortParams(2)} id="j2-th-subs">Subscriptions</Th>
          <Th sort={getModelSortParams(3)} id="j2-th-pols">Authorization policies</Th>
          <Th screenReaderText="Actions" id="j2-th-actions" />
        </Tr>
      </Thead>
      {pagedModels.length === 0 ? (
        <Tbody><Tr><Td colSpan={OVERVIEW_COL_COUNT} id="j2-models-empty">
          <EmptyState headingLevel="h3" titleText="No models match this filter" id="j2-models-empty-state"><EmptyStateBody>Try adjusting your filters or search term.</EmptyStateBody></EmptyState>
        </Td></Tr></Tbody>
      ) : (
        pagedModels.map((model, rowIndex) => {
          const isRowExpanded = expandedModels.has(model.id);
          return (
            <Tbody key={model.id} isExpanded={isRowExpanded} id={`j2-tbody-${model.id}`}>
              <Tr isContentExpanded={isRowExpanded} id={`j2-row-${model.id}`}>
                <Td expand={{ rowIndex, isExpanded: isRowExpanded, onToggle: () => toggleSet(expandedModels, model.id, setExpandedModels), expandId: `j2-expand-${model.id}` }} id={`j2-expand-td-${model.id}`} />
                <Td dataLabel="Model name" style={{ maxWidth: '350px' }} id={`j2-name-${model.id}`}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <TruncatedModelName name={model.name} id={`j2-model-${model.id}`} />
                    {model.source === 'external'
                      ? <Label color="purple" variant="outline" isCompact id={`j2-source-${model.id}`}>External</Label>
                      : <Label color="orange" variant="outline" isCompact id={`j2-source-${model.id}`}>Internal</Label>}
                  </span>
                  <TruncatedModelId modelId={model.modelId} id={`j2-model-id-${model.id}`} />
                  <TruncatedDescription text={model.description} id={`j2-model-desc-${model.id}`} />
                </Td>
                <Td dataLabel="Subscriptions" id={`j2-subs-cell-${model.id}`}>
                  {model.subscriptions.length}{model.subscriptions.length === 0 && renderWarningIcon(
                    <div>
                      <p>This model has no subscriptions. Without a subscription, no token rate limits are configured and the model cannot be called through the MaaS API gateway.</p>
                      <p style={{ marginTop: 'var(--pf-t--global--spacer--sm)', fontWeight: 600 }}>How to fix this:</p>
                      <ul style={{ marginTop: 'var(--pf-t--global--spacer--xs)', paddingLeft: 'var(--pf-t--global--spacer--md)' }}>
                        <li>Create a new subscription that includes this model and at least one group.</li>
                        <li>Or add this model to an existing subscription from the Subscriptions tab.</li>
                      </ul>
                    </div>, `j2-model-subs-warn-${model.id}`)}
                </Td>
                <Td dataLabel="Authorization policies" id={`j2-pols-cell-${model.id}`}>
                  {model.policies.length}{model.policies.length === 0 && renderWarningIcon(
                    <div>
                      <p>This model has no authorization policies. Without a policy, the MaaS gateway will deny all access to this model -- even if a subscription exists.</p>
                      <p style={{ marginTop: 'var(--pf-t--global--spacer--sm)', fontWeight: 600 }}>How to fix this:</p>
                      <ul style={{ marginTop: 'var(--pf-t--global--spacer--xs)', paddingLeft: 'var(--pf-t--global--spacer--md)' }}>
                        <li>Create a new authorization policy that includes this model and at least one group.</li>
                        <li>Or add this model to an existing policy from the Authorization policies tab.</li>
                      </ul>
                      <p style={{ marginTop: 'var(--pf-t--global--spacer--sm)', fontStyle: 'italic', color: 'var(--pf-t--global--text--color--subtle)' }}>Both a subscription and a policy are required for a group to access a model.</p>
                    </div>, `j2-model-pols-warn-${model.id}`)}
                </Td>
                <Td isActionCell id={`j2-actions-${model.id}`}>
                  <ActionsColumn items={getModelRowActions(model)} popperProps={{ position: 'right' }} id={`j2-kebab-${model.id}`} />
                </Td>
              </Tr>
              <Tr isExpanded={isRowExpanded} id={`j2-expand-details-${model.id}`}>
                <Td colSpan={OVERVIEW_COL_COUNT} id={`j2-expand-details-td-${model.id}`}>
                  {renderSideBySideDetails(model)}
                </Td>
              </Tr>
            </Tbody>
          );
        })
      )}
    </Table>
    <Pagination
      itemCount={sortedModels.length}
      perPage={modelPerPage}
      page={modelPage}
      onSetPage={(_e, p) => setModelPage(p)}
      onPerPageSelect={(_e, pp) => { setModelPerPage(pp); setModelPage(1); }}
      variant="bottom"
      id="j2-models-pagination-bottom"
    />
    </>
  );


  // --- Overview tab ---
  const renderOverviewTab = () => (
    <>
      {renderOverviewFilterToolbar(
        <>
          <ToolbarItem>
            <Button variant="secondary" onClick={() => goMaas({ maasWizard: 'create-subscription', maasSubId: null, maasPolId: null, prefillModel: null, prefillGroup: null })} id="j2-overview-create-sub-btn">Create subscription</Button>
          </ToolbarItem>
          <ToolbarItem>
            <Button variant="secondary" onClick={() => goMaas({ maasWizard: 'create-auth-policy', maasSubId: null, maasPolId: null, prefillModel: null, prefillGroup: null })} id="j2-overview-create-pol-btn">Create authorization policy</Button>
          </ToolbarItem>
          <ToolbarGroup align={{ default: 'alignEnd' }} id="j2-overview-right-actions">
            <ToolbarItem>
              <ToggleGroup id="j2-view-toggle" aria-label="Overview view">
                <ToggleGroupItem text="Model view" buttonId="j2-toggle-model" isSelected={overviewView === 'model'} onChange={() => { setOverviewView('model'); setOverviewFilterAttr('model'); setOverviewSearchValue(overviewFilters.model || ''); }} />
                <ToggleGroupItem text="Group view" buttonId="j2-toggle-group" isSelected={overviewView === 'group'} onChange={() => { setOverviewView('group'); setOverviewFilterAttr('group'); setOverviewSearchValue(overviewFilters.group || ''); }} />
              </ToggleGroup>
            </ToolbarItem>
          </ToolbarGroup>
        </>,
      )}
      {overviewView === 'model' ? renderModelViewTable() : renderGroupViewTable()}
    </>
  );

  const renderSubGroupsExpanded = (groups: string[], subId: string) => (
    <ExpandableRowContent>
      <Table aria-label="Groups in subscription" variant="compact" id={`j2-sub-groups-detail-${subId}`}>
        <Thead><Tr><Th id={`j2-sub-groups-detail-th-${subId}`}>Group name</Th></Tr></Thead>
        <Tbody>
          {groups.map((g) => (
            <Tr key={g} id={`j2-sub-group-row-${subId}-${g}`}>
              <Td dataLabel="Group name" id={`j2-sub-group-cell-${subId}-${g}`}><strong>{g}</strong></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </ExpandableRowContent>
  );

  const renderSubModelsExpanded = (sub: SubscriptionListItem) => (
    <ExpandableRowContent>
      <Table aria-label="Models in subscription" variant="compact" id={`j2-sub-models-detail-${sub.id}`}>
        <Thead><Tr><Th id={`j2-sub-models-detail-name-th-${sub.id}`}>Model name</Th><Th id={`j2-sub-models-detail-limits-th-${sub.id}`}>Token limits</Th></Tr></Thead>
        <Tbody>
          {sub.models.map((modelId) => {
            const gm = governanceModels.find((m) => m.id === modelId);
            const limits = sub.tokenLimits[modelId] || [];
            return (
              <Tr key={modelId} id={`j2-sub-model-row-${sub.id}-${modelId}`}>
                <Td dataLabel="Model name" id={`j2-sub-model-cell-${sub.id}-${modelId}`}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <TruncatedModelName name={gm?.name ?? modelId} id={`j2-sub-model-${sub.id}-${modelId}`} />
                    {gm?.source === 'external'
                      ? <Label color="purple" variant="outline" isCompact id={`j2-sub-source-${sub.id}-${modelId}`}>External</Label>
                      : <Label color="orange" variant="outline" isCompact id={`j2-sub-source-${sub.id}-${modelId}`}>Internal</Label>}
                  </span>
                  <TruncatedModelId modelId={gm?.modelId ?? modelId} id={`j2-sub-modelid-${sub.id}-${modelId}`} />
                  <TruncatedDescription text={gm?.description ?? ''} id={`j2-sub-modeldesc-${sub.id}-${modelId}`} />
                </Td>
                <Td dataLabel="Token limits" id={`j2-sub-limits-cell-${sub.id}-${modelId}`}>
                  {limits.length === 0 ? '—' : formatTokenLimits(limits)}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </ExpandableRowContent>
  );

  const renderSubscriptionsTab = () => (
    <>
      {renderListFilterToolbar(
        'j2-subs',
        subFilterAttr, setSubFilterAttr,
        subSearchValue, setSubSearchValue, updateSubSearch,
        isSubAttrOpen, setIsSubAttrOpen,
        subPhaseFilters, setSubPhaseFilters,
        isSubPhaseOpen, setIsSubPhaseOpen,
        subFilters,
        <ToolbarItem>
          <Button id="j2-subs-create-btn" variant="primary" onClick={() => goMaas({ maasWizard: 'create-subscription', maasSubId: null, maasPolId: null, prefillModel: null, prefillGroup: null })}>Create subscription</Button>
        </ToolbarItem>,
      )}
      <Pagination
        itemCount={sortedSubscriptions.length}
        perPage={subPerPage}
        page={subPage}
        onSetPage={(_e, p) => setSubPage(p)}
        onPerPageSelect={(_e, pp) => { setSubPerPage(pp); setSubPage(1); }}
        id="j2-subs-pagination-top"
      />
      <Table aria-label="Subscriptions list" isExpandable id="j2-subs-table">
        <Thead>
          <Tr>
            <Th sort={getSubSortParams(0)} width={20} id="j2-sub-th-name">Subscription</Th>
            <Th sort={getSubSortParams(1)} id="j2-sub-th-phase">Status</Th>
            <Th sort={getSubSortParams(2)} id="j2-sub-th-groups">Groups</Th>
            <Th sort={getSubSortParams(3)} id="j2-sub-th-models">Models</Th>
            <Th sort={getSubSortParams(4)} id="j2-sub-th-priority">Priority</Th>
            <Th screenReaderText="Actions" id="j2-sub-th-actions" />
          </Tr>
        </Thead>
        {sortedSubscriptions.length === 0 ? (
          <Tbody><Tr><Td colSpan={SUB_COL_COUNT} id="j2-subs-empty">
            <EmptyState headingLevel="h3" titleText="No subscriptions match this filter" id="j2-subs-empty-state"><EmptyStateBody>Try adjusting your filters or search term.</EmptyStateBody></EmptyState>
          </Td></Tr></Tbody>
        ) : (
          sortedSubscriptions.slice((subPage - 1) * subPerPage, subPage * subPerPage).map((sub, rowIndex) => {
            const expandedCol = subExpanded[sub.id];
            const isRowExpanded = !!expandedCol;
            return (
              <Tbody key={sub.id} isExpanded={isRowExpanded} id={`j2-sub-tbody-${sub.id}`}>
                <Tr isControlRow isContentExpanded={isRowExpanded} id={`j2-sub-row-${sub.id}`}>
                  <Td dataLabel="Name" id={`j2-sub-name-${sub.id}`}>
                    <Tooltip content={`Resource name: ${sub.resourceName}`} id={`j2-sub-name-tooltip-${sub.id}`}>
                      <Button variant="link" isInline onClick={() => goMaas({ maasSubId: sub.id, maasWizard: null, maasPolId: null })} id={`j2-sub-name-link-${sub.id}`}>{sub.name}</Button>
                    </Tooltip>
                    {sub.description && (
                      <div style={{ fontSize: 'var(--pf-t--global--font--size--sm)', color: 'var(--pf-t--global--text--color--subtle)' }} id={`j2-sub-desc-${sub.id}`}>{sub.description}</div>
                    )}
                  </Td>
                  <Td dataLabel="Status" id={`j2-sub-phase-td-${sub.id}`}>
                    <PhasePopoverLabel phase={sub.phase} message={getSubscriptionPhaseMessage(sub.phase, sub.models.length)} id={`j2-sub-phase-${sub.id}`} />
                  </Td>
                  <Td dataLabel="Groups" compoundExpand={subCompoundExpand(sub.id, 'groups', rowIndex, 2)} id={`j2-sub-groups-cell-${sub.id}`}
                    onClick={(e: React.MouseEvent) => { if (e.target === e.currentTarget) {toggleSubExpand(sub.id, 'groups');} }}>
                    {sub.groups.length === 0
                      ? <div style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--pf-t--global--icon--color--status--warning--default)' }} id={`j2-sub-groups-warn-wrap-${sub.id}`}><ExclamationTriangleIcon style={{ marginRight: '4px' }} /> 0</div>
                      : sub.groups.length
                    }
                  </Td>
                  <Td dataLabel="Models" compoundExpand={subCompoundExpand(sub.id, 'models', rowIndex, 3)} id={`j2-sub-models-cell-${sub.id}`}
                    onClick={(e: React.MouseEvent) => { if (e.target === e.currentTarget) {toggleSubExpand(sub.id, 'models');} }}>
                    {sub.models.length === 0
                      ? <div style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--pf-t--global--icon--color--status--warning--default)' }} id={`j2-sub-models-warn-wrap-${sub.id}`}><ExclamationTriangleIcon style={{ marginRight: '4px' }} /> 0</div>
                      : sub.models.length
                    }
                  </Td>
                  <Td dataLabel="Priority" id={`j2-sub-priority-${sub.id}`}>{sub.priority}</Td>
                  <Td isActionCell id={`j2-sub-actions-${sub.id}`}>
                    <ActionsColumn items={getSubRowActions(sub)} popperProps={{ position: 'right' }} id={`j2-sub-kebab-${sub.id}`} />
                  </Td>
                </Tr>
                <Tr isExpanded={expandedCol === 'groups'} id={`j2-sub-expand-groups-${sub.id}`}>
                  <Td colSpan={SUB_COL_COUNT} id={`j2-sub-expand-groups-td-${sub.id}`}>{renderSubGroupsExpanded(sub.groups, sub.id)}</Td>
                </Tr>
                <Tr isExpanded={expandedCol === 'models'} id={`j2-sub-expand-models-${sub.id}`}>
                  <Td colSpan={SUB_COL_COUNT} id={`j2-sub-expand-models-td-${sub.id}`}>{renderSubModelsExpanded(sub)}</Td>
                </Tr>
              </Tbody>
            );
          })
        )}
      </Table>
      <Pagination
        itemCount={sortedSubscriptions.length}
        perPage={subPerPage}
        page={subPage}
        onSetPage={(_e, p) => setSubPage(p)}
        onPerPageSelect={(_e, pp) => { setSubPerPage(pp); setSubPage(1); }}
        variant="bottom"
        id="j2-subs-pagination-bottom"
      />
    </>
  );

  const renderPolGroupsExpanded = (groups: string[], polId: string) => (
    <ExpandableRowContent>
      <Table aria-label="Groups in policy" variant="compact" id={`j2-pol-groups-detail-${polId}`}>
        <Thead><Tr><Th id={`j2-pol-groups-detail-th-${polId}`}>Group name</Th></Tr></Thead>
        <Tbody>
          {groups.map((g) => (
            <Tr key={g} id={`j2-pol-group-row-${polId}-${g}`}>
              <Td dataLabel="Group name" id={`j2-pol-group-cell-${polId}-${g}`}><strong>{g}</strong></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </ExpandableRowContent>
  );

  const renderPolModelsExpanded = (models: string[], polId: string) => (
    <ExpandableRowContent>
      <Table aria-label="Models in policy" variant="compact" id={`j2-pol-models-detail-${polId}`}>
        <Thead><Tr><Th id={`j2-pol-models-detail-th-${polId}`}>Model name</Th></Tr></Thead>
        <Tbody>
          {models.map((modelId) => {
            const gm = governanceModels.find((m) => m.id === modelId);
            return (
              <Tr key={modelId} id={`j2-pol-model-row-${polId}-${modelId}`}>
                <Td dataLabel="Model name" id={`j2-pol-model-cell-${polId}-${modelId}`}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <TruncatedModelName name={gm?.name ?? modelId} id={`j2-pol-model-${polId}-${modelId}`} />
                    {gm?.source === 'external'
                      ? <Label color="purple" variant="outline" isCompact id={`j2-pol-source-${polId}-${modelId}`}>External</Label>
                      : <Label color="orange" variant="outline" isCompact id={`j2-pol-source-${polId}-${modelId}`}>Internal</Label>}
                  </span>
                  <TruncatedModelId modelId={gm?.modelId ?? modelId} id={`j2-pol-modelid-${polId}-${modelId}`} />
                  <TruncatedDescription text={gm?.description ?? ''} id={`j2-pol-modeldesc-${polId}-${modelId}`} />
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </ExpandableRowContent>
  );

  const renderPoliciesTab = () => (
    <>
      {renderListFilterToolbar(
        'j2-pols',
        policyFilterAttr, setPolicyFilterAttr,
        policySearchValue, setPolicySearchValue, updatePolicySearch,
        isPolicyAttrOpen, setIsPolicyAttrOpen,
        policyPhaseFilters, setPolicyPhaseFilters,
        isPolicyPhaseOpen, setIsPolicyPhaseOpen,
        policyFilters,
        <ToolbarItem>
          <Button id="j2-pols-create-btn" variant="primary" onClick={() => goMaas({ maasWizard: 'create-auth-policy', maasSubId: null, maasPolId: null, prefillModel: null, prefillGroup: null })}>Create authorization policy</Button>
        </ToolbarItem>,
      )}
      <Pagination
        itemCount={sortedPolicies.length}
        perPage={polPerPage}
        page={polPage}
        onSetPage={(_e, p) => setPolPage(p)}
        onPerPageSelect={(_e, pp) => { setPolPerPage(pp); setPolPage(1); }}
        id="j2-pols-pagination-top"
      />
      <Table aria-label="Authorization policies list" isExpandable id="j2-pols-table">
        <Thead>
          <Tr>
            <Th sort={getPolicySortParams(0)} width={20} id="j2-pol-th-name">Authorization policy</Th>
            <Th sort={getPolicySortParams(1)} id="j2-pol-th-phase">Status</Th>
            <Th sort={getPolicySortParams(2)} id="j2-pol-th-groups">Groups</Th>
            <Th sort={getPolicySortParams(3)} id="j2-pol-th-models">Models</Th>
            <Th screenReaderText="Actions" id="j2-pol-th-actions" />
          </Tr>
        </Thead>
        {sortedPolicies.length === 0 ? (
          <Tbody><Tr><Td colSpan={POLICY_COL_COUNT} id="j2-pols-empty">
            <EmptyState headingLevel="h3" titleText="No authorization policies match this filter" id="j2-pols-empty-state"><EmptyStateBody>Try adjusting your filters or search term.</EmptyStateBody></EmptyState>
          </Td></Tr></Tbody>
        ) : (
          sortedPolicies.slice((polPage - 1) * polPerPage, polPage * polPerPage).map((pol, rowIndex) => {
            const expandedCol = policyExpanded[pol.id];
            const isRowExpanded = !!expandedCol;
            return (
              <Tbody key={pol.id} isExpanded={isRowExpanded} id={`j2-pol-tbody-${pol.id}`}>
                <Tr isControlRow isContentExpanded={isRowExpanded} id={`j2-pol-row-${pol.id}`}>
                  <Td dataLabel="Name" id={`j2-pol-name-${pol.id}`}>
                    <Tooltip content={`Resource name: ${pol.resourceName}`} id={`j2-pol-name-tooltip-${pol.id}`}>
                      <Button variant="link" isInline onClick={() => goMaas({ maasPolId: pol.id, maasWizard: null, maasSubId: null })} id={`j2-pol-name-link-${pol.id}`}>{pol.name}</Button>
                    </Tooltip>
                    {pol.description && (
                      <div style={{ fontSize: 'var(--pf-t--global--font--size--sm)', color: 'var(--pf-t--global--text--color--subtle)' }} id={`j2-pol-desc-${pol.id}`}>{pol.description}</div>
                    )}
                  </Td>
                  <Td dataLabel="Status" id={`j2-pol-phase-td-${pol.id}`}>
                    <PhasePopoverLabel phase={pol.phase} message={getAuthPolicyPhaseMessage(pol.phase, pol.models.length)} id={`j2-pol-phase-${pol.id}`} />
                  </Td>
                  <Td dataLabel="Groups" compoundExpand={policyCompoundExpand(pol.id, 'groups', rowIndex, 2)} id={`j2-pol-groups-cell-${pol.id}`}
                    onClick={(e: React.MouseEvent) => { if (e.target === e.currentTarget) {togglePolicyExpand(pol.id, 'groups');} }}>
                    {pol.groups.length === 0
                      ? <div style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--pf-t--global--icon--color--status--warning--default)' }} id={`j2-pol-groups-warn-wrap-${pol.id}`}><ExclamationTriangleIcon style={{ marginRight: '4px' }} /> 0</div>
                      : pol.groups.length
                    }
                  </Td>
                  <Td dataLabel="Models" compoundExpand={policyCompoundExpand(pol.id, 'models', rowIndex, 3)} id={`j2-pol-models-cell-${pol.id}`}
                    onClick={(e: React.MouseEvent) => { if (e.target === e.currentTarget) {togglePolicyExpand(pol.id, 'models');} }}>
                    {pol.models.length === 0
                      ? <div style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--pf-t--global--icon--color--status--warning--default)' }} id={`j2-pol-models-warn-wrap-${pol.id}`}><ExclamationTriangleIcon style={{ marginRight: '4px' }} /> 0</div>
                      : pol.models.length
                    }
                  </Td>
                  <Td isActionCell id={`j2-pol-actions-${pol.id}`}>
                    <ActionsColumn items={getPolicyRowActions(pol)} popperProps={{ position: 'right' }} id={`j2-pol-kebab-${pol.id}`} />
                  </Td>
                </Tr>
                <Tr isExpanded={expandedCol === 'groups'} id={`j2-pol-expand-groups-${pol.id}`}>
                  <Td colSpan={POLICY_COL_COUNT} id={`j2-pol-expand-groups-td-${pol.id}`}>{renderPolGroupsExpanded(pol.groups, pol.id)}</Td>
                </Tr>
                <Tr isExpanded={expandedCol === 'models'} id={`j2-pol-expand-models-${pol.id}`}>
                  <Td colSpan={POLICY_COL_COUNT} id={`j2-pol-expand-models-td-${pol.id}`}>{renderPolModelsExpanded(pol.models, pol.id)}</Td>
                </Tr>
              </Tbody>
            );
          })
        )}
      </Table>
      <Pagination
        itemCount={sortedPolicies.length}
        perPage={polPerPage}
        page={polPage}
        onSetPage={(_e, p) => setPolPage(p)}
        onPerPageSelect={(_e, pp) => { setPolPerPage(pp); setPolPage(1); }}
        variant="bottom"
        id="j2-pols-pagination-bottom"
      />
    </>
  );

    const maasWizard = searchParams.get('maasWizard')
  const maasSubId = searchParams.get('maasSubId')
  const maasPolId = searchParams.get('maasPolId')

  if (maasWizard || maasSubId || maasPolId) {
    const stubTitle = maasWizard
      ? maasWizard === 'create-subscription'
        ? 'Create subscription'
        : 'Create authorization policy'
      : maasSubId
        ? 'Subscription details'
        : 'Authorization policy details'
    return (
      <TenantUserPageChrome
        pageClassName="tenant-admin-maas-governance"
        kicker="AI"
        title={stubTitle}
        description="This admin flow is stubbed in the Ethan prototype. Use the breadcrumb-style back control to return to MaaS governance."
        actions={
          <Button
            variant="secondary"
            onClick={() =>
              goMaas({
                maasWizard: null,
                maasSubId: null,
                maasPolId: null,
                edit: null,
                prefillModel: null,
                prefillGroup: null,
                from: null,
              })
            }
          >
            Back to MaaS governance
          </Button>
        }
      />
    )
  }

  return (
    <>
    <TenantUserPageChrome
      pageClassName="tenant-admin-maas-governance"
      kicker="AI"
      title="MaaS governance"
      description="Manage subscriptions and authorization policies to control the MaaS models that each user group in your organization can access."
    >

          <Tabs activeKey={activeTab} onSelect={(_e, tabIndex) => setActiveTab(tabIndex as MainTab)} id="j2-main-tabs">
            <Tab
              eventKey="overview"
              title={<TabTitleText id="j2-tab-overview-title">{'Overview'}</TabTitleText>}
              id="j2-tab-overview"
            >
              <GenaiPageStack id="j2-overview-panel">
                {renderOverviewTab()}
              </GenaiPageStack>
            </Tab>
            <Tab
              eventKey="subscriptions"
              title={<TabTitleText id="j2-tab-subs-title">{'Subscriptions'}</TabTitleText>}
              actions={
                <TabAction>
                  <Popover
                    bodyContent="Subscriptions define which models user groups can access and the token rate limits for each group."
                    id="j2-tab-subs-popover"
                  >
                    <Button
                      variant="plain"
                      aria-label="More info about subscriptions"
                      className="tenant-genai-page__tab-help"
                      id="j2-tab-subs-help"
                    >
                      <OutlinedQuestionCircleIcon />
                    </Button>
                  </Popover>
                </TabAction>
              }
              id="j2-tab-subs"
            >
              <GenaiPageStack id="j2-subs-panel">
                {renderSubscriptionsTab()}
              </GenaiPageStack>
            </Tab>
            <Tab
              eventKey="policies"
              title={<TabTitleText id="j2-tab-pols-title">{'Authorization policies'}</TabTitleText>}
              actions={
                <TabAction>
                  <Popover
                    bodyContent="Authorization policies control the access permissions for API calls, determining which user groups can invoke specific models."
                    id="j2-tab-pols-popover"
                  >
                    <Button
                      variant="plain"
                      aria-label="More info about authorization policies"
                      className="tenant-genai-page__tab-help"
                      id="j2-tab-pols-help"
                    >
                      <OutlinedQuestionCircleIcon />
                    </Button>
                  </Popover>
                </TabAction>
              }
              id="j2-tab-pols"
            >
              <GenaiPageStack id="j2-pols-panel">
                {renderPoliciesTab()}
              </GenaiPageStack>
            </Tab>
          </Tabs>
      </TenantUserPageChrome>

      <Modal
        isOpen={removeGroupModalOpen}
        onClose={() => setRemoveGroupModalOpen(false)}
        variant="small"
        aria-labelledby="j2-remove-group-modal-title"
        id="j2-remove-group-modal"
      >
        <ModalHeader
          title="Remove group access?"
          titleIconVariant="warning"
          labelId="j2-remove-group-modal-title"
        />
        <ModalBody id="j2-remove-group-modal-body">
          <p style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
            This will remove <strong>{removeGroupTarget?.name}</strong> from the selected subscriptions and authorization policies below.
            The group will lose access to the associated models. Uncheck any items you want to keep.
          </p>
          {getRemoveGroupSubs().length > 0 && (
            <>
              <Title headingLevel="h4" size="md" style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }} id="j2-remove-group-subs-heading">Subscriptions</Title>
              {getRemoveGroupSubs().map((sub) => (
                <Checkbox
                  key={sub.id}
                  id={`j2-remove-group-sub-${sub.id}`}
                  label={sub.name}
                  isChecked={!!removeGroupChecked[`sub-${sub.id}`]}
                  onChange={(_e, checked) => setRemoveGroupChecked((prev) => ({ ...prev, [`sub-${sub.id}`]: checked }))}
                  style={{ marginBottom: 'var(--pf-t--global--spacer--xs)' }}
                />
              ))}
            </>
          )}
          {getRemoveGroupPols().length > 0 && (
            <>
              <Title headingLevel="h4" size="md" style={{ marginTop: 'var(--pf-t--global--spacer--md)', marginBottom: 'var(--pf-t--global--spacer--sm)' }} id="j2-remove-group-pols-heading">Authorization policies</Title>
              {getRemoveGroupPols().map((pol) => (
                <Checkbox
                  key={pol.id}
                  id={`j2-remove-group-pol-${pol.id}`}
                  label={pol.name}
                  isChecked={!!removeGroupChecked[`pol-${pol.id}`]}
                  onChange={(_e, checked) => setRemoveGroupChecked((prev) => ({ ...prev, [`pol-${pol.id}`]: checked }))}
                  style={{ marginBottom: 'var(--pf-t--global--spacer--xs)' }}
                />
              ))}
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            variant="danger"
            onClick={handleRemoveGroupAccess}
            isDisabled={!Object.values(removeGroupChecked).some(Boolean)}
            id="j2-remove-group-confirm-btn"
          >
            Remove
          </Button>
          <Button variant="link" onClick={() => setRemoveGroupModalOpen(false)} id="j2-remove-group-cancel-btn">
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Subscription Confirmation Modal */}
      <Modal
        variant={ModalVariant.small}
        isOpen={deleteSubModalOpen}
        onClose={() => setDeleteSubModalOpen(false)}
        aria-labelledby="j2-delete-sub-modal-title"
        id="j2-delete-sub-modal"
      >
        <ModalHeader
          title={`Delete ${subToDelete?.name || 'subscription'}?`}
          titleIconVariant="warning"
          labelId="j2-delete-sub-modal-title"
        />
        <ModalBody id="j2-delete-sub-modal-body">
          <p style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
            This action will permanently delete the subscription <strong>{subToDelete?.name}</strong>.
            Any groups and models associated with this subscription will lose access. This action cannot be undone.
          </p>
          <Form id="j2-delete-sub-form">
            <FormGroup
              label={<>Type <strong>{subToDelete?.name}</strong> to confirm deletion.</>}
              fieldId="j2-delete-sub-confirm-input"
            >
              <TextInput
                id="j2-delete-sub-confirm-input"
                value={deleteSubConfirmText}
                onChange={(_event, value) => setDeleteSubConfirmText(value)}
                placeholder={subToDelete?.name}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="danger"
            isDisabled={deleteSubConfirmText !== subToDelete?.name}
            onClick={() => {
              if (subToDelete) {
                deleteSubscriptionFromStore(subToDelete.id);
                refreshData();
                setDeleteSubModalOpen(false);
              }
            }}
            id="j2-delete-sub-confirm-btn"
          >
            Delete subscription
          </Button>
          <Button variant="link" onClick={() => setDeleteSubModalOpen(false)} id="j2-delete-sub-cancel-btn">
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Policy Confirmation Modal */}
      <Modal
        variant={ModalVariant.small}
        isOpen={deletePolicyModalOpen}
        onClose={() => setDeletePolicyModalOpen(false)}
        aria-labelledby="j2-delete-policy-modal-title"
        id="j2-delete-policy-modal"
      >
        <ModalHeader
          title={`Delete ${policyToDelete?.name || 'policy'}?`}
          titleIconVariant="warning"
          labelId="j2-delete-policy-modal-title"
        />
        <ModalBody id="j2-delete-policy-modal-body">
          <p style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
            This action will permanently delete the authorization policy <strong>{policyToDelete?.name}</strong>.
            Any groups associated with this policy will lose their access controls. This action cannot be undone.
          </p>
          <Form id="j2-delete-policy-form">
            <FormGroup
              label={<>Type <strong>{policyToDelete?.name}</strong> to confirm deletion.</>}
              fieldId="j2-delete-policy-confirm-input"
            >
              <TextInput
                id="j2-delete-policy-confirm-input"
                value={deletePolicyConfirmText}
                onChange={(_event, value) => setDeletePolicyConfirmText(value)}
                placeholder={policyToDelete?.name}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="danger"
            isDisabled={deletePolicyConfirmText !== policyToDelete?.name}
            onClick={() => {
              if (policyToDelete) {
                deleteAuthPolicyFromStore(policyToDelete.id);
                refreshData();
                setDeletePolicyModalOpen(false);
              }
            }}
            id="j2-delete-policy-confirm-btn"
          >
            Delete policy
          </Button>
          <Button variant="link" onClick={() => setDeletePolicyModalOpen(false)} id="j2-delete-policy-cancel-btn">
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default MaaSGovernancePage;
