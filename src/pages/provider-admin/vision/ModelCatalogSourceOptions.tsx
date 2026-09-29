import { Fragment } from 'react'
import {
  Button,
  Form,
  FormGroup,
  FormSection,
  Grid,
  GridItem,
  Label,
  Title,
} from '@patternfly/react-core'
import type { RegisteredOrganization } from '../../../providerAdmin/organizations'

export type ModelCatalogChoice = 'all' | 'specific'
export type ModelTenantAccessOption = 'catalog' | 'connection'

type ModelCatalogSourceOptionsProps = {
  tenants: readonly RegisteredOrganization[]
  tenantAccessOptions: readonly ModelTenantAccessOption[]
  onTenantAccessOptionsChange: (options: readonly ModelTenantAccessOption[]) => void
  catalogChoices: Readonly<Record<string, ModelCatalogChoice>>
  onCatalogChoiceChange: (tenantId: string, choice: ModelCatalogChoice) => void
}

const MODEL_ACCESS_OPTIONS: readonly {
  id: ModelTenantAccessOption
  label: string
  description: string
}[] = [
  {
    id: 'catalog',
    label: 'Models from the catalog',
    description: 'Tenants can select from an approved list of models',
  },
  {
    id: 'connection',
    label: 'Models from a connection',
    description: 'Tenants can specify any location where a model file is stored',
  },
]

const MODEL_CATALOG_CHOICES: readonly {
  id: ModelCatalogChoice
  label: string
  description: string
}[] = [
  {
    id: 'all',
    label: 'All models',
    description: 'Tenants can select from any model in the catalog',
  },
  {
    id: 'specific',
    label: 'Specific models',
    description: 'Tenants can only use 1 or more specific models',
  },
]

const isSelected = (items: readonly string[], item: string) => items.includes(item)
const getOptionCardClassName = (selected: boolean) =>
  `provider-setup-template__select-card provider-setup-template__select-card--instance-type${
    selected ? ' provider-setup-template__select-card--selected' : ''
  }`

export function ModelCatalogSourceOptions({
  tenants,
  tenantAccessOptions,
  onTenantAccessOptionsChange,
  catalogChoices,
  onCatalogChoiceChange,
}: ModelCatalogSourceOptionsProps) {
  const toggleTenantAccess = (option: ModelTenantAccessOption) => {
    const next = new Set(tenantAccessOptions)
    if (next.has(option)) {
      next.delete(option)
    } else {
      next.add(option)
    }
    onTenantAccessOptionsChange([...next])
  }

  return (
    <Form autoComplete="off" className="provider-setup-template__publish-source-step">
      <FormSection>
        <p>Choose the model available to deploy.</p>
        <FormGroup
          label="Tenant access to model selection"
          fieldId="model-source-tenant-access"
          role="group"
        >
          <Grid hasGutter>
            {MODEL_ACCESS_OPTIONS.map(({ id, label, description }) => {
              const selected = isSelected(tenantAccessOptions, id)
              return (
                <GridItem key={id} span={12} md={6}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={selected}
                    className={getOptionCardClassName(selected)}
                    onClick={() => toggleTenantAccess(id)}
                  >
                    {selected ? (
                      <Label
                        color="grey"
                        isCompact
                        className="provider-setup-template__select-card-selected-badge"
                      >
                        Selected
                      </Label>
                    ) : null}
                    <Title
                      headingLevel="h4"
                      size="md"
                      className="provider-setup-template__select-card-title"
                    >
                      {label}
                    </Title>
                    <p className="provider-setup-template__select-card-detail">
                      {description}
                    </p>
                  </button>
                </GridItem>
              )
            })}
          </Grid>
        </FormGroup>
      </FormSection>

      {isSelected(tenantAccessOptions, 'catalog') ? (
        <FormSection title="Model catalog" titleElement="h3">
          <p>Model catalog settings are per tenant.</p>
          {tenants.map((tenant) => {
            const selectedChoice = catalogChoices[tenant.tenantId] ?? 'all'
            const fieldId = `model-catalog-policy-${tenant.tenantId}`
            return (
              <Fragment key={tenant.tenantId}>
                <FormGroup label={tenant.name} fieldId={fieldId} role="radiogroup">
                  <Grid hasGutter>
                    {MODEL_CATALOG_CHOICES.map(({ id, label, description }) => {
                      const selected = selectedChoice === id
                      return (
                        <GridItem key={id} span={12} md={6}>
                          <button
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            className={getOptionCardClassName(selected)}
                            onClick={() => onCatalogChoiceChange(tenant.tenantId, id)}
                          >
                            {selected ? (
                              <Label
                                color="grey"
                                isCompact
                                className="provider-setup-template__select-card-selected-badge"
                              >
                                Selected
                              </Label>
                            ) : null}
                            <Title
                              headingLevel="h4"
                              size="md"
                              className="provider-setup-template__select-card-title"
                            >
                              {label}
                            </Title>
                            <p className="provider-setup-template__select-card-detail">
                              {description}
                            </p>
                          </button>
                        </GridItem>
                      )
                    })}
                  </Grid>
                </FormGroup>
                {selectedChoice === 'specific' ? (
                  <div>
                    <Button variant="secondary" id={`${fieldId}-select-models`}>
                      Select models
                    </Button>
                  </div>
                ) : null}
              </Fragment>
            )
          })}
        </FormSection>
      ) : null}
    </Form>
  )
}
