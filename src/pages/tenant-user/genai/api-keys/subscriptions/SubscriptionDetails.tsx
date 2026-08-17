import * as React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Divider,
  Dropdown,
  DropdownItem,
  DropdownList,
  Flex,
  FlexItem,
  MenuToggle,
  PageSection,
  Stack,
  StackItem,
  Tab,
  TabTitleText,
  Tabs,
  Tooltip,
} from '@patternfly/react-core';
import EllipsisVIcon from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon';
import InfoCircleIcon from '@patternfly/react-icons/dist/esm/icons/info-circle-icon';

import { ResourceDetailHeader, ResourceDetailsPageError } from '../../osacStubs/ResourceDetail';

import { useDocumentTitle } from '../stubs';
import { useApiKeysPaths } from '../useApiKeysPaths';
import { SubscriptionDetailsTab } from './components/SubscriptionDetailsTab';
import { SubscriptionYamlTab } from './components/SubscriptionYamlTab';
import { getSubscriptionById } from './mockData';
import type { Subscription } from './types';

type TabKey = 'details' | 'yaml';

const SubscriptionDetails: React.FunctionComponent = () => {
  const [searchParams] = useSearchParams();
  const subscriptionId = searchParams.get('subscriptionId') ?? undefined;
  const tab = searchParams.get('subTab') ?? undefined;
  const navigate = useNavigate();
  const { subscriptionsListPath, subscriptionDetailsPath } = useApiKeysPaths();
  const [activeTabKey, setActiveTabKey] = React.useState<TabKey>((tab as TabKey) || 'details');
  const [isActionsOpen, setIsActionsOpen] = React.useState(false);

  useDocumentTitle('Subscription Details');

  const initialSubscription = subscriptionId ? getSubscriptionById(subscriptionId) : undefined;
  const [subscription, setSubscription] = React.useState(initialSubscription);

  React.useEffect(() => {
    if (subscriptionId) {
      setSubscription(getSubscriptionById(subscriptionId));
    }
  }, [subscriptionId]);

  const handleSubscriptionChange = React.useCallback((updatedSubscription: Subscription) => {
    setSubscription(updatedSubscription);
  }, []);

  React.useEffect(() => {
    if (tab && ['details', 'yaml'].includes(tab)) {
      setActiveTabKey(tab as TabKey);
    }
  }, [tab]);

  const handleTabSelect = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number,
  ) => {
    const newTab = tabIndex as TabKey;
    setActiveTabKey(newTab);
    if (subscriptionId) {
      navigate(subscriptionDetailsPath(subscriptionId, newTab), { replace: true });
    }
  };

  if (!subscription) {
    return (
      <ResourceDetailsPageError
        parentTo={subscriptionsListPath}
        parentLabel="Subscriptions"
        resourceLabel="subscription"
        variant="not-found"
      />
    );
  }

  const actionsDropdown = (
    <Dropdown
      isOpen={isActionsOpen}
      onSelect={() => setIsActionsOpen(false)}
      onOpenChange={(isOpen: boolean) => setIsActionsOpen(isOpen)}
      toggle={(toggleRef: React.Ref<HTMLButtonElement>) => (
        <MenuToggle
          ref={toggleRef}
          aria-label="Subscription actions"
          variant="plain"
          onClick={() => setIsActionsOpen(!isActionsOpen)}
          isExpanded={isActionsOpen}
          id="subscription-actions-toggle"
        >
          <EllipsisVIcon />
        </MenuToggle>
      )}
      popperProps={{ position: 'right' }}
    >
      <DropdownList>
        <DropdownItem key="edit" id="edit-subscription-action" isDisabled>
          Edit subscription
        </DropdownItem>
        <Divider component="li" key="separator" />
        <DropdownItem key="delete" isDisabled>
          Delete subscription
        </DropdownItem>
      </DropdownList>
    </Dropdown>
  );

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Stack hasGutter>
          <StackItem>
            <Flex
              justifyContent={{ default: 'justifyContentSpaceBetween' }}
              alignItems={{ default: 'alignItemsFlexStart' }}
              flexWrap={{ default: 'wrap' }}
              spaceItems={{ default: 'spaceItemsMd' }}
            >
              <FlexItem>
                <ResourceDetailHeader
                  parentTo={subscriptionsListPath}
                  parentLabel="Subscriptions"
                  resourceName={subscription.displayName}
                  description={subscription.description}
                />
              </FlexItem>
              <FlexItem>{actionsDropdown}</FlexItem>
            </Flex>
          </StackItem>
          <StackItem>
            <Tabs
              activeKey={activeTabKey}
              onSelect={handleTabSelect}
              aria-label="Subscription details tabs"
              id="subscription-details-tabs"
            >
              <Tab
                eventKey="details"
                title={<TabTitleText>Details</TabTitleText>}
                aria-label="Details tab"
              >
                <SubscriptionDetailsTab
                  subscription={subscription}
                  onSubscriptionChange={handleSubscriptionChange}
                />
              </Tab>
              <Tab
                eventKey="yaml"
                title={
                  <Tooltip
                    content="This tab is a stretch goal and may not make it for 3.4"
                    id="yaml-tab-stretch-tooltip"
                  >
                    <TabTitleText>
                      <span style={{ color: '#F32BC4' }}>
                        YAML <InfoCircleIcon />
                      </span>
                    </TabTitleText>
                  </Tooltip>
                }
                aria-label="YAML tab"
              >
                <SubscriptionYamlTab
                  subscription={subscription}
                  onSubscriptionChange={handleSubscriptionChange}
                />
              </Tab>
            </Tabs>
          </StackItem>
        </Stack>
      </PageSection>
    </>
  );
};

export { SubscriptionDetails };
export default SubscriptionDetails;
