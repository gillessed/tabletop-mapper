import * as React from 'react';
import { Dispatchers } from '../../redux/Dispatchers';
import { MenuItem } from '@blueprintjs/core';
import { generateRandomString } from '../../utils/randomId';

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
        const featureId = generateRandomString();
        this.props.dispatchers.model.createFeature({
            featureId,
            layerId: this.props.parent,
        });
    }

    private onClickCreateLayer = () => {
        const layerId = generateRandomString();
        this.props.dispatchers.model.createLayer({
            layerId,
            parentId: this.props.parent,
        });
    }
}
