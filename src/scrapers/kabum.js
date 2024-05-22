import puppeteer from "puppeteer";
import "dotenv/config";

const TARGET_URL = "https://www.kabum.com.br";

export async function ScrapeKabum() {
	// SETUP
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.setViewport({ width: 1920, height: 1080 });

	// NAVIGATE TO LOGIN
	await page.goto(TARGET_URL);
	await page.click("#linkFavoritosHeader");
	await page.waitForNavigation();

	// NAVIGATE TO WISH LIST
	await page.type('[data-testid="login-input"]', process.env.KABUM_EMAIL);
	await page.type('[data-testid="password-input"]', process.env.KABUM_PASS);
	await page.click('[data-testid="login-submit-button"]');
	await page.waitForNavigation();

	// GET WISH LIST CARD INFO
	const wishListInfo = await page.evaluate(() => {
		const wishlistCards = Array.from(
			document.querySelectorAll("#main-content main section > div")
		);
		//B
		return wishlistCards.map((card) => {
			const image_url = card.querySelector("img").src;

			const imageUrlPieces = image_url.split("/");
			const productId = imageUrlPieces[imageUrlPieces.length - 2];
			const product_url = `https://kabum.com.br/produto/${productId}`;

			const title = card.querySelector(".productInfo h1").textContent;
			const price = card.querySelector(".productPrice h1").textContent;
			const buy_btn = card.querySelector(".productActions button");
			const on_stock = buy_btn ? true : false;

			return {
				image_url,
				product_url,
				title,
				price,
				on_stock
			};
		});
	});

	console.log("Wish List Info: ", wishListInfo);

	await browser.close();
}
