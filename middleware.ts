import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// 🚨 Added /admin(.*) so Clerk protects both your public dashboard and admin panel
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/admin(.*)'])

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect()
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
