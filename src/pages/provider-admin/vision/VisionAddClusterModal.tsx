import { useState } from 'react'
import {
  Button,
  Content,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
} from '@patternfly/react-core'
import {
  VISION_SITES,
  type VisionClusterOffering,
  type VisionSiteId,
} from '../../../vision/fleetWorld'

type VisionAddClusterModalProps = {
  isOpen: boolean
  offering: VisionClusterOffering | null
  onClose: () => void
  onAdd: (siteId: VisionSiteId) => void
}

export const VisionAddClusterModal = ({
  isOpen,
  offering,
  onClose,
  onAdd,
}: VisionAddClusterModalProps) => {
  const [siteId, setSiteId] = useState<VisionSiteId>('us-east-1-dc-b')

  return (
    <Modal
      variant={ModalVariant.small}
      isOpen={isOpen}
      onClose={onClose}
      aria-labelledby="vision-add-cluster-title"
    >
      <ModalHeader title="Launch instance" labelId="vision-add-cluster-title" />
      <ModalBody>
        <Content component="p">
          Launch <strong>{offering?.name ?? 'a cluster'}</strong> at a site. Models can be placed on
          it after it is available.
        </Content>
        <Form className="vision-place-on-sites-form">
          <FormGroup label="Site" fieldId="vision-add-cluster-site" isRequired>
            <FormSelect
              id="vision-add-cluster-site"
              value={siteId}
              onChange={(_event, value) => setSiteId(value as VisionSiteId)}
              aria-label="Site for the new cluster"
            >
              {VISION_SITES.map((site) => (
                <FormSelectOption
                  key={site.id}
                  value={site.id}
                  label={`${site.label} (${site.regionLabel})`}
                />
              ))}
            </FormSelect>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button variant="primary" onClick={() => onAdd(siteId)}>
          Launch instance
        </Button>
        <Button variant="link" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  )
}
