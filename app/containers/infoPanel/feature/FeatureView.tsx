import * as React from 'react';
import './FeatureView.scss';
import { FeatureTypeSelector } from './FeatureTypeSelector';
import { Dispatchers } from '../../../redux/dispatchers';
import { GeometryButtons } from './GeometryButtons';
import { Model } from '../../../redux/model/types';

interface Props {
    model: Model.Types.State;
    feature: Model.Types.Feature<any>;
    dispatchers: Dispatchers;
}

export class FeatureView extends React.PureComponent<Props, {}> {
    public render() {
        const geometryType = Model.Types.Geometries[this.props.feature.type].name;
        return (
            <div className='feature-view-container'>
                <div className='title'> {this.props.feature.name} </div>
                <div className='subtitle'>{geometryType}</div>
                <div className='section'>
                    <FeatureTypeSelector
                        feature={this.props.feature}
                        dispatchers={this.props.dispatchers}
                    />
                </div>
                <div className='section'>
                    <GeometryButtons
                        feature={this.props.feature}
                        dispatchers={this.props.dispatchers}
                    />
                </div>
                
            </div>
        );
    }
}
