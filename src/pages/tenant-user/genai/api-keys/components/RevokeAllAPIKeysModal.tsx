import * as React from 'react';
import {
  Button,
  Content,
  ContentVariants,
  // eslint-disable-next-line no-restricted-imports -- V34 prototype modal; OsacForm grid wrapper breaks modal layout
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  InputGroup,
  InputGroupItem,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  TextInput,
} from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import type { ApiKeyV34 } from '../typesV34';

export type RevokePreviewMode = 'capped' | 'scrollable';
export type RevokeAllTargetKind = 'user' | 'subscription';

const PREVIEW_CAP = 10;

interface RevokeAllAPIKeysModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (target: string, kind: RevokeAllTargetKind) => void;
  allKeys: ApiKeyV34[];
  isAdmin: boolean;
  currentUsername: string;
  previewMode?: RevokePreviewMode;
  /** Admin-only: revoke by user (default) or by subscription. */
  targetKind?: RevokeAllTargetKind;
}

const RevokeAllAPIKeysModal: React.FunctionComponent<RevokeAllAPIKeysModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  allKeys,
  isAdmin,
  currentUsername,
  previewMode = 'capped',
  targetKind = 'user',
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [searchedTarget, setSearchedTarget] = React.useState('');
  const [showAll, setShowAll] = React.useState(false);

  const isSubscriptionScope = isAdmin && targetKind === 'subscription';
  const targetLabel = isSubscriptionScope ? searchedTarget : isAdmin ? searchedTarget : currentUsername;

  const matchingKeys = React.useMemo(() => {
    if (!isAdmin) {
      return allKeys.filter((k) => k.username.toLowerCase() === currentUsername.toLowerCase());
    }
    if (!searchedTarget) {
      return [];
    }
    const needle = searchedTarget.toLowerCase();
    if (isSubscriptionScope) {
      return allKeys.filter(
        (k) =>
          (k.subscriptionName ?? '').toLowerCase() === needle ||
          (k.subscriptionId ?? '').toLowerCase() === needle,
      );
    }
    return allKeys.filter((k) => k.username.toLowerCase() === needle);
  }, [allKeys, currentUsername, isAdmin, isSubscriptionScope, searchedTarget]);

  const handleSearchKeys = () => {
    setSearchedTarget(query.trim());
    setShowAll(false);
  };

  const activeKeys = React.useMemo(() => {
    return [...matchingKeys]
      .filter((k) => k.status === 'active')
      .sort((a, b) => {
        const aTime = a.lastUsedAt?.getTime() ?? 0;
        const bTime = b.lastUsedAt?.getTime() ?? 0;
        return bTime - aTime;
      });
  }, [matchingKeys]);

  const isCapped = previewMode === 'capped' && !showAll;
  const displayedKeys = isCapped ? activeKeys.slice(0, PREVIEW_CAP) : activeKeys;

  const remainingCount = activeKeys.length - (isCapped ? PREVIEW_CAP : activeKeys.length);

  const isConfirmEnabled = isAdmin
    ? searchedTarget.length > 0 && activeKeys.length > 0
    : query.trim().toLowerCase() === currentUsername.toLowerCase();

  const handleConfirm = async () => {
    if (!isConfirmEnabled) {
      return;
    }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onConfirm(isAdmin ? searchedTarget : currentUsername, isSubscriptionScope ? 'subscription' : 'user');
    setIsSubmitting(false);
    setQuery('');
    onClose();
  };

  const handleClose = () => {
    setQuery('');
    setSearchedTarget('');
    setShowAll(false);
    onClose();
  };

  React.useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSearchedTarget('');
      setShowAll(false);
    }
  }, [isOpen, targetKind]);

  const formatDate = (date?: Date): string => {
    if (!date) {
      return '—';
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusLabel = (status: string) => {
    const colorMap: Record<string, 'green' | 'red' | 'purple'> = {
      active: 'green',
      expired: 'red',
      revoked: 'purple',
    };
    return (
      <Label color={colorMap[status] || 'grey'} isCompact id={`revoke-modal-status-${status}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Label>
    );
  };

  const keysTable = (
    <Table
      aria-label={`API keys for ${targetLabel}`}
      variant="compact"
      id="revoke-modal-keys-table"
    >
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Status</Th>
          <Th>Last used</Th>
          <Th>Expiration</Th>
        </Tr>
      </Thead>
      <Tbody>
        {displayedKeys.map((key) => (
          <Tr key={key.id}>
            <Td dataLabel="Name">{key.name}</Td>
            <Td dataLabel="Status">{getStatusLabel(key.status)}</Td>
            <Td dataLabel="Last used">{formatDate(key.lastUsedAt)}</Td>
            <Td dataLabel="Expiration">
              {key.expirationDate ? formatDate(key.expirationDate) : 'Never'}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );

  const title = !isAdmin
    ? 'Revoke all your active keys?'
    : isSubscriptionScope
      ? 'Revoke all active keys for a single subscription?'
      : 'Revoke all active keys for a single user?';

  const intro = !isAdmin
    ? 'All of your active API keys will be permanently invalidated. Applications or services using these keys will immediately lose access.'
    : isSubscriptionScope
      ? 'Enter a subscription name to view its API keys. All active keys for this subscription will be permanently invalidated. This action cannot be undone.'
      : 'Enter a username to view their API keys. All active keys for this user will be permanently invalidated. This action cannot be undone.';

  const fieldLabel = !isAdmin
    ? `Type "${currentUsername}" to confirm`
    : isSubscriptionScope
      ? 'Enter subscription to revoke its keys'
      : 'Enter username to revoke their keys';

  const helperText = !isAdmin
    ? query.trim().toLowerCase() === currentUsername.toLowerCase()
      ? 'All your active keys will be permanently revoked'
      : 'Type your username exactly to confirm'
    : searchedTarget
      ? activeKeys.length > 0
        ? `${activeKeys.length} active key(s) found for ${searchedTarget}`
        : `No active keys found for "${searchedTarget}"`
      : isSubscriptionScope
        ? 'Enter a subscription name and click search to view its keys'
        : 'Enter a username and click search to view their keys';

  return (
    <Modal
      variant={ModalVariant.medium}
      isOpen={isOpen}
      onClose={handleClose}
      id="revoke-all-api-keys-modal"
      aria-labelledby="revoke-all-api-keys-modal-title"
    >
      <ModalHeader
        title={title}
        titleIconVariant="warning"
        labelId="revoke-all-api-keys-modal-title"
      />
      <ModalBody>
        <Content component={ContentVariants.p}>{intro}</Content>

        <Content
          component={ContentVariants.p}
          className="tenant-user-genai-api-keys__revoke-modal-note"
        >
          Revoked keys will remain visible with a Revoked status but can no longer be used for
          authentication.
        </Content>

        <Form id="revoke-all-form">
          <FormGroup label={fieldLabel} isRequired fieldId="revoke-all-target">
            {isAdmin ? (
              <InputGroup>
                <InputGroupItem isFill>
                  <TextInput
                    isRequired
                    type="text"
                    id="revoke-all-target"
                    value={query}
                    onChange={(_event, value) => setQuery(value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearchKeys();
                      }
                    }}
                    placeholder={isSubscriptionScope ? 'Enter subscription name' : 'Enter username'}
                  />
                </InputGroupItem>
                <InputGroupItem>
                  <Button
                    variant="control"
                    aria-label="Search keys"
                    onClick={handleSearchKeys}
                    isDisabled={!query.trim()}
                    id="revoke-modal-search-button"
                  >
                    <SearchIcon />
                  </Button>
                </InputGroupItem>
              </InputGroup>
            ) : (
              <TextInput
                isRequired
                type="text"
                id="revoke-all-target"
                value={query}
                onChange={(_event, value) => setQuery(value)}
                placeholder={currentUsername}
              />
            )}
            <FormHelperText>
              <HelperText>
                <HelperTextItem>{helperText}</HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>
        </Form>

        {isAdmin && activeKeys.length > 0 && (
          <div className="tenant-user-genai-api-keys__revoke-modal-preview">
            <Content component={ContentVariants.h4} id="revoke-modal-keys-heading">
              {isCapped
                ? `Most recently used active keys for ${searchedTarget}`
                : `All active keys for ${searchedTarget}`}
            </Content>

            {showAll || previewMode === 'scrollable' ? (
              <div className="tenant-user-genai-api-keys__revoke-modal-scroll">{keysTable}</div>
            ) : (
              keysTable
            )}

            {previewMode === 'capped' && remainingCount > 0 && !showAll && (
              <Button
                variant="link"
                isInline
                onClick={() => setShowAll(true)}
                id="revoke-modal-show-all-button"
                className="tenant-user-genai-api-keys__revoke-modal-show-all"
              >
                Show all {activeKeys.length} active keys
              </Button>
            )}
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          variant="danger"
          onClick={handleConfirm}
          isLoading={isSubmitting}
          isDisabled={isSubmitting || !isConfirmEnabled}
          id="revoke-all-confirm-button"
        >
          Permanently revoke all keys
        </Button>
        <Button variant="link" onClick={handleClose} id="revoke-all-cancel-button">
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export { RevokeAllAPIKeysModal };
