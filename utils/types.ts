export type actionFunction = (
  prevState: any,
  formData: FormData
) => Promise<{ message: string }>;

export type ProductCategory =
  | 'Shoes'
  | 'Bags'
  | 'Perfumes'
  | 'Belts'
  | 'Clothes'
  | 'Snacks';

export interface Product {
  name: string;
  brand: string;
  genderCategory: 'Men' | 'Women' | 'UNISEX';
  category: ProductCategory;
  description: string;
  price: number | null;
  inventoryStatus: 'In Stock' | 'Out of Stock' | 'Pre-order';
  sizes: string[];
  colors: string[];
  imageUrls: string[];
  originalPrice: number | null;
  sellingPrice: number | null;
  countInStock: number | null;
  releaseDate: number | null;
  condition: 'New' | 'Used' | 'Refurbished';
  color: string[];
}

// Define more specific types for fields within each category
interface FieldDetail {
  label: string;
  type: 'string' | 'number' | 'array' | 'boolean'; // Define more types as needed
}

export type CategoryFields = {
  [key in ProductCategory]: FieldDetail[];
};

// Define the fields for each category with detailed type information
export const categoryFields: CategoryFields = {
  Shoes: [
    { label: 'Material', type: 'string' },
    { label: 'Sole Type', type: 'string' }
  ],
  Bags: [
    { label: 'Strap Length', type: 'number' },
    { label: 'Material', type: 'string' },
    { label: 'Dimensions', type: 'string' }
  ],
  Perfumes: [
    { label: 'Scent Notes', type: 'string' },
    { label: 'Volume', type: 'number' }
  ],
  Belts: [
    { label: 'Belt Width', type: 'number' },
    { label: 'Buckle Type', type: 'string' }
  ],
  Clothes: [
    { label: 'Fabric Type', type: 'string' },
    { label: 'Care Instructions', type: 'string' }
  ],
  Snacks: [
    { label: 'Ingredients', type: 'string' },
    { label: 'Nutritional Information', type: 'string' }
  ]
};

export interface IProductFormProps {
  product: Product;
  setProduct: React.Dispatch<React.SetStateAction<Product>>;
}
