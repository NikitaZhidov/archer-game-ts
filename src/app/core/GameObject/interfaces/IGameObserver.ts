export interface IGameObserver {
	draw: (ctx: CanvasRenderingContext2D, frame: number) => void;
}
