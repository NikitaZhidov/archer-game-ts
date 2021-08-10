import { MoveType } from "../core/EngineInfo/interfaces";
import { GameObject} from "../core/GameObject";
import { MobSpeed } from "../core/MobSpeed/MobSpeed";
import { ICanKilled, IKiller, IPolygonInfo, IPosition, IProjectile } from "../core/shared/interfaces";
import { ISpriteInfo } from "../core/SpriteInfo/interfaces";
import { MathHelper } from "../helpers";

export class Ork extends GameObject implements IKiller, ICanKilled {
    private readonly _orkSpeed = MobSpeed.Slow;
    private _spriteOrkSource: HTMLImageElement;

    killers: IKiller[] = [];

    kill(killed: ICanKilled) {
        killed.die();
    }

    die() {
        this.dieEmit(this);
    }

    registerKiller(killer: IKiller) {
        this.killers.push(killer);
    }

    constructor(spriteInfo: ISpriteInfo, polygonInfo: IPolygonInfo, spriteSource: HTMLImageElement) {
        super(spriteInfo, polygonInfo);
        this._spriteOrkSource = spriteSource;
    }

    async init(
        startPosition: IPosition,
        dieEmit: Function,
        shootEmit: (projectile: IProjectile, startPosition: IPosition) => Promise<void>,
    ) {
        await super.init(startPosition, dieEmit, shootEmit, this._spriteOrkSource);
        this.state.moveType = MoveType.Run;

        this.state.direction = MathHelper.getRandomDirection();
        this.state.speedAbsValue = this._orkSpeed;
        this.state.speed = MathHelper.getSpeedByDirection(this.state.direction, this._orkSpeed);
    }
}
