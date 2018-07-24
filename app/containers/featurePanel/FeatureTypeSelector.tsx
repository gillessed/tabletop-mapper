import * as React from 'react';
import { Feature, GeometryTypes } from '../../redux/model/types';
import { Dispatchers } from '../../redux/dispatchers';
import { HTMLSelect, IHTMLOptionProps } from '@blueprintjs/core';

interface Props {
    feature: Feature<any>;
    dispatchers: Dispatchers;
}

export class FeatureTypeSelector extends React.PureComponent<Props, {}> {
    public render() {
        const options = Object.keys(GeometryTypes).map((key: string) => {
            const node: IHTMLOptionProps = {
                value: GeometryTypes[key].id,
                label: GeometryTypes[key].name,
            };
            return node;
        });
        return (
            <HTMLSelect
                className='feature-type-selector'
                fill={true}
                options={options}
                value={this.props.feature.name}
                onChange={this.onSelect}
            />
        );
    }

    private onSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (this.props.feature.geometry) {
            // TODO: show warning
        }
        // TODO: set geometry
    }
}