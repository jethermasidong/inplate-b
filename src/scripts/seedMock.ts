import { query } from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const mockData = [
  {
    name: "Regular Milled Rice",
    specification: "Commercial",
    unit: "kg",
    market: "NCR",
    period_of: "2026-09-28 - 2026-10-04",
    price: 45.00
  },
  {
    name: "Regular Milled Rice",
    specification: "Commercial",
    unit: "kg",
    market: "NCR",
    period_of: "2026-10-05 - 2026-10-11",
    price: 46.50
  },
  {
    name: "Well-Milled Rice",
    specification: "Commercial",
    unit: "kg",
    market: "NCR",
    period_of: "2026-09-28 - 2026-10-04",
    price: 52.00
  },
  {
    name: "Well-Milled Rice",
    specification: "Commercial",
    unit: "kg",
    market: "NCR",
    period_of: "2026-10-05 - 2026-10-11",
    price: 53.00
  },
  {
    name: "Red Onion",
    specification: "Local",
    unit: "kg",
    market: "NCR",
    period_of: "2026-09-28 - 2026-10-04",
    price: 120.00
  },
  {
    name: "Red Onion",
    specification: "Local",
    unit: "kg",
    market: "NCR",
    period_of: "2026-10-05 - 2026-10-11",
    price: 115.00
  },
  {
    name: "Bangus",
    specification: "Fresh",
    unit: "kg",
    market: "NCR",
    period_of: "2026-09-28 - 2026-10-04",
    price: 180.00
  },
  {
    name: "Bangus",
    specification: "Fresh",
    unit: "kg",
    market: "NCR",
    period_of: "2026-10-05 - 2026-10-11",
    price: 185.00
  }
];

async function seedMockData() {
  try {
    console.log("🌱 Seeding database with mock agricultural data...");

    for (const item of mockData) {
      const commodityResult = await query(
        `INSERT INTO commodities (name, specification, unit)
         VALUES ($1, $2, $3)
         ON CONFLICT (name) DO UPDATE SET specification = EXCLUDED.specification
         RETURNING id;`,
        [item.name, item.specification, item.unit]
      );

      const commodityId = commodityResult.rows[0].id;

      await query(
        `INSERT INTO price_logs (commodity_id, price, market, period_of)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT DO NOTHING;`,
        [commodityId, item.price, item.market, item.period_of]
      );
    }

    console.log("🎉 Mock data seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding mock data:", error);
    process.exit(1);
  }
}

seedMockData();