import { NonIdealState } from '@blueprintjs/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { AppContext, withAppContext } from '../../AppContextProvider';
import { Dispatchers } from '../../redux/Dispatchers';
import { LayerTree } from '../../redux/layertree/LayerTreeTypes';
import { Model } from '../../redux/model/ModelTypes';
import { ReduxState } from '../../redux/AppReducer';
import { FeatureView } from './feature/FeatureView';
import './InfoPanel.scss';
import { LayerView } from './LayerView';

interface Props {
  appContext: AppContext;
  layerTree: LayerTree.Types.State;
  model: Model.Types.State;
}

class InfoPanelComponent extends React.PureComponent<Props, {}> {
  private dispatchers: Dispatchers;

  constructor(props: Props) {
    super(props);
    this.dispatchers = props.appContext.dispatchers;
  }

  public render() {
    let view;
    const { selectedNode } = this.props.layerTree;
    if (this.props.model.features.all.indexOf(selectedNode) >= 0) {
      view = (
        <FeatureView
          feature={this.props.model.features.byId[selectedNode]}
          model={this.props.model}
          dispatchers={this.dispatchers}
        />
      );
    } else if (this.props.model.layers.all.indexOf(selectedNode) >= 0) {
      view = (
        <LayerView
          layer={this.props.model.layers.byId[selectedNode]}
          model={this.props.model}
          dispatchers={this.dispatchers}
        />
      );
    } else {
      view = (
        <NonIdealState
          icon='warning-sign'
          title='Error'
          description={`Selected node "${selectedNode}" does not exist.`}
        />
      )
    }
    return (
      <div className='feature-panel-container'>
        {view}
      </div>
    );
  }
}

const mapStateToProps = (state: ReduxState) => {
  return {
    layerTree: LayerTree.Selectors.get(state),
    model: Model.Selectors.get(state),
  }
};

export const InfoPanel = connect(mapStateToProps)(withAppContext(InfoPanelComponent));
