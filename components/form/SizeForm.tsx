import React, { useState, ChangeEvent } from 'react';

interface SizeFormProps {
  initialSizes: string[];
  onSizesChange: (sizes: string[]) => void;
}

const SizeForm: React.FC<SizeFormProps> = ({ initialSizes, onSizesChange }) => {
  const [sizeInput, setSizeInput] = useState('');
  const [sizes, setSizes] = useState<string[]>(initialSizes);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSizeInput(event.target.value.toUpperCase()); // Convert input to uppercase if desired
  };

  const addSize = () => {
    if (!sizeInput) {
      setError('Please enter a size.');
      return;
    }
    if (sizes.includes(sizeInput)) {
      setError('This size has already been added.');
      return;
    }
    const updatedSizes = [...sizes, sizeInput];
    setSizes(updatedSizes);
    onSizesChange(updatedSizes);
    setSizeInput(''); // Clear input after adding
    setError(null);
  };

  const removeSize = (sizeToRemove: string) => {
    const updatedSizes = sizes.filter(size => size !== sizeToRemove);
    setSizes(updatedSizes);
    onSizesChange(updatedSizes);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission
      addSize();
    }
  };

  return (
    <div className='bg-white dark:bg-card p-4 border border-gray-300 dark:border-input rounded shadow space-y-2'>
      <h3 className='text-lg font-semibold dark:text-foreground'>
        Manage Sizes
      </h3>
      <div className='flex items-center space-x-2'>
        <input
          type='text'
          value={sizeInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder='Enter size (e.g., XS, S, M, L, 40, 42)'
          className='flex-1 border border-gray-300 dark:border-input p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-card dark:text-foreground'
        />
        <button
          onClick={addSize}
          className='bg-blue-500 hover:bg-blue-600 text-white dark:text-foreground px-4 py-2 rounded transition duration-150 ease-in-out'
        >
          Add
        </button>
      </div>
      {error && (
        <p className='text-red-500 dark:text-red-300 text-sm'>{error}</p>
      )}
      <div className='flex flex-wrap items-center gap-2'>
        {sizes.map((size, index) => (
          <div
            key={index}
            className='flex items-center gap-1 bg-gray-200 dark:bg-secondary px-2 py-1 rounded'
          >
            {size}
            <button
              onClick={() => removeSize(size)}
              className='text-red-500 hover:text-red-700 dark:hover:text-red-800'
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SizeForm;
