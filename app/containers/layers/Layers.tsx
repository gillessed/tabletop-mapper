import { Classes, ContextMenu, ITreeNode, Menu, Tree } from '@blueprintjs/core';
import * as classNames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useDispatchers } from '../../DispatcherContextProvider';
import { LayerTree } from '../../redux/layertree/LayerTreeTypes';
import { Model } from '../../redux/model/ModelTypes';
import { Indexable } from '../../redux/utils/indexable';
import { LayerMenuItem } from './LayerMenuItem';
import './Layers.scss';

function getTreeNode (
  layerTree: LayerTree.Types.State,
  layers: Indexable<Model.Types.Layer>,
  features: Indexable<Model.Types.Feature>,
  layerId: string,
) {
  const layer = layers.byId[layerId];
  const children: ITreeNode[] = [];
  for (const childId of layer.children) {
    children.push(getTreeNode(layerTree, layers, features, childId));
  }
  for (const featureId of layer.features) {
    children.push(getFeatureNode(layerTree, features, featureId));
  }
  const node: ITreeNode = {
    id: layer.id,
    icon: 'folder-open',
    label: layer.name,
    childNodes: children,
    hasCaret: children.length > 0,
    isExpanded: !!layerTree.expandedNodes[layer.id],
    isSelected: layerTree.selectedNodes.indexOf(layer.id) >= 0,
  };
  return node;
}

function getFeatureNode (
  layerTree: LayerTree.Types.State,
  features: Indexable<Model.Types.Feature>,
  featureId: string,
) {
  const feature = features.byId[featureId];
  const icon = Model.Types.Geometries[feature.geometry.type].icon;
  const node: ITreeNode = {
    id: feature.id,
    hasCaret: false,
    icon,
    label: feature.name,
    isExpanded: !!layerTree.expandedNodes[feature.id],
    isSelected: layerTree.selectedNodes.indexOf(feature.id) >= 0,
  };
  return node;
}

export function Layers() {
  const dispatchers = useDispatchers();
  const layers = useSelector(Model.Selectors.getLayers);
  const features = useSelector(Model.Selectors.getFeatures);
  const layerTree = useSelector(LayerTree.Selectors.get);

  const onClick = React.useCallback((e: any) => {
    const classes: string = e.target.className;
    if (classes.indexOf('layer-tree-container') >= 0) {
      dispatchers.layerTree.selectNodes([Model.RootLayerId]);
    }
  }, [dispatchers]);
  const onNodeClick = React.useCallback((node: ITreeNode, _: number[]) => {
    dispatchers.layerTree.selectNodes([`${node.id}`]);
  }, [dispatchers]);
  const onNodeExpand = React.useCallback((node: ITreeNode) => {
    dispatchers.layerTree.expandNode(`${node.id}`);
  }, [dispatchers]);
  const onNodeCollapse = React.useCallback((node: ITreeNode) => {
    dispatchers.layerTree.collapseNode(`${node.id}`);
  }, [dispatchers]);
  const onNodeContextMenu = React.useCallback((
    node: ITreeNode,
    _path: number[],
    e: React.MouseEvent<HTMLElement> 
  ) => {
    onNodeClick(node, _path);
    if (features.all.indexOf(`${node.id}`) >= 0) {
      return;
    }
    const menu = (
      <Menu>
        <LayerMenuItem parent={`${node.id}`} />
      </Menu>
    );

    ContextMenu.show(menu, { left: e.clientX, top: e.clientY });
  }, [dispatchers, features, onNodeClick]);

  const nodes: ITreeNode[] = getTreeNode(layerTree, layers, features, Model.RootLayerId).childNodes ?? [];
  return (
    <div className='layers-container'>
      <div className='side-panel-header unselectable title'>Layers</div>
      <div className='tree-container' onClick={onClick}>
        <Tree
          className={classNames('layer-tree-container', Classes.DARK)}
          contents={nodes}
          onNodeClick={onNodeClick}
          onNodeCollapse={onNodeCollapse}
          onNodeExpand={onNodeExpand}
          onNodeContextMenu={onNodeContextMenu}
        />
      </div>
    </div>
  );
}
