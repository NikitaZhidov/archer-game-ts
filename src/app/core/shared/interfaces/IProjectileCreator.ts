import { Direction } from "../../EngineInfo/interfaces";
import { IProjectile } from "./IProjectile";
import { ProjectileType } from "./ProjectileType";

export interface IProjectileCreator {
    createProjectile: (type: ProjectileType, direction: Direction) => IProjectile;
}
