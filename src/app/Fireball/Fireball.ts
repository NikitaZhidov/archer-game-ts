import { Direction } from "../core/EngineInfo/interfaces";
import { GameObject } from "../core/GameObject";
import { MobSpeed } from "../core/MobSpeed/MobSpeed";
import { IKiller, IPolygonInfo, IPosition, IProjectile, ProjectileType } from "../core/shared/interfaces";
import { ISpriteInfo } from "../core/SpriteInfo/interfaces";
import { MathHelper } from "../helpers";

export class Fireball extends GameObject implements IProjectile {

    projectileType: ProjectileType;

    private readonly _fireballSpeed: MobSpeed = MobSpeed.VeryFast;
    private _spriteFireballSource: HTMLImageElement;

    kill() {}

    killers: IKiller[] = [];
    registerKiller(killer: IKiller) {}

    die() {
        this.dieEmit(this);
    }

    constructor(
        projectileSpriteInfo: ISpriteInfo,
        projectilePolygonInfo: IPolygonInfo,
        type: ProjectileType, direction: Direction,
        spriteSource: HTMLImageElement
    ) {
        super(projectileSpriteInfo, projectilePolygonInfo);
        this.direction = direction;
        this.projectileType = type;
        this._spriteFireballSource = spriteSource;
    }

    async init(startPosition: IPosition, dieEmit: Function, shootEmit: (projectile: IProjectile, startPosition: IPosition) => Promise<void>) {
        this.speed = MathHelper.getSpeedByDirection(this.direction, this._fireballSpeed);
        startPosition.x -= this.state.size.width / 2;
        await super.init(startPosition, dieEmit, shootEmit, this._spriteFireballSource);
    }
}