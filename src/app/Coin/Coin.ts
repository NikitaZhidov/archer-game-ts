import { Direction } from "../core/EngineInfo/interfaces";
import { GameObject } from "../core/GameObject";
import { MobSpeed } from "../core/MobSpeed/MobSpeed";
import { IBonus, IPolygonInfo, IPosition, IProjectile } from "../core/shared/interfaces";
import { ISpriteInfo } from "../core/SpriteInfo/interfaces";
import { MathHelper } from "../helpers";

export class Coin extends GameObject implements IBonus{
    private _spriteCoinSource: HTMLImageElement;
    private readonly _coinSpeed = MobSpeed.Stop;

    remove() {
        this.dieEmit(this);
    }

    constructor(spriteInfo: ISpriteInfo, polygonInfo: IPolygonInfo, spriteSource: HTMLImageElement) {
        super(spriteInfo, polygonInfo);
        this._spriteCoinSource = spriteSource;
    }

    async init(
        startPosition: IPosition,
        dieEmit: Function,
        shootEmit: (projectile: IProjectile, startPosition: IPosition) => Promise<void>
    ) {
        await super.init(startPosition, dieEmit, shootEmit, this._spriteCoinSource);

        this.state.speedAbsValue = this._coinSpeed;
        this.direction = Direction.DOWN;
        this.speed = MathHelper.getSpeedByDirection(Direction.DOWN, this._coinSpeed);
    }
}