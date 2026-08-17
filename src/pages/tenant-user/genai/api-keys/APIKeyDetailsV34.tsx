import * as React from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ClipboardCopyButton,
  CodeBlock,
  CodeBlockAction,
  CodeBlockCode,
  Content,
  ContentVariants,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Divider,
  Flex,
  FlexItem,
  Icon,
  Label,
  PageSection,
  Stack,
  StackItem,
  Tab,
  TabTitleText,
  Tabs,
  Tooltip,
} from '@patternfly/react-core';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';

import { ResourceDetailHeader, ResourceDetailsPageError } from '../osacStubs/ResourceDetail';

import { findDynamicKey } from './apiKeysStoreV34';
import { getApiKeyByIdV34 } from './mockDataV34';
import { useDocumentTitle, useUserProfile } from './stubs';
import type { ApiKeyStatusV34 } from './typesV34';
import { useApiKeysPaths } from './useApiKeysPaths';

type CodeLanguage = 'curl' | 'python' | 'javascript';

const APIKeyDetailsV34: React.FunctionComponent = () => {
  const [searchParams] = useSearchParams();
  const keyId = searchParams.get('keyId') ?? undefined;
  const { userProfile } = useUserProfile();
  const { listPath } = useApiKeysPaths();
  const isAdmin = userProfile === 'AI Admin';

  useDocumentTitle('API Key Details');

  const apiKey = keyId ? (findDynamicKey(keyId) ?? getApiKeyByIdV34(keyId, isAdmin)) : undefined;

  const [activeLanguageTab, setActiveLanguageTab] = React.useState<CodeLanguage>('curl');
  const [copiedStates, setCopiedStates] = React.useState<Record<string, boolean>>({});

  const formatDate = (date: Date): string =>
    date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const formatLastUsed = (date?: Date): string => {
    if (!date) {
      return 'Never';
    }
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) {
      return 'Just now';
    }
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    }
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    }
    if (diffDays < 7) {
      return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    }

    return formatDate(date);
  };

  const getStatusLabel = (status: ApiKeyStatusV34) => {
    const map: Record<ApiKeyStatusV34, { color: 'green' | 'red' | 'purple'; label: string }> = {
      active: { color: 'green', label: 'Active' },
      expired: { color: 'red', label: 'Expired' },
      revoked: { color: 'purple', label: 'Revoked' },
    };
    const { color, label } = map[status];
    return (
      <Label id={`detail-status-${status}`} color={color}>
        {label}
      </Label>
    );
  };

  const handleCopyCode = (text: string, id: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedStates((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  if (!apiKey) {
    return (
      <ResourceDetailsPageError
        parentTo={listPath}
        parentLabel="API keys"
        resourceLabel="API key"
        variant="not-found"
      />
    );
  }

  const codeExamples: Record<CodeLanguage, { label: string; code: string }> = {
    curl: {
      label: 'cURL',
      code:
        'curl -X POST https://api.example.com/v1/chat/completions \\\n' +
        '  -H "Content-Type: application/json" \\\n' +
        '  -H "Authorization: Bearer $API_KEY" \\\n' +
        "  -d '{\n" +
        '    "model": "granite-3.1b",\n' +
        '    "messages": [\n' +
        '      { "role": "user", "content": "Hello, how are you?" }\n' +
        '    ],\n' +
        '    "temperature": 0.7,\n' +
        '    "max_tokens": 150\n' +
        "  }'",
    },
    python: {
      label: 'Python',
      code:
        'import requests\n\n' +
        'url = "https://api.example.com/v1/chat/completions"\n' +
        'headers = {\n' +
        '    "Content-Type": "application/json",\n' +
        '    "Authorization": "Bearer $API_KEY"\n' +
        '}\n\n' +
        'payload = {\n' +
        '    "model": "granite-3.1b",\n' +
        '    "messages": [\n' +
        '        {"role": "user", "content": "Hello, how are you?"}\n' +
        '    ],\n' +
        '    "temperature": 0.7,\n' +
        '    "max_tokens": 150\n' +
        '}\n\n' +
        'response = requests.post(url, headers=headers, json=payload)\n' +
        'print(response.json())',
    },
    javascript: {
      label: 'JavaScript',
      code:
        "const response = await fetch('https://api.example.com/v1/chat/completions', {\n" +
        "  method: 'POST',\n" +
        '  headers: {\n' +
        "    'Content-Type': 'application/json',\n" +
        "    'Authorization': 'Bearer $API_KEY'\n" +
        '  },\n' +
        '  body: JSON.stringify({\n' +
        "    model: 'granite-3.1b',\n" +
        "    messages: [{ role: 'user', content: 'Hello, how are you?' }],\n" +
        '    temperature: 0.7,\n' +
        '    max_tokens: 150\n' +
        '  })\n' +
        '});\n\n' +
        'const data = await response.json();\n' +
        'console.log(data);',
    },
  };

  const renderHighlightedCode = (code: string, highlights: string[]) => {
    const terms = highlights.filter(Boolean);
    if (terms.length === 0) {
      return code;
    }
    const escaped = terms.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const pattern = new RegExp(`(${escaped.join('|')})`, 'g');
    const parts = code.split(pattern);
    return parts.map((part, i) =>
      terms.includes(part) ? (
        <span
          key={i}
          style={{
            backgroundColor: '#fdf0d5',
            color: '#795600',
            borderRadius: '3px',
            padding: '1px 4px',
            fontWeight: 600,
          }}
        >
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <PageSection hasBodyWrapper={false}>
      <Stack hasGutter>
        <StackItem>
          <ResourceDetailHeader
            parentTo={listPath}
            parentLabel="API keys"
            resourceName={apiKey.name}
            titleAddon={getStatusLabel(apiKey.status)}
          />
        </StackItem>
        <StackItem>
          <Tabs activeKey="details" aria-label="API Key details tabs" id="api-key-tabs-v34">
            <Tab
              eventKey="details"
              title={<TabTitleText>Details</TabTitleText>}
              aria-label="Details tab"
            />
          </Tabs>
        </StackItem>
        <StackItem>
          <DescriptionList columnModifier={{ default: '2Col' }}>
            <DescriptionListGroup>
              <DescriptionListTerm>Name</DescriptionListTerm>
              <DescriptionListDescription>{apiKey.name}</DescriptionListDescription>
            </DescriptionListGroup>

            <DescriptionListGroup>
              <DescriptionListTerm>Description</DescriptionListTerm>
              <DescriptionListDescription>
                {apiKey.description || 'No description provided'}
              </DescriptionListDescription>
            </DescriptionListGroup>

            <DescriptionListGroup>
              <DescriptionListTerm>Status</DescriptionListTerm>
              <DescriptionListDescription>
                {getStatusLabel(apiKey.status)}
              </DescriptionListDescription>
            </DescriptionListGroup>

            <DescriptionListGroup>
              <DescriptionListTerm>Owner</DescriptionListTerm>
              <DescriptionListDescription>{apiKey.username}</DescriptionListDescription>
            </DescriptionListGroup>

            <DescriptionListGroup>
              <DescriptionListTerm>Created</DescriptionListTerm>
              <DescriptionListDescription>
                {formatDate(apiKey.creationDate)}
              </DescriptionListDescription>
            </DescriptionListGroup>

            <DescriptionListGroup>
              <DescriptionListTerm>Expiration</DescriptionListTerm>
              <DescriptionListDescription>
                {apiKey.expirationDate ? (
                  formatDate(apiKey.expirationDate)
                ) : (
                  <Flex
                    spaceItems={{ default: 'spaceItemsSm' }}
                    alignItems={{ default: 'alignItemsCenter' }}
                  >
                    <FlexItem>
                      <Tooltip content="This API key has no expiration date. Consider setting an expiration for security purposes.">
                        <Icon status="warning">
                          <ExclamationTriangleIcon />
                        </Icon>
                      </Tooltip>
                    </FlexItem>
                    <FlexItem>Never</FlexItem>
                  </Flex>
                )}
              </DescriptionListDescription>
            </DescriptionListGroup>

            <DescriptionListGroup>
              <DescriptionListTerm>Last used</DescriptionListTerm>
              <DescriptionListDescription>
                {formatLastUsed(apiKey.lastUsedAt)}
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </StackItem>
        <StackItem>
          <Divider />
        </StackItem>
        <StackItem>
          <Content component={ContentVariants.h2} id="usage-example-heading-v34">
            Usage example
          </Content>
          <div style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
            Use this API key to authenticate requests to the chat completions endpoint:
          </div>
          <Tabs
            id="usage-example-tabs-v34"
            activeKey={activeLanguageTab}
            onSelect={(_event, tabKey) => setActiveLanguageTab(tabKey as CodeLanguage)}
            aria-label="Code example language tabs"
          >
            {(Object.keys(codeExamples) as CodeLanguage[]).map((lang) => (
              <Tab
                key={lang}
                eventKey={lang}
                title={<TabTitleText>{codeExamples[lang].label}</TabTitleText>}
                aria-label={`${codeExamples[lang].label} example`}
              >
                <CodeBlock
                  id={`usage-code-v34-${lang}`}
                  actions={
                    <CodeBlockAction>
                      <ClipboardCopyButton
                        id={`copy-btn-v34-${lang}`}
                        textId={`code-v34-${lang}`}
                        aria-label="Copy to clipboard"
                        onClick={() => handleCopyCode(codeExamples[lang].code, lang)}
                        exitDelay={copiedStates[lang] ? 1500 : 600}
                        variant="plain"
                      >
                        {copiedStates[lang] ? 'Copied!' : 'Copy to clipboard'}
                      </ClipboardCopyButton>
                    </CodeBlockAction>
                  }
                >
                  <CodeBlockCode id={`code-v34-${lang}`}>
                    {renderHighlightedCode(codeExamples[lang].code, ['$API_KEY'])}
                  </CodeBlockCode>
                </CodeBlock>
              </Tab>
            ))}
          </Tabs>
        </StackItem>
      </Stack>
    </PageSection>
  );
};

export { APIKeyDetailsV34 };
export default APIKeyDetailsV34;
