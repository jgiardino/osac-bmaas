import { useState } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  Label,
  Stack,
  StackItem,
  Truncate,
} from '@patternfly/react-core';
import InProgressIcon from '@patternfly/react-icons/dist/esm/icons/in-progress-icon';


import type { CatalogSourceConfigRow } from './types';

interface CatalogSourceStatusLabelProps {
  source: CatalogSourceConfigRow;
}

const CatalogSourceStatusLabel = ({ source }: CatalogSourceStatusLabelProps) => {
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  if (source.isDefault || !source.enabled || source.validationStatus === 'none') {
    return <>—</>;
  }

  if (source.validationStatus === 'ready') {
    return (
      <Label status="success" variant="outline" id={`catalog-source-status-${source.id}`}>
        {'Ready'}
      </Label>
    );
  }

  if (source.validationStatus === 'starting') {
    return (
      <Label
        color="grey"
        variant="outline"
        icon={<InProgressIcon />}
        id={`catalog-source-status-${source.id}`}
      >
        {'Starting'}
      </Label>
    );
  }

  if (source.validationStatus === 'failed') {
    const errorMessage = source.validationError ?? 'Unknown error occurred';
    return (
      <>
        <Stack hasGutter>
          <StackItem>
            <Label status="danger" variant="outline" id={`catalog-source-status-${source.id}`}>
              {'Failed'}
            </Label>
          </StackItem>
          <StackItem>
            <Button
              variant="link"
              isInline
              isDanger
              onClick={() => setIsErrorOpen(true)}
              id={`catalog-source-status-error-${source.id}`}
            >
              <Truncate content={errorMessage} tooltipProps={{ hidden: true }} />
            </Button>
          </StackItem>
        </Stack>
        <Modal
          variant={ModalVariant.small}
          isOpen={isErrorOpen}
          onClose={() => setIsErrorOpen(false)}
          id={`catalog-source-error-modal-${source.id}`}
        >
          <ModalHeader title={'Validation error'} />
          <ModalBody>{errorMessage}</ModalBody>
          <ModalFooter>
            <Button variant="primary" onClick={() => setIsErrorOpen(false)}>
              {'Close'}
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }

  return (
    <Label
      color="grey"
      variant="outline"
      icon={<InProgressIcon />}
      id={`catalog-source-status-${source.id}`}
    >
      {'Unknown'}
    </Label>
  );
};

export default CatalogSourceStatusLabel;
