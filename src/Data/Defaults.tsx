import { IVector2 } from "../Components/Timeline/Timeline";

export interface ISettings {
  rulerHeight: number,
  scale: IVector2
}

export default {
  rulerHeight: 64,
  scale:  { x: 100.0, y: 64.0 }
} as ISettings;