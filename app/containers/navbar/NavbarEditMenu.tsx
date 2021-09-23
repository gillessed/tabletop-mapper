import { Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Clipboard } from "../../redux/clipboard/ClipboardTypes";
import { copySelectionWorker, pasteClipboardWorker } from "../../redux/clipboard/ClipboardWorkers";
import { LayerTree } from "../../redux/layertree/LayerTreeTypes";
import { ModelRedo, ModelUndo } from '../../redux/model/ModelReducers';
import { Model } from '../../redux/model/ModelTypes';
import { canRedo, canUndo } from '../../redux/undo/UndoState';
import { useWorker } from "../../redux/utils/workers";

export function NavbarEditMenu() {
  const dispatch = useDispatch();
  const modelUndoable = useSelector(Model.Selectors.getUndoable);
  const clipboardItems = useSelector(Clipboard.Selectors.getItems);
  const selection = useSelector(LayerTree.Selectors.getSelectedNodes);
  const undoEnabled = canUndo(modelUndoable);
  const redoEnabled = canRedo(modelUndoable);
  const copySelection = useWorker(copySelectionWorker);
  const canPaste = clipboardItems.length > 0;
  const onlyRootLayerSelected = selection.length === 1 && selection[0] === Model.RootLayerId;
  const canCutAndCopy = selection.length > 0 && !onlyRootLayerSelected;
  const pasteClipboard = useWorker(pasteClipboardWorker);

  const onUndo = React.useCallback(() => {
    dispatch(ModelUndo.create());
  }, [dispatch]);
  const onRedo = React.useCallback(() => {
    dispatch(ModelRedo.create());
  }, [dispatch]);

  return (
    <Menu>
      <MenuItem text='Undo' icon={IconNames.UNDO} onClick={onUndo} disabled={!undoEnabled} label="Ctrl+z" />
      <MenuItem text='Redo' icon={IconNames.REDO} onClick={onRedo} disabled={!redoEnabled} label="Ctrl+y" />
      <MenuDivider />
      <MenuItem text='Copy Selection' icon={IconNames.DUPLICATE} onClick={copySelection} disabled={!canCutAndCopy} label="Ctrl+c" />
      <MenuItem text='Paste Selection' icon={IconNames.CLIPBOARD} onClick={pasteClipboard} disabled={!canPaste} label="Ctrl+v" />
    </Menu>
  );
}
