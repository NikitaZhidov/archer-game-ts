import { EventType } from './EventType';

export interface IEventListener {
	eventType: EventType;
	eventListener: (e: KeyboardEvent) => void;
}
