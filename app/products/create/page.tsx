'use client';
import React, { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Product, ProductCategory, IProductFormProps } from '@/utils/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ProductDefault from '@/components/form/ProductForm';

const initialProductState: Product = {
  name: 'AF1',
  brand: '',
  genderCategory: 'UNISEX',
  category: 'Shoes',
  description: '',
  price: 0,
  inventoryStatus: 'In Stock',
  originalPrice: 0,
  sellingPrice: 0,
  countInStock: 0,
  sizes: [],
  colors: [],
  imageUrls: [],
  releaseDate: 0,
  color: []
};

const CreateProduct: React.FC = () => {
  const [product, setProduct] = useState<Product>(initialProductState);
  const [selectedProductType, setSelectedProductType] =
    useState<ProductCategory>('Shoes');

  const categories = [
    'Shoes',
    'Bags',
    'Perfumes',
    'Belts',
    'Clothes',
    'Snacks'
  ];

  // Using dynamic to load the specific form with type assertion
  const SpecificProductForm = dynamic<IProductFormProps>(
    () =>
      import(`@/components/form/${selectedProductType}Form`).catch(err => {
        console.error(
          `Failed to load component for type ${selectedProductType} at path: '@/components/form/${selectedProductType}Form'`
        );
        console.error(err);
        throw err; // Rethrow to avoid silent failure if no fallback
      }),
    {
      loading: () => <LoadingSpinner />,
      ssr: false
    }
  );

  const handleProductTypeChange = (newCategory: ProductCategory) => {
    setProduct({ ...initialProductState, category: newCategory });
    setSelectedProductType(newCategory);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Submitting product:', product);
  };

  return (
    <div className='p-10'>
      <h1 className='text-2xl font-bold mb-8'>Create Product</h1>
      <div className='mb-8 flex space-x-2'>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => handleProductTypeChange(category as ProductCategory)}
            className={`px-4 py-2 rounded-md text-white ${
              selectedProductType === category ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <Suspense
          fallback={
            <div>
              Loading form... <LoadingSpinner />
            </div>
          }
        >
          <ProductDefault product={product} setProduct={setProduct} />
          <SpecificProductForm product={product} setProduct={setProduct} />
        </Suspense>
        <button
          type='submit'
          className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
