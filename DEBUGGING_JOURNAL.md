# Debugging Journal — Task 2 (Lessons 2.6–2.9)

**Author:** Chea Panharith  
**Project:** Hardware & Tech Catalog Mini-App  
**Stack:** Vite + React 19 + TypeScript + Tailwind CSS  

---

## Executive Summary (Required Deliverable)

> **Which tool caught which bug—and why the console alone was not enough:**  
> I used a breakpoint to catch the null state before `.map()` crashed the page, React DevTools to find the `inStock` prop typo that silently broke the badges with zero console errors, and the Network tab to spot the 404 URL typo that the console alone couldn't explain.

---

## Bug Hunt Entries

### Entry 1: The App Crash (`.map()` on Null State)

- **Lesson Pattern:** Unhandled Null State / Array Iteration Crash (Lesson 2.8)
- **Symptom:**  
  When mounting or resetting the product catalog, the application completely crashed with a blank white screen. The standard console output provided an unhelpful minified error stack: `TypeError: Cannot read properties of null (reading 'map')`.
- **Diagnostic Tool:**  
  **Sources Tab Breakpoint** (Chrome Developer Tools).
- **What It Showed:**  
  - Setting an exception breakpoint on "Pause on caught/uncaught exceptions" and placing a line-of-code breakpoint directly on the catalog render loop paused JavaScript execution immediately prior to the crash.
  - Inspecting the **Scope Pane** revealed the local state variable `products` was evaluated to `null` rather than an instantiated array (`Product[]`). Because `null` does not possess the `Array.prototype.map` method, the invocation failed fatally.
- **Fix:**  
  1. Guaranteed state initialization with a non-null fallback: `useState<Product[]>(INITIAL_PRODUCTS)`.
  2. Applied nullish coalescing guard prior to iteration: `(products ?? []).map(...)`.
  3. Added TypeScript strict null check guards (`strictNullChecks: true`) so that `products` can never silently be assigned `null`.

```tsx
// Before (Crash):
const nullProductsState: PublicProduct[] = null as unknown as PublicProduct[]
return nullProductsState.map((item) => <div key={item.id}>{item.name}</div>)

// After (Fixed):
const displayedProducts = products ?? []
return displayedProducts.map((product) => (
  <ProductCard key={product.id} product={product} onDelete={handleDeleteProduct} />
))
```

---

### Entry 2: Silent Wrong Value (Prop Name Typo)

- **Lesson Pattern:** Prop Interface Mismatch / Silent UI Failure (Lesson 2.8 & 2.9)
- **Symptom:**  
  All product cards persistently displayed the "Sold Out" badge, even when products were in stock (`inStock: true`). No errors, warnings, or exceptions appeared in the browser console.
- **Diagnostic Tool:**  
  **React DevTools** (Components Tree Inspector).
- **What It Showed:**  
  - Selecting the `<ProductCard>` node inside the React DevTools Component Tree revealed its received `props`:
    - `isAvailable: true` (a misspelled prop name passed from parent)
    - `inStock: undefined` (the actual prop declared on `ProductCardProps`)
  - Because `inStock` was `undefined`, the JSX condition `product.inStock ? ... : ...` silently fell back to the falsy branch ("Sold Out") without throwing any JavaScript error.
- **Fix:**  
  1. Handled prop alignment by referencing the strictly typed `ProductCardProps` interface.
  2. Corrected the prop binding in the parent rendering loop to `<ProductCard product={product} ... />` ensuring the `product.inStock` boolean was correctly mapped.

```tsx
// Before (Silent Prop Typo):
// Parent passed: <ProductCard isAvailable={product.inStock} />
// ProductCard received undefined for `inStock`

// After (Fixed):
// Strict interface enforcement ensures accurate prop passing:
export interface ProductCardProps {
  product: PublicProduct
  onDelete: (id: string) => void
}

<ProductCard
  key={product.id}
  product={product}
  onDelete={handleDeleteProduct}
/>
```

---

### Entry 3: Network Failure (Mistyped URL Endpoint)

- **Lesson Pattern:** Asynchronous Fetch Failure & HTTP Status Inspection (Lesson 2.9)
- **Symptom:**  
  Clicking "Sync Catalog API" triggered an unexpected failure banner. The catalog list remained unchanged, and the generic console error only logged a high-level fetch error without clarifying why the remote service rejected the call.
- **Diagnostic Tool:**  
  **Network Tab** (Chrome Developer Tools).
- **What It Showed:**  
  - Filtering by **Fetch/XHR** requests highlighted the outgoing request in red with HTTP Status `404 Not Found`.
  - The Request URL showed: `https://dummyjson.com/productss?limit=3` (with an extra `s` at the end).
  - Inspecting the **Response Tab** showed the server's JSON payload: `{"message": "Resource not found"}`.
- **Fix:**  
  1. Corrected the endpoint URL typo from `productss` to `products`.
  2. Enhanced error handling in `handleSyncApi` to explicitly evaluate `response.ok` before attempting `.json()` parsing, providing actionable feedback if status code is non-2xx.

```tsx
// Before (Mistyped URL):
const endpoint = 'https://dummyjson.com/productss?limit=3' // 404 Not Found

// After (Fixed):
const endpoint = 'https://dummyjson.com/products?limit=3'
const response = await fetch(endpoint)
if (!response.ok) {
  throw new Error(`HTTP ${response.status} ${response.statusText} from ${endpoint}`)
}
```

---

## Audit Checklist Verification

- [x] **`tsc` Clean**: `npx tsc --noEmit` and `npm run build` pass with 0 errors.
- [x] **Zero `any`**: No `any` type used anywhere across the entire codebase.
- [x] **Strict Props Interfaces**: Every component defines and exports its own typed interface.
- [x] **Derived Types**: `PublicProduct` derived via `Omit`, form draft derived via `Partial`.
- [x] **Safe Optional Access**: `?.` combined with `??` for all nested/optional fields.
- [x] **Team Project Rules (AGENTS.md)**:
  - React 19 + TypeScript.
  - UI components strictly from `@/components/ui/`.
  - Styling via Tailwind CSS + `cn()`.
  - Icons exclusively from `lucide-react`.
  - State updates strictly immutable (`prev => ...`).
