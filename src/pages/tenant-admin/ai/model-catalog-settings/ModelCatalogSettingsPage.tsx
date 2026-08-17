import { useMemo, useState } from 'react';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  Label,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  Switch,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import PlusCircleIcon from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import { ActionsColumn, Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import { TenantUserPageChrome } from '../../../tenant-user/genai/TenantUserPageChrome';
import { GenaiPageStack } from '../../../tenant-user/genai/GenaiPageStack';

import CatalogSourceStatusLabel from './CatalogSourceStatusLabel';
import { MOCK_CATALOG_SOURCE_CONFIGS } from './mocks';
import type { CatalogSourceConfigRow, CatalogSourceType } from './types';

const sourceTypeLabel = (type: CatalogSourceType) =>
  type === 'hf' ? 'Hugging Face' : 'YAML file';

const hasSourceFilters = (source: CatalogSourceConfigRow) =>
  Boolean(
    (source.includedModels && source.includedModels.length > 0) ||
      (source.excludedModels && source.excludedModels.length > 0),
  );

const organizationDisplay = (source: CatalogSourceConfigRow) => {
  if (source.isDefault || source.type !== 'hf') {
    return '—';
  }
  return source.allowedOrganization || '—';
};

const ModelCatalogSettingsPage = () => {
  const [sources, setSources] = useState<CatalogSourceConfigRow[]>(MOCK_CATALOG_SOURCE_CONFIGS);
  const [deleteTarget, setDeleteTarget] = useState<CatalogSourceConfigRow | null>(null);

  const isEmpty = sources.length === 0;

  const handleToggle = (sourceId: string, enabled: boolean) => {
    setSources((prev) => prev.map((s) => (s.id === sourceId ? { ...s, enabled } : s)));
  };

  const handleDelete = () => {
    if (!deleteTarget) {
      return;
    }
    setSources((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const emptyState = useMemo(
    () => (
      <EmptyState
        headingLevel="h2"
        icon={PlusCircleIcon}
        titleText={'No catalog sources'}
        id="model-catalog-settings-empty"
      >
        <EmptyStateBody>
          {'No catalog sources have been configured. Add a source to get started.'}
        </EmptyStateBody>
        <Button
          variant="primary"
          onClick={() => {
            /* Add source flow deferred */
          }}
          id="model-catalog-settings-add-empty"
        >
          {'Add a source'}
        </Button>
      </EmptyState>
    ),
    [],
  );

  return (
    <TenantUserPageChrome
      pageClassName="tenant-admin-model-catalog-settings"
      kicker="AI"
      title={'Model catalog settings'}
      description={'Add and manage model sources that populate the model catalog for users in your organization.'}
    >
      {isEmpty ? (
        emptyState
      ) : (
        <GenaiPageStack>
          <Toolbar id="model-catalog-settings-toolbar" hasNoPadding>
            <ToolbarContent>
              <ToolbarItem>
                <Button
                  variant="primary"
                  onClick={() => {
                    /* Add source flow deferred */
                  }}
                  id="model-catalog-settings-add"
                >
                  {'Add a source'}
                </Button>
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>

          <Table
            aria-label={'Model catalog sources'}
            variant="compact"
            id="model-catalog-settings-table"
          >
            <Thead>
              <Tr>
                <Th>{'Source name'}</Th>
                <Th
                  info={{
                    popover: 'Applies only to Hugging Face sources. Shows the organization the source syncs models from (for example, meta-llama). Only models within this organization are included in the catalog.',
                    ariaLabel: 'More information for Organization',
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
                        <List>
                          <ListItem>
                            <strong>{'All models:'}</strong>{' '}
                            {'Every model from the source appears in the catalog.'}
                          </ListItem>
                          <ListItem>
                            <strong>{'Filtered:'}</strong>{' '}
                            {'Only specific models appear, based on the visibility settings for that source.'}
                          </ListItem>
                        </List>
                      </div>
                    ),
                    ariaLabel: 'More information for Model visibility',
                  }}
                >
                  {'Model visibility'}
                </Th>
                <Th>{'Source type'}</Th>
                <Th
                  info={{
                    popover: 'Enable a source to make its models available to users in your organization from the model catalog.',
                    ariaLabel: 'More information for Enable',
                  }}
                >
                  {'Enable'}
                </Th>
                <Th>{'Validation status'}</Th>
                <Th />
                <Th screenReaderText={'Actions'} />
              </Tr>
            </Thead>
            <Tbody>
              {sources.map((source) => (
                <Tr key={source.id}>
                  <Td dataLabel={'Source name'}>{source.name}</Td>
                  <Td dataLabel={'Organization'}>{organizationDisplay(source)}</Td>
                  <Td dataLabel={'Model visibility'}>
                    {hasSourceFilters(source) ? (
                      <Label color="purple">{'Filtered'}</Label>
                    ) : (
                      <Label color="grey" variant="outline">
                        {'All models'}
                      </Label>
                    )}
                  </Td>
                  <Td dataLabel={'Source type'}>{sourceTypeLabel(source.type)}</Td>
                  <Td dataLabel={'Enable'}>
                    <Switch
                      id={`catalog-source-enable-${source.id}`}
                      aria-label={`Enable ${source.name}`}
                      isChecked={source.enabled}
                      onChange={(_e, checked) => handleToggle(source.id, checked)}
                    />
                  </Td>
                  <Td dataLabel={'Validation status'}>
                    <CatalogSourceStatusLabel source={source} />
                  </Td>
                  <Td dataLabel={'Manage source'}>
                    <Button
                      variant="link"
                      isInline
                      onClick={() => {
                        /* Manage source deferred */
                      }}
                      id={`catalog-source-manage-${source.id}`}
                    >
                      {'Manage source'}
                    </Button>
                  </Td>
                  <Td isActionCell>
                    {!source.isDefault && (
                      <ActionsColumn
                        items={[
                          {
                            title: 'Delete source',
                            onClick: () => setDeleteTarget(source),
                          },
                        ]}
                      />
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </GenaiPageStack>
      )}

      <Modal
        variant={ModalVariant.small}
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        id="catalog-source-delete-modal"
      >
        <ModalHeader title={'Delete a source'} />
        <ModalBody>
          {`The ${deleteTarget?.name ?? ''} repository will be deleted, and its models will be removed from the model catalog.`}
        </ModalBody>
        <ModalFooter>
          <Button variant="danger" onClick={handleDelete} id="catalog-source-delete-confirm">
            {'Delete'}
          </Button>
          <Button variant="link" onClick={() => setDeleteTarget(null)}>
            {'Cancel'}
          </Button>
        </ModalFooter>
      </Modal>
    </TenantUserPageChrome>
  );
};

export default ModelCatalogSettingsPage;
