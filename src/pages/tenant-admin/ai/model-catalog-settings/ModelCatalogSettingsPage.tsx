import { useState } from 'react';
import { Button, Label, Switch, Toolbar, ToolbarContent, ToolbarItem } from '@patternfly/react-core';
import { ActionsColumn, Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import { TenantUserPageChrome } from '../../../tenant-user/genai/TenantUserPageChrome';
import { GenaiPageStack } from '../../../tenant-user/genai/GenaiPageStack';

import { MOCK_CATALOG_SOURCE_CONFIGS } from './mocks';
import type { CatalogSourceConfigRow } from './types';

const ModelCatalogSettingsPage = () => {
  const [sources, setSources] = useState<CatalogSourceConfigRow[]>(MOCK_CATALOG_SOURCE_CONFIGS);

  const handleToggle = (sourceId: string, enabled: boolean) => {
    setSources((current) =>
      current.map((source) => (source.id === sourceId ? { ...source, enabled } : source)),
    );
  };

  return (
    <TenantUserPageChrome
      pageClassName="tenant-admin-model-catalog-settings"
      kicker="AI"
      title="Model catalog settings"
      description="Add and manage model sources that populate the model catalog for users in your organization."
    >
      <GenaiPageStack>
        <Toolbar id="model-catalog-settings-toolbar" hasNoPadding>
          <ToolbarContent>
            <ToolbarItem>
              <Button variant="primary" id="odh-add-source-button" data-testid="add-source-button">
                {'Add a source'}
              </Button>
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>

        <Table
          aria-label="Catalog sources"
          id="odh-catalog-sources-table"
        >
          <Thead>
            <Tr>
              <Th>{'Source name'}</Th>
              <Th
                info={{
                  popover:
                    'Applies only to Hugging Face sources. Shows the organization the source syncs models from (for example, meta-llama). Only models within this organization are included in the catalog.',
                }}
              >
                {'Organization'}
              </Th>
              <Th
                info={{
                  popover: (
                    <div>
                      <p>
                        {'Shows whether all models from a source appear in the model catalog or if visibility is filtered.'}
                      </p>
                    </div>
                  ),
                }}
              >
                {'Model visibility'}
              </Th>
              <Th>{'Source type'}</Th>
              <Th
                info={{
                  popover:
                    'Enable a source to make its models available to users in your organization from the model catalog.',
                }}
              >
                {'Enable'}
              </Th>
              <Th>{'Validation status'}</Th>
              <Th screenReaderText="Manage source" />
              <Th screenReaderText="Actions" />
            </Tr>
          </Thead>
          <Tbody>
            {sources.map((source) => (
              <Tr key={source.id}>
                <Td dataLabel="Source name">
                  <span>{source.name}</span>
                </Td>
                <Td dataLabel="Organization">{source.organization || '-'}</Td>
                <Td dataLabel="Model visibility">
                  {source.visibility === 'Filtered' ? (
                    <Label color="blue">{'Filtered'}</Label>
                  ) : (
                    <Label variant="outline">
                      {'All models'}
                    </Label>
                  )}
                </Td>
                <Td dataLabel="Source type">{source.type}</Td>
                <Td dataLabel="Enable">
                  <Switch
                    id={`enable-toggle-${source.id}`}
                    aria-label={`Enable ${source.name}`}
                    isChecked={source.enabled}
                    onChange={(_event, checked) => handleToggle(source.id, checked)}
                  />
                </Td>
                <Td dataLabel="Validation status">
                  {source.validationStatus === 'ready' ? (
                    <Label status="success" variant="outline">
                      {'Ready'}
                    </Label>
                  ) : (
                    '-'
                  )}
                </Td>
                <Td dataLabel="Manage source">
                  <Button
                    variant="link"
                    id={`manage-source-button-${source.id}`}
                    isDisabled
                  >
                    {'Manage source'}
                  </Button>
                </Td>
                <Td isActionCell>
                  {!source.isDefault && (
                    <ActionsColumn
                      items={[{ title: 'Delete source', isDisabled: true }]}
                    />
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </GenaiPageStack>
    </TenantUserPageChrome>
  );
};

export default ModelCatalogSettingsPage;
