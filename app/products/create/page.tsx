'use client';
import React, { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Product, ProductCategory, IProductFormProps } from '@/utils/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ProductDefault from '@/components/form/ProductForm';
import { SubmitButton } from '@/components/form/Buttons';
import { createProductAction } from '@/utils/actions';

const CreateProduct: React.FC = () => {
  const [product, setProduct] = useState<Product>({
    name: 'AF1',
    brand: 'NIKE',
    genderCategory: 'UNISEX',
    category: 'Shoes',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    price: null, // Initialize as null
    inventoryStatus: 'In Stock',
    originalPrice: null, // Initialize as null
    sellingPrice: null, // Initialize as null
    countInStock: null, // Initialize as null
    sizes: [],
    colors: [],
    imageUrls: [],
    condition: 'New',
    releaseDate: null,
  });
  const [selectedProductType, setSelectedProductType] =
    useState<ProductCategory>('Shoes');

  const SpecificProductForm = React.useMemo(
    () =>
      dynamic<IProductFormProps>(
        () =>
          import(`@/components/form/${selectedProductType}Form`).catch(err => {
            console.error(
              `Failed to load component for type ${selectedProductType}:`,
              err
            );
            throw err;
          }),
        { loading: () => <LoadingSpinner />, ssr: false }
      ),
    [selectedProductType]
  );

  const handleProductTypeChange = (newCategory: ProductCategory) => {
    setProduct({ ...product, category: newCategory });
    setSelectedProductType(newCategory);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    Object.keys(product).forEach(key => {
      const value = product[key as keyof Product];
      if (value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item => formData.append(key, item));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    try {
      const response = await createProductAction(formData);
      alert('Product created successfully: ' + response.message);
    } catch (error) {
      alert('Failed to create product: ' + (error as Error).message);
      console.error('Product creation error:', error);
    }
  };

  return (
    <div className='p-10'>
      <h1 className='text-2xl font-bold mb-8'>Create Product</h1>
      <div className='mb-8 flex space-x-2'>
        {['Shoes', 'Bags', 'Perfumes', 'Belts', 'Clothes', 'Snacks'].map(
          category => (
            <button
              key={category}
              onClick={() =>
                handleProductTypeChange(category as ProductCategory)
              }
              className={`px-4 py-2 rounded-md text-white ${
                selectedProductType === category ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              {category}
            </button>
          )
        )}
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
        <SubmitButton
          text='Create Product'
          className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        />
      </form>
    </div>
  );
};

export default CreateProduct;
