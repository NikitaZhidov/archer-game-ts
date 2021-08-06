import { EventType, IEventListener } from '../../Event';
import { EventKey } from '../../Event/interfaces/EventKey';
import { IControl } from '../../shared/interfaces';
import { IPlayer } from '../interfaces';

export class Player implements IPlayer {
	private _eventListeners: IEventListener[] = [];

	private _controls: IControl[] = [
		{ key: EventKey.Up, handler: this.goUp },
		{ key: EventKey.Right, handler: this.goRight },
		{ key: EventKey.Down, handler: this.goDown },
		{ key: EventKey.Left, handler: this.goLeft },
	];

	constructor() {
		this._initPlayerControl();
	}

	goUp() { };
	goRight() { };
	goDown() { };
	goLeft() { };

	destroy() {
		this._eventListeners.forEach((listener) => {
			document.removeEventListener(listener.eventType, listener.eventListener);
		})
	}

	private _initPlayerControl() {
		this._controls.forEach((control) => {
			this._registerControlListener(control);
		});
	}

	private _registerControlListener(control: IControl) {
		document.addEventListener(EventType.Keydown, (e) => {
			if (e.key === control.key) {
				control.handler();
			}
		})

		this._eventListeners.push({
			eventType: EventType.Keydown,
			eventListener: control.handler,
		})
	}
}
