import { Content, ContentVariants, Switch, Title } from '@patternfly/react-core';


interface KnowledgeSettingsProps {
  ragEnabled: boolean;
  onRagEnabledChange: (enabled: boolean) => void;
}

const KnowledgeSettings = ({ ragEnabled, onRagEnabledChange }: KnowledgeSettingsProps) => {

  return (
    <div className="pf-v6-u-p-md">
      <Title headingLevel="h5" size="md" className="pf-v6-u-mb-md">
        {'Knowledge'}
      </Title>
      <Switch
        id="playground-rag-enabled"
        label={'Use knowledge'}
        isChecked={ragEnabled}
        onChange={(_e, checked) => onRagEnabledChange(checked)}
      />
      <Content component={ContentVariants.small} className="pf-v6-u-mt-md pf-v6-u-color-200">
        {'Add knowledge sources to ground responses with your documents.'}
      </Content>
    </div>
  );
};

export default KnowledgeSettings;
