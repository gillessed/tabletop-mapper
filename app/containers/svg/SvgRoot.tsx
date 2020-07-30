import * as React from 'react';
import { connect } from 'react-redux';
import { AppContext, withAppContext } from '../../AppContextProvider';
import { Transform, Vector } from '../../math/Vector';
import { Dispatchers } from '../../redux/Dispatchers';
import { Grid } from '../../redux/grid/GridTypes';
import { Model } from '../../redux/model/ModelTypes';
import { ReduxState } from '../../redux/AppReducer';
import { Gridlines } from './grid/Gridlines';

type MouseMode = Grid.Types.MouseMode;
const MouseMode = Grid.Types.MouseMode;

interface StateProps {
  appContext: AppContext;
  model: Model.Types.State;
  transform: Transform;
  mouseMode: MouseMode;
  mousePosition?: Vector;
}

interface OwnProps {
  width: number;
  height: number;
}

type Props = StateProps & OwnProps;

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
    this.dispatchers.grid.updateGridState({
      mouseMode: MouseMode.NONE,
      transform: new Transform(new Vector(this.props.width / (2 * INITIAL_SCALE), this.props.height / (2 * INITIAL_SCALE)), INITIAL_SCALE),
    });
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
          <Gridlines transform={this.props.transform} width={this.props.width} height={this.props.height} />
        </g>
      </svg>
    );
  }

  private onMouseDown = (e: React.MouseEvent<SVGElement>) => {
    this.dispatchers.grid.updateGridState({
      mousePosition: new Vector(e.nativeEvent.offsetX, e.nativeEvent.offsetY),
      mouseMode: MouseMode.DRAG,
    });
  }

  private onMouseMove = (e: React.MouseEvent<SVGElement>) => {
    const newMousePosition = new Vector(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    if (this.props.mouseMode == MouseMode.DRAG && this.props.mousePosition) {
      const newTranslation = newMousePosition
        .subtract(this.props.mousePosition)
        .scalarMultiply(1 / this.props.transform.scale)
        .add(this.props.transform.translation);
      this.dispatchers.grid.updateGridState({
        mousePosition: new Vector(e.nativeEvent.offsetX, e.nativeEvent.offsetY),
        transform: this.props.transform.setTranslation(newTranslation),
      });
    }
  }

  private onMouseUp = (e: React.MouseEvent<SVGElement>) => {
    if (this.props.mouseMode == MouseMode.DRAG) {
      this.dispatchers.grid.updateGridState({
        mouseMode: MouseMode.NONE,
      });
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
    this.dispatchers.grid.updateGridState({
      transform: this.props.transform.setTranslation(newTranslation).setScale(newScale),
    });
  }
}

const mapStateToProps = (state: ReduxState) => {
  return {
    model: Model.Selectors.get(state),
    transform: state.grid.transform,
    mouseMode: state.grid.mouseMode,
    mousePosition: state.grid.mousePosition,
  };
};

export const SvgRoot = connect(mapStateToProps)(withAppContext(SvgRootComponent));
