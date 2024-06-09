import {
  Button,
  ControlGroup,
  InputGroup,
  Intent,
  Tooltip,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import * as React from "react";
import { useDispatchers } from "../../DispatcherContextProvider";
import { AssetPackGrid } from "./assetPackGrid/AssetPackGrid";
import "./AssetSearch.scss";
import { getIpc } from "../../ipc/ipc";
import { ImageTypes } from "../../../filer/fileExtension";

export const NoPack = "No Pack";

export function AssetSearch() {
  const dispatchers = useDispatchers();
  const [filter, setFilter] = React.useState<string>("");
  const onChangeAssetFilter = React.useCallback(
    (e: React.FormEvent) => {
      setFilter((e.target as HTMLInputElement).value);
    },
    [setFilter]
  );
  const onImport = React.useCallback(() => {
    getIpc()
      .showOpenDialog({
        message: "Import assets",
        buttonLabel: "Import",
        filters: [{ name: "Images", extensions: ImageTypes }],
        properties: ["openDirectory", "openFile", "multiSelections"],
      })
      .then((result) => {
        if (!result.canceled && result.filePaths.length > 0) {
          dispatchers.assets.importAssets(result.filePaths);
        }
      });
  }, [dispatchers]);
  return (
    <>
      <div className="title asset-search-title">Assets</div>
      <ControlGroup className="asset-control-group" fill>
        <InputGroup
          value={filter}
          placeholder="Search assets packs..."
          leftIcon={IconNames.SEARCH}
          onChange={onChangeAssetFilter}
          fill
        />
        <Tooltip
          content="Tabletop Mapper will import all image files within the selected folder."
          hoverOpenDelay={1000}
        >
          <Button
            text="Import"
            icon={IconNames.CUBE_ADD}
            intent={Intent.PRIMARY}
            onClick={onImport}
          />
        </Tooltip>
      </ControlGroup>
      <AssetPackGrid filter={filter} />
    </>
  );
}
