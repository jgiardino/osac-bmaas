import { useMemo, useState } from 'react'
import {
  Button,
  ClipboardCopy,
  Label,
  MenuToggle,
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
import FilterIcon from '@patternfly/react-icons/dist/esm/icons/filter-icon'
import PlayIcon from '@patternfly/react-icons/dist/esm/icons/play-icon'
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table'

import { MOCK_MCP_SERVERS } from './mocks'
import type { MCPServer } from './types'

type FilterType = 'name' | 'keyword' | 'description'

type McpTabProps = {
  /** Wired to Ethan’s GenAI playground nav placeholder until Batch C. */
  onTryInPlayground?: () => void
}

const statusLabel = (status: MCPServer['status']) => {
  switch (status) {
    case 'healthy':
      return (
        <Label status="success" variant="outline">
          Healthy
        </Label>
      )
    case 'error':
      return (
        <Label status="danger" variant="outline">
          Error
        </Label>
      )
    default:
      return (
        <Label variant="outline" color="grey">
          Unknown
        </Label>
      )
  }
}

const filterTypeLabel = (key: FilterType) => {
  switch (key) {
    case 'keyword':
      return 'Keyword'
    case 'description':
      return 'Description'
    default:
      return 'Name'
  }
}

const filterPlaceholder = (key: FilterType) => {
  switch (key) {
    case 'keyword':
      return 'Filter by keyword...'
    case 'description':
      return 'Filter by description...'
    default:
      return 'Filter by name...'
  }
}

export function McpTab({ onTryInPlayground }: McpTabProps) {
  const [filterType, setFilterType] = useState<FilterType>('name')
  const [filterTypeOpen, setFilterTypeOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) {
      return MOCK_MCP_SERVERS
    }
    return MOCK_MCP_SERVERS.filter((server) => {
      if (filterType === 'description') {
        return server.description.toLowerCase().includes(q)
      }
      if (filterType === 'keyword') {
        return server.name.toLowerCase().includes(q) || server.description.toLowerCase().includes(q)
      }
      return server.name.toLowerCase().includes(q)
    })
  }, [filterType, search])

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <>
      <Toolbar id="aae-prod-mcp-toolbar">
        <ToolbarContent>
          <ToolbarGroup variant="filter-group">
            <ToolbarItem>
              <Select
                isOpen={filterTypeOpen}
                onOpenChange={setFilterTypeOpen}
                selected={filterType}
                onSelect={(_e, value) => {
                  if (value === 'name' || value === 'keyword' || value === 'description') {
                    setFilterType(value)
                    setSearch('')
                  }
                  setFilterTypeOpen(false)
                }}
                toggle={(toggleRef) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setFilterTypeOpen(!filterTypeOpen)}
                    isExpanded={filterTypeOpen}
                    icon={<FilterIcon />}
                    aria-label="Filter toggle"
                  >
                    {filterTypeLabel(filterType)}
                  </MenuToggle>
                )}
              >
                <SelectList>
                  {(['name', 'keyword', 'description'] as const).map((key) => (
                    <SelectOption key={key} value={key}>
                      {filterTypeLabel(key)}
                    </SelectOption>
                  ))}
                </SelectList>
              </Select>
            </ToolbarItem>
            <ToolbarItem>
              <SearchInput
                placeholder={filterPlaceholder(filterType)}
                value={search}
                onChange={(_e, value) => setSearch(value)}
                onClear={() => setSearch('')}
                aria-label="Filter MCP servers"
                id="aae-prod-mcp-search"
              />
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup variant="action-group">
            <ToolbarItem>
              <Button
                variant="primary"
                icon={<PlayIcon />}
                isDisabled={selected.size === 0}
                onClick={() => onTryInPlayground?.()}
                id="aae-prod-mcp-try-playground"
              >
                {selected.size > 0
                  ? `Try in Playground (${selected.size})`
                  : 'Try in Playground'}
              </Button>
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>

      <Table aria-label="MCP servers" variant="compact" id="aae-prod-mcp-table">
        <Thead>
          <Tr>
            <Th
              select={{
                onSelect: (_e, isSelecting) => {
                  setSelected((prev) => {
                    const next = new Set(prev)
                    filtered.forEach((server) => {
                      if (isSelecting) {
                        next.add(server.id)
                      } else {
                        next.delete(server.id)
                      }
                    })
                    return next
                  })
                },
                isSelected:
                  filtered.length > 0 && filtered.every((server) => selected.has(server.id)),
              }}
              aria-label="Select"
            />
            <Th>Name</Th>
            <Th>Status</Th>
            <Th>Endpoint</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filtered.map((server, rowIndex) => (
            <Tr key={server.id}>
              <Td
                select={{
                  rowIndex,
                  onSelect: () => toggle(server.id),
                  isSelected: selected.has(server.id),
                }}
              />
              <Td dataLabel="Name">
                <div>
                  <strong>
                    <Truncate content={server.name} />
                  </strong>
                </div>
                <div className="pf-v6-u-font-size-sm pf-v6-u-color-200">{server.description}</div>
              </Td>
              <Td dataLabel="Status">{statusLabel(server.status)}</Td>
              <Td dataLabel="Endpoint">
                <Popover
                  headerContent="Endpoint"
                  bodyContent={
                    <ClipboardCopy isReadOnly hoverTip="Copy" clickTip="Copied">
                      {server.url}
                    </ClipboardCopy>
                  }
                >
                  <Button variant="link" isInline id={`aae-prod-mcp-endpoint-${server.id}`}>
                    {server.endpoint}
                  </Button>
                </Popover>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  )
}
