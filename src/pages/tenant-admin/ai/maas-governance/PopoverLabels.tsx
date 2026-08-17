import React from 'react';
import { Label, Popover } from '@patternfly/react-core';
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import InProgressIcon from '@patternfly/react-icons/dist/esm/icons/in-progress-icon';
import OutlinedQuestionCircleIcon from '@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon';
import PendingIcon from '@patternfly/react-icons/dist/esm/icons/pending-icon';

import type { PhaseStatus } from './mockData';

interface PhaseLabelConfig {
  status?: 'success' | 'danger' | 'warning';
  color?: 'purple' | 'grey';
  icon?: React.ReactNode;
}

const phaseConfig = (phase: PhaseStatus): PhaseLabelConfig => {
  switch (phase) {
    case 'Active':
      return { status: 'success', icon: <CheckCircleIcon /> };
    case 'Failed':
      return { status: 'danger', icon: <ExclamationCircleIcon /> };
    case 'Pending':
      return { color: 'purple', icon: <PendingIcon /> };
    case 'Deleting':
      return { color: 'grey', icon: <InProgressIcon /> };
    case 'Degraded':
      return { status: 'warning', icon: <ExclamationTriangleIcon /> };
    case 'Unhealthy':
      return { status: 'warning', icon: <ExclamationTriangleIcon /> };
    case 'Unknown':
      return { color: 'grey', icon: <OutlinedQuestionCircleIcon /> };
    default:
      return { color: 'grey', icon: <OutlinedQuestionCircleIcon /> };
  }
};

export { phaseConfig };

interface PhasePopoverLabelProps {
  phase: PhaseStatus;
  message: string;
  id?: string;
}

export const PhasePopoverLabel: React.FC<PhasePopoverLabelProps> = ({ phase, message, id }) => {
  const config = phaseConfig(phase);

  return (
    <Popover headerContent={phase} bodyContent={message} id={id ? `${id}-popover` : undefined}>
      <Label
        id={id}
        variant="filled"
        isCompact
        status={config.status}
        color={config.color}
        icon={config.icon}
        style={{ cursor: 'pointer' }}
      >
        {phase}
      </Label>
    </Popover>
  );
};

export const PhaseStaticLabel: React.FC<{ phase: PhaseStatus; id?: string }> = ({ phase, id }) => {
  const config = phaseConfig(phase);
  return (
    <Label
      id={id}
      variant="outline"
      isCompact
      status={config.status}
      color={config.color}
      icon={config.icon}
    >
      {phase}
    </Label>
  );
};

interface GroupsPopoverLabelProps {
  groups: string[];
  id?: string;
}

export const GroupsPopoverLabel: React.FC<GroupsPopoverLabelProps> = ({ groups, id }) => {
  return (
    <Popover
      headerContent={`${groups.length} Group${groups.length !== 1 ? 's' : ''}`}
      bodyContent={
        <div>
          {groups.map((g) => (
            <div key={g}>{g}</div>
          ))}
        </div>
      }
      id={id ? `${id}-popover` : undefined}
    >
      <Label id={id} style={{ cursor: 'pointer' }}>
        {groups.length} Group{groups.length !== 1 ? 's' : ''}
      </Label>
    </Popover>
  );
};

interface ModelsPopoverLabelProps {
  modelNames: string[];
  id?: string;
}

export const ModelsPopoverLabel: React.FC<ModelsPopoverLabelProps> = ({ modelNames, id }) => {
  return (
    <Popover
      headerContent={`${modelNames.length} Model${modelNames.length !== 1 ? 's' : ''}`}
      bodyContent={
        <div>
          {modelNames.map((m) => (
            <div key={m}>{m}</div>
          ))}
        </div>
      }
      id={id ? `${id}-popover` : undefined}
    >
      <Label id={id} style={{ cursor: 'pointer' }}>
        {modelNames.length} Model{modelNames.length !== 1 ? 's' : ''}
      </Label>
    </Popover>
  );
};

export const getSubscriptionPhaseMessage = (phase: PhaseStatus, modelCount: number): string => {
  switch (phase) {
    case 'Active':
      return 'All model references are valid and operational';
    case 'Failed':
      return `All ${modelCount} model references are invalid or unavailable`;
    case 'Pending':
      return 'Subscription is awaiting reconciliation by the controller';
    case 'Deleting':
      return 'Subscription is being deleted by the controller';
    case 'Degraded':
      return 'Subscription is functioning at reduced capacity';
    case 'Unhealthy':
      return 'Subscription is in a sub-optimal state and may need attention';
    case 'Unknown':
      return 'Subscription phase could not be determined';
    default:
      return '';
  }
};

export const getAuthPolicyPhaseMessage = (phase: PhaseStatus, _modelCount: number): string => {
  switch (phase) {
    case 'Active':
      return 'All model references are valid and the policy is active';
    case 'Failed':
      return 'No generated AuthPolicies attached to models';
    case 'Pending':
      return 'Policy is awaiting reconciliation by the controller';
    case 'Deleting':
      return 'Policy is being deleted by the controller';
    case 'Degraded':
      return 'Policy is functioning at reduced capacity';
    case 'Unhealthy':
      return 'Policy is in a sub-optimal state and may need attention';
    case 'Unknown':
      return 'Policy phase could not be determined';
    default:
      return '';
  }
};
