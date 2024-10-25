export const SCRAPER_CONFIG = {
  // Rate limiting settings
  delays: {
    betweenPages: 2000,
    betweenProducts: 500,
    afterError: 5000
  },
  
  // Retry settings
  retry: {
    attempts: 3,
    initialDelay: 1000,
    maxDelay: 10000
  },
  
  // Browser settings
  browser: {
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920x1080'
    ]
  },
  
  // User agents to rotate
  userAgents: [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0'
  ],
  
  // Retailer-specific settings
  retailers: {
    amazon: {
      baseUrl: 'https://www.amazon.com',
      selectors: {
        product: '[data-component-type="s-search-result"]',
        title: 'h2 a span',
        price: '.a-price-whole',
        rating: '.a-icon-star-small .a-icon-alt',
        reviews: '[aria-label*="reviews"]',
        image: 'img.s-image'
      }
    },
    target: {
      baseUrl: 'https://www.target.com',
      selectors: {
        product: '[data-test="product-card"]',
        title: '[data-test="product-title"]',
        price: '[data-test="product-price"]',
        rating: '[data-test="product-rating"]',
        image: 'img[data-test="product-image"]'
      }
    },
    bestbuy: {
      baseUrl: 'https://www.bestbuy.com',
      selectors: {
        product: '.sku-item',
        title: '.sku-header a',
        price: '.priceView-customer-price span',
        rating: '.customer-review-average',
        reviews: '.customer-review-count',
        image: 'img.product-image'
      }
    },
    walmart: {
      baseUrl: 'https://www.walmart.com',
      selectors: {
        product: '[data-item-id]',
        title: '[data-automation-id="product-title"]',
        price: '[data-automation-id="product-price"]',
        rating: '.stars-container',
        reviews: '.stars-reviews-count',
        image: '[data-automation-id="product-image"] img'
      }
    }
  }
};