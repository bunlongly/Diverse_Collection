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