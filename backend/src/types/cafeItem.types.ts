export interface CafeItem {
  item_id: number;
  cafe_id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  quantity_in_stock: number;
  image_url?: string;
  deleted_at?: string | null;
}
