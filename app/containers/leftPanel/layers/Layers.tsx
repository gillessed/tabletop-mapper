import { Classes, Tree, TreeNodeInfo } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import classNames from "classnames";
import * as React from "react";
import { useSelector } from "react-redux";
import { useDispatchers } from "../../../DispatcherContextProvider";
import { Grid } from "../../../redux/grid/GridTypes";
import { LayerTree } from "../../../redux/layertree/LayerTreeTypes";
import {
  expandNodesWorker,
  selectNodesWorker,
} from "../../../redux/layertree/LayerTreeWorkers";
import {
  ReparentSection,
  ReparentTarget,
  getCoverSet,
  getNodesBetween,
  isValidReparent,
} from "../../../redux/model/ModelTree";
import { Model } from "../../../redux/model/ModelTypes";
import { Indexable } from "../../../redux/utils/indexable";
import { useWorker } from "../../../redux/utils/workers";
import { getTreeMouseDownTarget } from "../utils/TreeMouseDown";
import "./Layers.scss";
import { NewFolderButton } from "./NewFolderButton";

type LayerNode = TreeNodeInfo<void>;

interface NodeContext {
  layerTree: LayerTree.Types.State;
  layerIndex: Indexable<Model.Types.Layer>;
  featureIndex: Indexable<Model.Types.Feature>;
  mouseMode: Grid.Types.MouseMode;
  treeHover: ReparentTarget | null;
  validReparent: boolean;
  selectionCoverSet: Set<string>;
}

function getTreeNode(context: NodeContext, layerId: string): LayerNode {
  const {
    layerTree,
    layerIndex,
    mouseMode,
    treeHover,
    validReparent,
    selectionCoverSet,
  } = context;
  const layer = layerIndex.byId[layerId];
  const children: LayerNode[] = [];
  for (const childId of layer.children) {
    children.push(getTreeNode(context, childId));
  }
  for (const featureId of layer.features) {
    children.push(getFeatureNode(context, featureId));
  }
  const isReparenting =
    mouseMode === Grid.Types.MouseMode.DragSelectionInTree &&
    treeHover != null &&
    layerId === treeHover.nodeId &&
    validReparent;
  const selected = layerTree.selectedNodes.indexOf(layer.id) >= 0;
  const classes = classNames("layer-tree-node", `id:${layer.id}`, {
    "reparent-into": isReparenting && treeHover.section === "mid",
    "selected-child": selected && !selectionCoverSet.has(layer.id),
    "selected-cover": selectionCoverSet.has(layer.id),
  });
  const label = (
    <>
      <span>{layer.name}</span>
      {isReparenting && treeHover.section === "top" && (
        <div className="reparent-line reparent-top-line" />
      )}
      {isReparenting && treeHover.section === "bottom" && (
        <div className="reparent-line reparent-bottom-line" />
      )}
    </>
  );
  const node: LayerNode = {
    id: layer.id,
    icon: IconNames.FOLDER_OPEN,
    label,
    childNodes: children,
    hasCaret: children.length > 0,
    isExpanded: !!layerTree.expandedNodes[layer.id],
    className: classes,
  };
  return node;
}

function getFeatureNode(context: NodeContext, featureId: string): LayerNode {
  const {
    layerTree,
    featureIndex,
    mouseMode,
    treeHover,
    validReparent,
    selectionCoverSet,
  } = context;
  const feature = featureIndex.byId[featureId];
  const icon = Model.Types.Geometries[feature.geometry.type].icon;
  const isReparenting =
    mouseMode === Grid.Types.MouseMode.DragSelectionInTree &&
    treeHover != null &&
    featureId === treeHover.nodeId &&
    validReparent;
  const selected = layerTree.selectedNodes.indexOf(feature.id) >= 0;
  const classes = classNames("layer-tree-node", `id:${feature.id}`, {
    "selected-child": selected && !selectionCoverSet.has(feature.id),
    "selected-cover": selectionCoverSet.has(feature.id),
  });
  const label = (
    <>
      <span>{feature.name}</span>
      {isReparenting && treeHover.section === "top" && (
        <div className="reparent-line reparent-top-line" />
      )}
      {isReparenting && treeHover.section === "bottom" && (
        <div className="reparent-line reparent-bottom-line" />
      )}
    </>
  );
  const node: LayerNode = {
    id: feature.id,
    hasCaret: false,
    icon,
    label,
    isExpanded: !!layerTree.expandedNodes[feature.id],
    className: classes,
  };
  return node;
}

