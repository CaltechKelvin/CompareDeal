import puppeteer from 'puppeteer';
import { updateProduct } from '../../database.js';
import { delay } from '../utils.js';

export async function scrapeWalmart() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    await page.goto('https://www.walmart.com/browse/electronics/3944');
    await delay(2000);
    
    await page.waitForSelector('[data-item-id]');

    const products = await page.evaluate(() => {
      const items = document.querySelectorAll('[data-item-id]');
      
      return Array.from(items).map(item => {
        const titleElement = item.querySelector('[data-automation-id="product-title"]');
        const priceElement = item.querySelector('[data-automation-id="product-price"]');
        const ratingElement = item.querySelector('.stars-container');
        const reviewsElement = item.querySelector('.stars-reviews-count');
        const imageElement = item.querySelector('[data-automation-id="product-image"] img');
        const itemId = item.getAttribute('data-item-id');
        
        return {
          id: `walmart-${itemId}`,
          name: titleElement?.textContent?.trim(),
          price: priceElement ? parseFloat(priceElement.textContent.replace(/[^0-9.]/g, '')) : 0,
          retailer: 'Walmart',
          rating: ratingElement ? parseFloat(ratingElement.getAttribute('data-rating')) : 0,
          reviews: reviewsElement ? parseInt(reviewsElement.textContent) : 0,
          image: imageElement?.src,
          shipping: 0,
          tax: 0,
          url: `https://www.walmart.com/ip/${itemId}`
        };
      });
    });

    for (const product of products) {
      if (product.name && product.price) {
        await updateProduct(product);
        await delay(500);
      }
    }

  } finally {
    await browser.close();
  }
}