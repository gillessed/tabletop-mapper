import { Button, ButtonGroup, Classes, Switch } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { Select } from '@blueprintjs/select';
import * as React from 'react';
import { useDispatchers } from '../../../../DispatcherContextProvider';
import { Model } from '../../../../redux/model/ModelTypes';

export interface ImageFillDropdownProps {
  featureId: string;
  imageFill: Model.Types.ImageFill;
}

export const ImageFillDropdown = React.memo(function ImageFillDropdown({
  featureId,
  imageFill,
}: ImageFillDropdownProps) {
  const dispatchers = useDispatchers();
  const setValue = React.useCallback((value: Model.Types.ImageFill) => {
    dispatchers.model.setObjectCover({ featureIds: [featureId], value });
  }, [dispatchers, featureId]);
  const setContain = React.useCallback(() => setValue('contain'), [setValue]);
  const setStretch = React.useCallback(() => setValue('stretch'), [setValue]);
  const setCover = React.useCallback(() => setValue('cover'), [setValue]);
  return (
    <ButtonGroup className={Classes.DARK} fill>
      <Button
        text='Contain'
        active={imageFill === 'contain'}
        onClick={setContain}
      />
      <Button
        text='Stretch'
        active={imageFill === 'stretch'}
        onClick={setStretch}
      />
      <Button
        text='Cover'
        active={imageFill === 'cover'}
        onClick={setCover}
      />
    </ButtonGroup>
  );
});