export function Layers() {
  const dispatchers = useDispatchers();
  const layerIndex = useSelector(Model.Selectors.getLayers);
  const featureIndex = useSelector(Model.Selectors.getFeatures);
  const layerTree = useSelector(LayerTree.Selectors.get);
  const mouseMode = useSelector(Grid.Selectors.getMouseMode);
  const editingFeatureClipRegion = useSelector(
    Grid.Selectors.getEditingFeatureClipRegion
  );
  const treeRef = React.useRef<Tree<void>>(null);
  const selection = layerTree.selectedNodes;
  const selectionCoverSet = React.useMemo(
    () => getCoverSet(selection, featureIndex, layerIndex),
    [selection]
  );

  const [lastClicked, setLastClicked] = React.useState<string | null>(null);
  const [treeHover, setTreeHover] = React.useState<ReparentTarget | null>(null);
  const [isMouseDown, setIsMouseDown] = React.useState(false);
  const selectNodes = useWorker(selectNodesWorker);
  const expandNodes = useWorker(expandNodesWorker);

  const validReparent = React.useMemo(() => {
    return treeHover != null
      ? isValidReparent(featureIndex, layerIndex, selection, treeHover)
      : false;
  }, [featureIndex, layerIndex, selection, treeHover]);

  const onMouseDown = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (editingFeatureClipRegion != null) {
        return;
      }
      const nodeId = getTreeMouseDownTarget("layer-tree-node", event);
      event.preventDefault();
      if (nodeId == null) {
        setLastClicked(null);
        dispatchers.layerTree.setSelectedNodes([]);
      } else {
        if (event.shiftKey && lastClicked != null) {
          const nodeIds = getNodesBetween(
            featureIndex,
            layerIndex,
            lastClicked,
            nodeId
          );
          selectNodes(nodeIds);
        } else if (event.ctrlKey) {
          const newSelection = new Set(selection);
          if (newSelection.has(nodeId)) {
            newSelection.delete(nodeId);
          } else {
            newSelection.add(nodeId);
          }
          setLastClicked(nodeId);
          selectNodes([...newSelection]);
        } else {
          if (!selectionCoverSet.has(nodeId)) {
            setLastClicked(nodeId);
            selectNodes([nodeId]);
          }
        }
        setIsMouseDown(true);
      }
    },
    [
      selection,
      lastClicked,
      dispatchers,
      layerIndex,
      featureIndex,
      editingFeatureClipRegion,
      setIsMouseDown,
      selectNodes,
    ]
  );

  const onMouseUp = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (isMouseDown && treeHover != null && validReparent) {
        dispatchers.model.reparentNodes({
          nodeIds: selection,
          target: treeHover,
        });
      }
      setTreeHover(null);
      setIsMouseDown(false);
      dispatchers.grid.setMouseMode(Grid.Types.MouseMode.None);
    },
    [selection, dispatchers, setIsMouseDown, treeHover, setTreeHover]
  );

  const onNodeExpand = React.useCallback(
    (node: LayerNode) => {
      expandNodes([`${node.id}`]);
    },
    [expandNodes]
  );
  const onNodeCollapse = React.useCallback(
    (node: LayerNode) => {
      dispatchers.layerTree.collapseNode(`${node.id}`);
    },
    [dispatchers]
  );

  const updateTreeHover = React.useCallback(
    (nodeId: string | number | null, e: React.MouseEvent<HTMLElement>) => {
      if (treeRef.current == null || nodeId == null) {
        return;
      }
      const isLayer = layerIndex.byId[nodeId] != null;
      const element = treeRef.current.getNodeContentElement(nodeId);
      if (element == null) {
        return;
      }
      const totalHeight = element.clientHeight;
      const mouseYAlongElement = e.pageY - element.getBoundingClientRect().top;
      const mouseRatio = mouseYAlongElement / totalHeight;
      if (isLayer) {
        const section: ReparentSection =
          mouseRatio < 0.33 ? "top" : mouseRatio > 0.67 ? "bottom" : "mid";
        setTreeHover({ nodeId: `${nodeId}`, section });
      } else {
        const section: ReparentSection = mouseRatio < 0.5 ? "top" : "bottom";
        setTreeHover({ nodeId: `${nodeId}`, section });
      }
    },
    [setTreeHover, treeRef, layerIndex]
  );
  const onMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const nodeId = getTreeMouseDownTarget("layer-tree-node", e);
      if (nodeId == null) {
        return;
      }
      updateTreeHover(nodeId, e);
      if (
        isMouseDown &&
        mouseMode !== Grid.Types.MouseMode.DragSelectionInTree
      ) {
        dispatchers.grid.setMouseMode(Grid.Types.MouseMode.DragSelectionInTree);
      }
    },
    [updateTreeHover, mouseMode, isMouseDown]
  );
  const onNodeMouseEnter = React.useCallback(
    (node: LayerNode, _: number[], e: React.MouseEvent<HTMLElement>) => {
      updateTreeHover(node.id, e);
    },
    [updateTreeHover]
  );
  const onNodeMouseLeave = React.useCallback(() => {
    setTreeHover(null);
  }, [setTreeHover]);

  const nodes: LayerNode[] = React.useMemo(() => {
    const context: NodeContext = {
      layerTree,
      layerIndex,
      featureIndex,
      mouseMode,
      treeHover,
      validReparent,
      selectionCoverSet,
    };
    const rootNode = getTreeNode(context, Model.RootLayerId);
    return rootNode.childNodes ?? [];
  }, [
    layerTree,
    layerIndex,
    featureIndex,
    mouseMode,
    treeHover,
    selection,
    validReparent,
    selectionCoverSet,
  ]);

  const treeClasses = classNames("layer-tree", Classes.DARK, {
    reparenting:
      mouseMode === Grid.Types.MouseMode.DragSelectionInTree &&
      treeHover !== null,
  });

  return (
    <div className="layer-tree-container">
      <div
        className="layer-tree-mask"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        <Tree<void>
          ref={treeRef}
          className={treeClasses}
          contents={nodes}
          onNodeCollapse={onNodeCollapse}
          onNodeExpand={onNodeExpand}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseLeave={onNodeMouseLeave}
        />
      </div>
      <NewFolderButton />
    </div>
  );
}
