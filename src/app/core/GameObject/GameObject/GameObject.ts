import { IGameObject, IGameObjectState } from "../interfaces";
import { ISpriteInfo } from "../../SpriteInfo/interfaces";
import { Direction, MoveType } from "../../EngineInfo/interfaces";
import { ImgLoader } from "../../../helpers";
import { EngineInfo } from "../../EngineInfo";
import { IPolygonInfo, IPosition, IProjectile, ISize, ISpeed } from "../../shared/interfaces";
import { GameObjectHelper } from "../helpers";
import { MobSpeed } from "../../MobSpeed/MobSpeed";

export class GameObject implements IGameObject {
    private _isInitialed = false;

    private _spriteSource!: HTMLImageElement;

    private _changeFrameBorder: number;

    private _polygonInfo: IPolygonInfo;

    dieEmit!: Function;
    shootEmit!: (projectile: IProjectile, startPosition: IPosition) => Promise<void>;

    constructor(spriteInfo: ISpriteInfo, polygonInfo: IPolygonInfo) {
        this._spriteInfo = spriteInfo;
        this.state.size = polygonInfo;
        this._polygonInfo = polygonInfo;
        this._changeFrameBorder = Math.ceil(EngineInfo.FPS / spriteInfo.framesCount / (8/3));
    }

    get position(): IPosition {
		return this.state.position;
	}

	get speed(): ISpeed {
		return this.state.speed;
	}

    set speed(speed: ISpeed) {
        this.state.speed = speed;
    }

	get size(): ISize {
		return this.state.size;
	}

    get direction(): Direction {
        return this.state.direction;
    }

    set direction(dir: Direction) {
        this.state.direction = dir;
    }

    get speedAbsValue(): MobSpeed {
        return this.state.speedAbsValue;
    }

    set speedAbsValue(speedAbsValue: MobSpeed) {
        this.state.speedAbsValue = speedAbsValue;
    }

    private _inversedDirection = false;
    private _collisionFramesCount = 0;

    inverseDirection() {
        this._collisionFramesCount++;
        if (this._collisionFramesCount === EngineInfo.FPS*3) {
            this._collisionFramesCount = 0;
        }
        if (!this._inversedDirection) {
            this._inversedDirection = true;
            this.speed.dx = -this.speed.dx;
            this.speed.dy = -this.speed.dy;
        }

        if (this._inversedDirection && this._collisionFramesCount === 50) {
            this._inversedDirection = false;
        }
    }

    state: IGameObjectState = {
        position: {
            x: 0,
            y: 0,
        },
        speed: {
            dx: 0,
            dy: 0,
        },
        size: {
            width: 0,
            height: 0,
        },
        speedAbsValue: MobSpeed.Slow,
        direction: Direction.DOWN,
        moveType: MoveType.Run,
        isDie: false,
    };

    private _spriteInfo: ISpriteInfo;

    private _currentFrame = 1;

    setDirection(dir: Direction) {
        this.state.direction = dir;
    }

    draw(ctx: CanvasRenderingContext2D, frame: number) {
        if (!this._isInitialed) {
            throw new Error('GameObject is not initialized');
        }

        if (this.state.isDie) {
            this._currentFrame = this._spriteInfo.framesCount;
        } else if (frame % this._changeFrameBorder === 0) {
            this._currentFrame++;
            if (this._currentFrame > this._spriteInfo.framesCount) {
                this._currentFrame = 1;
            }
        }

        this.state.position.x += this.state.speed.dx;
        this.state.position.y += this.state.speed.dy;

        this.state.direction = GameObjectHelper.getCurrentDirection(this.state.speed.dx, this.state.speed.dy, this.state.direction);

        if (this._polygonInfo.showPolygon) {
            ctx.fillStyle = 'green';
            ctx.fillRect(this.state.position.x, this.state.position.y, this.state.size.width, this.state.size.height);
        }

        if (this._polygonInfo.showSprite) {
            ctx.drawImage(
                this._spriteSource,

                // Show current frame over time
                this._spriteInfo.spriteBeginHorizontalOffset +
                    this._spriteInfo.frameOffset * this._currentFrame,

                this._spriteInfo.spriteBeginVerticalOffset
                    + (this._spriteInfo.verticalOffsets && this._spriteInfo.verticalOffsets[this.state.direction]?.[this.state.moveType] || 0),

                this._spriteInfo.spriteWidthInImage,
                this._spriteInfo.spriteHeightInImage,
                this.state.position.x - this._polygonInfo.horizontalOffset,
                this.state.position.y - this._polygonInfo.verticalOffset,
                this._spriteInfo.spriteWidth,
                this._spriteInfo.spriteHeight,
            )
        }
    }

    async init(
        startPosition: IPosition,
        dieEmit: Function,
        shootEmit: (projectile: IProjectile, startPosition: IPosition) => Promise<void>,
        spriteSource?: HTMLImageElement
    ) {
        try {
            this.dieEmit = dieEmit;
            this.shootEmit = shootEmit;
            this.state.position = startPosition;
            if (spriteSource) {
                this._spriteSource = spriteSource;
            } else {
                this._spriteSource = await ImgLoader.load(this._spriteInfo.imageUrl);
            }

            this._isInitialed = true;
        } catch (e) {
            throw new Error('Init GameObject error');
        }
    }
}