import { EventKey } from '../../Event';

export interface IControl {
	key: EventKey,
	handler: () => void;
}
