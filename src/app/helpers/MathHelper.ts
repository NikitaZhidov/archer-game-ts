import { Direction } from "../core/EngineInfo/interfaces";
import { MobSpeed } from "../core/MobSpeed/MobSpeed";
import { ISpeed } from "../core/shared/interfaces";

export class MathHelper {
	static getRandomInt(min: number, max: number): number {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min;
	}

	static randomSort(): number {
		return Date.now() % 100 - Math.random() * 100;
	}

	static getRandomBoolean(chance: number): boolean {
		return Math.random() <= chance;
	}

	static getRandomDirection(): Direction {
		switch(this.getRandomInt(0, 4)) {
			case 0:
				return Direction.UP;
			case 1:
				return Direction.RIGHT;
			case 2:
				return Direction.DOWN;
			default:
				return Direction.LEFT;
		}
	}

	static getSpeedByDirection(dir: Direction, speed: MobSpeed): ISpeed {
		switch (dir) {
			case Direction.UP:
				return { dy: -speed, dx: 0 };
			case Direction.DOWN:
				return { dy: speed, dx: 0 };
			case Direction.RIGHT:
				return { dy: 0, dx: speed };
			case Direction.LEFT:
				return { dy: 0, dx: -speed };
		}
	}

	static getOppositeDirection(dir: Direction): Direction {
		switch (dir) {
			case Direction.UP:
				return Direction.DOWN;
			case Direction.DOWN:
				return Direction.UP
			case Direction.RIGHT:
				return Direction.LEFT;
			case Direction.LEFT:
				return Direction.RIGHT;
		}
	}
}
