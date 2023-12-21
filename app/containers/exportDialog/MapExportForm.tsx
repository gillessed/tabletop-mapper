import { Classes, NumericInput } from '@blueprintjs/core';
import classNames from 'classnames';
import * as React from 'react';
import "./MapExportForm.scss";

export const MapExportForm = React.memo(function GridSettingsForm() {
  return (
    <div className={classNames('map-export-form', Classes.DARK)}>
      <div className='title'>Image Width</div>
      <div>
        <NumericInput min={16} max={4096} />
      </div>
      <div>Set path</div>
      <div>Export button which spins on export / Cancel button</div>
      <div>Progress Bar on load</div>
    </div>
  )
});
