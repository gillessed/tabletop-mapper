import * as React from 'react';
import { connect } from 'react-redux';
import { AppContext, withAppContext } from '../../AppContextProvider';
import { Transform, Vector } from '../../math/Vector';
import { ReduxState } from '../../redux/AppReducer';
import { Dispatchers } from '../../redux/Dispatchers';
import { Grid } from '../../redux/grid/GridTypes';
import { LayerTree } from '../../redux/layertree/LayerTreeTypes';
import { Model } from '../../redux/model/ModelTypes';
import { addCoordinateToPartialGeometry } from '../../redux/model/PartialGeometry';
import { treeWalk } from '../../redux/model/TreeWalk';
import { generateRandomString } from '../../utils/randomId';
import { SvgRectangleFeature } from './features/SvgRectangleFeature';
import { Gridlines } from './grid/Gridlines';

type MouseMode = Grid.Types.MouseMode;
const MouseMode = Grid.Types.MouseMode;

type StoreProps = ReturnType<typeof mapStateToProps>;

interface OwnProps {
  appContext: AppContext;
  width: number;
  height: number;
}

type Props = StoreProps & OwnProps;

const INITIAL_SCALE = 50;
const ZOOM_CONSTANT = 1.1;
const MAX_SCALE = 400;
const MIN_SCALE = 2;

class SvgRootComponent extends React.Component<Props, {}> {
  private dispatchers: Dispatchers;

  constructor(props: Props) {
    super(props);
    this.dispatchers = props.appContext.dispatchers;
  }

  public UNSAFE_componentWillMount() {
    this.dispatchers.grid.setMouseMode(MouseMode.None);
    this.dispatchers.grid.setTransform(new Transform(new Vector(this.props.width / (2 * INITIAL_SCALE), this.props.height / (2 * INITIAL_SCALE)), INITIAL_SCALE));
  }

  public render() {
    return (
      <svg
        className='app-canvas'
        width={this.props.width}
        height={this.props.height}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseMove={this.onMouseMove}
        onWheel={this.onWheel}
      >
        <rect x={0} y={0} width={this.props.width} height={this.props.height} fill='#E1E8ED' />
        <g transform={this.props.transform.toSvg()}>
          {this.renderFeatures()}
          <Gridlines transform={this.props.transform} width={this.props.width} height={this.props.height} />
        </g>
      </svg>
    );
  }

  private renderFeatures() {
    const features: React.ReactNode[] = [];
    treeWalk(this.props.model, (feature) => {
      features.push(this.renderFeature(feature));
    });
    return features;
  }

  private renderFeature = (feature: Model.Types.Feature) => {
    switch(feature.geometry.type) {
      case 'rectangle':
        return <SvgRectangleFeature key={feature.id} feature={feature as Model.Types.Feature<Model.Types.Rectangle>} />;
    }
    return null;
  }

  private onMouseDown = (e: React.MouseEvent<SVGElement>) => {
    const { mouseMode, partialGeometry, mousePosition, transform, currentLayer } = this.props;
    this.dispatchers.grid.setMousePosition(new Vector(e.nativeEvent.offsetX, e.nativeEvent.offsetY));
    switch (mouseMode) {
      case MouseMode.None:
        this.dispatchers.grid.setMouseMode(MouseMode.Drag);
        break;
      case MouseMode.DrawPoint:
      case MouseMode.DrawRectangle:
        const coordinate = transform.applyV(mousePosition).getCoordinate();
        const rounded = transform.applyV(mousePosition).round().getCoordinate();
        const { complete, geometry } = addCoordinateToPartialGeometry(partialGeometry, partialGeometry.snapToGrid ? rounded : coordinate);
        if (complete) {
          this.dispatchers.grid.setMouseMode(MouseMode.None);
          const featureId = generateRandomString();
          this.dispatchers.model.createFeature({
            id: featureId,
            name: 'New ' + Model.Types.Geometries[geometry.type].name,
            layerId: currentLayer,
            geometry: geometry as Model.Types.Geometry,
          });
          this.dispatchers.layerTree.expandNode(currentLayer);
          this.dispatchers.layerTree.selectNode(featureId);
        } else {
          this.dispatchers.grid.updatePartialGeometry(geometry);
        }
        break;
    }
  }

  private onMouseMove = (e: React.MouseEvent<SVGElement>) => {
    const { mousePosition, mouseMode, transform } = this.props;
    const newMousePosition = new Vector(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    if (mouseMode !== MouseMode.None) {
      this.dispatchers.grid.setMousePosition(new Vector(e.nativeEvent.offsetX, e.nativeEvent.offsetY));
    }
    if (this.props.mouseMode == MouseMode.Drag && mousePosition) {
      const newTranslation = newMousePosition
        .subtract(mousePosition)
        .scalarMultiply(1 / transform.scale)
        .add(transform.translation);
      this.dispatchers.grid.setTransform(transform.setTranslation(newTranslation));
    }
  }

  private onMouseUp = (e: React.MouseEvent<SVGElement>) => {
    if (this.props.mouseMode === MouseMode.Drag) {
      this.dispatchers.grid.setMouseMode(MouseMode.None);
    }
  }

  private onWheel = (e: React.WheelEvent<SVGElement>) => {
    if ((this.props.transform.scale === MIN_SCALE && e.nativeEvent.deltaY > 0) ||
      (this.props.transform.scale === MAX_SCALE && e.nativeEvent.deltaY < 0)) {
      return;
    }
    const mousePosition = new Vector(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    let newScale = this.props.transform.scale * Math.pow(ZOOM_CONSTANT, -Math.sign(e.nativeEvent.deltaY));
    if (newScale > MAX_SCALE) {
      newScale = MAX_SCALE;
    } else if (newScale < MIN_SCALE) {
      newScale = MIN_SCALE;
    }
    const newTranslation = this.props.transform.translation
      .subtract(mousePosition.scalarMultiply(1 / this.props.transform.scale))
      .add(mousePosition.scalarMultiply(1 / newScale));
    this.dispatchers.grid.setTransform(this.props.transform.setTranslation(newTranslation).setScale(newScale));
  }
}

const mapStateToProps = (state: ReduxState) => {
  const grid = Grid.Selectors.get(state);
  return {
    model: Model.Selectors.get(state),
    transform: grid.transform,
    mouseMode: grid.mouseMode,
    mousePosition: grid.mousePosition,
    partialGeometry: grid.partialGeometry,
    currentLayer: LayerTree.Selectors.getCurrentLayer(state),
  };
};

export const SvgRoot = connect(mapStateToProps)(withAppContext(SvgRootComponent));
