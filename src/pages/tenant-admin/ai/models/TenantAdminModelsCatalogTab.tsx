import * as React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Content,
  ContentVariants,
  Divider,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Label,
  LabelGroup,
  Popover,
  SearchInput,
  Sidebar,
  SidebarContent,
  SidebarPanel,
  Slider,
  Stack,
  StackItem,
  Switch,
  Title,
  ToggleGroup,
  ToggleGroupItem,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  ToolbarToggleGroup,
} from '@patternfly/react-core';
import { ArrowRightIcon, ChartBarIcon, CheckCircleIcon, FilterIcon, SearchIcon } from '@patternfly/react-icons';
import GenericModelSvgIcon from '../../../../assets/generic-model-icon.svg';
import ValidatedModelSvgIcon from '../../../../assets/validated-model.svg';
import {
  ODH_CATALOG_LANGUAGES,
  ODH_CATALOG_LICENSES,
  ODH_CATALOG_PROVIDERS,
  ODH_CATALOG_TASKS,
  ODH_CATALOG_TENSOR_TYPES,
  odhCatalogModels,
} from './TenantAdminModelsCatalogData';
import type { OdhCatalogCategory, OdhCatalogModel } from './TenantAdminModelsCatalogData';

const CATEGORIES: OdhCatalogCategory[] = [
  'All models',
  'Red Hat AI – validated models',
  'Red Hat AI models',
  'Other models',
];

const CATEGORY_DESCRIPTIONS: Record<Exclude<OdhCatalogCategory, 'All models'>, string> = {
  'Red Hat AI – validated models':
    'Third-party models verified by Red Hat to ensure reliable performance and compatibility. Some include validated runtime arguments for additional capabilities.',
  'Red Hat AI models': 'Red Hat models with full support and legal indemnification.',
  'Other models': 'A broad collection of third-party, community, and administrator-configured models.',
};

const RESET_ALL_FILTERS_LABEL = 'Reset all filters';
const PAGE_SIZE = 4;

const VALIDATED_POPOVER =
  'This model has been validated by Red Hat AI for selected tasks and hardware configurations.';
const RED_HAT_POPOVER = 'This model is provided by Red Hat.';

type StringFilters = {
  task: string[];
  validatedArguments: string[];
  provider: string[];
  license: string[];
  language: string[];
  tensorType: string[];
};

const EMPTY_FILTERS: StringFilters = {
  task: [],
  validatedArguments: [],
  provider: [],
  license: [],
  language: [],
  tensorType: [],
};

const toggleValue = (values: string[], value: string): string[] =>
  values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

const matchesFilters = (model: OdhCatalogModel, filters: StringFilters): boolean => {
  if (filters.task.length > 0 && !filters.task.some((task) => model.tasks.includes(task))) {
    return false;
  }
  if (filters.validatedArguments.length > 0) {
    const validated = model.validatedTasks ?? [];
    if (!filters.validatedArguments.every((argument) => validated.includes(argument))) {
      return false;
    }
  }
  if (filters.provider.length > 0 && !filters.provider.includes(model.provider)) {
    return false;
  }
  if (filters.license.length > 0 && !filters.license.includes(model.license)) {
    return false;
  }
  if (filters.language.length > 0 && !filters.language.includes(model.language)) {
    return false;
  }
  if (filters.tensorType.length > 0 && (!model.tensorType || !filters.tensorType.includes(model.tensorType))) {
    return false;
  }
  return true;
};

const FilterGroup: React.FunctionComponent<{
  id: string;
  title: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  footer?: React.ReactNode;
}> = ({ id, title, options, selected, onToggle, footer }) => (
  <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }} id={id}>
    <Title headingLevel="h2" size="md" id={`${id}-title`}>
      {title}
    </Title>
    {options.map((option) => (
      <Checkbox
        key={option}
        id={`${id}-${option.replace(/\s+/g, '-').toLowerCase()}-checkbox`}
        data-testid={`${title}-${option}-checkbox`}
        label={option}
        isChecked={selected.includes(option)}
        onChange={() => onToggle(option)}
      />
    ))}
    {footer}
  </Flex>
);

