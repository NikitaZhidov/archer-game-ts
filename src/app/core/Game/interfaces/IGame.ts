export interface IGame {
	init: () => Promise<void>;
	start: () => void;
	stop: () => void;
}
