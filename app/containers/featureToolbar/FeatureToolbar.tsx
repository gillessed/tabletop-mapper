import { ButtonGroup, Classes } from '@blueprintjs/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { AppContext, withAppContext } from '../../AppContextProvider';
import { ReduxState } from '../../redux/AppReducer';
import { Dispatchers } from '../../redux/Dispatchers';
import { Grid } from '../../redux/grid/GridTypes';
import { Model } from '../../redux/model/ModelTypes';
import { FeatureButton } from './FeatureButton';
import './FeatureToolbar.scss';

interface OwnProps {
  appContext: AppContext;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

class FeatureToolbarInternal extends React.PureComponent<Props> {
  private dispatchers: Dispatchers;

  constructor(props: Props) {
    super(props);
    this.dispatchers = props.appContext.dispatchers;
  }

  public render() {
    return (
      <div className='feature-toolbar'>
        <ButtonGroup id='feature-buttons' fill className={Classes.DARK}>
          {Object.keys(Model.Types.Geometries).map((geometry) => {
            const geometryInfo = Model.Types.Geometries[geometry];
            return (
              <FeatureButton
                geometryInfo={geometryInfo}
                dispatchers={this.dispatchers}
                key={geometryInfo.id}
                mouseMode={this.props.mouseMode}
              />
            )
          })}
        </ButtonGroup>
      </div>
    );
  }
}

const mapStateToProps = (state: ReduxState) => {
  return {
    mouseMode: Grid.Selectors.get(state).mouseMode,
  };
}

export const FeatureToolbar = connect(mapStateToProps)(withAppContext(FeatureToolbarInternal));