import * as React from 'react';
import { AppContext } from '../../redux/appContext';
import { DispatchersContextType } from '../../dispatcherProvider';
import { Dispatchers } from '../../redux/dispatchers';
import { generateRandomString } from '../../utils/randomId';
import { NavRoutes } from '../../redux/navigation/types';
import { TagTypes, JannaState, JannaTag } from '../../redux/model/types';
import { ReduxState } from '../../redux/rootReducer';
import { connect } from 'react-redux';
import { ConfigPaths } from '../../redux/config/types';
import { etn } from '../../etn';

interface OwnProps {
    route: string;
    params?: {
        id: string,
    }
}

interface StateProps {
    rootDirectory: string;
    janna: JannaState;
}

type Props = OwnProps & StateProps;

interface State {
    name: string;
    tagType: string;
    cover?: FileList;
}

class UpsertTagViewInternal extends React.PureComponent<Props, State> {
    public static contextTypes = DispatchersContextType;
    private dispatchers: Dispatchers;

    constructor(props: Props, context: AppContext) {
        super(props, context);
        this.dispatchers = context.dispatchers;
        const tag = this.getOldTag();
        this.state = {
            name: tag ? tag.value : '',
            tagType: tag ? tag.tagType : TagTypes[0],
        };
    }

    private getOldTag = (): JannaTag | undefined => {
        if (this.props.params) {
            return this.props.janna.tags.get(this.props.params.id);
        }
    }

    public render() {
        const title = this.props.params ? 'Edit Tag' : 'Create Tag';
        return (
            <div className='container create-tag-container'>
                <h1 className='title unselectable'> {title} </h1>
                {this.renderForm()}
                {this.renderPreview()}
            </div>
        );
    }

    private renderForm() {
        const fileChooserText = this.state.cover === undefined ?
            'Choose file...' : 
            this.state.cover[0].path;
        const importButtonClass = 'pt-button pt-icon-add pt-large pt-icon-add pt-intent-success'
            + (this.state.name.trim().length === 0 ? ' pt-disabled' : '');
        const submitButtonText = this.props.params ? 'Save' : 'Create';
        return (
            <div className='create-tag-form-container'>
                <label className='pt-label pt-inline'>
                    <span className='create-tag-label'>Tag Name</span>
                    <input
                        className='pt-input pt-large create-tag-name-input'
                        type='text'
                        placeholder='Tag name...'
                        value={this.state.name}
                        onChange={this.onNameChanged}
                        dir='auto'
                    />
                </label>
                <label className='pt-label pt-inline'>
                    <span className='create-tag-label'>Tag Type</span>
                    <div className='pt-select pt-large'>
                        <select className='create-tag-type-select' value={this.state.tagType} onChange={this.onTypeChanged}>
                            {TagTypes.map((value: string) => {
                                return (
                                    <option value={value} key={value}>{value}</option>
                                )
                            })}
                        </select>
                    </div>
                </label>
                <p className='unselectable'>Choose cover image</p>
                <label className='pt-file-upload pt-large'>
                    <input type='file' onChange={this.onFolderSelected} accept='image/*'/>
                    <span className='pt-file-upload-input'>{fileChooserText}</span>
                </label>
                <button type='button' className={importButtonClass} onClick={this.onImportGalleryPressed}>{submitButtonText}</button>
            </div>
        );
    }

    private onNameChanged = (e: any) => {
        this.setState({
            name: e.nativeEvent.target.value,
        });
    }

    private onTypeChanged = (e: any) => {
        this.setState({
            tagType: e.nativeEvent.target.value,
        });
    }

    private renderPreview() {
        const tag = this.getOldTag();
        if (this.state.cover) {
            return (
                <div className='create-tag-preview-container'>
                    <div className='preview-image-container'>
                        <img className='preview-image' src={this.state.cover[0].path}/>
                    </div>
                </div>
            );
        } else if (tag && tag.cover) {
            const coverDir = ConfigPaths.tagCoverDir(this.props.rootDirectory);
            const coverSource = etn.path.join(coverDir, tag.cover);
            return (
                <div className='create-tag-preview-container'>
                    <div className='preview-image-container'>
                        <img className='preview-image' src={coverSource}/>
                    </div>
                </div>
            );
        } else {
            return <div/>;
        }
    }

    private onFolderSelected = (e: { target: { files: FileList } }) => {
        if (e.target.files.length > 0) {
            this.setState({
                cover: e.target.files,
            });
        } else {
            this.setState({
                cover: undefined,
            });
        }
    }

    private onImportGalleryPressed = () => {
        if (this.state.name.trim().length === 0) {
            return;
        }

        const tag = this.getOldTag();

        this.dispatchers.tag.saveTag({
            id: tag ? tag.id : generateRandomString(),
            name: this.state.name,
            cover: this.state.cover ? this.state.cover[0].path : undefined,
            tagType: this.state.tagType,
            create: !tag,
        });
    }
}

const mapStateToProps = (state: ReduxState, ownProps: OwnProps) => {
    return {
        ...ownProps,
        rootDirectory: state.config.rootDirectory!,
        janna: state.janna,
    };
};

export const UpsertTagView = connect(mapStateToProps)(UpsertTagViewInternal);