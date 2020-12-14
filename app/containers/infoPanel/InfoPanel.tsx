import * as React from 'react';
import { connect } from 'react-redux';
import { AppContext, withAppContext } from '../../AppContextProvider';
import { ReduxState } from '../../redux/AppReducer';
import { Dispatchers } from '../../redux/Dispatchers';
import { LayerTree } from '../../redux/layertree/LayerTreeTypes';
import { Model } from '../../redux/model/ModelTypes';
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
      view = <FeatureView featureId={selectedNode} />;
    } else if (this.props.model.layers.all.indexOf(selectedNode) >= 0 && selectedNode !== Model.RootLayerId) {
      view = (
        <LayerView
          layer={this.props.model.layers.byId[selectedNode]}
          model={this.props.model}
          dispatchers={this.dispatchers}
        />
      );
    }
    if (view == null) {
      return null;
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
