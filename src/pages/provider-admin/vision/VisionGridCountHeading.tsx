import { Badge, Divider, Flex, FlexItem, Stack, StackItem, Title } from '@patternfly/react-core'

type VisionGridCountHeadingProps = {
  id: string
  title: string
  count: number
  showDivider?: boolean
}

export const VisionGridCountHeading = ({
  id,
  title,
  count,
  showDivider = true,
}: VisionGridCountHeadingProps) => (
  <Stack>
    {showDivider ? (
      <StackItem>
        <Divider />
      </StackItem>
    ) : null}
    <StackItem className={showDivider ? 'pf-v6-u-pt-sm' : undefined}>
      <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
        <FlexItem>
          <Title headingLevel="h3" size="md" id={id}>
            {title}
          </Title>
        </FlexItem>
        <FlexItem>
          <Badge isRead>{count}</Badge>
        </FlexItem>
      </Flex>
    </StackItem>
  </Stack>
)
