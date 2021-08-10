import { Direction, MoveType } from "../../EngineInfo/interfaces";
import { IPosition, ISize, ISpeed } from "../../shared/interfaces";

export interface IGameObjectState {
    position: IPosition;
    speed: ISpeed;
    direction: Direction;
    moveType: MoveType;
    size: ISize;
    speedAbsValue: number;
    isDie: boolean;
}
