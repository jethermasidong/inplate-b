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
