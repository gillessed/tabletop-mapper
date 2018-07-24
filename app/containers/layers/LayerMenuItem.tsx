import * as React from 'react';
import { Dispatchers } from '../../redux/dispatchers';
import { MenuItem } from '@blueprintjs/core';

interface Props {
    parent: string;
    dispatchers: Dispatchers;
}

export class LayerMenuItems extends React.PureComponent<Props, {}> {
    public render() {
        return (
            <>
                <MenuItem
                    key='new-object-item'
                    icon='new-object'
                    text='Create Feature'
                    onClick={this.onClickNewObject}
                />
                <MenuItem
                    key='new-layer-item'
                    icon='add-to-artifact'
                    text='Create Sublayer'
                    onClick={this.onClickCreateLayer}
                />
                <MenuItem
                    key='delete-layer-item'
                    icon='trash'
                    text='Delete Layer'
                />
            </>
        );
    }

    private onClickNewObject = () => {
        this.props.dispatchers.model.createFeature(this.props.parent);
    }

    private onClickCreateLayer = () => {
        this.props.dispatchers.model.createLayer(this.props.parent);
    }
}