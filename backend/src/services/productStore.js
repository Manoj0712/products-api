import { Pool } from "pg";
import { env } from "../config/env.js";
import { seedProducts } from "../data/seedProducts.js";
import { slugify } from "../utils/slugify.js";
import { buildProduct, getAverageRating, getProductRating, normalizeRecord, toArray } from "../utils/productHelper.js";

const pool = env.databaseUrl
  ? new Pool({
    connectionString: env.databaseUrl
  })
  : null;

let databaseReady = false;

async function initializeDatabase() {
  if (!pool || databaseReady) {
    return;
  }
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price NUMERIC(10, 2) NOT NULL,
      rating NUMERIC(3, 2) NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'USD',
      sku TEXT UNIQUE NOT NULL,
      images JSONB NOT NULL DEFAULT '[]'::jsonb,
      availability TEXT NOT NULL DEFAULT 'In Stock',
      category TEXT DEFAULT '',
      brand TEXT DEFAULT '',
      specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
      reviews JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM products");
  if (rows[0].count === 0) {
    for (const product of seedProducts) {
      await pool.query(
        `
          INSERT INTO products (
            id, slug, name, description, price, rating, currency, sku, images,
            availability, category, brand, specifications, reviews
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10, $11, $12, $13::jsonb, $14::jsonb)
        `,
        [
          product.id,
          product.slug,
          product.name,
          product.description,
          product.price,
          getProductRating(product),
          product.currency,
          product.sku,
          JSON.stringify(product.images || []),
          product.availability,
          product.category,
          product.brand,
          JSON.stringify(product.specifications || {}),
          JSON.stringify(product.reviews || [])
        ]
      );
    }
  }
  databaseReady = true;
}

export async function bootstrapStore() {
  try {
    await initializeDatabase();
  } catch (error) {
    console.warn("PostgreSQL unavailable, falling back to in-memory data.");
    console.warn(error.message);
  } 
}

export async function listProducts(req) {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.max(1, Math.min(50, Number(req.query.limit || 9)));
  const q = String(req.query.q || "");
  const search = q.toLowerCase().trim();
  const brands = req.query.brands || [];
  const minRating = req.query.minRating;
  const minPrice = req.query.minPrice;
  const maxPrice = req.query.maxPrice;
  const normalizedBrands = toArray(brands).map((brand) => brand.toLowerCase());
  const hasMinRating = minRating !== undefined && minRating !== null && minRating !== "";
  const hasMinPrice = minPrice !== undefined && minPrice !== null && minPrice !== "";
  const hasMaxPrice = maxPrice !== undefined && maxPrice !== null && maxPrice !== "";
  const offset = (page - 1) * limit;
  if (databaseReady && pool) {
    const conditions = [];
    const values = [];

    if (search) {
      values.push(`%${search}%`);
      const index = values.length;
      conditions.push(
        `(LOWER(name) LIKE $${index} OR LOWER(description) LIKE $${index} OR LOWER(category) LIKE $${index})`
      );
    }

    if (normalizedBrands.length > 0) {
      values.push(normalizedBrands);
      conditions.push(`LOWER(brand) = ANY($${values.length})`);
    }

    if (hasMinPrice) {
      values.push(Number(minPrice));
      conditions.push(`price >= $${values.length}`);
    }

    if (hasMaxPrice) {
      values.push(Number(maxPrice));
      conditions.push(`price <= $${values.length}`);
    }

    if (hasMinRating) {
      values.push(Number(minRating));
      conditions.push(`rating >= $${values.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const paginationValues = [...values, limit, offset];
    const query = `
      SELECT *
      FROM products
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paginationValues.length - 1} OFFSET $${paginationValues.length}
    `;
    const countQuery = `
      SELECT COUNT(*)::int AS total
      FROM products
      ${whereClause}
    `;
    const brandsQuery = `
      SELECT DISTINCT brand
      FROM products
      WHERE TRIM(COALESCE(brand, '')) <> ''
      ORDER BY brand ASC
    `;
    const [records, totalResult, brandsResult] = await Promise.all([
      pool.query(query, paginationValues),
      pool.query(countQuery, values),
      pool.query(brandsQuery)
    ]);

    const total = totalResult.rows[0].total;
    return {
      data: records.rows.map(normalizeRecord),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        availableBrands: brandsResult.rows.map((row) => row.brand)
      }
    };
  }else{
    return {
      data: [],
      meta: {
        total: 0,
        page,
        limit,
        totalPages: 0,
        availableBrands: []
      } 
    };
  }
}

export async function getProductById(id) {
  if (databaseReady && pool) {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    return normalizeRecord(result.rows[0]);
  }else{
    return null;
  }
}

export async function createProduct(input) {
  const product = buildProduct(input);
  if (databaseReady && pool) {
    const result = await pool.query(
      `
        INSERT INTO products (
          id, slug, name, description, price, rating, currency, sku, images,
          availability, category, brand, specifications, reviews
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10, $11, $12, $13::jsonb, $14::jsonb)
        RETURNING *
      `,
      [
        product.id,
        product.slug,
        product.name,
        product.description,
        product.price,
        product.rating,
        product.currency,
        product.sku,
        JSON.stringify(product.images),
        product.availability,
        product.category,
        product.brand,
        JSON.stringify(product.specifications),
        JSON.stringify(product.reviews)
      ]
    );
    return normalizeRecord(result.rows[0]);
  }else{
    return null;
  }
}

export async function updateProduct(id, input) {
  const existing = await getProductById(id);
  if (!existing) {
    return null;
  }

  const updated = buildProduct(
    {
      ...existing,
      ...input
    },
    existing.id
  );

  if (databaseReady && pool) {
    const result = await pool.query(
      `
        UPDATE products
        SET slug = $2,
            name = $3,
            description = $4,
            price = $5,
            rating = $6,
            currency = $7,
            sku = $8,
            images = $9::jsonb,
            availability = $10,
            category = $11,
            brand = $12,
            specifications = $13::jsonb,
            reviews = $14::jsonb,
            updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `,
      [
        existing.id,
        updated.slug,
        updated.name,
        updated.description,
        updated.price,
        updated.rating,
        updated.currency,
        updated.sku,
        JSON.stringify(updated.images),
        updated.availability,
        updated.category,
        updated.brand,
        JSON.stringify(updated.specifications),
        JSON.stringify(updated.reviews)
      ]
    );
    return normalizeRecord(result.rows[0]);
  }else{
    return null;
  }
}

export async function deleteProduct(id) {
  const existing = await getProductById(id);
  if (!existing) {
    return false;
  }

  if (databaseReady && pool) {
    await pool.query("DELETE FROM products WHERE id = $1", [existing.id]);
    return true;
  } else {
    return false;
  }
}
