import { useState } from 'react'
import {
  Button,
  Checkbox,
  Content,
  Form,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
} from '@patternfly/react-core'
import {
  getVisionSite,
  type VisionCluster,
  type VisionModelPreset,
} from '../../../vision/fleetWorld'

type VisionPlaceModelModalProps = {
  isOpen: boolean
  preset: VisionModelPreset | null
  clusters: VisionCluster[]
  initiallySelectedClusterIds: string[]
  onClose: () => void
  onPlace: (clusterIds: string[]) => void
}

export const VisionPlaceModelModal = ({
  isOpen,
  preset,
  clusters,
  initiallySelectedClusterIds,
  onClose,
  onPlace,
}: VisionPlaceModelModalProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(initiallySelectedClusterIds)
  const placeable = clusters.filter((cluster) => cluster.health === 'available')

  const toggle = (clusterId: string, checked: boolean) => {
    setSelectedIds((current) => {
      if (checked) {
        return current.includes(clusterId) ? current : [...current, clusterId]
      }
      return current.filter((id) => id !== clusterId)
    })
  }

  return (
    <Modal
      variant={ModalVariant.medium}
      isOpen={isOpen}
      onClose={onClose}
      aria-labelledby="vision-place-model-title"
    >
      <ModalHeader title="Place on AI Grid" labelId="vision-place-model-title" />
      <ModalBody>
        <Content component="p">
          Choose clusters for <strong>{preset?.displayName ?? 'this preset'}</strong>. This is a
          published serving preset — you are not configuring accelerators from scratch.
        </Content>
        <Form className="vision-place-on-sites-form">
          <FormGroup label="Clusters" fieldId="vision-place-clusters" isRequired>
            {placeable.length === 0 ? (
              <Content component="p">No available clusters in the current filter.</Content>
            ) : (
              placeable.map((cluster) => {
                const site = getVisionSite(cluster.siteId)
                return (
                  <Checkbox
                    key={cluster.id}
                    id={`vision-place-cluster-${cluster.id}`}
                    label={`${cluster.name} (${site.regionLabel} · ${cluster.platform})`}
                    isChecked={selectedIds.includes(cluster.id)}
                    onChange={(_event, checked) => toggle(cluster.id, checked)}
                  />
                )
              })
            )}
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          variant="primary"
          isDisabled={selectedIds.length === 0}
          onClick={() => onPlace(selectedIds)}
        >
          Place on AI Grid
        </Button>
        <Button variant="link" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  )
}
