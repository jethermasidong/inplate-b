export interface DataChart {
  period_of: string;
  price: number;
}

export interface CommodityTimeSeries {
  commodity_id: number;
  name: string;
  unit: string;
  category?: string;
  data: DataChart[];
}
