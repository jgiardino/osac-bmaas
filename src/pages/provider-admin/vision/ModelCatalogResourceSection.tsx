import { FormSection } from '@patternfly/react-core'
import type { ReactNode } from 'react'
import type { ModelSettingId, ModelSettingMode } from '../../../vision/modelAuthoringFlow'
import { CatalogTenantAccessCards } from './CatalogTenantAccessCards'

interface ModelCatalogResourceSectionProps {
  title: string
  accessLabel: string
  settingId: ModelSettingId
  mode: ModelSettingMode
  onModeChange: (id: ModelSettingId, mode: ModelSettingMode) => void
  children: ReactNode
}

const ModelCatalogResourceSection = ({
  title,
  accessLabel,
  settingId,
  mode,
  onModeChange,
  children,
}: ModelCatalogResourceSectionProps) => (
  <FormSection title={title} titleElement="h3">
    <CatalogTenantAccessCards
      fieldId={`model-catalog-${settingId}-access`}
      label={accessLabel}
      mode={mode}
      onChange={(nextMode) => onModeChange(settingId, nextMode)}
    />
    {children}
  </FormSection>
)

export default ModelCatalogResourceSection
