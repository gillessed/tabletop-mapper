import * as React from 'react';
import * as classNames from 'classnames';
import { JannaPhotoset, JannaGallery } from '../../redux/model/types';
import { EditableText, ContextMenuTarget, Menu, MenuItem, Alert, Dialog, Intent, Button } from '@blueprintjs/core';
import { Dispatchers } from '../../redux/dispatchers';

interface Props {
    gallery: JannaGallery;
    activeIndex: number;
    index: number;
    setPhotosetIndex: (photoset: number) => void;
    dispatchers: Dispatchers;
}

interface State {
    showingEditDialog: boolean;
    showingDeleteAlert: boolean;
    editValue?: string;
}

@ContextMenuTarget
export class PhotosetTab extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showingEditDialog: false,
            showingDeleteAlert: false,
        }
    }

    public render() {
        const { index, activeIndex, gallery } = this.props;
        const classes = classNames(
            'gallery-body-tab',
            {
                active: index === activeIndex,
                ['not-active']: index !== activeIndex,
            }
        );
        const onClick = () => {
            this.props.setPhotosetIndex(index);
        };
        const photoset = gallery.photosets[index];
        return (
            <div key={photoset.id} className={classes} onClick={onClick}>
                <p>{photoset.name} ({photoset.imageCount})</p>
                <Alert
                    intent={Intent.WARNING}
                    isOpen={this.state.showingDeleteAlert}
                    confirmButtonText='Delete Photoset?'
                    cancelButtonText='Cancel'
                    onConfirm={this.onConfirmDelete}
                    onCancel={this.closeDeleteAlert}
                > Are you sure you want to delete this?</Alert>
                <Dialog
                    iconName='edit'
                    isOpen={this.state.showingEditDialog}
                    onClose={this.closeEditDialog}
                    title='Rename Photoset'
                >
                    <div className='pt-dialog-body'>
                        <input
                            id='rename-input'
                            className='pt-input .pt-round'
                            type='text'
                            placeholder='Enter name...'
                            dir='auto'
                            value={this.state.editValue}
                            onKeyUp={this.onEditKeyUp}
                            onChange={this.onRenameChange}
                            style={{width: '100%'}}
                            
                        />
                    </div>
                    <div className='pt-dialog-footer'>
                        <div className='pt-dialog-footer-actions'>
                            <Button
                                text='Cancel'
                                onClick={this.closeEditDialog}
                            />
                            <Button
                                intent={Intent.PRIMARY}
                                onClick={this.onConfirmRename}
                                text='Primary'
                            />
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }

    public renderContextMenu() {
        return (
            <Menu>
                <MenuItem onClick={this.onRename} text='Rename' iconName='edit'/>
                <MenuItem onClick={this.onDelete} text='Delete' iconName='cross'/>
            </Menu>
        );
    }

    private onDelete = () => {
        this.setState({ showingDeleteAlert: true });
    }

    private onConfirmDelete = () => {
        this.setState({ showingDeleteAlert: false }, () => {
            if (this.props.gallery.photosets.length > 1) {
                this.props.dispatchers.model.deletePhotoset({
                    galleryId: this.props.gallery.id,
                    index: this.props.index,
                });
            }
        });
    }

    private closeDeleteAlert = () => {
        this.setState({ showingDeleteAlert: false });
    }

    private onRename = () => {
        this.setState({
            editValue: this.props.gallery.photosets[this.props.index].name,
            showingEditDialog: true,
        }, () => {
            $('#rename-input').focus();
        });
    }
    
    private onRenameChange = (e: any) => {
        this.setState({
            editValue: e.target.value,
            showingEditDialog: true,
        });
    }

    private onEditKeyUp = (e: any) => {
        if (e.nativeEvent.code === 'Enter') {
            this.onConfirmRename();
        }
    }

    private onConfirmRename = () => {
        this.setState({
            showingEditDialog: false,
        }, () => [
            this.props.dispatchers.model.renamePhotoset({
                galleryId: this.props.gallery.id,
                index: this.props.index,
                name: this.state.editValue,
            })
        ]);
    }

    private closeEditDialog = () => {
        this.setState( { showingEditDialog: false });
    }
}