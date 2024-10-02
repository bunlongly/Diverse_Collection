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
  description: 'Feel at home, away from home.'
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

const isProtectedRoute = createRouteMatcher(['/profile(.*)']);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
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

````tsx
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
````

- create utils/schemas.ts

```ts
import * as z from 'zod';
import { ZodSchema } from 'zod';

export const profileSchema = z.object({
  // firstName: z.string().max(5, { message: 'max length is 5' }),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string()
});
```

### Prisma

- install prisma vs-code extension

Prisma ORM is a database toolkit that simplifies database access in web applications. It allows developers to interact with databases using a type-safe and auto-generated API, making database operations easier and more secure.

- Prisma server: A standalone infrastructure component sitting on top of your database.
- Prisma client: An auto-generated library that connects to the Prisma server and lets you read, write and stream data in your database. It is used for data access in your applications.

```sh
npm install prisma --save-dev
npm install @prisma/client

```

```sh
npx prisma init
```

### Setup Instance

In development, the command next dev clears Node.js cache on run. This in turn initializes a new PrismaClient instance each time due to hot reloading that creates a connection to the database. This can quickly exhaust the database connections as each PrismaClient instance holds its own connection pool.

(Prisma Instance)[https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices#solution]

````

- npx prisma migrate dev --name init
- npx prisma db push

npx prisma migrate dev --name init creates a new migration for your database schema
changes and applies it, while npx prisma db push directly updates the database schema without creating a migration. In the context of databases, a migration is set of operations, that modify the database schema, helping it evolve over time while preserving existing data.

```bash

npx prisma db push
````

```bash
npx prisma studio


Use prisma db push for quick schema prototyping in development.
Use prisma generate to keep your Prisma client up to date with your schema, both in development and production.
Use prisma migrate for managing database changes in production safely through migrations.

```

## Optional - Prisma Crud

[Prisma Docs](https://www.prisma.io/docs/concepts/components/prisma-client/crud)

- Get All Records

```js
const tasks = await prisma.task.findMany();
```

- Get record by ID or unique identifier

```js
// By unique identifier
const user = await prisma.user.findUnique({
  where: {
    email: 'elsa@prisma.io'
  }
});

// By ID
const task = await prisma.task.findUnique({
  where: {
    id: id
  }
});
```

- Update Record

```js
const updateTask = await prisma.task.update({
  where: {
    id: id
  },
  data: {
    content: 'updated task'
  }
});
```

- Update or create records

```js
const upsertTask = await prisma.task.upsert({
  where: {
    id: id
  },
  update: {
    content: 'some value'
  },
  create: {
    content: 'some value'
  }
});
```

- Delete a single record

```js
const deleteTask = await prisma.task.delete({
  where: {
    id: id
  }
});
```

````

```bash
npx prisma db push
````

```bash
npx prisma studio
```

### CreateProfile Action - Complete

[Clerk User Metadata](https://clerk.com/docs/users/metadata)

```ts
import db from './db';
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const createProfileAction = async (
  prevState: any,
  formData: FormData
) => {
  try {
    const user = await currentUser();
    if (!user) throw new Error('Please login to create a profile');

    const rawData = Object.fromEntries(formData);
    const validatedFields = profileSchema.parse(rawData);

    await db.profile.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        profileImage: user.imageUrl ?? '',
        ...validatedFields
      }
    });
    await clerkClient.users.updateUserMetadata(user.id, {
      privateMetadata: {
        hasProfile: true
      }
    });
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : 'An error occurred'
    };
  }
  redirect('/');
};
```

### FetchProfileImage

actions.ts

```ts
export const fetchProfileImage = async () => {
  const user = await currentUser();
  if (!user) return null;

  const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id
    },
    select: {
      profileImage: true
    }
  });
  return profile?.profileImage;
};
```

- components/navbar/UserIcon.tsx

```tsx
import { LuUser2 } from 'react-icons/lu';
import { fetchProfileImage } from '@/utils/actions';

async function UserIcon() {
  const profileImage = await fetchProfileImage();

  if (profileImage)
    return (
      <img src={profileImage} className='w-6 h-6 rounded-full object-cover' />
    );
  return <LuUser2 className='w-6 h-6 bg-primary rounded-full text-white' />;
}
export default UserIcon;
```

### Modify Create Profile

```tsx
import { currentUser } from '@clerk/nextjs/server';

import { redirect } from 'next/navigation';
async function CreateProfile() {
  const user = await currentUser();
  if (user?.privateMetadata?.hasProfile) redirect('/');
  ....
}
```

### Update Profile

actions.ts

```ts
const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) {
    throw new Error('You must be logged in to access this route');
  }
  if (!user.privateMetadata.hasProfile) redirect('/profile/create');
  return user;
};
```

```ts
export const fetchProfile = async () => {
  const user = await getAuthUser();

  const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id
    }
  });
  if (!profile) return redirect('/profile/create');
  return profile;
};
```

```ts
export const updateProfileAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  return { message: 'update profile action' };
};
```

app/profile/page.tsx

```tsx
import FormContainer from '@/components/form/FormContainer';
import { updateProfileAction, fetchProfile } from '@/utils/actions';
import FormInput from '@/components/form/FormInput';
import { SubmitButton } from '@/components/form/Buttons';

async function ProfilePage() {
  const profile = await fetchProfile();

  return (
    <section>
      <h1 className='text-2xl font-semibold mb-8 capitalize'>user profile</h1>
      <div className='border p-8 rounded-md'>
        {/* image input container */}

        <FormContainer action={updateProfileAction}>
          <div className='grid gap-4 md:grid-cols-2 mt-4 '>
            <FormInput
              type='text'
              name='firstName'
              label='First Name'
              defaultValue={profile.firstName}
            />
            <FormInput
              type='text'
              name='lastName'
              label='Last Name'
              defaultValue={profile.lastName}
            />
            <FormInput
              type='text'
              name='username'
              label='Username'
              defaultValue={profile.username}
            />
          </div>
          <SubmitButton text='Update Profile' className='mt-8' />
        </FormContainer>
      </div>
    </section>
  );
}
export default ProfilePage;
```

actions.ts

```ts
export const updateProfileAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);

    const validatedFields = profileSchema.parse(rawData);

    await db.profile.update({
      where: {
        clerkId: user.id
      },
      data: validatedFields
    });
    revalidatePath('/profile');
    return { message: 'Profile updated successfully' };
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : 'An error occurred'
    };
  }
};
```

### Alternative Error Handling

actions.ts

```ts
const renderError = (error: unknown): { message: string } => {
  console.log(error);
  return {
    message: error instanceof Error ? error.message : 'An error occurred'
  };
};
```

```ts
export const updateProfileAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);

    const validatedFields = profileSchema.safeParse(rawData);
    if (!validatedFields.success) {
      const errors = validatedFields.error.errors.map(error => error.message);
      throw new Error(errors.join(','));
    }

    await db.profile.update({
      where: {
        clerkId: user.id
      },
      data: validatedFields.data
    });
    revalidatePath('/profile');
    return { message: 'Profile updated successfully' };
  } catch (error) {
    return renderError(error);
  }
};
```

### ValidateWithZodSchema

schemas.ts

```ts
export function validateWithZodSchema<T>(
  schema: ZodSchema<T>,
  data: unknown
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map(error => error.message);

    throw new Error(errors.join(', '));
  }
  return result.data;
}
```

actions.ts

```ts
// createProfileAction

const validatedFields = validateWithZodSchema(profileSchema, rawData);

// updateProfileAction
const validatedFields = validateWithZodSchema(profileSchema, rawData);

await db.profile.update({
  where: {
    clerkId: user.id
  },
  data: validatedFields
});
```

### ImageInput

components/form/ImageInput.tsx

```tsx
import { Label } from '../ui/label';
import { Input } from '../ui/input';

function ImageInput() {
  const name = 'image';
  return (
    <div className='mb-2'>
      <Label htmlFor={name} className='capitalize'>
        Image
      </Label>
      <Input
        id={name}
        name={name}
        type='file'
        required
        accept='image/*'
        className='max-w-xs'
      />
    </div>
  );
}
export default ImageInput;
```

### SubmitButton

```tsx
type btnSize = 'default' | 'lg' | 'sm';

type SubmitButtonProps = {
  className?: string;
  text?: string;
  size?: btnSize;
};

export function SubmitButton({
  className = '',
  text = 'submit',
  size = 'lg'
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      type='submit'
      disabled={pending}
      className={`capitalize ${className}`}
      size={size}
    >
      {pending ? (
        <>
          <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
          Please wait...
        </>
      ) : (
        text
      )}
    </Button>
  );
}
```

### ImageInputContainer

components/form/ImageInputContainer.tsx

```tsx
'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import FormContainer from './FormContainer';
import ImageInput from './ImageInput';
import { SubmitButton } from './Buttons';
import { type actionFunction } from '@/utils/types';
import { LuUser2 } from 'react-icons/lu';

type ImageInputContainerProps = {
  image: string;
  name: string;
  action: actionFunction;
  text: string;
  children?: React.ReactNode;
};

function ImageInputContainer(props: ImageInputContainerProps) {
  const { image, name, action, text } = props;
  const [isUpdateFormVisible, setUpdateFormVisible] = useState(false);

  const userIcon = (
    <LuUser2 className='w-24 h-24 bg-primary rounded-md text-white mb-4' />
  );
  return (
    <div>
      {image ? (
        <Image
          src={image}
          width={100}
          height={100}
          className='rounded-md object-cover mb-4 w-24 h-24'
          alt={name}
        />
      ) : (
        userIcon
      )}

      <Button
        variant='outline'
        size='sm'
        onClick={() => setUpdateFormVisible(prev => !prev)}
      >
        {text}
      </Button>
      {isUpdateFormVisible && (
        <div className='max-w-lg mt-4'>
          <FormContainer action={action}>
            {props.children}
            <ImageInput />
            <SubmitButton size='sm' />
          </FormContainer>
        </div>
      )}
    </div>
  );
}
export default ImageInputContainer;
```

### updateProfileImageAction

actions.ts

```ts
export const updateProfileImageAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  return { message: 'Profile image updated successfully' };
};
```

### Profile Page

```tsx
import {
  updateProfileAction,
  fetchProfile,
  updateProfileImageAction
} from '@/utils/actions';

import ImageInputContainer from '@/components/form/ImageInputContainer';

/* image input container */

<ImageInputContainer
  image={profile.profileImage}
  name={profile.username}
  action={updateProfileImageAction}
  text='Update Profile Image'
/>;
```

### Remote Patterns

```mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com'
      }
    ]
  }
};

export default nextConfig;
```

### imageSchema

schemas.ts

```ts
export const imageSchema = z.object({
  image: validateFile()
});

function validateFile() {
  const maxUploadSize = 1024 * 1024;
  const acceptedFileTypes = ['image/'];
  return z
    .instanceof(File)
    .refine(file => {
      return !file || file.size <= maxUploadSize;
    }, `File size must be less than 1 MB`)
    .refine(file => {
      return (
        !file || acceptedFileTypes.some(type => file.type.startsWith(type))
      );
    }, 'File must be an image');
}
```

The .refine() method in Zod is used to add custom validation to a Zod schema. It takes two arguments:

A function that takes a value and returns a boolean. This function is the validation rule. If it returns true, the validation passes. If it returns false, the validation fails.
A string that is the error message to be returned when the validation fails.

### updateProfileImageAction

```ts
export const updateProfileImageAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  try {
    const image = formData.get('image') as File;
    const validatedFields = validateWithZodSchema(imageSchema, { image });

    return { message: 'Profile image updated successfully' };
  } catch (error) {
    return renderError(error);
  }
};
```
