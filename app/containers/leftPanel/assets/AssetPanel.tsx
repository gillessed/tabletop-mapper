import { Classes, TreeNodeInfo, Popover, PopoverInteractionKind, Position, Tree } from '@blueprintjs/core';
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
import { SearchKey } from './SearchKey';
import { AssetSearchBar } from './AssetSearchBar';
import { filterAssets } from '../../../redux/asset/AssetUtils';

export function AssetPanel() {
  const appConfig = useAppConfig();
  const dispatchers = useDispatchers();
  const assetState = useSelector(Asset.Selectors.get);
  const [expandedNodes, setExpandedNodes] = React.useState<Set<string>>(new Set());
  const [searchKeys, setSearchKeys] = React.useState<SearchKey[]>([]);
  const mouseMode = useSelector(Grid.Selectors.getMouseMode);
  const editingFeatureClipRegion = useSelector(Grid.Selectors.getEditingFeatureClipRegion);

  const filteredState = React.useMemo(() => filterAssets(assetState, searchKeys), [assetState, searchKeys]);
  const { assetIndex, assetPackIndex } = filteredState;

  const onMouseDown = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (editingFeatureClipRegion != null) {
      return null;
    }
    const assetId = getTreeMouseDownTarget('asset-tree-node', event);
    if (assetId == null) {
      return;
    }
    event.preventDefault();
    dispatchers.grid.startDraggingAsset(assetId);
  }, [dispatchers, editingFeatureClipRegion]);

  const onNodeExpand = React.useCallback((node: TreeNodeInfo) => {
    const newNodes = new Set(expandedNodes);
    newNodes.add(node.id as string);
    setExpandedNodes(newNodes);
  }, [dispatchers, expandedNodes, setExpandedNodes]);

  const onNodeCollapse = React.useCallback((node: TreeNodeInfo) => {
    const newNodes = new Set(expandedNodes);
    newNodes.delete(node.id as string);
    setExpandedNodes(newNodes);
  }, [dispatchers, expandedNodes, setExpandedNodes]);

  const nodes: TreeNodeInfo[] = React.useMemo(() => {
    const assetPackNodes: TreeNodeInfo[] = [];
    for (const assetPackId of assetPackIndex.all) {
      const assetPack = assetPackIndex.byId[assetPackId];
      const assetNodes: TreeNodeInfo[] = [];
      for (const assetId of assetPack.assetIds) {
        if (assetIndex.byId[assetId] == null) {
          continue;
        }
        const asset = assetIndex.byId[assetId];
        const file = appConfig.getAssetFileById(asset.id, asset.extension);
        const popoverPreview = (
          <div className='asset-hover-image-container'>
            <div className='asset-hover-image-backdrop'>
              <img className='asset-hover-image-preview' src={file.fullPath} />
            </div>
          </div>
        );
        assetNodes.push({
          id: asset.id,
          label: asset.name,
          icon: (
            <Popover
              position={Position.LEFT}
              interactionKind={PopoverInteractionKind.HOVER}
              content={popoverPreview}
            >
              <div className='asset-tree-thumbnail-backdrop'>
                <img className='asset-tree-thumbnail' src={file.fullPath} />

              </div>
            </Popover>
          ),
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
      <AssetSearchBar searchKeys={searchKeys} setSearchKeys={setSearchKeys}   />
      <Tree
        className={classNames('asset-tree', Classes.DARK)}
        contents={nodes}
        onNodeCollapse={onNodeCollapse}
        onNodeExpand={onNodeExpand}
      />
    </div>
  );
}
