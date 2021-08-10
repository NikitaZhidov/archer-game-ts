import { ICanKilled, IKiller } from "../../shared/interfaces";

export interface IEnemyCreator {
    createEnemy: () => IKiller & ICanKilled;
}
