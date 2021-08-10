import { Direction } from "../core/EngineInfo/interfaces";
import { IPolygonInfo, IProjectileCreator, ProjectileType } from "../core/shared/interfaces";
import { ISpriteInfo } from "../core/SpriteInfo/interfaces";
import { Fireball } from "../Fireball/Fireball";
import { ImgLoader } from "../helpers";

export class FireballCreator implements IProjectileCreator {
    projectileSpriteInfo: ISpriteInfo;
    projectilePolygonInfo: IPolygonInfo;

    private _spriteSoure!: HTMLImageElement;

    createProjectile(type: ProjectileType, direction: Direction) {
        return new Fireball(this.projectileSpriteInfo, this.projectilePolygonInfo, type, direction, this._spriteSoure);
    }

    constructor(projectileSpriteInfo: ISpriteInfo, projectilePolygonInfo: IPolygonInfo) {
        this.projectileSpriteInfo = projectileSpriteInfo;
        this.projectilePolygonInfo = projectilePolygonInfo;
    }

    async init() {
        this._spriteSoure = await ImgLoader.load(this.projectileSpriteInfo.imageUrl);
    }
}