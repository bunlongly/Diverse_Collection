import { Input } from '../ui/input';

function Search() {
  return (
    <Input
      type='search'
      placeholder='find a property...'
      className='max-w-xs dark:bg-muted '
    />
  );
}
export default Search;