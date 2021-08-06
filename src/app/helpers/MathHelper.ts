export class MathHelper {
	static getRandomInt(min: number, max: number): number {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min;
	}

	static randomSort(): number {
		return Date.now() % 100 - Math.random() * 100;
	}

	static getRandomTrue(chance: number): boolean {
		return Math.random() <= chance;
	}
}
