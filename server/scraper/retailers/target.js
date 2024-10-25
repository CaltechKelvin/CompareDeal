import puppeteer from 'puppeteer';
import { updateProduct } from '../../database.js';
import { delay } from '../utils.js';

export async function scrapeTarget() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Target's search URL
    await page.goto('https://www.target.com/c/electronics/-/N-5xtg6');
    await delay(2000); // Respect rate limits
    
    await page.waitForSelector('[data-test="product-grid"]');

    const products = await page.evaluate(() => {
      const items = document.querySelectorAll('[data-test="product-card"]');
      
      return Array.from(items).map(item => {
        const titleElement = item.querySelector('[data-test="product-title"]');
        const priceElement = item.querySelector('[data-test="product-price"]');
        const ratingElement = item.querySelector('[data-test="product-rating"]');
        const imageElement = item.querySelector('img[data-test="product-image"]');
        const productId = item.getAttribute('data-product-id');
        
        return {
          id: `target-${productId}`,
          name: titleElement?.textContent?.trim(),
          price: priceElement ? parseFloat(priceElement.textContent.replace(/[^0-9.]/g, '')) : 0,
          retailer: 'Target',
          rating: ratingElement ? parseFloat(ratingElement.getAttribute('data-rating')) : 0,
          reviews: ratingElement ? parseInt(ratingElement.getAttribute('data-count')) : 0,
          image: imageElement?.src,
          shipping: 0,
          tax: 0,
          url: `https://www.target.com/p/-/A-${productId}`
        };
      });
    });

    for (const product of products) {
      if (product.name && product.price) {
        await updateProduct(product);
        await delay(500); // Prevent database overload
      }
    }

  } finally {
    await browser.close();
  }
}