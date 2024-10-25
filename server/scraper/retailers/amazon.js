import puppeteer from 'puppeteer';
import { updateProduct } from '../../database.js';

export async function scrapeAmazon() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Example search URL
    await page.goto('https://www.amazon.com/s?k=electronics');
    
    // Wait for product grid
    await page.waitForSelector('[data-component-type="s-search-result"]');

    const products = await page.evaluate(() => {
      const items = document.querySelectorAll('[data-component-type="s-search-result"]');
      
      return Array.from(items).map(item => {
        const titleElement = item.querySelector('h2 a span');
        const priceElement = item.querySelector('.a-price-whole');
        const ratingElement = item.querySelector('.a-icon-star-small .a-icon-alt');
        const reviewsElement = item.querySelector('[aria-label*="reviews"]');
        const imageElement = item.querySelector('img.s-image');
        
        return {
          id: `amazon-${item.dataset.asin}`,
          name: titleElement?.textContent?.trim(),
          price: priceElement ? parseFloat(priceElement.textContent.replace(/[^0-9.]/g, '')) : 0,
          retailer: 'Amazon',
          rating: ratingElement ? parseFloat(ratingElement.textContent) : 0,
          reviews: reviewsElement ? parseInt(reviewsElement.textContent.replace(/[^0-9]/g, '')) : 0,
          image: imageElement?.src,
          shipping: 0, // Would need Prime status check
          tax: 0, // Would need location-based calculation
          url: `https://www.amazon.com/dp/${item.dataset.asin}`
        };
      });
    });

    // Save products to database
    for (const product of products) {
      if (product.name && product.price) {
        await updateProduct(product);
      }
    }

  } finally {
    await browser.close();
  }
}