### E-Commerce System

```sh
npx create-next-app@latest diverse-collection
```

```sh
would you like to use TypeScript? Yes
✔ Would you like to use ESLint? Yes
✔ Would you like to use Tailwind CSS? Yes
✔ Would you like to use `src/` directory? No 
✔ Would you like to use App Router? Yes
✔ Would you like to customize the default import alias (@/*)? No 
```

### Remove Boilerplate

- in globals.css remove all code after directives
- page.tsx

```tsx
function HomePage() {
  return <h1 className='text-3xl'>HomePage</h1>;
}
export default HomePage;
```

- layout.tsx

```tsx
export const metadata: Metadata = {
  title: 'HomeAway',
  description: 'Feel at home, away from home.',
};
```



```sh
npx shadcn@latest add breadcrumb calendar card checkbox dropdown-menu input label popover scroll-area select separator table textarea toast skeleton
```

```sh
✔ Which style would you like to use? › New York
✔ Which color would you like to use as the base color? › Zinc
? Would you like to use CSS variables for theming?  yes
```

### Clerk

[Clerk Docs](https://clerk.com/)
[Clerk + Next.js Setup](https://clerk.com/docs/quickstarts/nextjs)

- create new application

```sh
npm install @clerk/nextjs
```

- create .env.local

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

In Next.js, environment variables that start with NEXT*PUBLIC* are exposed to the browser. This means they can be accessed in your front-end code.

For example, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY can be used in both server-side and client-side code.

On the other hand, CLERK_SECRET_KEY is a server-side environment variable. It's not exposed to the browser, making it suitable for storing sensitive data like API secrets.


- create middleware.ts

```ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/profile(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
```


### Toast Component

[Toast](https://ui.shadcn.com/docs/components/toast)

providers.tsx

```tsx
'use client';
import { ThemeProvider } from './theme-provider';
import { Toaster } from '@/components/ui/toaster';

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster />
      <ThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </>
  );
}
export default Providers;
```

### SignOutLink

- redirectUrl

```tsx
'use client';

import { SignOutButton } from '@clerk/nextjs';
import { useToast } from '../ui/use-toast';

function SignOutLink() {
  const { toast } = useToast();
  const handleLogout = () => {
    toast({ description: 'You have been signed out.' });
  };
  return (
    <SignOutButton redirectUrl='/'>
      <button className='w-full text-left' onClick={handleLogout}>
        Logout
      </button>
    </SignOutButton>
  );
}
export default SignOutLink;
```

### Direct User

.env.local

```bash
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/profile/create
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/profile/create
```

### Create Profile

- profile
  - create

```tsx
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
const createProfileAction = async (formData: FormData) => {
  'use server';
  const firstName = formData.get('firstName') as string;
  console.log(firstName);
};

function CreateProfile() {
  return (
    <section>
      <h1 className='text-2xl font-semibold mb-8 capitalize'>new user</h1>
      <div className='border p-8 rounded-md max-w-lg'>
        <form action={createProfileAction}>
          <div className='mb-2'>
            <Label htmlFor='firstName'>First Name</Label>
            <Input id='firstName' name='firstName' type='text' />
          </div>
          <Button type='submit' size='lg'>
            Create Profile
          </Button>
        </form>
      </div>
    </section>
  );
}
export default CreateProfile;

### Zod

Zod is a JavaScript library for building schemas and validating data, providing type safety and error handling.

```sh
npm install zod
```

- create utils/schemas.ts

```ts
import * as z from 'zod';
import { ZodSchema } from 'zod';

export const profileSchema = z.object({
  // firstName: z.string().max(5, { message: 'max length is 5' }),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
});
```