import puppeteer from 'puppeteer';
import { updateProduct } from '../../database.js';
import { delay } from '../utils.js';

export async function scrapeBestBuy() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    await page.goto('https://www.bestbuy.com/site/electronics/top-deals/pcmcat1563299784494.c');
    await delay(2000);
    
    await page.waitForSelector('.sku-item');

    const products = await page.evaluate(() => {
      const items = document.querySelectorAll('.sku-item');
      
      return Array.from(items).map(item => {
        const titleElement = item.querySelector('.sku-header a');
        const priceElement = item.querySelector('.priceView-customer-price span');
        const ratingElement = item.querySelector('.customer-review-average');
        const reviewsElement = item.querySelector('.customer-review-count');
        const imageElement = item.querySelector('img.product-image');
        const skuId = item.getAttribute('data-sku-id');
        
        return {
          id: `bestbuy-${skuId}`,
          name: titleElement?.textContent?.trim(),
          price: priceElement ? parseFloat(priceElement.textContent.replace(/[^0-9.]/g, '')) : 0,
          retailer: 'Best Buy',
          rating: ratingElement ? parseFloat(ratingElement.textContent) : 0,
          reviews: reviewsElement ? parseInt(reviewsElement.textContent) : 0,
          image: imageElement?.src,
          shipping: 0,
          tax: 0,
          url: `https://www.bestbuy.com/site/searchpage.jsp?id=${skuId}`
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