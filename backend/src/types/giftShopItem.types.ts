export interface GiftShopItem {
  item_id: number;
  gift_shop_id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  cost: number;
  quantity_in_stock: number;
  supplier: string;
  image_url?: string;
  deleted_at?: string | null;
}
