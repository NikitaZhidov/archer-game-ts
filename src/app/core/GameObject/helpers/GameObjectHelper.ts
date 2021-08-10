import { Direction } from "../../EngineInfo/interfaces";

export class GameObjectHelper {
    static getCurrentDirection(dx: number, dy: number, currentDirection: Direction): Direction {
        switch(true) {
            case dx > 0:
                return Direction.RIGHT;
            case dx < 0:
                return Direction.LEFT;
            case dy > 0:
                return Direction.DOWN;
            case dy < 0:
                return Direction.UP;
            default:
                break;
        }

        return currentDirection;
    }
}