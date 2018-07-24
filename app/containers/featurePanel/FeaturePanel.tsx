import * as React from 'react';
import './FeaturePanel.scss'; 
import { ModelState } from '../../redux/model/types';
import { connect } from 'react-redux';
import { ReduxState } from '../../redux/rootReducer';
import { NonIdealState } from '@blueprintjs/core';
import { LayerView } from './LayerView';
import { FeatureView } from './FeatureView';
import { DispatchersContextType } from '../../dispatcherProvider';
import { Dispatchers } from '../../redux/dispatchers';
import { AppContext } from '../../redux/appContext';

interface Props {
    model: ModelState;
}

class FeaturePanelComponent extends React.PureComponent<Props, {}> {
    public static contextTypes = DispatchersContextType;
    private dispatchers: Dispatchers;

    constructor(props: Props, context: AppContext) {
        super(props);
        this.dispatchers = context.dispatchers;
    }

    public render() {
        let view;
        const { selectedNode } = this.props.model;
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
        model: state.model,
    }
};

export const FeaturePanel = connect(mapStateToProps)(FeaturePanelComponent as any);