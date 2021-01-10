import { Button, Classes, InputGroup, Intent } from '@blueprintjs/core';
import * as React from 'react';
import './NewMapForm.scss';
import { useDispatchers } from '../../DispatcherContextProvider';

export function NewMapForm() {
  const dispatchers = useDispatchers();
  const [mapName, setMapName] = React.useState<string>('');
  const [created, setCreated] = React.useState<boolean>(false);
  const onChange = React.useCallback((e: React.FormEvent) => {
    setMapName((e.target as HTMLInputElement).value);
  }, [setMapName]);
  const onClick = React.useCallback(() => {
    setCreated(true);
    dispatchers.project.createProject(mapName);
  }, [setCreated, dispatchers, mapName]);
  const createButton = <Button
    disabled={mapName == null || mapName.length === 0}
    intent={Intent.PRIMARY}
    text='Create Map'
    minimal
    loading={created}
    onClick={onClick}
  />;
  return (
    <div className='new-map-form'>
      <InputGroup
        onChange={onChange}
        placeholder="Enter map name"
        rightElement={createButton}
        value={mapName}
        className={Classes.DARK}
        large
      />
    </div>
  );
}
