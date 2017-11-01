import * as React from 'react';
import * as classNames from 'classnames';
import { AppContext } from '../../redux/appContext';
import { DispatchersContextType } from '../../dispatcherProvider';
import { Dispatchers } from '../../redux/dispatchers';
import { generateRandomString } from '../../utils/randomId';
import { NavRoutes, Navigation } from '../../redux/navigation/types';
import { TagTypes, JannaState, JannaTag, JannaGallery, TagTypeDisplays } from '../../redux/model/types';
import { ReduxState } from '../../redux/rootReducer';
import { connect } from 'react-redux';
import { etn } from '../../etn';
import { ConfigPaths } from '../../redux/config/types';
import { createSelector } from 'reselect';
import { Dialog, Intent, Button, MenuItem, Classes } from '@blueprintjs/core';
import { MultiSelect, ISelectItemRendererProps } from '@blueprintjs/labs';
import { PhotoViewState } from '../../redux/photoView/types';

const TagMultiSelect = MultiSelect.ofType<JannaTag>();

interface StateProps {
    janna: JannaState;
    photoView: PhotoViewState;
}

type Props = StateProps;

interface State {
    playing: boolean;
}

class PhotoViewInternal extends React.PureComponent<Props, State> {
    public static contextTypes = DispatchersContextType;
    private dispatchers: Dispatchers;
    private autoplaySubscription: NodeJS.Timer;

    constructor(props: Props, context: AppContext) {
        super(props, context);
        this.dispatchers = context.dispatchers;
        this.state = {
            playing: false,
        };
    }

    public render() {
        if (!this.props.photoView) {
            return <div/>;
        }

        const imageSource = this.props.photoView.images[this.props.photoView.index];
        const autoplayClasses = classNames({
            ['pt-icon']: true,
            ['pt-icon-play']: !this.state.playing,
            ['pt-icon-stop']: this.state.playing,
        });
        return (
            <div className='photo-view-container'>
                <div className='photo-view-next-button-container button-container'>
                    <div className='photo-view-button' onClick={this.onNextClicked}>
                        <span className='pt-icon pt-icon-chevron-right'/>
                    </div>
                </div>
                <div className='photo-view-previous-button-container button-container'>
                    <div className='photo-view-button' onClick={this.onPreviousClicked}>
                        <span className='pt-icon pt-icon-chevron-left'/>
                    </div>
                </div>
                <div className='photo-view-close-button' onClick={this.onCloseClicked}>
                    <span className='pt-icon pt-icon-cross'/>
                </div>
                <div className='photo-view-autoplay-button' onClick={this.onAutoplayClicked}>
                    <span className={autoplayClasses}/>
                </div>
                <img className='unselectable photo-view-image' src={imageSource}/>
            </div>
        );
    }

    private onCloseClicked = () => {
        
        clearInterval(this.autoplaySubscription);
        this.setState({
            playing: false,
        }, () => {
            this.dispatchers.photoView.closePhotoView();
        });
    }
    
    private onNextClicked = () => {
        this.dispatchers.photoView.next();
    }

    private onPreviousClicked = () => {
        this.dispatchers.photoView.previous();
    }

    private onAutoplayClicked = () => {
        if (!this.state.playing) {
            this.autoplaySubscription = setInterval(() => {
                this.dispatchers.photoView.next();
            }, 2000);
        } else {
            clearInterval(this.autoplaySubscription);
        }
        this.setState({
            playing: !this.state.playing,  
        });
    }
}

const mapStateToProps = (state: ReduxState) => {
    return {
        photoView: state.photoView,
        janna: state.janna,
    };
};

export const PhotoView = connect(mapStateToProps)(PhotoViewInternal);