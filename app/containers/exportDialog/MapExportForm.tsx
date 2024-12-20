import { Button, Classes, Intent, NumericInput } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import classNames from "classnames";
import React from "react";
import { Filer } from "../../../filer/filer";
import { getIpc } from "../../ipc/ipc";
import "./MapExportForm.scss";
import { exportSvgToImage } from "./exportSvgToImage";

type ExportState = "none" | "exporting" | "complete" | "error";

export const MapExportForm = React.memo(function GridSettingsForm() {
  const [imageWidth, setImageWidth] = React.useState(2048);
  const [exportPath, setExportPath] = React.useState("");
  const [exportState, setExportState] = React.useState<ExportState>("none");

  const handleSetExportPath = React.useCallback(() => {
    async function handler() {
      const result = await getIpc().showSaveDialog({
        title: "Set export path",
        defaultPath: exportPath,
      });
      if (!result.canceled) {
        const path = result.filePath;
        const pathWithExtension = path.endsWith(".png") ? path : path + ".png";
        setExportState("none");
        setExportPath(pathWithExtension);
      }
    }
    handler();
  }, [setExportPath, setExportState]);

  const handleExport = React.useCallback(() => {
    async function handler() {
      try {
        setExportState("exporting");
        const pngImage = await exportSvgToImage(imageWidth);
        const pngData = pngImage.replace(/^data:image\/\w+;base64,/, "");
        getIpc().fsWriteFile({
          path: exportPath,
          data: pngData,
          options: {
            encoding: "base64",
          },
        });
        setExportState("complete");
      } catch (error) {
        setExportState("error");
      }
    }
    handler();
  }, [exportPath, imageWidth]);

  const handleOpenFile = React.useCallback(() => {
    const containingFolder = Filer.open(exportPath).getParent();
    if (containingFolder != null) {
      getIpc().exec(`start ${containingFolder.fullPath}`);
    }
  }, [exportPath]);

  return (
    <div className={classNames("map-export-form", Classes.DARK)}>
      <div className="image-width">
        <NumericInput
          min={16}
          max={4096}
          value={imageWidth}
          onValueChange={setImageWidth}
        />
        <span>px</span>
      </div>
      <div className="export-path">
        <Button
          icon={IconNames.FOLDER_OPEN}
          intent={Intent.PRIMARY}
          onClick={handleSetExportPath}
        />
        <span>{exportPath}</span>
        {exportPath === "" && (
          <span className="placeholder">Set export path...</span>
        )}
      </div>
      <Button
        icon={IconNames.EXPORT}
        intent={exportState === "error" ? Intent.DANGER : Intent.SUCCESS}
        text="Export"
        disabled={exportPath === ""}
        onClick={handleExport}
        loading={exportState === "exporting"}
      />
      {exportState === "complete" && (
        <Button
          icon={IconNames.DOCUMENT_OPEN}
          intent={Intent.PRIMARY}
          text="Show in file system"
          onClick={handleOpenFile}
        />
      )}
    </div>
  );
});
