export interface dataChart {
  period_of: string;
  price: number;
}

export interface commodityTimeSeries {
  commodity_id: number;
  name: string;
  unit: string;
  category?: string;
  data: dataChart[];
}

export async function getCommodityTimeSeries(commodityId: number): Promise<CommodityTimeSeries | null> {
  const sql = `
    SELECT 
      c.id as commodity_id,
      c.name,
      c.unit,
      c.category,
      p.price,
      p.period_of
    FROM commodities c
    JOIN price_logs p ON c.id = p.commodity_id
    WHERE c.id = $1
    ORDER BY p.period_of ASC;
  `;

  const result = await query(sql, [commodityId]);

  if (result.rows.length === 0) {
    return null;
  }

  const firstRow = result.rows[0];

  const dataPoints: ChartDataPoint[] = result.rows.map((row) => ({
    period_of: row.period_of,
    price: Number(row.price),
  }));

  return {
    commodityId: firstRow.commodity_id,
    name: firstRow.name,
    unit: firstRow.unit,
    category: firstRow.category,
    data: dataPoints,
  };
}
