import * as React from 'react';
import { Grid } from './grid/Grid';
import { Transform, Vector } from '../../math/transform';
import { ROOT_LAYER } from '../../redux/model/types';

interface Props {
    width: number;
    height: number;
}

export enum MouseMode {
    NONE,
    DRAG,
}

interface State {
    transform: Transform;
    mouseMode: MouseMode;
    mousePosition?: Vector;
    selectedLayer: string;
}

const INITIAL_SCALE = 50;
const ZOOM_CONSTANT = 1.1;
const MAX_SCALE = 400;
const MIN_SCALE = 2;

export class SvgRoot extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            mouseMode: MouseMode.NONE,
            transform: new Transform(new Vector(props.width / (2 * INITIAL_SCALE), props.height / (2 * INITIAL_SCALE)), INITIAL_SCALE),
            selectedLayer: ROOT_LAYER,
        };
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
                <g transform={this.state.transform.toSvg()}>
                    <Grid transform={this.state.transform} width={this.props.width} height={this.props.height}/>
                </g>
            </svg>
        );
    }

    private onMouseDown = (e: React.MouseEvent<SVGElement>) => {
        this.setState({
            mouseMode: MouseMode.DRAG,
            mousePosition: new Vector(e.nativeEvent.offsetX, e.nativeEvent.offsetY),
        });
    }
    
    private onMouseMove = (e: React.MouseEvent<SVGElement>) => {
        const newMousePosition = new Vector(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        if (this.state.mouseMode == MouseMode.DRAG && this.state.mousePosition) {
            const newTranslation = newMousePosition
                .subtract(this.state.mousePosition)
                .scalarMultiply(1 / this.state.transform.scale)
                .add(this.state.transform.translation);
            this.setState({
                transform: this.state.transform.setTranslation(newTranslation),
                mousePosition: new Vector(e.nativeEvent.offsetX, e.nativeEvent.offsetY),
            });
        }
    }
    
    private onMouseUp = (e: React.MouseEvent<SVGElement>) => {
        if (this.state.mouseMode == MouseMode.DRAG) {
            this.setState({
                mouseMode: MouseMode.NONE,
            });
        }
    }

    private onWheel = (e: React.WheelEvent<SVGElement>) => {
        if ((this.state.transform.scale === MIN_SCALE && e.nativeEvent.deltaY > 0) ||
            (this.state.transform.scale === MAX_SCALE && e.nativeEvent.deltaY < 0)) {
            return;
        }
        const mousePosition = new Vector(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        let newScale = this.state.transform.scale * Math.pow(ZOOM_CONSTANT, -Math.sign(e.nativeEvent.deltaY));
        if (newScale > MAX_SCALE) {
            newScale = MAX_SCALE;
        } else if (newScale < MIN_SCALE) {
            newScale = MIN_SCALE;
        }
        const newTranslation = this.state.transform.translation
            .subtract(mousePosition.scalarMultiply(1 / this.state.transform.scale))
            .add(mousePosition.scalarMultiply(1 / newScale));
        this.setState({
            transform: this.state.transform.setTranslation(newTranslation).setScale(newScale),
        });
    }
    
    private onSelectLayer = (layerId: string) => {
        this.setState({
            selectedLayer: layerId,
        });
    }
}