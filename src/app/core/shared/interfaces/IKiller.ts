import { IGameObject } from "../../GameObject";
import { ICanKilled } from "./ICanKilled";

export interface IKiller extends IGameObject {
    kill: (killed: ICanKilled) => void;
}
