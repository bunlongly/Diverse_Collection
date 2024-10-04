import React, { useState, ChangeEvent } from 'react';

type ImagePreviewProps = {
  src: string;
  onRemove: () => void;
};

const ImagePreview: React.FC<ImagePreviewProps> = ({ src, onRemove }) => (
  <div className='relative w-24 h-24 m-1 border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden'>
    <img src={src} alt='Preview' className='w-full h-full object-cover' />
    <button
      className='absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 px-2 text-xs'
      onClick={onRemove}
    >
      &times;
    </button>
  </div>
);

const ProductImage: React.FC = () => {
  const [mainImage, setMainImage] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
    isMain: boolean = false
  ) => {
    const files = event.target.files;
    if (files && files[0]) {
      const fileReader = new FileReader();
      fileReader.onload = e => {
        const { result } = e.target!;
        if (isMain) {
          setMainImage(result as string);
        } else {
          setImages(prevImages => [...prevImages, result as string]);
        }
      };
      fileReader.readAsDataURL(files[0]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div className='p-4 bg-white dark:bg-card shadow-lg rounded-lg'>
      <h1 className='text-lg text-center p-6 dark:text-foreground'>
        Product Image
      </h1>
      <div className='grid grid-cols-3 gap-4'>
        <div className='col-span-2'>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 dark:text-foreground'>
              Product Main Image
            </label>
            <input
              type='file'
              onChange={e => handleImageChange(e, true)}
              className='mt-1 w-full'
            />
            {mainImage && (
              <div className='mt-2 border p-2 rounded-lg dark:border-gray-600'>
                <img
                  src={mainImage}
                  alt='Main Product'
                 className='w-full h-auto min-h-full object-cover rounded-md'
                />
              </div>
            )}
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-foreground'>
              Additional Images
            </label>
            <input
              type='file'
              onChange={handleImageChange}
              multiple
              className='mt-1 w-full'
            />
            <div className='flex flex-wrap gap-2 mt-2'>
              {images.map((src, index) => (
                <ImagePreview
                  key={index}
                  src={src}
                  onRemove={() => removeImage(index)}
                />
              ))}
            </div>
          </div>
        </div>
        <div>
          <p className='text-sm font-medium text-gray-700 dark:text-foreground mb-2'>
            Uploaded Images Preview
          </p>
          {images.length > 0 ? (
            images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Preview ${index}`}
                className='mb-2 w-full h-32 object-cover rounded-md'
              />
            ))
          ) : (
            <p className='text-gray-500 dark:text-gray-400'>
              No additional images uploaded.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductImage;
