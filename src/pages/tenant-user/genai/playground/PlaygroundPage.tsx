import { useState } from 'react'
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerContentBody,
  Flex,
  FlexItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Title,
} from '@patternfly/react-core'

import { MOCK_PLAYGROUND_MODELS } from './mocks'
import PlaygroundChatArea from './PlaygroundChatArea'
import PlaygroundHeaderActions from './PlaygroundHeaderActions'
import PlaygroundSettingsPanel from './PlaygroundSettingsPanel'

// PatternFly Chatbot CSS overrides core styles; keep this import last among this module's imports.
import '@patternfly/chatbot/dist/css/main.css'

/**
 * Production Playground shell from odh-dashboard packages/gen-ai Chatbot (ready state).
 * Layout/actions/settings structure only — no chat send/stream simulation.
 */
export function PlaygroundPage() {
  const [isDrawerExpanded, setDrawerExpanded] = useState(true)
  const [selectedModel, setSelectedModel] = useState(MOCK_PLAYGROUND_MODELS[0].id)
  const [temperature, setTemperature] = useState(1)
  const [streamingEnabled, setStreamingEnabled] = useState(true)
  const [systemInstruction, setSystemInstruction] = useState('')
  const [ragEnabled, setRagEnabled] = useState(false)
  const [selectedMcpIds, setSelectedMcpIds] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [isNewChatOpen, setNewChatOpen] = useState(false)
  const [isDeleteOpen, setDeleteOpen] = useState(false)

  const modelName =
    MOCK_PLAYGROUND_MODELS.find((m) => m.id === selectedModel)?.name ?? selectedModel

  const toggleMcp = (id: string) => {
    setSelectedMcpIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  return (
    <div className="tenant-user-workspace-page tenant-user-genai-playground">
      <Flex
        className="tenant-user-genai-playground__header"
        gap={{ default: 'gapMd' }}
        alignItems={{ default: 'alignItemsBaseline' }}
        justifyContent={{ default: 'justifyContentSpaceBetween' }}
      >
        <FlexItem>
          <Title headingLevel="h1" size="3xl" className="tenant-user-genai-playground__title">
            Playground
          </Title>
        </FlexItem>
        <FlexItem>
          <PlaygroundHeaderActions
            isSettingsOpen={isDrawerExpanded}
            onSettingsClick={() => setDrawerExpanded((open) => !open)}
            onNewChat={() => setNewChatOpen(true)}
            onCompareChat={() => {
              /* layout-only: compare mode not simulated */
            }}
            onViewCode={() => {
              /* disabled until a message exists (matches prod) */
            }}
            onUpdatePlayground={() => {
              /* layout-only */
            }}
            onDeletePlayground={() => setDeleteOpen(true)}
          />
        </FlexItem>
      </Flex>

      <div className="tenant-user-genai-playground__body" aria-label="Playground">
        <Drawer
          isExpanded={isDrawerExpanded}
          isInline
          position="right"
          className="tenant-user-genai-playground__drawer"
        >
          <DrawerContent
            panelContent={
              <PlaygroundSettingsPanel
                onClose={() => setDrawerExpanded(false)}
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
                temperature={temperature}
                onTemperatureChange={setTemperature}
                streamingEnabled={streamingEnabled}
                onStreamingChange={setStreamingEnabled}
                systemInstruction={systemInstruction}
                onSystemInstructionChange={setSystemInstruction}
                ragEnabled={ragEnabled}
                onRagEnabledChange={setRagEnabled}
                selectedMcpIds={selectedMcpIds}
                onToggleMcp={toggleMcp}
              />
            }
          >
            <DrawerContentBody className="tenant-user-genai-playground__chat-body">
              <PlaygroundChatArea
                message={message}
                onMessageChange={setMessage}
                modelName={modelName}
              />
            </DrawerContentBody>
          </DrawerContent>
        </Drawer>
      </div>

      <Modal
        variant="small"
        isOpen={isNewChatOpen}
        onClose={() => setNewChatOpen(false)}
        aria-labelledby="playground-new-chat-title"
      >
        <ModalHeader title="Start a new chat?" labelId="playground-new-chat-title" />
        <ModalBody>
          Starting a new chat will clear the current conversation from this view.
        </ModalBody>
        <ModalFooter>
          <Button
            key="confirm"
            variant="primary"
            onClick={() => {
              setMessage('')
              setNewChatOpen(false)
            }}
          >
            New chat
          </Button>
          <Button key="cancel" variant="link" onClick={() => setNewChatOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <Modal
        variant="small"
        isOpen={isDeleteOpen}
        onClose={() => setDeleteOpen(false)}
        aria-labelledby="playground-delete-title"
      >
        <ModalHeader title="Delete playground?" labelId="playground-delete-title" />
        <ModalBody>
          Deleting a playground removes this playground configuration from the workspace.
        </ModalBody>
        <ModalFooter>
          <Button key="confirm" variant="danger" onClick={() => setDeleteOpen(false)}>
            Delete
          </Button>
          <Button key="cancel" variant="link" onClick={() => setDeleteOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default PlaygroundPage
