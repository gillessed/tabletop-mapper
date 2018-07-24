import * as React from 'react';
import './LayerView.scss';
import { Layer, ModelState } from '../../redux/model/types';
import { Button, Intent } from '@blueprintjs/core';
import { Dispatchers } from '../../redux/dispatchers';

interface Props {
    model: ModelState;
    layer: Layer;
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
        this.props.dispatchers.model.createFeature(this.props.layer.id);
    }
}
