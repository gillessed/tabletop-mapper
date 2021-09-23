import { Model } from '../model/ModelTypes';
import { Identifiable } from '../utils/indexable';
import { newTypedReducer, Reducer } from '../utils/typedReducer';
import { Clipboard } from './ClipboardTypes';

const InitialState: Clipboard.Types.State = {
  items: [],
  pasteCount: 0,
};

const setItemsReducer = (_: Clipboard.Types.State, items: string[]): Clipboard.Types.State => ({ items, pasteCount: 0 });

const increatePasteCountReducer = (state: Clipboard.Types.State): Clipboard.Types.State => ({ ...state, pasteCount: state.pasteCount + 1 });

const clearItemsReducer = (): Clipboard.Types.State => InitialState;

export const clipboardReducer: Reducer<Clipboard.Types.State> = newTypedReducer<Clipboard.Types.State>()
  .handlePayload(Clipboard.Actions.setItems.type, setItemsReducer)
  .handlePayload(Clipboard.Actions.clearItems.type, clearItemsReducer)
  .handlePayload(Clipboard.Actions.increasePasteCount.type, increatePasteCountReducer)
  .handleDefault((state = InitialState) => state)
  .build();

