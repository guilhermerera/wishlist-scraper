export function KabumGetProductURL(imageUrl) {
	const urlPieces = imageUrl.split("/");
	const productId = urlPieces[urlPieces.length - 1];

	return `kabum.com.br/produto/${productId}`;
}
