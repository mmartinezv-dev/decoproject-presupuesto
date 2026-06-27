export interface ProductEntity {
  id?: number;
  name: string;
  description: string;
  unit: string;
  price: number;
  categoryId?: number;
  category?: {
    id: number;
    name: string;
    sortOrder: number;
  };
}
