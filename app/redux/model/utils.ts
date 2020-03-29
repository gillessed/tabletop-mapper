import { Indexable } from "../utils/indexable";
import { Model } from "./types";

export const findByName = <T extends Model.Types.Object>(index: Indexable<T>, name: string) => {
  return index.all.find((id: string) => {
      if (index.byId[id].name === name) {
          return true;
      }
      return false;
  });
}
