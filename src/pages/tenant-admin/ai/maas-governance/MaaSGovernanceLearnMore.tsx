import { Button, Popover } from '@patternfly/react-core'

const MaaSGovernanceLearnMore = () => (
  <Popover
    headerContent="About MaaS governance"
    bodyContent={
      <div>
        <p>
          Subscriptions define which models user groups can access and the token rate limits for each
          group.
        </p>
        <p>
          Authorization policies control the access permissions for API calls, determining which
          user groups can invoke specific models.
        </p>
      </div>
    }
    id="maas-governance-learn-more-popover"
  >
    <Button variant="link" isInline aria-label="Learn more about MaaS governance">
      Learn more
    </Button>
  </Popover>
)

export default MaaSGovernanceLearnMore
