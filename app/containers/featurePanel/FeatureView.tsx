import * as React from 'react';
import './FeatureView.scss';
import { ModelState, Feature } from '../../redux/model/types';
import { FeatureTypeSelector } from './FeatureTypeSelector';
import { Dispatchers } from '../../redux/dispatchers';

interface Props {
    model: ModelState;
    feature: Feature<any>;
    dispatchers: Dispatchers;
}

export class FeatureView extends React.PureComponent<Props, {}> {
    public render() {
        return (
            <div className='feature-view-container'>
                <div className='title'> {this.props.feature.name} </div>
                <div className='subtitle'>Feature - {this.props.feature.type}</div>
                <div className='label space'>Type:</div>
                <FeatureTypeSelector
                    feature={this.props.feature}
                    dispatchers={this.props.dispatchers}
                />
            </div>
        );
    }
}
