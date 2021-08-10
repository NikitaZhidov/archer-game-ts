import { IGameObject } from "../../GameObject";
import { IKiller } from "./IKiller";

export interface ICanKilled extends IGameObject{
    die: () => void;
    killers: IKiller[];
    registerKiller: (killer: IKiller) => void;
}