const ModelCatalogCard: React.FunctionComponent<{ model: OdhCatalogModel }> = ({ model }) => (
  <Card isFullHeight id={`odh-model-catalog-card-${model.id}`} data-testid="model-catalog-card">
    <CardHeader>
      <Flex
        alignItems={{ default: 'alignItemsFlexStart' }}
        justifyContent={{ default: 'justifyContentSpaceBetween' }}
        flexWrap={{ default: 'nowrap' }}
        fullWidth={{ default: 'fullWidth' }}
        gap={{ default: 'gapXs' }}
      >
        <FlexItem>
          <img
            id={`odh-model-catalog-card-icon-${model.id}`}
            aria-hidden="true"
            src={model.isValidated ? ValidatedModelSvgIcon : GenericModelSvgIcon}
            alt=""
            width={56}
            height={56}
          />
        </FlexItem>
        {(model.isValidated || model.isRedHat) && (
          <FlexItem>
            <Flex spaceItems={{ default: 'spaceItemsSm' }}>
              {model.isValidated && (
                <Popover bodyContent={VALIDATED_POPOVER}>
                  <Label variant="outline" isClickable status="success" icon={<CheckCircleIcon />}>
                    Validated
                  </Label>
                </Popover>
              )}
              {model.isRedHat && (
                <Popover bodyContent={RED_HAT_POPOVER}>
                  <Label color="grey" isClickable>
                    Red Hat
                  </Label>
                </Popover>
              )}
            </Flex>
          </FlexItem>
        )}
      </Flex>
      <CardTitle>
        <Button
          id={`odh-model-catalog-card-link-${model.id}`}
          data-testid="model-catalog-detail-link"
          variant="link"
          isInline
        >
          <span data-testid="model-catalog-card-name">{model.name}</span>
        </Button>
      </CardTitle>
    </CardHeader>
    <CardBody>
      <Content component={ContentVariants.p} data-testid="model-catalog-card-description">
        {model.description}
      </Content>
    </CardBody>
    <CardFooter>
      <LabelGroup numLabels={model.isValidated ? 2 : 3} isCompact>
        {model.tasks.map((task) => (
          <Label
            data-testid="model-catalog-label"
            key={task}
            variant="outline"
            icon={
              model.validatedTasks?.includes(task) ? (
                <CheckCircleIcon color="var(--pf-t--global--icon--color--status--success--default)" />
              ) : undefined
            }
          >
            {task}
          </Label>
        ))}
        <Label isCompact variant="outline">
          {model.provider}
        </Label>
      </LabelGroup>
    </CardFooter>
  </Card>
);

const CATALOG_GRID_SPANS = { sm: 6 as const, md: 6 as const, lg: 6 as const, xl: 6 as const, xl2: 3 as const };

