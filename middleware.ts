import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/profile(.*)',
  '/products(.*)',
  '/categories(.*)',
  '/invoice(.*)',
  '/income(.*)',
  '/user(.*)'
]);

export default clerkMiddleware((auth, req) => {
  console.log(`Accessing: ${req.url}`); // Make sure you're logging the correct property
  if (isProtectedRoute(req)) {
    console.log('Protecting route:', req.url);
    auth().protect();
  } else {
    console.log('No protection needed for:', req.url);
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
};
