import * as React from 'react';
import { connect } from 'react-redux';
import './Layers.scss';
import { ReduxState } from '../../redux/rootReducer';
import { ModelState, ROOT_LAYER } from '../../redux/model/types';
import { Tree, ITreeNode, ContextMenu, Menu, MenuItem, IconName } from '@blueprintjs/core';
import { Dispatchers } from '../../redux/dispatchers';
import { DispatchersContextType } from '../../dispatcherProvider';
import { AppContext } from '../../redux/appContext';
import { LayerMenuItems } from './LayerMenuItem';

interface Props {
    model: ModelState;
}

class LayersComponent extends React.Component<Props, {}> {
    public static contextTypes = DispatchersContextType;
    private dispatchers: Dispatchers;

    constructor(props: Props, context: AppContext) {
        super(props);
        this.dispatchers = context.dispatchers;
    }

    public render() {
        const nodes: ITreeNode[] = [
            this.getTreeNode(this.props.model, ROOT_LAYER),
        ];
        return (
            <div className='layers-container'>
                <div className='side-panel-header unselectable title'>Layers</div>
                <div className='tree-container'>
                    <Tree
                        contents={nodes}
                        onNodeClick={this.onNodeClick}
                        onNodeCollapse={this.onNodeCollapse}
                        onNodeExpand={this.onNodeExpand}
                        onNodeContextMenu={this.onNodeContextMenu}
                    />
                </div>
            </div>
        );
    }

    private getTreeNode = (model: ModelState, layerId: string) => {
        const layer = model.layers.byId[layerId];
        const children: ITreeNode[] = [];
        layer.children.forEach((childId: string) => {
            children.push(this.getTreeNode(model, childId));
        });
        layer.features.forEach((featureId: string) => {
            children.push(this.getFeatureNode(model, featureId));
        });
        const node: ITreeNode = {
            id: layer.id,
            icon: 'folder-open',
            label: layer.name,
            childNodes: children,
            hasCaret: children.length > 0,
            isExpanded: !!this.props.model.expandedNodes[layer.id],
            isSelected: layer.id === this.props.model.selectedNode,
        };
        return node;
    }

    private getFeatureNode = (model: ModelState, featureId: string) => {
        const feature = model.features.byId[featureId];
        let icon: IconName = 'warning-sign';
        if (feature.type === 'point') {
            icon = 'dot';
        } else if (feature.type === 'rectangle') {
            icon = 'widget';
        }

        const node: ITreeNode = {
            id: feature.id,
            hasCaret: false,
            icon: icon,
            label: feature.name,
            isExpanded: !!this.props.model.expandedNodes[feature.id],
            isSelected: feature.id === this.props.model.selectedNode,
        };
        return node;
    }

    private onNodeClick = (node: ITreeNode, _: number[]) => {
        this.dispatchers.model.selectNode(`${node.id}`);
    };

    private onNodeExpand = (node: ITreeNode) => {
        this.dispatchers.model.expandNode(`${node.id}`);
    };

    private onNodeCollapse = (node: ITreeNode) => {
        this.dispatchers.model.collapseNode(`${node.id}`);
    };

    private onNodeContextMenu = (
        node: ITreeNode,
        _path: number[],
        e: React.MouseEvent<HTMLElement>
    ) => {
        this.onNodeClick(node, _path);
        if (this.props.model.features.all.indexOf(`${node.id}`) >= 0) {
            return;
        }
        const menu = (
            <Menu>
                <LayerMenuItems
                    parent={`${node.id}`}
                    dispatchers={this.dispatchers}
                />
            </Menu>
        );

        ContextMenu.show(menu, { left: e.clientX, top: e.clientY });
    }
}

const mapStateToProps = (redux: ReduxState) => {
    return {
        model: redux.model,
    };
};

export const Layers = connect<Props, {}, {}>(mapStateToProps)(LayersComponent as any);