const CategorySection: React.FunctionComponent<{
  title: string;
  description?: string;
  models: OdhCatalogModel[];
  onShowMore: () => void;
}> = ({ title, description, models, onShowMore }) => {
  if (models.length === 0) {
    return null;
  }
  const visible = models.slice(0, PAGE_SIZE);
  return (
    <StackItem className="pf-v6-u-pb-xl" id={`odh-catalog-section-${title}`}>
      <Flex
        alignItems={{ default: 'alignItemsCenter' }}
        justifyContent={{ default: 'justifyContentSpaceBetween' }}
        className="pf-v6-u-mb-md"
      >
        <FlexItem>
          <Title headingLevel="h3" size="lg" id={`odh-catalog-section-title-${title}`}>
            {title}
          </Title>
          {description && (
            <Content component={ContentVariants.p} className="pf-v6-u-color-200 pf-v6-u-mt-sm">
              {description}
            </Content>
          )}
        </FlexItem>
        {models.length > PAGE_SIZE && (
          <FlexItem>
            <Button
              variant="link"
              size="sm"
              isInline
              icon={<ArrowRightIcon />}
              iconPosition="right"
              id={`odh-catalog-show-more-${title}`}
              data-testid={`show-more-button ${title.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={onShowMore}
            >
              Show all {title}
            </Button>
          </FlexItem>
        )}
      </Flex>
      <Grid hasGutter>
        {visible.map((model) => (
          <GridItem key={model.id} {...CATALOG_GRID_SPANS}>
            <ModelCatalogCard model={model} />
          </GridItem>
        ))}
      </Grid>
    </StackItem>
  );
};

interface TenantAdminModelsCatalogTabProps {
  onManageSources?: () => void
}

export const TenantAdminModelsCatalogTab: React.FunctionComponent<
  TenantAdminModelsCatalogTabProps
> = ({ onManageSources }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [submittedSearch, setSubmittedSearch] = React.useState('');
  const [category, setCategory] = React.useState<OdhCatalogCategory>('All models');
  const [filters, setFilters] = React.useState<StringFilters>(EMPTY_FILTERS);
  const [performanceViewEnabled, setPerformanceViewEnabled] = React.useState(false);
  const [minVram, setMinVram] = React.useState(4);
  const [containerSize, setContainerSize] = React.useState(4);

  const hasStringFilters = Object.values(filters).some((values) => values.length > 0);
  const isAllModelsView = category === 'All models' && !submittedSearch && !hasStringFilters;

  const filteredModels = React.useMemo(() => {
    const query = submittedSearch.trim().toLowerCase();
    return odhCatalogModels.filter((model) => {
      if (category !== 'All models' && model.category !== category) {
        return false;
      }
      if (performanceViewEnabled && !model.isValidated) {
        return false;
      }
      if (query && !model.name.toLowerCase().includes(query) && !model.description.toLowerCase().includes(query)) {
        return false;
      }
      return matchesFilters(model, filters);
    });
  }, [category, filters, performanceViewEnabled, submittedSearch]);

  const handleFilterReset = () => {
    setSearchTerm('');
    setSubmittedSearch('');
    setFilters(EMPTY_FILTERS);
    setMinVram(4);
    setContainerSize(4);
  };

  const validatedFooter =
    filters.validatedArguments.length > 0 ? (
      <Content component={ContentVariants.small}>Showing models with all selected configurations</Content>
    ) : null;

  const filterItems: { id: string; content: React.ReactNode }[] = [
    {
      id: 'odh-catalog-task-filter',
      content: (
        <FilterGroup
          id="odh-catalog-task-filter"
          title="Task"
          options={ODH_CATALOG_TASKS}
          selected={filters.task}
          onToggle={(value) => setFilters((prev) => ({ ...prev, task: toggleValue(prev.task, value) }))}
        />
      ),
    },
    {
      id: 'odh-catalog-validated-filter',
      content: (
        <FilterGroup
          id="odh-catalog-validated-filter"
          title="Validated arguments"
          options={['Tool calling']}
          selected={filters.validatedArguments}
          onToggle={(value) =>
            setFilters((prev) => ({
              ...prev,
              validatedArguments: toggleValue(prev.validatedArguments, value),
            }))
          }
          footer={validatedFooter}
        />
      ),
    },
    {
      id: 'odh-catalog-hardware-filters',
      content: (
        <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }} id="odh-catalog-hardware-filters">
          <Title headingLevel="h2" size="md" id="odh-catalog-hardware-filters-title">
            Hardware filters
          </Title>
          <Content component={ContentVariants.small}>Minimum vRAM</Content>
          <Slider
            id="odh-catalog-min-vram-slider"
            value={minVram}
            min={4}
            max={480}
            onChange={(_event, value) => setMinVram(value)}
            customSteps={[
              { value: 4, label: '4 GB' },
              { value: 480, label: '480 GB' },
            ]}
            areCustomStepsContinuous
          />
          <Divider className="pf-v6-u-my-sm" />
          <Content component={ContentVariants.small}>Container size</Content>
          <Slider
            id="odh-catalog-container-size-slider"
            value={containerSize}
            min={4}
            max={500}
            onChange={(_event, value) => setContainerSize(value)}
            customSteps={[
              { value: 4, label: '4 GB' },
              { value: 500, label: '500 GB' },
            ]}
            areCustomStepsContinuous
          />
        </Flex>
      ),
    },
    {
      id: 'odh-catalog-provider-filter',
      content: (
        <FilterGroup
          id="odh-catalog-provider-filter"
          title="Provider"
          options={ODH_CATALOG_PROVIDERS}
          selected={filters.provider}
          onToggle={(value) => setFilters((prev) => ({ ...prev, provider: toggleValue(prev.provider, value) }))}
        />
      ),
    },
    {
      id: 'odh-catalog-license-filter',
      content: (
        <FilterGroup
          id="odh-catalog-license-filter"
          title="License"
          options={ODH_CATALOG_LICENSES}
          selected={filters.license}
          onToggle={(value) => setFilters((prev) => ({ ...prev, license: toggleValue(prev.license, value) }))}
        />
      ),
    },
    {
      id: 'odh-catalog-language-filter',
      content: (
        <FilterGroup
          id="odh-catalog-language-filter"
          title="Language"
          options={ODH_CATALOG_LANGUAGES}
          selected={filters.language}
          onToggle={(value) => setFilters((prev) => ({ ...prev, language: toggleValue(prev.language, value) }))}
        />
      ),
    },
    {
      id: 'odh-catalog-tensor-filter',
      content: (
        <FilterGroup
          id="odh-catalog-tensor-filter"
          title="Tensor type"
          options={ODH_CATALOG_TENSOR_TYPES}
          selected={filters.tensorType}
          onToggle={(value) => setFilters((prev) => ({ ...prev, tensorType: toggleValue(prev.tensorType, value) }))}
        />
      ),
    },
  ];

  return (
    <>
      <div className="pf-v6-u-flex-1" id="odh-model-catalog-body">
        <Sidebar hasBorder hasGutter id="odh-model-catalog-sidebar">
          <SidebarPanel variant="sticky" id="odh-model-catalog-filter-panel">
            <Stack hasGutter>
              <StackItem>
                <Card id="odh-model-performance-view-card">
                  <CardBody>
                    <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
                      <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                        <ChartBarIcon />
                        <Switch
                          id="model-performance-view-toggle"
                          label="Model performance view"
                          isChecked={performanceViewEnabled}
                          isReversed
                          onChange={(_event, checked) => setPerformanceViewEnabled(checked)}
                          data-testid="model-performance-view-toggle"
                        />
                      </Flex>
                      <Content component={ContentVariants.small}>
                        Enable performance filters, display model benchmark data, and exclude unvalidated
                        models.
                      </Content>
                    </Flex>
                  </CardBody>
                </Card>
              </StackItem>
              {filterItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  <StackItem>{item.content}</StackItem>
                  {index < filterItems.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Stack>
          </SidebarPanel>
          <SidebarContent>
            <Stack hasGutter>
              <StackItem>
                <Toolbar className="pf-v6-u-pb-0" id="odh-model-catalog-search-toolbar">
                  <ToolbarContent>
                    <ToolbarToggleGroup breakpoint="md" toggleIcon={<FilterIcon />}>
                      <ToolbarGroup variant="filter-group">
                        <ToolbarItem>
                          <SearchInput
                            id="odh-model-catalog-search"
                            aria-label="Search with submit button"
                            placeholder="Filter by name, description, or task"
                            value={searchTerm}
                            onChange={(_event, value) => setSearchTerm(value)}
                            onSearch={(_event, value) => setSubmittedSearch(value.trim())}
                            onClear={() => {
                              setSearchTerm('');
                              setSubmittedSearch('');
                            }}
                          />
                        </ToolbarItem>
                      </ToolbarGroup>
                    </ToolbarToggleGroup>
                    {onManageSources ? (
                      <ToolbarGroup align={{ default: 'alignEnd' }}>
                        <ToolbarItem>
                          <Button
                            variant="secondary"
                            id="odh-manage-model-sources-button"
                            onClick={onManageSources}
                          >
                            Manage sources
                          </Button>
                        </ToolbarItem>
                      </ToolbarGroup>
                    ) : null}
                  </ToolbarContent>
                </Toolbar>
              </StackItem>
              <StackItem>
                <ToggleGroup aria-label="Model catalog categories" id="odh-model-catalog-categories">
                  {CATEGORIES.map((item) => (
                    <ToggleGroupItem
                      key={item}
                      text={item}
                      buttonId={`odh-model-catalog-category-${item}`}
                      isSelected={category === item}
                      onChange={() => setCategory(item)}
                    />
                  ))}
                </ToggleGroup>
              </StackItem>
              <StackItem isFilled>
                <div className="pf-v6-u-flex-1" id="odh-model-catalog-results">
                  {isAllModelsView ? (
                    <Stack hasGutter>
                      <CategorySection
                        title="Red Hat AI – validated models"
                        description={CATEGORY_DESCRIPTIONS['Red Hat AI – validated models']}
                        models={filteredModels.filter((model) => model.category === 'Red Hat AI – validated models')}
                        onShowMore={() => setCategory('Red Hat AI – validated models')}
                      />
                      <CategorySection
                        title="Red Hat AI models"
                        description={CATEGORY_DESCRIPTIONS['Red Hat AI models']}
                        models={filteredModels.filter((model) => model.category === 'Red Hat AI models')}
                        onShowMore={() => setCategory('Red Hat AI models')}
                      />
                      <CategorySection
                        title="Other models"
                        description={CATEGORY_DESCRIPTIONS['Other models']}
                        models={filteredModels.filter((model) => model.category === 'Other models')}
                        onShowMore={() => setCategory('Other models')}
                      />
                    </Stack>
                  ) : filteredModels.length === 0 ? (
                    <Flex
                      direction={{ default: 'column' }}
                      alignItems={{ default: 'alignItemsCenter' }}
                      id="odh-model-catalog-empty"
                    >
                      <SearchIcon />
                      <Title headingLevel="h2" size="lg" id="odh-model-catalog-empty-title">
                        No results found
                      </Title>
                      <Content component={ContentVariants.p}>Adjust your filters and try again.</Content>
                      <Button variant="link" id="odh-model-catalog-reset-filters" onClick={handleFilterReset}>
                        {RESET_ALL_FILTERS_LABEL}
                      </Button>
                    </Flex>
                  ) : (
                    <Grid hasGutter>
                      {filteredModels.map((model) => (
                        <GridItem key={model.id} {...CATALOG_GRID_SPANS}>
                          <ModelCatalogCard model={model} />
                        </GridItem>
                      ))}
                    </Grid>
                  )}
                </div>
              </StackItem>
            </Stack>
          </SidebarContent>
        </Sidebar>
      </div>
    </>
  );
};
