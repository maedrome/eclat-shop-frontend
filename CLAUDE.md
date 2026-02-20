# Teslo Shop - Angular 19 E-commerce App

## Commands
- `npm start` - dev server at http://localhost:4200
- `npm run build` - production build (output: dist/teslo-shop)
- `npm test` - unit tests (Karma/Jasmine)

## Architecture
Angular 19 standalone app (no NgModules). All components use `standalone: true`.

### Feature Areas (all lazy-loaded)
- **auth** (`/auth`) - login, register; guarded by `NotAuthenticatedGuard`
- **admin-dashboard** (`/admin`) - product management; guarded by `IsAdminGuard` (role-based)
- **store-front** (`/`) - public catalog, product pages, cart, checkout, orders
- **cart** - cart service, interfaces, components (shared across store-front)

### Routing
- Hash-based routing (`withHashLocation()`)
- Guards use `CanMatchFn` (functional guards, not class-based)
- Route files: `src/app/{feature}/{feature}.routes.ts`

### Providers (app.config.ts)
- `provideRouter(routes, withHashLocation())`
- `provideHttpClient(withFetch(), withInterceptors([authInterceptor]))`
- `provideZoneChangeDetection({ eventCoalescing: true })`

## Path Aliases (tsconfig.json)
- `@auth/*` -> `src/app/auth/*`
- `@products/*` -> `src/app/products/*`
- `@shared/*` -> `src/app/shared/*`
- `@store-front/*` -> `src/app/store-front/*`
- `@admin-dashboard/*` -> `src/app/admin-dashboard/*`
- `@utils/*` -> `src/app/utils/*`
- `@cart/*` -> `src/app/cart/*`

## State Management
- **Signals** for reactive state (`signal()`, `computed()`)
- **`rxResource`** for async data loading tied to component lifecycle
- **Map-based caching** in `ProductsService` for products/queries

## Auth
- JWT stored in `localStorage` under key `token`
- Functional interceptor (`auth.interceptor.ts`) adds `Bearer` token to all requests
- `AuthService` exposes `authStatus`, `user`, `token` as computed signals
- Auth status: `'checking' | 'authenticated' | 'not-authenticated'`

## Backend API
- NestJS REST API (Teslo Shop)
- Base URL in `src/environments/environment.ts` and `environment.development.ts`
- Production: `https://nest-tesloshop-lcy9.onrender.com/api`
- Local dev: `http://localhost:3000/api` (commented out by default)

## Styling
- Tailwind CSS v4 + DaisyUI v5
- Custom Montserrat font

## Cart & Checkout System
- **CartService** (`@cart/services/cart.service.ts`) - Signals + localStorage hybrid
  - Guest users: stores cart in `localStorage['guest_cart']` as `LocalCartItem[]`
  - Authenticated: calls backend `/api/cart` endpoints
  - Auto-merges guest cart on login via `effect()` watching `authService.authStatus()`
- **OrdersService** (`@cart/services/orders.service.ts`) - order CRUD via HTTP
- **Cart sidebar** - DaisyUI drawer in store-front-layout
- **IsAuthenticatedGuard** - protects `/checkout`, `/orders`, `/payment-result`

### Store-Front Routes
- `/cart` - full cart page
- `/checkout` - shipping form + order summary (guarded)
- `/payment-result` - PayPhone redirect callback, confirms payment (guarded)
- `/orders` - order history (guarded)
- `/orders/:id` - order detail (guarded)

### PayPhone Payment Flow
1. User fills shipping form on `/checkout`, clicks "Pay with PayPhone"
2. Backend creates Order + calls PayPhone `/api/button/Prepare`
3. Frontend redirects to PayPhone payment page (`window.location.href`)
4. User pays on PayPhone → redirected back to `/#/payment-result?id=X&clientTransactionId=Y`
5. Frontend calls `POST /api/orders/confirm` → backend confirms with PayPhone
6. Success/failure page shown

## Key Files
- `src/app/app.config.ts` - app providers
- `src/app/app.routes.ts` - top-level routes with guards
- `src/app/auth/services/auth.service.ts` - JWT auth, signals
- `src/app/auth/guards/is-authenticated.guard.ts` - redirects to login if not auth'd
- `src/app/products/services/products.service.ts` - CRUD, caching, image upload
- `src/app/cart/services/cart.service.ts` - cart state management (signals + localStorage)
- `src/app/cart/services/orders.service.ts` - order API calls
- `src/app/store-front/store-front.routes.ts` - all store routes including cart/checkout/orders
- `src/app/utils/form-utils.ts` - validation error messages
- `src/environments/environment.ts` - API base URL config
