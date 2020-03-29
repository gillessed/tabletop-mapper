import * as React from 'react';
import { Dispatchers } from '../../../redux/dispatchers';
import { Button, Intent } from '@blueprintjs/core';
import { Model } from '../../../redux/model/types';

interface Props {
    feature: Model.Types.Feature<any>;
    dispatchers: Dispatchers;
}

export class GeometryButtons extends React.PureComponent<Props, {}> {
    public render() {
        if (!this.props.feature.geometry) {
            return (
                <Button
                    id='draw-button'
                    icon='draw'
                    intent={Intent.SUCCESS}
                    onClick={this.onClick}
                >
                    Draw Feature
                </Button>
            );
        } else {
            return (
                <div
                />
            );
        }
    }

    private onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (this.props.feature.geometry) {
            // TODO: show warning
        }
    }
}