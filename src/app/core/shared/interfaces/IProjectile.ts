import { ICanKilled } from "./ICanKilled";
import { IKiller } from "./IKiller";
import { ProjectileType } from "./ProjectileType";

export interface IProjectile extends IKiller, ICanKilled {
    projectileType: ProjectileType;
}
