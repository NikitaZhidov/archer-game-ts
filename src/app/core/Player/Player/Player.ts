import { MoveType } from '../../EngineInfo/interfaces';
import { EventType, IEventListener } from '../../Event';
import { GameObject } from '../../GameObject';
import { ICanKilled, IControl, IKiller, IPolygonInfo, IPosition, IProjectile } from '../../shared/interfaces';
import { ISpriteInfo } from '../../SpriteInfo/interfaces';

export class Player extends GameObject implements ICanKilled {
	private _eventListeners: IEventListener[] = [];

	killers: IKiller[] = [];
	isShooting: boolean = false;

	private _controls: IControl[] = [];

	constructor(spriteInfo: ISpriteInfo, polygonInfo: IPolygonInfo) {
		super(spriteInfo, polygonInfo);
	}

	registerKiller(killer: IKiller) {
		this.killers.push(killer);
	}

	die() {
		this.state.isDie = true;
		this.speed.dx = 0;
		this.speed.dy = 0;

		this.destroy();
		this.dieEmit(this);
	}

	async init(startPosition: IPosition, dieEmit: Function, shootEmit: (projectile: IProjectile, startPosition: IPosition) => Promise<void>) {
		this._initPlayerControl();
		await super.init(startPosition, dieEmit, shootEmit);
	}

	draw(ctx: CanvasRenderingContext2D, frame: number) {
		if (this.isShooting) {
			this.state.moveType = MoveType.Shoot;
		} else if (this.state.isDie) {
			this.state.moveType = MoveType.Die;
		} else {
			this.state.moveType = this.state.speed.dx !== 0 || this.state.speed.dy !== 0 ?
			MoveType.Run : MoveType.Stand;
		}
		super.draw(ctx, frame);
	}

	private _initPlayerControl() {
		this._controls.forEach((control) => {
			this._registerControlListener(control);
		});
	}

	private _registerControlListener(control: IControl) {
		const handler = (e: KeyboardEvent) => {
			if (e.key === control.keyboardKey) {
				control.handler();
			}
		};

		document.addEventListener(EventType.Keydown, handler)

		this._eventListeners.push({
			eventType: EventType.Keydown,
			eventListener: handler,
		})
	}

	registerControls(controls: IControl[]) {
		controls.forEach((c) => {
			this._registerControlListener(c);
		})
	}

	destroy() {
		this._eventListeners.forEach((listener) => {
			document.removeEventListener(listener.eventType, listener.eventListener);
		})
	}

}
