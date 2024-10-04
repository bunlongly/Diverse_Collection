import React, { useState, ChangeEvent, KeyboardEvent } from 'react';

interface ColorFormProps {
  initialColors: string[];
  onColorsChange: (colors: string[]) => void;
}

const ColorForm: React.FC<ColorFormProps> = ({
  initialColors = [],
  onColorsChange
}) => {
  const [colorInput, setColorInput] = useState<string>('#');
  const [colors, setColors] = useState<string[]>(initialColors);
  const [error, setError] = useState<string | null>(null);

  const handleColorInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setColorInput(value.startsWith('#') ? value : `#${value}`);
    if (error) setError(null);
  };

  const addColor = () => {
    const trimmedColor = colorInput.trim().toUpperCase();
    if (trimmedColor === '#') {
      setError('Color code cannot be empty.');
      return;
    }
    if (!/^#[0-9A-F]{6}$/i.test(trimmedColor)) {
      setError('Invalid hex color code. Please use the format: #1A2B3C.');
      return;
    }
    if (colors.includes(trimmedColor)) {
      setError('This color has already been added.');
      return;
    }
    const newColors = [...colors, trimmedColor];
    setColors(newColors);
    onColorsChange(newColors);
    setColorInput('#');
  };

  const removeColor = (colorToRemove: string) => {
    const filteredColors = colors.filter(color => color !== colorToRemove);
    setColors(filteredColors);
    onColorsChange(filteredColors);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addColor();
    }
  };

  return (
    <div className='bg-white dark:bg-card p-4 border border-gray-300 dark:border-input rounded shadow space-y-2'>
      <h3 className='text-lg font-semibold dark:text-foreground'>
        Manage Colors
      </h3>
      <div className='flex items-center space-x-2'>
        <input
          type='text'
          value={colorInput}
          onChange={handleColorInputChange}
          onKeyDown={handleKeyDown}
          placeholder='#1A2B3C'
          className='flex-1 border border-gray-300 dark:border-input p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-card dark:text-foreground'
        />
        <button
          onClick={addColor}
          className='bg-blue-500 hover:bg-blue-600 text-white dark:text-foreground px-4 py-2 rounded transition duration-150 ease-in-out'
        >
          Add
        </button>
      </div>
      {error && (
        <p className='text-red-500 dark:text-red-300 text-sm'>{error}</p>
      )}
      <div className='flex flex-wrap items-center gap-2'>
        {colors.map((color, index) => (
          <div
            key={index}
            className='flex items-center gap-1 bg-gray-200 dark:bg-secondary px-2 py-1 rounded'
          >
            <div
              style={{ backgroundColor: color }}
              className='w-6 h-6 rounded-full'
            ></div>
            <button
              onClick={() => removeColor(color)}
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

export default ColorForm;
