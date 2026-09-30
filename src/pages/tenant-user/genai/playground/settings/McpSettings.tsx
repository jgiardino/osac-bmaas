import { Checkbox, Content, ContentVariants, Stack, StackItem, Title } from '@patternfly/react-core';


import { MOCK_PLAYGROUND_MCP_SERVERS } from '../mocks';

interface McpSettingsProps {
  selectedIds: string[];
  onToggle: (id: string) => void;
}

const McpSettings = ({ selectedIds, onToggle }: McpSettingsProps) => {

  return (
    <div className="pf-v6-u-p-md">
      <Title headingLevel="h5" size="md" className="pf-v6-u-mb-md">
        {'MCP'}
      </Title>
      <Content component={ContentVariants.small} className="pf-v6-u-mb-md pf-v6-u-text-color-subtle">
        {'Select MCP servers to use as tools in this chat.'}
      </Content>
      <Stack hasGutter>
        {MOCK_PLAYGROUND_MCP_SERVERS.map((server) => (
          <StackItem key={server.id}>
            <Checkbox
              id={`playground-mcp-${server.id}`}
              label={server.name}
              description={server.description}
              isChecked={selectedIds.includes(server.id)}
              onChange={() => onToggle(server.id)}
            />
          </StackItem>
        ))}
      </Stack>
    </div>
  );
};

export default McpSettings;
