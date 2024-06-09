import classNames from "classnames";
import React from "react";
import { useSelector } from "react-redux";
import { useDispatchers } from "../../DispatcherContextProvider";
import { boundRectangleWithin } from "../../math/BoundRectangle";
import { geometryEquals } from "../../math/CompareGeometry";
import { expandRectangle } from "../../math/ExpandGeometry";
import { rectifyRectangle } from "../../math/RectifyGeometry";
import { Coordinate, Transform, Vector } from "../../math/Vector";
import { Asset } from "../../redux/asset/AssetTypes";
import { Grid } from "../../redux/grid/GridTypes";
import { LayerTree } from "../../redux/layertree/LayerTreeTypes";
import { selectAndExpandNodesWorker } from "../../redux/layertree/LayerTreeWorkers";
import {
  getControlPoints,
  getHoveredControlPoint,
  getRectangleControlPoints,
} from "../../redux/model/ControlPoints";
import {
  doesGeometryContain,
  getHoveredFeatures,
} from "../../redux/model/FeatureIntersection";
import {
  getFeatureTranslation,
  translateRectangle,
} from "../../redux/model/FeatureTranslation";
import { getHighestFeatureId } from "../../redux/model/ModelTree";
import { Model } from "../../redux/model/ModelTypes";
import {
  getBoundingBox,
  getGeometryForBasicAssetFeature,
} from "../../redux/model/ModelUtils";
import { addCoordinateToPartialGeometry } from "../../redux/model/PartialGeometry";
import { resizeRectangle } from "../../redux/model/Resize";
import { useWorker } from "../../redux/utils/workers";
import { MouseButtons } from "../../utils/mouse";
import { generateRandomString } from "../../utils/randomId";
import { ControlPointsOverlay } from "./features/ControlPointsOverlay";
import { FeatureOutlines } from "./features/FeatureOutlines";
import { Features } from "./features/Features";
import { ClipRegionOverlay } from "./features/overlay/ClipRegionOverlay";
import { FeaturePartialGeometries } from "./features/partials/FeaturePartialGeometries";
import { AssetDropShadow } from "./features/shadows/AssetDropShadow";
import { FeatureDragShadows } from "./features/shadows/FeatureDragShadows";
import { FeatureResizeShadows } from "./features/shadows/FeatureResizeShadows";
import { GridLines } from "./grid/GridLines";
import "./SvgRoot.scss";

type MouseMode = Grid.Types.MouseMode;
const MouseMode = Grid.Types.MouseMode;

export namespace SvgRoot {
  export interface Props {
    width: number;
    height: number;
  }
}

const InitialScale = 50;
const ZoomConstant = 1.05;
const MaxScale = 400;
const MinScale = 2;

