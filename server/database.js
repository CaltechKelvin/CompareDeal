import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
let db;

export async function setupDatabase() {
  try {
    db = await open({
      filename: join(__dirname, '../database.sqlite'),
      driver: sqlite3.Database
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        retailer TEXT NOT NULL,
        rating REAL,
        reviews INTEGER,
        image TEXT,
        shipping REAL DEFAULT 0,
        tax REAL DEFAULT 0,
        url TEXT NOT NULL,
        category TEXT,
        model_number TEXT,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
      CREATE INDEX IF NOT EXISTS idx_products_retailer ON products(retailer);
      CREATE INDEX IF NOT EXISTS idx_products_last_updated ON products(last_updated);
    `);

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Database setup failed:', error);
    throw error;
  }
}

export async function getProducts(filters = {}) {
  try {
    const conditions = ['1=1'];
    const params = [];

    if (filters.search) {
      conditions.push('name LIKE ?');
      params.push(`%${filters.search}%`);
    }

    if (filters.category) {
      conditions.push('category = ?');
      params.push(filters.category);
    }

    if (filters.minPrice) {
      conditions.push('price >= ?');
      params.push(filters.minPrice);
    }

    if (filters.maxPrice) {
      conditions.push('price <= ?');
      params.push(filters.maxPrice);
    }

    if (filters.retailers?.length) {
      conditions.push(`retailer IN (${filters.retailers.map(() => '?').join(',')})`);
      params.push(...filters.retailers);
    }

    if (filters.rating) {
      conditions.push('rating >= ?');
      params.push(filters.rating);
    }

    const query = `
      SELECT * FROM products 
      WHERE ${conditions.join(' AND ')}
      ORDER BY price ASC
      LIMIT 100
    `;

    const products = await db.all(query, params);
    return products || [];
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
}

export async function updateProduct(product) {
  try {
    const query = `
      INSERT OR REPLACE INTO products (
        id, name, price, retailer, rating, reviews, 
        image, shipping, tax, url, category, model_number, 
        last_updated
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;

    await db.run(query, [
      product.id,
      product.name,
      product.price,
      product.retailer,
      product.rating || 0,
      product.reviews || 0,
      product.image || '',
      product.shipping || 0,
      product.tax || 0,
      product.url,
      product.category || '',
      product.model_number || ''
    ]);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function cleanupOldProducts(daysOld) {
  try {
    const query = `
      DELETE FROM products 
      WHERE last_updated < datetime('now', '-' || ? || ' days')
    `;
    
    await db.run(query, [daysOld]);
  } catch (error) {
    console.error('Error cleaning up old products:', error);
    throw error;
  }
}