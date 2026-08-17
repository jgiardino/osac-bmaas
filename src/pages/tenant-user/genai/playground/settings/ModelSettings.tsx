import { useState } from 'react';
import {
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  MenuToggle,
  NumberInput,
  Select,
  SelectList,
  SelectOption,
  Switch,
  Title,
} from '@patternfly/react-core';

import OsacForm from '../../osacStubs/OsacForm';

import { MOCK_PLAYGROUND_MODELS } from '../mocks';

interface ModelSettingsProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  temperature: number;
  onTemperatureChange: (value: number) => void;
  streamingEnabled: boolean;
  onStreamingChange: (enabled: boolean) => void;
}

const ModelSettings = ({
  selectedModel,
  onModelChange,
  temperature,
  onTemperatureChange,
  streamingEnabled,
  onStreamingChange,
}: ModelSettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = MOCK_PLAYGROUND_MODELS.find((m) => m.id === selectedModel);

  return (
    <div className="pf-v6-u-p-md">
      <Title headingLevel="h5" size="md" className="pf-v6-u-mb-md">
        {'Model'}
      </Title>
      <OsacForm isResponsive={false}>
        <FormGroup fieldId="playground-model-selector" label={'Model'}>
          <Select
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            selected={selectedModel}
            onSelect={(_e, value) => {
              if (typeof value === 'string') {
                onModelChange(value);
              }
              setIsOpen(false);
            }}
            toggle={(toggleRef) => (
              <MenuToggle
                ref={toggleRef}
                onClick={() => setIsOpen(!isOpen)}
                isExpanded={isOpen}
                id="playground-model-selector"
                style={{ width: '100%' }}
              >
                {selected?.name ?? 'Select a model'}
              </MenuToggle>
            )}
          >
            <SelectList>
              {MOCK_PLAYGROUND_MODELS.map((model) => (
                <SelectOption key={model.id} value={model.id}>
                  {model.name}
                </SelectOption>
              ))}
            </SelectList>
          </Select>
        </FormGroup>
        <FormGroup fieldId="playground-temperature" label={'Temperature: 0 - 2'}>
          <NumberInput
            value={temperature}
            onMinus={() => onTemperatureChange(Math.max(0, Number((temperature - 0.1).toFixed(1))))}
            onPlus={() => onTemperatureChange(Math.min(2, Number((temperature + 0.1).toFixed(1))))}
            onChange={(e) => {
              const next = Number((e.target as HTMLInputElement).value);
              if (!Number.isNaN(next)) {
                onTemperatureChange(Math.min(2, Math.max(0, next)));
              }
            }}
            min={0}
            max={2}
            inputName="playground-temperature"
          />
          <FormHelperText>
            <HelperText>
              <HelperTextItem>
                Controls randomness in the output. Lower values make the output more focused and
                deterministic, while higher values increase creativity and diversity.
              </HelperTextItem>
            </HelperText>
          </FormHelperText>
        </FormGroup>
        <FormGroup fieldId="playground-streaming">
          <Switch
            id="playground-streaming"
            label={'Streaming'}
            isChecked={streamingEnabled}
            onChange={(_e, checked) => onStreamingChange(checked)}
          />
        </FormGroup>
      </OsacForm>
    </div>
  );
};

export default ModelSettings;
