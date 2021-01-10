import { Identifiable, Indexable } from "../utils/indexable";

export const findByName = <T extends Identifiable>(index: Indexable<T>, name: string) => {
  return index.all.find((id: string) => {
    if (index.byId[id].name === name) {
      return true;
    }
    return false;
  });
}
