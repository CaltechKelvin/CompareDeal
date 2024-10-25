import { SCRAPER_CONFIG } from './config.js';

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export function normalizeProductName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function findSimilarProducts(productName, existingProducts, threshold = 0.8) {
  const normalized = normalizeProductName(productName);
  return existingProducts.filter(product => {
    const similarity = calculateStringSimilarity(
      normalized,
      normalizeProductName(product.name)
    );
    return similarity >= threshold;
  });
}

export function calculateStringSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1, str2) {
  const matrix = Array(str2.length + 1).fill(null)
    .map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }
  return matrix[str2.length][str1.length];
}

export function extractModelNumber(name) {
  const modelPatterns = [
    /model\s*[:=#]?\s*([a-z0-9-]+)/i,
    /([a-z0-9]+-[a-z0-9]+)/i,
    /([a-z][0-9]{3,})/i
  ];

  for (const pattern of modelPatterns) {
    const match = name.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function validateProduct(product) {
  const required = ['name', 'price', 'retailer', 'url'];
  const valid = required.every(field => product[field]);
  
  if (!valid) return false;
  
  // Additional validation
  if (product.price <= 0) return false;
  if (product.name.length < 5) return false;
  if (!product.url.startsWith('http')) return false;
  
  return true;
}