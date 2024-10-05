import { Input } from '../ui/input';

function Search() {
  return (
    <Input
      type='search'
      placeholder='find a product...'
      className='max-w-xs dark:bg-muted '
    />
  );
}
export default Search;