import { Classes, ITreeNode, Tree } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import * as classNames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useAppConfig } from '../../../AppConfigContextProvider';
import { useDispatchers } from '../../../DispatcherContextProvider';
import { Asset } from '../../../redux/asset/AssetTypes';
import './AssetPanel.scss';
import { Grid } from '../../../redux/grid/GridTypes';
import { getTreeMouseDownTarget } from '../utils/TreeMouseDown';

export function AssetPanel() {
  const appConfig = useAppConfig();
  const dispatchers = useDispatchers();
  const assetIndex = useSelector(Asset.Selectors.getAssetIndex);
  const assetPackIndex = useSelector(Asset.Selectors.getAssetPackIndex);
  const [expandedNodes, setExpandedNodes] = React.useState<Set<string>>(new Set());
  const mouseMode = useSelector(Grid.Selectors.getMouseMode);

  const onMouseDown = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const assetId = getTreeMouseDownTarget('asset-tree-node', event);
    if (assetId == null) {
      return;
    }
    event.preventDefault();
    dispatchers.grid.startDraggingAsset(assetId);
  }, []);
  const onNodeExpand = React.useCallback((node: ITreeNode) => {
    const newNodes = new Set(expandedNodes);
    newNodes.add(node.id as string);
    setExpandedNodes(newNodes);
  }, [dispatchers, expandedNodes, setExpandedNodes]);
  const onNodeCollapse = React.useCallback((node: ITreeNode) => {
    const newNodes = new Set(expandedNodes);
    newNodes.delete(node.id as string);
    setExpandedNodes(newNodes);
  }, [dispatchers, expandedNodes, setExpandedNodes]);

  const nodes: ITreeNode[] = React.useMemo(() => {
    const assetPackNodes: ITreeNode[] = [];
    for (const assetPackId of assetPackIndex.all) {
      const assetPack = assetPackIndex.byId[assetPackId];
      const assetNodes: ITreeNode[] = [];
      for (const assetId of assetPack.assetIds) {
        const asset = assetIndex.byId[assetId];
        const file = appConfig.getAssetFileById(asset.id, asset.extension);
        assetNodes.push({
          id: asset.id,
          label: asset.name,
          icon: <img className='asset-tree-thumbnail' src={file.fullPath} />,
          className: `asset-tree-node id:${assetId}`,
        });
      }
      assetPackNodes.push({
        id: assetPack.id,
        icon: IconNames.FOLDER_CLOSE,
        label: assetPack.name,
        hasCaret: true,
        isExpanded: expandedNodes.has(assetPack.id),
        childNodes: assetNodes,
      });
    }
    return assetPackNodes;
  }, [assetIndex, assetPackIndex, expandedNodes]);
  return (
    <div
      className={classNames('asset-tree-container', { 'dragging-asset': mouseMode === Grid.Types.MouseMode.DragAsset })}
      onMouseDown={onMouseDown}
    >
      <Tree
        className={classNames('asset-tree', Classes.DARK)}
        contents={nodes}
        onNodeCollapse={onNodeCollapse}
        onNodeExpand={onNodeExpand}
      />
    </div>
  );
}