export const SvgRoot = React.memo(function SvgRoot({
  width,
  height,
}: SvgRoot.Props) {
  const dispatchers = useDispatchers();
  const mouseMode = useSelector(Grid.Selectors.getMouseMode);
  const mousePosition = useSelector(Grid.Selectors.getMousePosition);
  const partialGeometry = useSelector(Grid.Selectors.getPartialGeometry);
  const transformSet = useSelector(Grid.Selectors.getTransformSet);
  const transform = useSelector(Grid.Selectors.getTransform);
  const currentLayer = useSelector(LayerTree.Selectors.getCurrentLayer);
  const features = useSelector(Model.Selectors.getFeatures);
  const layers = useSelector(Model.Selectors.getLayers);
  const { backgroundColor } = useSelector(Model.Selectors.getSettings);
  const selectedFeatureIds = useSelector(
    LayerTree.Selectors.getSelectedFeatureIds
  );
  const mouseDragOrigin = useSelector(Grid.Selectors.getMouseDragOrigin);
  const assetDropId = useSelector(Grid.Selectors.getAssetDropId);
  const editingFeatureClipRegion = useSelector(
    Grid.Selectors.getEditingFeatureClipRegion
  );
  const clipRegionResizeInfo = useSelector(
    Grid.Selectors.getClipRegionResizeInfo
  );
  const draggingAsset = useSelector(
    Asset.Selectors.getAssetById(assetDropId ?? "")
  );
  const resizeInfo = useSelector(Grid.Selectors.getResizeInfo);
  const resizedFeature = useSelector(Grid.Selectors.getResizedFeature);
  const featureToResize = useSelector(
    Model.Selectors.getFeatureById(resizeInfo?.featureId ?? "")
  );
  const selectAndExpandNodes = useWorker(selectAndExpandNodesWorker);

  React.useEffect(() => {
    if (transformSet) {
      return;
    }
    let transformVector = new Vector(
      width / (2 * InitialScale),
      height / (2 * InitialScale)
    );
    let transformScale = InitialScale;
    if (features.all.length > 0) {
      const geometries: Model.Types.Geometry[] = [];
      for (const featureId of features.all) {
        const feature = features.byId[featureId];
        geometries.push(feature.geometry);
      }
      const boundingBox: Model.Types.Rectangle = getBoundingBox(geometries);
      const expanded = expandRectangle(boundingBox, 2);
      const bboxWidth = expanded.p2.x - expanded.p1.x;
      const bboxHeight = expanded.p2.y - expanded.p1.y;
      const midx = expanded.p1.x + bboxWidth / 2;
      const midy = expanded.p1.y + bboxHeight / 2;
      const boundingOffset = new Vector(-midx, -midy);

      const xAspect = width / bboxWidth;
      const yAspect = height / bboxHeight;
      const minAspect = Math.min(xAspect, yAspect);
      transformScale = minAspect;
      transformVector = new Vector(
        width / (2 * transformScale),
        height / (2 * transformScale)
      ).add(boundingOffset);
    }
    dispatchers.grid.setTransform(
      new Transform(transformVector, transformScale)
    );
  }, [transformSet]);

  const createNewFeature = React.useCallback(
    (feature: Model.Types.Feature) => {
      dispatchers.grid.setMouseMode(MouseMode.None);
      dispatchers.model.createFeature(feature);
      selectAndExpandNodes([feature.id]);
      dispatchers.grid.updatePartialGeometry(undefined);
    },
    [dispatchers]
  );

  const onLeftMouseDownModeNone = React.useCallback(
    (
      e: React.MouseEvent<SVGElement>,
      newMousePosition: Vector,
      coordinate: Coordinate
    ) => {
      const selectedFeatures = selectedFeatureIds.map(
        (featureId) => features.byId[featureId]
      );
      const controlPoints = getControlPoints(transform, selectedFeatures);
      const hoveredControlPoint = getHoveredControlPoint(
        controlPoints,
        coordinate
      );
      if (hoveredControlPoint) {
        if (hoveredControlPoint.type === "rectangle") {
          const resizeInfo: Grid.Types.ResizeInfo = {
            featureId: hoveredControlPoint.featureId,
            rectMode: hoveredControlPoint.mode,
            cursor: hoveredControlPoint.cursor,
          };
          dispatchers.grid.startResizeFeature({
            info: resizeInfo,
            geometryType: "rectangle",
          });
        } else {
          const resizeInfo: Grid.Types.ResizeInfo = {
            featureId: hoveredControlPoint.featureId,
            pathIndex: hoveredControlPoint.index,
            cursor: hoveredControlPoint.cursor,
          };
          dispatchers.grid.startResizeFeature({
            info: resizeInfo,
            geometryType: "path",
          });
        }
        return;
      }
      const hoveredFeatureIds: string[] = getHoveredFeatures(
        features,
        coordinate,
        transform
      );
      const hoveringSelectedFeature = selectedFeatureIds.find(
        (id) => hoveredFeatureIds.indexOf(id) >= 0
      );
      if (!hoveringSelectedFeature) {
        if (hoveredFeatureIds.length >= 1) {
          const highestFeatureId = getHighestFeatureId(
            features,
            layers,
            hoveredFeatureIds
          );
          if (e.shiftKey && selectedFeatureIds.indexOf(highestFeatureId) < 0) {
            const newSelection = [...selectedFeatureIds, highestFeatureId];
            selectAndExpandNodes(newSelection);
          } else {
            selectAndExpandNodes([highestFeatureId]);
          }
          dispatchers.grid.setMouseMode(MouseMode.TransformFeatures);
        } else {
          dispatchers.layerTree.clearSelectedNodes();
        }
      } else {
        dispatchers.grid.setMouseMode(MouseMode.TransformFeatures);
      }

      // TODO: box select should go here

      dispatchers.grid.setMouseDragOrigin(newMousePosition);
    },
    [dispatchers, features, transform, selectedFeatureIds, selectAndExpandNodes]
  );

  const clipRegionFeature = React.useMemo(() => {
    if (editingFeatureClipRegion == null) {
      return null;
    }
    const feature = features.byId[editingFeatureClipRegion];
    if (feature != null && feature.type === "basic-asset") {
      return feature;
    } else {
      return null;
    }
  }, [editingFeatureClipRegion, features]);
  const onLeftMouseDownClipRegionEdit = React.useCallback(
    (
      e: React.MouseEvent<SVGElement>,
      newMousePosition: Vector,
      coordinate: Coordinate
    ) => {
      if (
        clipRegionFeature == null ||
        clipRegionFeature.type !== "basic-asset"
      ) {
        return;
      }
      const { clipRegion, geometry } = clipRegionFeature;
      if (clipRegion == null || geometry.type != "rectangle") {
        return;
      }
      const rectified = rectifyRectangle(geometry);
      const renderedClipRegion = translateRectangle(
        { x: rectified.p1.x, y: rectified.p1.y },
        clipRegion
      );
      const controlPoints = getRectangleControlPoints(
        transform,
        clipRegionFeature.id,
        renderedClipRegion
      );
      const hoveredControlPoint = getHoveredControlPoint(
        controlPoints,
        coordinate
      );
      if (hoveredControlPoint != null && editingFeatureClipRegion != null) {
        if (hoveredControlPoint.type !== "rectangle") {
          return;
        }
        dispatchers.grid.setMouseMode(MouseMode.ResizeClipRegion);
        dispatchers.grid.startResizeClipRegion({
          featureId: editingFeatureClipRegion,
          cursor: hoveredControlPoint.cursor,
          rectMode: hoveredControlPoint.mode,
        });
        dispatchers.grid.setMouseDragOrigin(newMousePosition);
        return;
      }

      const hoveringClipRegion = doesGeometryContain(
        renderedClipRegion,
        coordinate
      );
      if (hoveringClipRegion) {
        dispatchers.grid.setMouseMode(MouseMode.DragClipRegion);
        dispatchers.grid.setMouseDragOrigin(newMousePosition);
      }
    },
    [clipRegionFeature, transform]
  );

  const onLeftMouseDown = React.useCallback(
    (e: React.MouseEvent<SVGElement>) => {
      const newMousePosition = new Vector(
        e.nativeEvent.offsetX,
        e.nativeEvent.offsetY
      );
      const coordinate = transform.applyV(newMousePosition).getCoordinate();
      switch (mouseMode) {
        case MouseMode.None:
          if (editingFeatureClipRegion != null) {
            onLeftMouseDownClipRegionEdit(e, newMousePosition, coordinate);
          } else {
            onLeftMouseDownModeNone(e, newMousePosition, coordinate);
          }
          break;
        case MouseMode.DrawRectangle:
        case MouseMode.DrawPath:
          if (editingFeatureClipRegion != null || partialGeometry == null) {
            break;
          }
          const rounded = transform
            .applyV(newMousePosition)
            .round()
            .getCoordinate();
          const { complete, geometry } = addCoordinateToPartialGeometry(
            partialGeometry,
            partialGeometry.snapToGrid ? rounded : coordinate
          );
          if (complete) {
            const newFeature: Model.Types.PatternFeature = {
              id: generateRandomString(),
              type: "pattern",
              name: "New Pattern",
              layerId: currentLayer,
              geometry: geometry as Model.Types.Geometry,
              opacity: 1,
            };
            createNewFeature(newFeature);
          } else {
            dispatchers.grid.updatePartialGeometry(geometry);
          }
          break;
      }
    },
    [
      dispatchers,
      mouseMode,
      partialGeometry,
      mouseMode,
      transform,
      currentLayer,
      features,
      selectedFeatureIds,
      createNewFeature,
      onLeftMouseDownModeNone,
    ]
  );

  const onRightMouseDown = React.useCallback(
    (e: React.MouseEvent<SVGElement>) => {
      switch (mouseMode) {
        case MouseMode.None:
          dispatchers.grid.setMouseMode(MouseMode.Drag);
          break;
      }
    },
    [dispatchers]
  );

  const onMouseDown = React.useCallback(
    (e: React.MouseEvent<SVGElement>) => {
      const newMousePosition = new Vector(
        e.nativeEvent.offsetX,
        e.nativeEvent.offsetY
      );
      dispatchers.grid.setMousePosition(newMousePosition);
      if (e.button === MouseButtons.Left) {
        onLeftMouseDown(e);
      } else if (e.button === MouseButtons.Right) {
        onRightMouseDown(e);
      }
    },
    [dispatchers, onLeftMouseDown, onRightMouseDown]
  );

  const onMouseUp = React.useCallback(() => {
    switch (mouseMode) {
      case MouseMode.Drag:
        dispatchers.grid.setMouseMode(MouseMode.None);
        break;
      case MouseMode.TransformFeatures:
        if (mousePosition == null || mouseDragOrigin == null) {
          return;
        }
        const selectedFeatures = selectedFeatureIds.map(
          (id) => features.byId[id]
        );
        const translation = getFeatureTranslation(
          mousePosition,
          mouseDragOrigin,
          transform,
          selectedFeatures.map((feature) => feature.geometry)
        );
        dispatchers.grid.setMouseDragOrigin(undefined);
        dispatchers.grid.setMouseMode(MouseMode.None);
        if (translation.x !== 0 || translation.y !== 0) {
          dispatchers.model.translateFeatures({
            featureIds: selectedFeatureIds,
            translation,
          });
        }
        break;
      case MouseMode.DragAsset:
        if (
          draggingAsset != null &&
          assetDropId != null &&
          mousePosition != null
        ) {
          const geometry = getGeometryForBasicAssetFeature(
            draggingAsset,
            transform,
            mousePosition
          );
          const newAssetFeature: Model.Types.BasicAssetFeature = {
            id: generateRandomString(),
            type: "basic-asset",
            name: draggingAsset.name,
            layerId: currentLayer,
            geometry,
            assetId: assetDropId,
            objectCover: "contain",
            rotation: 0,
            mirrored: false,
            opacity: 1,
          };
          createNewFeature(newAssetFeature);
        }
        break;
      case MouseMode.ResizeRectangle:
        if (
          resizeInfo == null ||
          featureToResize == null ||
          featureToResize.type != "basic-asset" ||
          mousePosition == null
        ) {
          return;
        }
        const resizedGeometry = resizeRectangle(
          transform,
          featureToResize.geometry,
          resizeInfo,
          mousePosition
        );
        if (
          resizedGeometry != null &&
          !geometryEquals(featureToResize.geometry, resizedGeometry)
        ) {
          dispatchers.model.setFeatureGeometry({
            featureId: featureToResize.id,
            geometry: resizedGeometry,
          });
        }
        dispatchers.grid.stopResizeFeature();
        break;
      case MouseMode.ResizeClipRegion:
        const clipRegion = clipRegionFeature?.clipRegion;
        if (
          clipRegionFeature == null ||
          clipRegion == null ||
          clipRegionResizeInfo == null ||
          mousePosition == null
        ) {
          return;
        }
        const clipRegionTranslation = Vector.of(clipRegionFeature.geometry.p1);
        const renderedClipRegion = translateRectangle(
          clipRegionTranslation,
          clipRegion
        );
        const resizedClipRegion = resizeRectangle(
          transform,
          renderedClipRegion,
          clipRegionResizeInfo,
          mousePosition
        );
        if (resizedClipRegion == null) {
          return;
        }
        const boundedRect = boundRectangleWithin(
          resizedClipRegion,
          clipRegionFeature.geometry
        );
        const newClipRegion = translateRectangle(
          clipRegionTranslation.scalarMultiply(-1),
          boundedRect
        );
        dispatchers.model.setClipRegion({
          featureIds: [clipRegionFeature.id],
          value: newClipRegion,
        });
        dispatchers.grid.stopResizeClipRegion();
        break;
      case MouseMode.DragClipRegion:
        dispatchers.grid.setMouseMode(Grid.Types.MouseMode.None);
        break;
    }
  }, [
    dispatchers,
    mouseMode,
    features,
    mousePosition,
    mouseDragOrigin,
    transform,
    clipRegionFeature,
    clipRegionResizeInfo,
  ]);

  const onMouseMoveResizeFeature = React.useCallback(
    (mousePosition: Vector) => {
      if (resizeInfo == null || featureToResize.type != "basic-asset") {
        return;
      }
      const resizedGeometry = resizeRectangle(
        transform,
        featureToResize.geometry,
        resizeInfo,
        mousePosition
      );
      if (
        resizedGeometry == null ||
        geometryEquals(resizedFeature?.geometry, resizedGeometry)
      ) {
        return;
      }
      const newResizedFeature = {
        ...featureToResize,
        geometry: resizedGeometry,
      } as Model.Types.Feature;
      dispatchers.grid.setResizedFeature(newResizedFeature);
    },
    [resizeInfo, featureToResize, resizedFeature]
  );

  const onMouseMoveResizeClipRegion = React.useCallback(
    (mousePosition: Vector) => {
      if (clipRegionFeature == null) {
        return null;
      }
      const { clipRegion } = clipRegionFeature;
      if (clipRegionResizeInfo == null || clipRegion == null) {
        return;
      }
      const translation = Vector.of(clipRegionFeature.geometry.p1);
      const renderedClipRegion = translateRectangle(translation, clipRegion);
      const resizedGeometry = resizeRectangle(
        transform,
        renderedClipRegion,
        clipRegionResizeInfo,
        mousePosition
      ) as Model.Types.Rectangle;
      const resizedClipRegion =
        resizedGeometry != null
          ? translateRectangle(translation.scalarMultiply(-1), resizedGeometry)
          : undefined;
      if (
        resizedClipRegion == null ||
        geometryEquals(clipRegion, resizedClipRegion)
      ) {
        return;
      }
      dispatchers.grid.setResizedClipRegion(resizedClipRegion);
    },
    [clipRegionResizeInfo, clipRegionFeature]
  );

  const onMouseMove = React.useCallback(
    (e: React.MouseEvent<SVGElement>) => {
      const newMousePosition = new Vector(
        e.nativeEvent.offsetX,
        e.nativeEvent.offsetY
      );
      switch (mouseMode) {
        case MouseMode.Drag:
          if (mousePosition) {
            const newTranslation = newMousePosition
              .subtract(mousePosition)
              .scalarMultiply(1 / transform.scale)
              .add(transform.translation);
            dispatchers.grid.setTransform(
              transform.setTranslation(newTranslation)
            );
          }
          break;
        case MouseMode.ResizePath:
        case MouseMode.ResizeRectangle:
          onMouseMoveResizeFeature(newMousePosition);
          break;
        case MouseMode.ResizeClipRegion:
          onMouseMoveResizeClipRegion(newMousePosition);
          break;
      }
      dispatchers.grid.setMousePosition(
        new Vector(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
      );
    },
    [dispatchers, mousePosition, mouseMode, transform, onMouseMoveResizeFeature]
  );

  const onWheel = React.useCallback(
    (e: React.WheelEvent<SVGElement>) => {
      if (
        (transform.scale === MinScale && e.nativeEvent.deltaY > 0) ||
        (transform.scale === MaxScale && e.nativeEvent.deltaY < 0)
      ) {
        return;
      }
      const mousePosition = new Vector(
        e.nativeEvent.offsetX,
        e.nativeEvent.offsetY
      );
      let newScale =
        transform.scale *
        Math.pow(ZoomConstant, -Math.sign(e.nativeEvent.deltaY));
      if (newScale > MaxScale) {
        newScale = MaxScale;
      } else if (newScale < MinScale) {
        newScale = MinScale;
      }
      const newTranslation = transform.translation
        .subtract(mousePosition.scalarMultiply(1 / transform.scale))
        .add(mousePosition.scalarMultiply(1 / newScale));
      dispatchers.grid.setTransform(
        transform.setTranslation(newTranslation).setScale(newScale)
      );
    },
    [dispatchers, transform]
  );

  const onMouseEnter = React.useCallback(() => {
    dispatchers.grid.setMouseOnCanvas(true);
  }, [dispatchers]);

  const onMouseLeave = React.useCallback(() => {
    dispatchers.grid.setMouseOnCanvas(false);
    if (draggingAsset != null) {
      dispatchers.grid.stopDraggingAsset();
      dispatchers.grid.setMouseMode(MouseMode.None);
    }
    if (resizeInfo?.featureId != null) {
      dispatchers.grid.stopResizeFeature();
      dispatchers.grid.setMouseMode(MouseMode.None);
    }
    if (editingFeatureClipRegion != null) {
      dispatchers.grid.stopResizeClipRegion();
      dispatchers.grid.setMouseMode(MouseMode.None);
    }
  }, [dispatchers, resizeInfo, draggingAsset, editingFeatureClipRegion]);

  const transformString = React.useMemo(() => transform.toSvg(), [transform]);
  const canvasClasses = classNames(
    "app-canvas",
    resizeInfo?.cursor,
    clipRegionResizeInfo?.cursor,
    {
      "dragging-features": mouseMode === MouseMode.TransformFeatures,
      "dragging-asset": mouseMode === MouseMode.DragAsset,
      "dragging-clip-region": mouseMode === MouseMode.DragClipRegion,
    }
  );

  return (
    <svg
      className={canvasClasses}
      width={width}
      height={height}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onWheel={onWheel}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <rect x={0} y={0} width={width} height={height} fill={backgroundColor} />
      <g transform={transformString}>
        <Features />
        <GridLines transform={transform} width={width} height={height} />
        <FeaturePartialGeometries />
        <FeatureOutlines />
        <ControlPointsOverlay />
        <FeatureDragShadows />
        <FeatureResizeShadows />
        <AssetDropShadow />
        <ClipRegionOverlay width={width} height={height} />
      </g>
    </svg>
  );
});
