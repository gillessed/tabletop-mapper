import { Model } from "../redux/model/ModelTypes";
import { coordinateEquals } from "./Vector";

export function geometryEquals(g1: Model.Types.Geometry, g2: Model.Types.Geometry): boolean {
  if (g1 == null || g2 == null) {
    return false;
  } else if (g1.type === "rectangle" && g2.type === "rectangle") {
    return coordinateEquals(g1.p1, g2.p1) && coordinateEquals(g1.p2, g2.p2);
  } else {
    return false;
  }
}
