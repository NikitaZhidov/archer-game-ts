export class ImgLoader {
	static load(imageUrl: string): Promise<HTMLImageElement> {
		const image = new Image();
		image.src = imageUrl;

		return new Promise((res, rej) => {
			image.onload = () => res(image);
			image.onerror = () => rej();
		})
	}
}
