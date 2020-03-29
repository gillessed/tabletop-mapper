import * as React from 'react';
import './InfoPanel.scss'; 
import { Model } from '../../redux/model/types';
import { connect } from 'react-redux';
import { ReduxState } from '../../redux/rootReducer';
import { NonIdealState } from '@blueprintjs/core';
import { LayerView } from './LayerView';
import { FeatureView } from './feature/FeatureView';
import { DispatchersContextType } from '../../dispatcherProvider';
import { Dispatchers } from '../../redux/dispatchers';
import { AppContext } from '../../redux/appContext';
import { LayerTree } from '../../redux/layertree/types';

interface Props {
    layerTree: LayerTree.Types.State;
    model: Model.Types.State;
}

class InfoPanelComponent extends React.PureComponent<Props, {}> {
    public static contextTypes = DispatchersContextType;
    private dispatchers: Dispatchers;

    constructor(props: Props, context: AppContext) {
        super(props);
        this.dispatchers = context.dispatchers;
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

export const InfoPanel = connect(mapStateToProps)(InfoPanelComponent as any);