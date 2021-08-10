import { EventKey } from '../../Event';

export interface IControl {
	keyboardKey: EventKey,
	handler: () => void;
}
