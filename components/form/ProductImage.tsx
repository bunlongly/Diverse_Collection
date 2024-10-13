import React, { useState, ChangeEvent, useCallback } from 'react';

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

interface ProductImageProps {
  images: string[];
  setImages: (images: string[]) => void;
}

const ProductImage: React.FC<ProductImageProps> = ({ images, setImages }) => {
  const [mainImage, setMainImage] = useState<string>('');

  const handleImageChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>, isMain: boolean = false) => {
      const files = event.target.files;
      if (files) {
        Array.from(files).forEach(file => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            if (isMain) {
              setMainImage(result);
              setImages([result, ...images]);
            } else {
              const updatedImages = [...images, result];
              setImages(updatedImages);
            }
          };
          reader.readAsDataURL(file);
        });
      }
    },
    [images, setImages]
  );

  const removeImage = useCallback(
    (index: number) => {
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
      if (mainImage && index === 0 && newImages.length) {
        setMainImage(newImages[0]);
      } else if (images[index] === mainImage) {
        setMainImage('');
      }
    },
    [images, setImages, mainImage]
  );

  const clearAllImages = useCallback(() => {
    setMainImage('');
    setImages([]);
  }, [setImages]);

  return (
    <div className='p-4 bg-white dark:bg-card shadow-lg rounded-lg'>
      <h1 className='text-lg text-center p-6 dark:text-foreground'>
        Product Images
      </h1>
      <div className='grid grid-cols-3 gap-4'>
        <div className='col-span-2'>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 dark:text-foreground'>
              Main Image
            </label>
            <input
              type='file'
              accept='image/*'
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
              accept='image/*'
              onChange={e => handleImageChange(e, false)}
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
          {(mainImage || images.length > 0) && (
            <button
              onClick={clearAllImages}
              className='mt-4 bg-red-500 text-white py-2 px-4 rounded'
              type='button'
            >
              Clear All Images
            </button>
          )}
        </div>
        <div className='col-span-1'>
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
