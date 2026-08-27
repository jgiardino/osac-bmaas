import { Badge, Divider, Flex, FlexItem, Stack, StackItem, Title } from '@patternfly/react-core'

type VisionGridCountHeadingProps = {
  id: string
  title: string
  count: number
}

export const VisionGridCountHeading = ({ id, title, count }: VisionGridCountHeadingProps) => (
  <Stack>
    <StackItem>
      <Divider />
    </StackItem>
    <StackItem className="pf-v6-u-pt-sm">
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
