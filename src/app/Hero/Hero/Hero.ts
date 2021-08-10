import { Direction } from '../../core/EngineInfo/interfaces';
import { EventKey, EventType } from '../../core/Event';
import { MobSpeed } from '../../core/MobSpeed/MobSpeed';
import { Player } from '../../core/Player/Player';
import { IPolygonInfo, IPosition, IProjectile, IProjectileCreator, IShooter, ProjectileType } from '../../core/shared/interfaces';
import { ISpriteInfo } from '../../core/SpriteInfo/interfaces';

const SHOOT_ANIMATION_TIME = 300;

export class Hero extends Player implements IShooter {
	private readonly _heroSpeed = MobSpeed.Fast;
	private _projectileCreator: IProjectileCreator;

	constructor(spriteInfo: ISpriteInfo, polygonInfo: IPolygonInfo, projectileCreator: IProjectileCreator) {
		super(spriteInfo, polygonInfo);
		this._projectileCreator = projectileCreator;
	}

	async init(startPosition: IPosition, dieEmit: Function, shootEmit: (projectile: IProjectile, startPosition: IPosition) => Promise<void>) {
		this.registerControls([
			{ keyboardKey: EventKey.Up, handler: this.goUp.bind(this) },
			{ keyboardKey: EventKey.Right, handler: this.goRight.bind(this) },
			{ keyboardKey: EventKey.Down, handler: this.goDown.bind(this) },
			{ keyboardKey: EventKey.Left, handler: this.goLeft.bind(this) },
			{ keyboardKey: EventKey.Space, handler: this.shoot.bind(this) },
		]);
		await super.init(startPosition, dieEmit, shootEmit);
	}

	goUp() {
		this.state.speed.dy = -this._heroSpeed;
		this._listenStopDirection(EventKey.Up, Direction.UP);
	}
	goRight() {
		this.state.speed.dx = this._heroSpeed;
		this._listenStopDirection(EventKey.Right, Direction.RIGHT);
	}
	goDown() {
		this.state.speed.dy = this._heroSpeed;
		this._listenStopDirection(EventKey.Down, Direction.DOWN);
	}
	goLeft() {
		this.state.speed.dx = -this._heroSpeed;
		this._listenStopDirection(EventKey.Left, Direction.LEFT);
	}

	async shoot() {
		this.isShooting = true;
		setTimeout(async () => {
			await this.shootEmit(
				this._projectileCreator.createProjectile(ProjectileType.KillEnemy, this.state.direction),
				{
					x: this.state.position.x + this.state.size.width / 2,
					y: this.state.position.y,
				});
		}, 200);
		setTimeout(() => {
			this.isShooting = false;
		}, SHOOT_ANIMATION_TIME);
	}

	private _listenStopDirection(eventKey: EventKey, direction: Direction) {
		const stop = (e: KeyboardEvent) => {
			if (e.key === eventKey) {
				if (direction === Direction.LEFT || direction === Direction.RIGHT) {
					this.state.speed.dx = 0;
				} else {
					this.state.speed.dy = 0;
				}
				document.removeEventListener(EventType.Keyup, stop);
			}
		}

		document.addEventListener(EventType.Keyup, stop);
	}
}
