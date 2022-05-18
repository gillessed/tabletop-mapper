import { Colors, Icon, Tooltip } from '@blueprintjs/core';
import { IconName, IconNames } from '@blueprintjs/icons';
import * as React from 'react';
import { useDispatchers } from '../../DispatcherContextProvider';
import './Dialog.scss';

export interface DialogProps {
  isOpen: boolean;
  icon: IconName;
  title: string;
  content: React.ReactNode;
  closeIcon: IconName;
  onClose?: () => void;
}

export const Dialog = React.memo(function ProjectDialog({
  isOpen,
  icon,
  title,
  content,
  closeIcon,
  onClose,
}: DialogProps) {
  if (!isOpen) {
    return null;
  }
  return (
    <div className='dialog-container'>
      <div className='dialog'>
        <div className='dialog-header'>
          <Icon
            className='header-icon'
            color={Colors.LIGHT_GRAY1}
            icon={icon}
            iconSize={24}
          />
          <h1 className='project-title title'>{title}</h1>
          <div className='right-align'>
            <Icon
              className='close-icon'
              icon={closeIcon}
              iconSize={36}
              onClick={onClose}
            />
          </div>
        </div>
        <div className='dialog-body'>
          {content}
        </div>
      </div>
    </div>
  );
});
