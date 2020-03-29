import * as React from 'react';
import { Transform } from '../../../math/Vector';
import './Gridlines.scss';

interface Props {
    width: number;
    height: number;
    transform: Transform;
}

export class Gridlines extends React.Component<Props, {}> {
    public render() {
        return (
            <g fill="transparent" stroke="#394B59" opacity={0.5}>
                {this.renderLines(1 / this.props.transform.scale)}
            </g>
        );
    }

    private renderLines(strokeWidth: number) {
        const topLeft = this.props.transform.apply(0, 0);
        const bottomRight = this.props.transform.apply(this.props.width, this.props.height);

        const lines = [];

        for(let i = Math.floor(topLeft.x); i <= bottomRight.x; i++) {
            let classNames = "";
            let s = strokeWidth;
            if (i == 0) {
                s *= 2;
                classNames = "axis-gridline";
            }
            lines.push(<path className={classNames} d={`M${i} ${bottomRight.y} v ${topLeft.y - bottomRight.y}`} key={`vertical-${i}`} strokeWidth={s}/>);
        }

        for(let i = Math.floor(topLeft.y); i <= bottomRight.y; i++) {
            let classNames = "";
            let s = strokeWidth;
            if (i == 0) {
                s *= 2;
                classNames = "axis-gridline";
            }
            lines.push(<path className={classNames} d={`M${bottomRight.x} ${i} h ${topLeft.x - bottomRight.x}`} key={`horizontal-${i}`} strokeWidth={s}/>);
        }

        return lines;
    }
}