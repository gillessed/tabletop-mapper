import { ResizeEntry, ResizeSensor } from "@blueprintjs/core";
import * as React from "react";
import { FeatureToolbar } from "../featureToolbar/FeatureToolbar";
import { SvgRoot } from "../svg/SvgRoot";
import "./CanvasContainer.scss";

export type Dimensions = { width: number; height: number } | undefined;

export const CanvasContainer = function CanvasContainer() {
  const [dimensions, setDimensions] = React.useState<Dimensions>();

  let canvasElement: React.ReactNode | undefined = undefined;
  if (dimensions != undefined) {
    canvasElement = (
      <SvgRoot width={dimensions.width} height={dimensions.height} />
    );
  }

  const handleResize = React.useCallback(
    (entries: ResizeEntry[]) => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    },
    [setDimensions]
  );

  return (
    <ResizeSensor onResize={handleResize}>
      <div className="canvas-container">
        {canvasElement}
        <FeatureToolbar />
      </div>
    </ResizeSensor>
  );
};
