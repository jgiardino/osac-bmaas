import { useMemo, useState } from 'react'
import {
  Button,
  ClipboardCopy,
  Dropdown,
  DropdownItem,
  DropdownList,
  Flex,
  FlexItem,
  Label,
  MenuToggle,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Pagination,
  Popover,
  SearchInput,
  Select,
  SelectList,
  SelectOption,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Truncate,
} from '@patternfly/react-core'
import EllipsisVIcon from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon'
import FilterIcon from '@patternfly/react-icons/dist/esm/icons/filter-icon'
import InfoCircleIcon from '@patternfly/react-icons/dist/esm/icons/info-circle-icon'
import OutlinedQuestionCircleIcon from '@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon'
import PlusCircleIcon from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon'
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon'
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table'

import { MOCK_AI_MODELS } from './mocks'
import type { AIModel } from './types'
import { GenaiPageStack } from '../GenaiPageStack'

const CAPABILITY_DISPLAY: Record<string, { label: string; color: 'green' | 'purple' | 'teal' }> = {
  vision: { label: 'Vision', color: 'green' },
  'audio-transcription': { label: 'Transcription', color: 'purple' },
  tools: { label: 'Tools', color: 'teal' },
}

const visibleCapabilities = (capabilities?: string[]) =>
  (capabilities ?? []).filter((c) => c !== 'text-generation')

const statusLabel = (status: string) => {
  switch (status) {
    case 'Running':
      return (
        <Label status="success" variant="outline">
          Ready
        </Label>
      )
    case 'Stop':
      return (
        <Label status="danger" variant="outline">
          Inactive
        </Label>
      )
    default:
      return (
        <Label variant="outline" color="grey" icon={<OutlinedQuestionCircleIcon />}>
          Unknown
        </Label>
      )
  }
}

const statusFilterValue = (status: string) => {
  if (status === 'Running') {
    return 'Ready'
  }
  if (status === 'Stop') {
    return 'Inactive'
  }
  return 'Unknown'
}

type FilterType = 'name' | 'useCase' | 'status'

const STATUS_OPTIONS = ['Ready', 'Inactive', 'Unknown'] as const

const filterLabel = (key: FilterType) => {
  switch (key) {
    case 'useCase':
      return 'Use Case'
    case 'status':
      return 'Status'
    default:
      return 'Name'
  }
}

