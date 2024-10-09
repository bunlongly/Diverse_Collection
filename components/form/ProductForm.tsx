import React, { ChangeEvent} from 'react';
import { Product } from '@/utils/types'; // Ensure this is the correct path to your types
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import ProductImage from './ProductImage';
import ColorForm from './ColorForm';
import SizeForm from './SizeForm';


interface ProductFormProps {
  product: Product;
  setProduct: (product: Product) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, setProduct }) => {
  // const [productSizes, setProductSizes] = useState<string[]>(
  //   product.sizes || []
  // );

  // Handle changes for inputs and textarea fields
  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setProduct({ ...product, [name]: value });
  };

  // Handle selection changes for dropdowns
  const handleSelectChange = (name: string, value: string) => {
    setProduct({ ...product, [name]: value });
  };

  // Handle changes for colors array
  const handleColorsChange = (colors: string[]) => {
    setProduct({ ...product, colors: colors });
  };

  const handleSizesChange = (sizes: string[]) => {
    setProduct({ ...product, sizes: sizes });
  };


  return (
    <div className='flex p-6 bg-white dark:bg-card border border-gray-200 dark:border-input shadow-lg rounded-lg space-x-4'>
      <div className='flex-1 space-y-4 max-w-2xl'>
        <h2 className='text-lg font-semibold dark:text-foreground'>
          Product Details
        </h2>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <Label htmlFor='name' className='dark:text-foreground'>
              Name
            </Label>
            <Input
              id='name'
              name='name'
              value={product.name || ''}
              onChange={handleInputChange}
              className='mt-1 block w-full p-2 border-gray-300 dark:border-input rounded shadow-md dark:bg-card dark:text-foreground'
            />
          </div>
          <div>
            <Label htmlFor='brand' className='dark:text-foreground'>
              Brand
            </Label>
            <Input
              id='brand'
              name='brand'
              value={product.brand || ''}
              onChange={handleInputChange}
              className='mt-1 block w-full p-2 border-gray-300 dark:border-input rounded shadow-md dark:bg-card dark:text-foreground'
            />
          </div>

          <div>
            <Label htmlFor='genderCategory' className='dark:text-foreground'>
              Gender Category
            </Label>
            <Select
              value={product.genderCategory}
              onValueChange={value =>
                handleSelectChange('genderCategory', value)
              }
            >
              <SelectTrigger className='border-gray-300 dark:border-input rounded shadow-md dark:bg-card dark:text-foreground'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['Men', 'Women', 'UNISEX'].map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor='condition' className='dark:text-foreground'>
              Condition
            </Label>
            <Select
              value={product.condition}
              onValueChange={value =>
                handleSelectChange('condition', value)
              }
            >
              <SelectTrigger className='border-gray-300 dark:border-input rounded shadow-md dark:bg-card dark:text-foreground'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['New', 'Used', 'Refurbished'].map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>


          <div className='col-span-2'>
            <Label htmlFor='releaseDate' className='dark:text-foreground'>
              Release Date
            </Label>
            <Input
              id='releaseDate'
              name='releaseDate'
              type='date'
              value={product.releaseDate || ''}
              onChange={handleInputChange}
              className='mt-1 block w-full p-2 border-gray-300 dark:border-input rounded shadow-md dark:bg-card dark:text-foreground'
            />
          </div>

          

          <div className='col-span-2'>
            <Label htmlFor='description' className='dark:text-foreground'>
              Description
            </Label>
            <Textarea
              id='description'
              name='description'
              value={product.description || ''}
              onChange={handleInputChange}
              className='mt-1 block w-full p-2 border-gray-300 dark:border-input rounded shadow-md dark:bg-card dark:text-foreground'
              style={{ resize: 'none' }}
            />
          </div>
          <div className='col-span-2'>
            <ColorForm
              initialColors={product.colors || []}
              onColorsChange={handleColorsChange}
            />
            <SizeForm
              initialSizes={product.sizes || []}
              onSizesChange={handleSizesChange}
            />
          </div>
          <div>
            <Label htmlFor='price' className='dark:text-foreground'>
              Price
            </Label>
            <Input
              id='price'
              name='price'
              type='number'
              value={product.price || ''}
              onChange={handleInputChange}
              className='mt-1 block w-full p-2 border-gray-300 dark:border-input rounded shadow-md dark:bg-card dark:text-foreground'
            />
          </div>
          <div>
            <Label htmlFor='originalPrice' className='dark:text-foreground'>
              Original Price
            </Label>
            <Input
              id='originalPrice'
              name='originalPrice'
              type='number'
              value={product.originalPrice || ''}
              onChange={handleInputChange}
              className='mt-1 block w-full p-2 border-gray-300 dark:border-input rounded shadow-md dark:bg-card dark:text-foreground'
            />
          </div>
          <div>
            <Label htmlFor='sellingPrice' className='dark:text-foreground'>
              Selling Price
            </Label>
            <Input
              id='sellingPrice'
              name='sellingPrice'
              type='number'
              value={product.sellingPrice || ''}
              onChange={handleInputChange}
              className='mt-1 block w-full p-2 border-gray-300 dark:border-input rounded shadow-md dark:bg-card dark:text-foreground'
            />
          </div>
          <div>
            <Label htmlFor='countInStock' className='dark:text-foreground'>
              Count In Stock
            </Label>
            <Input
              id='countInStock'
              name='countInStock'
              type='number'
              value={product.countInStock || ''}
              onChange={handleInputChange}
              className='mt-1 block w-full p-2 border-gray-300 dark:border-input rounded shadow-md dark:bg-card dark:text-foreground'
            />
          </div>
        </div>
      </div>
      <div className='pl-8 w-1/2'>
        <ProductImage />
      </div>
    </div>
  );
};

export default ProductForm;
