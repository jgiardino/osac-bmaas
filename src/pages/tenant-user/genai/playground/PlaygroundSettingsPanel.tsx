import { useRef, useState } from 'react';
import {
  Badge,
  DrawerActions,
  DrawerCloseButton,
  DrawerHead,
  DrawerPanelBody,
  DrawerPanelContent,
  Flex,
  FlexItem,
  Tab,
  TabContent,
  TabTitleText,
  Tabs,
  Title,
} from '@patternfly/react-core';


import KnowledgeSettings from './settings/KnowledgeSettings';
import McpSettings from './settings/McpSettings';
import ModelSettings from './settings/ModelSettings';
import PromptSettings from './settings/PromptSettings';

interface PlaygroundSettingsPanelProps {
  onClose: () => void;
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  temperature: number;
  onTemperatureChange: (value: number) => void;
  streamingEnabled: boolean;
  onStreamingChange: (enabled: boolean) => void;
  systemInstruction: string;
  onSystemInstructionChange: (value: string) => void;
  ragEnabled: boolean;
  onRagEnabledChange: (enabled: boolean) => void;
  selectedMcpIds: string[];
  onToggleMcp: (id: string) => void;
}

/**
 * Mirrors odh-dashboard ChatbotSettingsPanel (ready-state, single chat).
 * Guardrails tab omitted until feature-flag decision.
 */
const PlaygroundSettingsPanel = ({
  onClose,
  selectedModel,
  onModelChange,
  temperature,
  onTemperatureChange,
  streamingEnabled,
  onStreamingChange,
  systemInstruction,
  onSystemInstructionChange,
  ragEnabled,
  onRagEnabledChange,
  selectedMcpIds,
  onToggleMcp,
}: PlaygroundSettingsPanelProps) => {
  const [activeTabKey, setActiveTabKey] = useState<string | number>(0);
  const modelTabRef = useRef<HTMLElement>(null);
  const promptTabRef = useRef<HTMLElement>(null);
  const knowledgeTabRef = useRef<HTMLElement>(null);
  const mcpTabRef = useRef<HTMLElement>(null);

  return (
    <DrawerPanelContent isResizable defaultSize="400px" minSize="300px">
      <DrawerHead>
        <Title headingLevel="h4" size="md">
          {'Settings'}
        </Title>
        <DrawerActions>
          <DrawerCloseButton onClick={onClose} aria-label={'Close settings panel'} />
        </DrawerActions>
      </DrawerHead>
      <DrawerPanelBody hasNoPadding>
        <Tabs
          activeKey={activeTabKey}
          onSelect={(_e, key) => setActiveTabKey(key)}
          aria-label={'Chatbot settings page tabs'}
        >
          <Tab
            eventKey={0}
            title={<TabTitleText>{'Model'}</TabTitleText>}
            tabContentRef={modelTabRef}
          />
          <Tab
            eventKey={1}
            title={<TabTitleText>{'Prompt'}</TabTitleText>}
            tabContentRef={promptTabRef}
          />
          <Tab
            eventKey={2}
            title={
              <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                <FlexItem>
                  <TabTitleText>{'Knowledge'}</TabTitleText>
                </FlexItem>
                <FlexItem>
                  <Badge isRead={!ragEnabled}>{ragEnabled ? 'On' : 'Off'}</Badge>
                </FlexItem>
              </Flex>
            }
            tabContentRef={knowledgeTabRef}
          />
          <Tab
            eventKey={3}
            title={
              <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                <FlexItem>
                  <TabTitleText>{'MCP'}</TabTitleText>
                </FlexItem>
                {selectedMcpIds.length > 0 && (
                  <FlexItem>
                    <Badge>{selectedMcpIds.length}</Badge>
                  </FlexItem>
                )}
              </Flex>
            }
            tabContentRef={mcpTabRef}
          />
        </Tabs>
        <TabContent eventKey={0} id="playground-settings-model" ref={modelTabRef} hidden={activeTabKey !== 0}>
          <ModelSettings
            selectedModel={selectedModel}
            onModelChange={onModelChange}
            temperature={temperature}
            onTemperatureChange={onTemperatureChange}
            streamingEnabled={streamingEnabled}
            onStreamingChange={onStreamingChange}
          />
        </TabContent>
        <TabContent
          eventKey={1}
          id="playground-settings-prompt"
          ref={promptTabRef}
          hidden={activeTabKey !== 1}
        >
          <PromptSettings
            systemInstruction={systemInstruction}
            onSystemInstructionChange={onSystemInstructionChange}
          />
        </TabContent>
        <TabContent
          eventKey={2}
          id="playground-settings-knowledge"
          ref={knowledgeTabRef}
          hidden={activeTabKey !== 2}
        >
          <KnowledgeSettings ragEnabled={ragEnabled} onRagEnabledChange={onRagEnabledChange} />
        </TabContent>
        <TabContent eventKey={3} id="playground-settings-mcp" ref={mcpTabRef} hidden={activeTabKey !== 3}>
          <McpSettings selectedIds={selectedMcpIds} onToggle={onToggleMcp} />
        </TabContent>
      </DrawerPanelBody>
    </DrawerPanelContent>
  );
};

export default PlaygroundSettingsPanel;
