import React, { ChangeEvent } from 'react';
import { Product, categoryFields } from '@/utils/types';
import { Input } from '@/components/ui/input'; 
import { Label } from '@/components/ui/label'; 

interface ShoesFormProps {
  product: Product;
  setProduct: (product: Product) => void;
}

const Shoes: React.FC<ShoesFormProps> = ({ product, setProduct }) => {
  const handleInputChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;
    setProduct({ ...product, [name]: value });
  };

  const handleArrayInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const list = value.split(',').map(item => item.trim());
    setProduct({ ...product, [name]: list });
  };

  const generateShoeSpecificFields = () => {
    const fields = categoryFields['Shoes'];

    return fields.map(field => (
      <div className='mb-6' key={field.label}>
        <Label htmlFor={field.label} className='dark:text-foreground'>
          {field.label + (field.type === 'array' ? ' (comma-separated)' : '')}
        </Label>
        <Input
          className='mt-1 block w-full p-2 border-gray-300 dark:border-input rounded shadow-md dark:bg-card dark:text-foreground'
          type={field.type === 'number' ? 'number' : 'text'}
          id={field.label}
          name={field.label}
          value={
            field.type === 'array' &&
            Array.isArray(product[field.label as keyof Product])
              ? (
                  product[field.label as keyof Product] as string[] | number[]
                ).join(', ')
              : product[field.label as keyof Product] !== undefined
              ? (
                  product[field.label as keyof Product] as string | number
                ).toString()
              : ''
          }
          onChange={
            field.type === 'array' ? handleArrayInputChange : handleInputChange
          }
        />
      </div>
    ));
  };

  return (
    <div className='p-6 bg-white dark:bg-card shadow-md rounded-lg'>
      <h2 className='text-lg font-semibold mb-6 dark:text-foreground'>
        Customize Shoe Attributes
      </h2>
      {generateShoeSpecificFields()}
    </div>
  );
};

export default Shoes;
