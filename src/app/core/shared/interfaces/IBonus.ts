import { IGameObject } from "../../GameObject";

export interface IBonus extends IGameObject {
    remove: () => void;
}
