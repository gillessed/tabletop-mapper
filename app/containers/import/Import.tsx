import * as React from 'react';
import { AppContext } from '../../redux/appContext';
import { DispatchersContextType } from '../../dispatcherProvider';
import { Dispatchers } from '../../redux/dispatchers';
import { generateRandomString } from '../../utils/randomId';
import { NavRoutes } from '../../redux/navigation/types';
import { Button, Intent } from '@blueprintjs/core';
import { etn } from '../../etn';

interface Props {
    route: string;
}

interface State {
    selectedDirectories?: string[];
    name: string;
}

export class ImportInternal extends React.PureComponent<Props, State> {
    public static contextTypes = DispatchersContextType;
    private dispatchers: Dispatchers;

    constructor(props: Props, context: AppContext) {
        super(props, context);
        this.dispatchers = context.dispatchers;
        this.state = {
            name: '',
        };
    }

    public render() {
        return (
            <div className='container import-container'>
                <h1 className='title unselectable'> Import Gallery </h1>
                {this.renderForm()}
                {this.renderPreview()}
            </div>
        );
    }

    private renderForm() {
        const buttonText = this.state.selectedDirectories === undefined ?
            'Choose Folders to Import' : 
            this.state.selectedDirectories.length + ' Folders Chosen';
        return (
            <div className='import-form-container'>
                <Button
                    className='pt-large'
                    text={buttonText}
                    intent={Intent.PRIMARY}
                    onClick={this.showOpenDialog}
                />
                <Button
                    className='pt-large'
                    text='Import Folders'
                    intent={Intent.SUCCESS}
                    iconName='import'
                    disabled={this.state.selectedDirectories === undefined}
                    onClick={this.onImportGalleryPressed}
                />
            </div>
        );
    }

    private showOpenDialog = () => {
        etn.dialog.showOpenDialog({
            properties: [
                'openDirectory',
                'multiSelections',
            ],
        }, (fileList: string[]) => {
            this.setState({
                selectedDirectories: fileList,  
            });
        });
    }

    private renderPreview() {
        if (this.state.selectedDirectories) {
            return (
                <div>
                    {this.state.selectedDirectories.map(this.renderPreviewForDirectory)}
                </div>
            );
        } else {
            return <div/>;
        }
    }

    private renderPreviewForDirectory(folder: string) {
        const imageFiles = etn.fs.readdirSync(folder);
        const images: JSX.Element[] = [];
        for (let i = 0; i < imageFiles.length && i < 6; i++) {
            images.push(
                <div className='preview-image-container' key={i}>
                    <img className='preview-image' src={etn.path.join(folder, imageFiles[i])}/>
                </div>
            );
        }
        images.push(<div key='filler' className='preview-fillter' />);
        return (
            <div key={'import-preview' + folder} className='import-preview-container'>
                <span className='unselectable text'>{folder}</span>
                <div className='import-preview'>
                    {images}
                </div>
            </div>
        );
    }

    private onImportGalleryPressed = () => {
        if (this.state.selectedDirectories === undefined) {
            return;
        }
        this.dispatchers.navigation.toggleImportPanel(true);
        this.dispatchers.navigation.setRoute(NavRoutes.root._, NavRoutes.root.home);

        this.dispatchers.import.importGallery(this.state.selectedDirectories.map((folder) => {
            return {
                id: generateRandomString(),
                folder,
            };
        }));
    }
}

export const Import = ImportInternal;