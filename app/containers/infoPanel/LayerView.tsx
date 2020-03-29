import * as React from 'react';
import './LayerView.scss';
import { Button, Intent } from '@blueprintjs/core';
import { Dispatchers } from '../../redux/dispatchers';
import { Model } from '../../redux/model/types';
import { generateRandomString } from '../../utils/randomId';

interface Props {
    model: Model.Types.State;
    layer: Model.Types.Layer;
    dispatchers: Dispatchers;
}

export class LayerView extends React.PureComponent<Props, {}> {
    public render() {
        return (
            <div className='layer-view-container'>
                <div className='title'> {this.props.layer.name} </div>
                <div className='subtitle'>Layer</div>
                <div className='buttons'>
                    <Button
                        icon='new-object'
                        text='Create Feature'
                        intent={Intent.PRIMARY}
                        onClick={this.onClickCreateFeature}
                    />
                    <Button
                        icon='add-to-artifact'
                        text='Create Sublayer'
                        intent={Intent.PRIMARY}
                    />
                    <Button
                        icon='duplicate'
                        text='Clone Layer'
                    />
                    <Button
                        icon='trash'
                        text='Delete Layer'
                        intent={Intent.DANGER}
                    />
                </div>
            </div>
        );
    }

    private onClickCreateFeature = () => {
        const featureId = generateRandomString();
        this.props.dispatchers.model.createFeature({
            featureId,
            layerId: this.props.layer.id,
        });
    }
}
