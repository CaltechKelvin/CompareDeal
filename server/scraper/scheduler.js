import { scrapeAmazon } from './retailers/amazon.js';
import { scrapeTarget } from './retailers/target.js';
import { scrapeBestBuy } from './retailers/bestbuy.js';
import { scrapeWalmart } from './retailers/walmart.js';
import { delay } from './utils.js';
import { cleanupOldProducts } from '../database.js';

let isScrapingInProgress = false;

export async function scrapeAllRetailers() {
  if (isScrapingInProgress) {
    console.log('Scraping already in progress, skipping...');
    return;
  }

  try {
    isScrapingInProgress = true;
    console.log('Starting real-time product scraping...');

    await Promise.all([
      scrapeAmazon(),
      delay(2000).then(() => scrapeTarget()),
      delay(4000).then(() => scrapeBestBuy()),
      delay(6000).then(() => scrapeWalmart())
    ]);

    console.log('Real-time scraping completed successfully');
  } catch (error) {
    console.error('Error in real-time scraping:', error);
  } finally {
    isScrapingInProgress = false;
  }
}

// Initial scrape on server start
console.log('Running initial scrape...');
scrapeAllRetailers();