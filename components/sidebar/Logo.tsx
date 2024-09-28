// import Link from 'next/link';
// import Image from 'next/image';
// import { Button } from '../ui/button';

// function Logo() {
//   return (
//     <Button size='icon' asChild>
//       <Link href='/' passHref legacyBehavior>
//         <a className='inline-block relative w-16 h-16' >
//           {' '}
//           <Image
//             src='/images/DvC-logo 2.png'
//             alt='DvC Logo'
//             layout='responsive'
//             width={64} // Smaller dimensions to fit the navbar
//             height={64} // Keeping the layout responsive
//           />
//         </a>
//       </Link>
//     </Button>
//   );
// }

// export default Logo;



import Link from 'next/link';
import { LuTent } from 'react-icons/lu';
import { Button } from '../ui/button';

function Logo() {
  return (
    <Button size='icon' asChild>
      <Link href='/'>
        <LuTent className='w-6 h-6' />
      </Link>
    </Button>
  );
}
export default Logo
