import { ContextMenu, ITreeNode, Menu, Tree } from '@blueprintjs/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { AppContext, withAppContext } from '../../AppContextProvider';
import { Dispatchers } from '../../redux/Dispatchers';
import { LayerTree } from '../../redux/layertree/LayerTreeTypes';
import { Model } from '../../redux/model/ModelTypes';
import { ReduxState } from '../../redux/AppReducer';
import { LayerMenuItems } from './LayerMenuItem';
import './Layers.scss';

interface Props {
  appContext: AppContext;
  model: Model.Types.State;
  layerTree: LayerTree.Types.State;
}

class LayersComponent extends React.Component<Props> {
  private dispatchers: Dispatchers;

  constructor(props: Props) {
    super(props);
    this.dispatchers = props.appContext.dispatchers;
  }

  public render() {
    const nodes: ITreeNode[] = [
      this.getTreeNode(this.props.model, Model.ROOT_LAYER),
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

  private getTreeNode = (model: Model.Types.State, layerId: string) => {
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
      isExpanded: !!this.props.layerTree.expandedNodes[layer.id],
      isSelected: layer.id === this.props.layerTree.selectedNode,
    };
    return node;
  }

  private getFeatureNode = (model: Model.Types.State, featureId: string) => {
    const feature = model.features.byId[featureId];
    const icon = Model.Types.Geometries[feature.type].icon;
    const node: ITreeNode = {
      id: feature.id,
      hasCaret: false,
      icon,
      label: feature.name,
      isExpanded: !!this.props.layerTree.expandedNodes[feature.id],
      isSelected: feature.id === this.props.layerTree.selectedNode,
    };
    return node;
  }

  private onNodeClick = (node: ITreeNode, _: number[]) => {
    this.dispatchers.layerTree.selectNode(`${node.id}`);
  };

  private onNodeExpand = (node: ITreeNode) => {
    this.dispatchers.layerTree.expandNode(`${node.id}`);
  };

  private onNodeCollapse = (node: ITreeNode) => {
    this.dispatchers.layerTree.collapseNode(`${node.id}`);
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

const mapStateToProps = (state: ReduxState) => {
  return {
    model: Model.Selectors.get(state),
    layerTree: LayerTree.Selectors.get(state),
  };
};

export const Layers = connect(mapStateToProps)(withAppContext(LayersComponent));
