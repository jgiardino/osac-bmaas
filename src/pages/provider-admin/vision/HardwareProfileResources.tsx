import { useState } from 'react'
import {
  Button,
  ExpandableSection,
  FormGroup,
  FormGroupLabelHelp,
  FormSelect,
  FormSelectOption,
  Grid,
  GridItem,
  NumberInput,
  Popover,
} from '@patternfly/react-core'

type ResourceKey = 'cpuRequests' | 'cpuLimits' | 'memoryRequests' | 'memoryLimits'
type ResourceUnit = 'Cores' | 'Millicores' | 'GiB' | 'MiB'

interface ResourceField {
  id: ResourceKey
  label: string
  unit: 'Cores' | 'GiB'
  unitOptions: readonly ResourceUnit[]
  min: number
  max: number
  help: string
}

const RESOURCE_FIELDS: ResourceField[] = [
  {
    id: 'cpuRequests',
    label: 'CPU requests',
    unit: 'Cores',
    unitOptions: ['Cores', 'Millicores'],
    min: 1,
    max: 4,
    help: 'CPU requests reserve compute resources for the model deployment.',
  },
  {
    id: 'cpuLimits',
    label: 'CPU limits',
    unit: 'Cores',
    unitOptions: ['Cores', 'Millicores'],
    min: 1,
    max: 4,
    help: 'CPU limits set the maximum compute resources the model deployment can use.',
  },
  {
    id: 'memoryRequests',
    label: 'Memory requests',
    unit: 'GiB',
    unitOptions: ['GiB', 'MiB'],
    min: 2,
    max: 8,
    help: 'Memory requests reserve memory for the model deployment.',
  },
  {
    id: 'memoryLimits',
    label: 'Memory limits',
    unit: 'GiB',
    unitOptions: ['GiB', 'MiB'],
    min: 2,
    max: 8,
    help: 'Memory limits set the maximum memory the model deployment can use.',
  },
]

const getUnitScale = (unit: ResourceUnit) =>
  unit === 'Millicores' ? 1000 : unit === 'MiB' ? 1024 : 1

const HardwareProfileResources = () => {
  const [isCustomizeExpanded, setIsCustomizeExpanded] = useState(false)
  const [resources, setResources] = useState<Record<ResourceKey, number>>({
    cpuRequests: 2,
    cpuLimits: 2,
    memoryRequests: 4,
    memoryLimits: 4,
  })
  const [units, setUnits] = useState<Record<ResourceKey, ResourceUnit>>({
    cpuRequests: 'Cores',
    cpuLimits: 'Cores',
    memoryRequests: 'GiB',
    memoryLimits: 'GiB',
  })

  const updateResource = (id: ResourceKey, value: number, field: ResourceField) => {
    if (Number.isFinite(value) && value >= field.min && value <= field.max) {
      setResources((current) => ({ ...current, [id]: value }))
    }
  }

  return (
    <>
      <FormGroup
        label="Hardware profile"
        fieldId="model-catalog-hardware-profile"
        isRequired
        labelHelp={
          <Popover
            headerContent="Hardware profile"
            bodyContent="Hardware profiles set the default CPU, memory, and accelerator resources for a model deployment."
          >
            <FormGroupLabelHelp aria-label="More info about hardware profile" />
          </Popover>
        }
      >
        <div className="vision-model-flow-preview__hardware-profile-row">
          <FormSelect id="model-catalog-hardware-profile" value="default-profile" isDisabled>
            <FormSelectOption value="default-profile" label="default-profile" />
          </FormSelect>
          <Popover
            headerContent="default-profile"
            bodyContent="This profile provides 2 CPUs and 4 GiB of memory. Resource requests and limits can be customized up to 4 CPUs and 8 GiB of memory."
          >
            <Button variant="link" isInline>
              View details
            </Button>
          </Popover>
        </div>
        <p className="vision-model-flow-preview__hardware-profile-summary">
          This profile offers 2 CPUs and 4 GiB of memory. You can customize these resources up to 4
          CPUs and 8 GiB of memory.
          <br />
          CPU: Default = 2 Cores, Max = 4 Cores; Memory: Default = 4 GiB, Max = 8 GiB
        </p>
      </FormGroup>

      <ExpandableSection
        toggleText="Customize resource requests and limits"
        isExpanded={isCustomizeExpanded}
        onToggle={(_event, isExpanded) => setIsCustomizeExpanded(isExpanded)}
      >
        <Grid hasGutter className="vision-model-flow-preview__resource-grid">
          {RESOURCE_FIELDS.map((field) => {
            const scale = getUnitScale(units[field.id])
            const displayedValue = Math.round(resources[field.id] * scale)
            return (
              <GridItem key={field.id} span={12} md={6}>
                <FormGroup
                  label={field.label}
                  fieldId={`model-catalog-${field.id}`}
                  labelHelp={
                    <Popover headerContent={field.label} bodyContent={field.help}>
                      <FormGroupLabelHelp aria-label={`More info about ${field.label}`} />
                    </Popover>
                  }
                >
                  <div className="vision-model-flow-preview__resource-control">
                    <NumberInput
                      id={`model-catalog-${field.id}`}
                      inputName={field.id}
                      inputAriaLabel={field.label}
                      minusBtnAriaLabel={`Decrease ${field.label.toLowerCase()}`}
                      plusBtnAriaLabel={`Increase ${field.label.toLowerCase()}`}
                      min={field.min * scale}
                      max={field.max * scale}
                      value={displayedValue}
                      onMinus={() =>
                        updateResource(field.id, (displayedValue - 1) / scale, field)
                      }
                      onPlus={() =>
                        updateResource(field.id, (displayedValue + 1) / scale, field)
                      }
                      onChange={(event) =>
                        updateResource(
                          field.id,
                          Number((event.target as HTMLInputElement).value) / scale,
                          field,
                        )
                      }
                    />
                    <FormSelect
                      aria-label={`${field.label} unit`}
                      value={units[field.id]}
                      onChange={(_event, value) =>
                        setUnits((current) => ({ ...current, [field.id]: value as ResourceUnit }))
                      }
                    >
                      {field.unitOptions.map((unit) => (
                        <FormSelectOption key={unit} value={unit} label={unit} />
                      ))}
                    </FormSelect>
                  </div>
                  <p className="vision-model-flow-preview__resource-range">
                    Min = {field.min * scale} {units[field.id]}, Max = {field.max * scale}{' '}
                    {units[field.id]}
                  </p>
                </FormGroup>
              </GridItem>
            )
          })}
        </Grid>
        <Popover
          headerContent="Resource requests and limits"
          bodyContent="Requests reserve CPU and memory for a workload. Limits cap the resources it can use."
        >
          <Button variant="link" isInline className="vision-model-flow-preview__resource-learn-more">
            Learn more about requests and limits
          </Button>
        </Popover>
      </ExpandableSection>
    </>
  )
}

export default HardwareProfileResources
