import * as React from 'react';
import { Grid } from './grid/Grid';
import { Transform, Vector } from '../../math/transform';
import { ROOT_LAYER, ModelState, MouseMode } from '../../redux/model/types';
import { ReduxState } from '../../redux/rootReducer';
import { connect } from 'react-redux';
import { AppContext } from '../../redux/appContext';
import { Dispatchers } from '../../redux/dispatchers';
import { DispatchersContextType } from '../../dispatcherProvider';

interface StateProps {
    model: ModelState;
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
    public static contextTypes = DispatchersContextType;
    private dispatchers: Dispatchers;

    constructor(props: Props, context: AppContext) {
        super(props);
        this.dispatchers = context.dispatchers;
    }

    public componentWillMount() {
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
                    <Grid transform={this.props.transform} width={this.props.width} height={this.props.height}/>
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

const mapStateToProps = (redux: ReduxState) => {
    return {
        model: redux.model,
        transform: redux.model.grid.transform,
        mouseMode: redux.model.grid.mouseMode,
        mousePosition: redux.model.grid.mousePosition,
    };
};

export const SvgRoot = connect<StateProps, {}, OwnProps>(mapStateToProps)(SvgRootComponent as any);