export function ModelsTab() {
  const [filterType, setFilterType] = useState<FilterType>('name')
  const [searchValue, setSearchValue] = useState('')
  const [appliedName, setAppliedName] = useState('')
  const [appliedUseCase, setAppliedUseCase] = useState('')
  const [statusFilters, setStatusFilters] = useState<string[]>([])
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false)
  const [isStatusSelectOpen, setIsStatusSelectOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [models, setModels] = useState(MOCK_AI_MODELS)

  const hasCustomEndpoints = models.some((m) => m.model_source_type === 'custom_endpoint')

  const filtered = useMemo(() => {
    return models.filter((model) => {
      const matchesName =
        !appliedName ||
        model.display_name.toLowerCase().includes(appliedName.toLowerCase()) ||
        model.model_id.toLowerCase().includes(appliedName.toLowerCase())
      const matchesUseCase =
        !appliedUseCase || model.usecase.toLowerCase().includes(appliedUseCase.toLowerCase())
      const matchesStatus =
        statusFilters.length === 0 || statusFilters.includes(statusFilterValue(model.status))
      return matchesName && matchesUseCase && matchesStatus
    })
  }, [models, appliedName, appliedUseCase, statusFilters])

  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const activeFilters: { type: FilterType; value: string }[] = [
    ...(appliedName ? [{ type: 'name' as const, value: appliedName }] : []),
    ...(appliedUseCase ? [{ type: 'useCase' as const, value: appliedUseCase }] : []),
    ...statusFilters.map((value) => ({ type: 'status' as const, value })),
  ]

  const clearAllFilters = () => {
    setAppliedName('')
    setAppliedUseCase('')
    setStatusFilters([])
    setSearchValue('')
    setPage(1)
  }

  const removeFilter = (type: FilterType, value: string) => {
    if (type === 'name') {
      setAppliedName('')
      if (filterType === 'name') {
        setSearchValue('')
      }
    } else if (type === 'useCase') {
      setAppliedUseCase('')
      if (filterType === 'useCase') {
        setSearchValue('')
      }
    } else {
      setStatusFilters((prev) => prev.filter((s) => s !== value))
    }
    setPage(1)
  }

  return (
    <>
      <GenaiPageStack>
      <Toolbar id="aae-prod-models-toolbar" clearAllFilters={clearAllFilters} hasNoPadding>
        <ToolbarContent>
          <ToolbarGroup variant="filter-group">
            <ToolbarItem>
              <Dropdown
                isOpen={isFilterDropdownOpen}
                onOpenChange={setIsFilterDropdownOpen}
                toggle={(toggleRef) => (
                  <MenuToggle
                    ref={toggleRef}
                    icon={<FilterIcon />}
                    isExpanded={isFilterDropdownOpen}
                    onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                    aria-label="Filter toggle"
                    id="aae-prod-filter-type"
                  >
                    {filterLabel(filterType)}
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  {(['name', 'useCase', 'status'] as FilterType[]).map((key) => (
                    <DropdownItem
                      key={key}
                      onClick={() => {
                        setFilterType(key)
                        setSearchValue(
                          key === 'name' ? appliedName : key === 'useCase' ? appliedUseCase : '',
                        )
                        setIsFilterDropdownOpen(false)
                        setIsStatusSelectOpen(false)
                      }}
                    >
                      {filterLabel(key)}
                    </DropdownItem>
                  ))}
                </DropdownList>
              </Dropdown>
            </ToolbarItem>
            <ToolbarItem>
              {filterType === 'status' ? (
                <Select
                  isOpen={isStatusSelectOpen}
                  onOpenChange={setIsStatusSelectOpen}
                  onSelect={(_e, value) => {
                    if (typeof value !== 'string') {
                      return
                    }
                    setStatusFilters((prev) =>
                      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value],
                    )
                    setPage(1)
                  }}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsStatusSelectOpen(!isStatusSelectOpen)}
                      isExpanded={isStatusSelectOpen}
                      id="aae-prod-status-select"
                    >
                      Filter by status
                      {statusFilters.length > 0 ? ` (${statusFilters.length})` : ''}
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectOption
                        key={option}
                        value={option}
                        hasCheckbox
                        isSelected={statusFilters.includes(option)}
                      >
                        {option}
                      </SelectOption>
                    ))}
                  </SelectList>
                </Select>
              ) : (
                <SearchInput
                  placeholder={
                    filterType === 'name' ? 'Filter by name...' : 'Filter by use case...'
                  }
                  value={searchValue}
                  onChange={(_e, value) => setSearchValue(value)}
                  onSearch={() => {
                    if (filterType === 'name') {
                      setAppliedName(searchValue)
                    } else {
                      setAppliedUseCase(searchValue)
                    }
                    setPage(1)
                  }}
                  onClear={() => {
                    setSearchValue('')
                    if (filterType === 'name') {
                      setAppliedName('')
                    } else {
                      setAppliedUseCase('')
                    }
                    setPage(1)
                  }}
                  aria-label="Filter models"
                  id="aae-prod-models-search"
                />
              )}
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarItem>
              <Button
                variant="primary"
                onClick={() => setIsCreateOpen(true)}
                id="aae-prod-create-endpoint"
              >
                Create endpoint
              </Button>
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarItem>
              <Popover
                headerContent="Don't see the model you're looking for?"
                bodyContent="This page displays model deployments available as AI assets and MaaS models. To make a deployment available as an AI asset, edit it from the Model deployments page."
              >
                <Button variant="link" id="aae-prod-dont-see-model">
                  Don&apos;t see the model you&apos;re looking for?
                </Button>
              </Popover>
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup align={{ default: 'alignEnd' }}>
            <ToolbarItem>
              <Pagination
                itemCount={filtered.length}
                page={page}
                perPage={perPage}
                onSetPage={(_e, p) => setPage(p)}
                onPerPageSelect={(_e, pp) => {
                  setPerPage(pp)
                  setPage(1)
                }}
                isCompact
                id="aae-prod-models-pagination"
              />
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
        {activeFilters.length > 0 ? (
          <ToolbarContent>
            <ToolbarItem>
              <span className="pf-v6-u-font-weight-bold">Active filters:</span>
            </ToolbarItem>
            <ToolbarItem>
              <Flex gap={{ default: 'gapSm' }}>
                {activeFilters.map(({ type, value }) => (
                  <FlexItem key={`${type}-${value}`}>
                    <Label color="blue" onClose={() => removeFilter(type, value)}>
                      {filterLabel(type)}: {value}
                    </Label>
                  </FlexItem>
                ))}
                <FlexItem>
                  <Button
                    variant="link"
                    icon={<TimesIcon />}
                    onClick={clearAllFilters}
                    id="aae-prod-clear-filters"
                  >
                    Clear all filters
                  </Button>
                </FlexItem>
              </Flex>
            </ToolbarItem>
          </ToolbarContent>
        ) : null}
      </Toolbar>

      <Table aria-label="AI asset models" variant="compact" id="aae-prod-models-table">
        <Thead>
          <Tr>
            <Th
              info={{
                popover:
                  "The model's display name, followed by the model ID, which is the exact identifier used in API calls.",
                ariaLabel: 'Model information',
              }}
            >
              Model
            </Th>
            <Th>Use case</Th>
            <Th>Capabilities</Th>
            <Th>Status</Th>
            <Th>Endpoints</Th>
            <Th>Playground</Th>
            {hasCustomEndpoints ? <Th screenReaderText="Actions" /> : null}
          </Tr>
        </Thead>
        <Tbody>
          {paginated.map((model) => (
            <ModelRow
              key={`${model.model_source_type}-${model.model_id}`}
              model={model}
              showActions={hasCustomEndpoints}
              onDelete={() =>
                setModels((prev) =>
                  prev.filter(
                    (m) =>
                      !(
                        m.model_id === model.model_id &&
                        m.model_source_type === model.model_source_type
                      ),
                  ),
                )
              }
            />
          ))}
        </Tbody>
      </Table>
      </GenaiPageStack>

      <Modal
        variant="small"
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        id="aae-prod-create-endpoint-modal"
      >
        <ModalHeader title="Create endpoint" />
        <ModalBody>
          Create external endpoint is stubbed in this comparison view. In the console this opens the
          full registration form.
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={() => setIsCreateOpen(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

function PlaygroundCell({ model }: { model: AIModel }) {
  const isRunningOrCustom =
    model.model_source_type === 'custom_endpoint' || model.status === 'Running'

  if (model.capabilities?.includes('audio-transcription')) {
    return (
      <span className="pf-v6-u-text-color-subtle pf-v6-u-font-size-sm">Used in Playground settings</span>
    )
  }

  if (model.inPlayground && model.model_type === 'embedding') {
    return (
      <Button variant="link" isInline isDisabled id={`aae-prod-vector-stores-${model.model_id}`}>
        See vector stores
      </Button>
    )
  }

  if (model.inPlayground) {
    return (
      <Button
        variant="secondary"
        isDisabled={
          model.model_type === 'embedding' ||
          model.model_type === 'transcription' ||
          !isRunningOrCustom
        }
        id={`aae-prod-try-playground-${model.model_id}`}
      >
        Try in playground
      </Button>
    )
  }

  return (
    <Button
      variant="link"
      isInline
      icon={<PlusCircleIcon />}
      isDisabled={!isRunningOrCustom}
      id={`aae-prod-add-playground-${model.model_id}`}
    >
      Add to playground
    </Button>
  )
}

function ModelRow({
  model,
  showActions,
  onDelete,
}: {
  model: AIModel
  showActions: boolean
  onDelete: () => void
}) {
  const [isKebabOpen, setIsKebabOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const endpoint = model.externalEndpoint || model.internalEndpoint
  const caps = visibleCapabilities(model.capabilities)

  return (
    <>
      <Tr>
        <Td dataLabel="Model">
          <Flex gap={{ default: 'gapXs' }} alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem>
              <strong>{model.display_name || model.model_name}</strong>
            </FlexItem>
            {model.model_type === 'embedding' ? (
              <FlexItem>
                <Label color="blue" isCompact>
                  Embedding
                </Label>
              </FlexItem>
            ) : null}
          </Flex>
          <Truncate
            content={model.model_id}
            className="pf-v6-u-font-family-monospace pf-v6-u-font-size-xs pf-v6-u-text-color-subtle"
          />
          {model.description ? (
            <Truncate
              content={model.description}
              className="pf-v6-u-font-size-xs pf-v6-u-text-color-subtle"
            />
          ) : null}
        </Td>
        <Td dataLabel="Use case">{model.usecase}</Td>
        <Td dataLabel="Capabilities">
          {caps.length ? (
            <Flex gap={{ default: 'gapXs' }}>
              {caps.slice(0, 2).map((cap) => {
                const display = CAPABILITY_DISPLAY[cap] ?? {
                  label: cap,
                  color: 'teal' as const,
                }
                return (
                  <FlexItem key={cap}>
                    <Label isCompact color={display.color}>
                      {display.label}
                    </Label>
                  </FlexItem>
                )
              })}
              {caps.length > 2 ? (
                <FlexItem>
                  <span className="pf-v6-u-font-size-sm">+{caps.length - 2}</span>
                </FlexItem>
              ) : null}
            </Flex>
          ) : (
            '—'
          )}
        </Td>
        <Td dataLabel="Status">{statusLabel(model.status)}</Td>
        <Td dataLabel="Endpoints">
          {endpoint ? (
            <Popover
              headerContent="Endpoints"
              bodyContent={
                <ClipboardCopy isReadOnly hoverTip="Copy" clickTip="Copied">
                  {endpoint}
                </ClipboardCopy>
              }
            >
              <Button variant="link" isInline id={`aae-prod-endpoint-${model.model_id}`}>
                View
              </Button>
            </Popover>
          ) : (
            <Label icon={<InfoCircleIcon />}>Not available</Label>
          )}
        </Td>
        <Td dataLabel="Playground">
          <PlaygroundCell model={model} />
        </Td>
        {showActions ? (
          <Td isActionCell>
            {model.model_source_type === 'custom_endpoint' ? (
              <Dropdown
                isOpen={isKebabOpen}
                onOpenChange={setIsKebabOpen}
                toggle={(toggleRef) => (
                  <MenuToggle
                    ref={toggleRef}
                    variant="plain"
                    aria-label={`Actions for ${model.display_name || model.model_id}`}
                    onClick={() => setIsKebabOpen(!isKebabOpen)}
                    id={`aae-prod-actions-${model.model_id}`}
                  >
                    <EllipsisVIcon />
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem
                    isDanger
                    onClick={() => {
                      setIsKebabOpen(false)
                      setIsDeleteOpen(true)
                    }}
                  >
                    Delete endpoint
                  </DropdownItem>
                </DropdownList>
              </Dropdown>
            ) : null}
          </Td>
        ) : null}
      </Tr>

      <Modal
        variant="small"
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        id={`aae-prod-delete-modal-${model.model_id}`}
      >
        <ModalHeader title="Delete endpoint?" />
        <ModalBody>
          The {model.display_name} model endpoint will be deleted, and its associated model will no
          longer be accessible from this project.
        </ModalBody>
        <ModalFooter>
          <Button
            variant="danger"
            onClick={() => {
              onDelete()
              setIsDeleteOpen(false)
            }}
          >
            Delete
          </Button>
          <Button variant="link" onClick={() => setIsDeleteOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
