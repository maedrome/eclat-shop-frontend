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
- **store-front** (`/`) - public catalog, product pages

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

## Key Files
- `src/app/app.config.ts` - app providers
- `src/app/app.routes.ts` - top-level routes with guards
- `src/app/auth/services/auth.service.ts` - JWT auth, signals
- `src/app/products/services/products.service.ts` - CRUD, caching, image upload
- `src/app/utils/form-utils.ts` - validation error messages
- `src/environments/environment.ts` - API base URL config
