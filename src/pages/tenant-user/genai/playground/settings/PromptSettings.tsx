import { FormGroup, TextArea, Title } from '@patternfly/react-core';

import OsacForm from '../../osacStubs/OsacForm';

interface PromptSettingsProps {
  systemInstruction: string;
  onSystemInstructionChange: (value: string) => void;
}

const PromptSettings = ({ systemInstruction, onSystemInstructionChange }: PromptSettingsProps) => {

  return (
    <div className="pf-v6-u-p-md">
      <Title headingLevel="h5" size="md" className="pf-v6-u-mb-md">
        {'Prompt'}
      </Title>
      <OsacForm isResponsive={false}>
        <FormGroup fieldId="playground-system-instruction" label={'System instructions'}>
          <TextArea
            id="playground-system-instruction"
            value={systemInstruction}
            onChange={(_e, value) => onSystemInstructionChange(value)}
            resizeOrientation="vertical"
            rows={8}
            aria-label={'System instructions'}
          />
        </FormGroup>
      </OsacForm>
    </div>
  );
};

export default PromptSettings;
