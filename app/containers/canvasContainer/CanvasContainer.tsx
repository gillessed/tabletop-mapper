import * as React from 'react';
import './CanvasContainer.scss'; 
import { SvgRoot } from '../svg/SvgRoot';

interface State {
    dimensions?: {
        width: number;
        height: number;
    }
}

export class CanvasContainer extends React.Component<{}, State> {
    private containerDiv: HTMLDivElement;

    constructor(props: {}) {
        super(props);
        this.state = {}
    }

    public render() {
        return (
            <div className='canvas-container' ref={this.setContainerRef}>
                {this.renderCanvasElement()}
            </div>
        );
    }

    public componentDidMount() {
        window.addEventListener('resize', this.windowResizeListener);
    }

    private renderCanvasElement = () => {
        if (this.state.dimensions && this.containerDiv) {
            const { width, height } = this.state.dimensions;
            return (
                <SvgRoot width={width} height={height} />
            );
        }
    }

    private setContainerRef = (ref: HTMLDivElement) => {
        if (!this.containerDiv) {
            this.containerDiv = ref;
            this.setState({
                dimensions: {
                    width: ref.clientWidth,
                    height: ref.clientHeight,
                },
            });
        }
    }

    private windowResizeListener = () => {
        this.setState({
            dimensions: {
                width: this.containerDiv.clientWidth,
                height: this.containerDiv.clientHeight,
            },
        });
    }
}