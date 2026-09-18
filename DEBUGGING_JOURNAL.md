# Debugging Journal — Task 2 (Lessons 2.6–2.9)

**Student:** Chea Panharith  
**GitHub Repo:** [https://github.com/panharithhh/cheapanharith_Task-2-Typed-Debugged-Lessons-2.6-2.9](https://github.com/panharithhh/cheapanharith_Task-2-Typed-Debugged-Lessons-2.6-2.9)  

---

## Deliverable Sentence
> I used a breakpoint to catch the null state before `.map()` crashed the page, React DevTools to find the `inStock` prop typo that silently broke the badges with zero console errors, and the Network tab to spot the 404 URL typo that the console alone couldn't explain.

---

## 1. Bug 1: App Crash (`.map()` on null state)
- **Symptom:** Blank white screen when opening the catalog. Console gave `TypeError: Cannot read properties of null (reading 'map')`.
- **Tool:** Chrome DevTools Sources Tab Breakpoint.
- **What it showed:** I enabled "Pause on exceptions" and put a breakpoint right on the `.map()` line. The Scope pane showed `products` was `null` instead of an array.
- **Fix:** Initialized state to an empty array and added nullish coalescing `(products ?? []).map(...)`.

---

## 2. Bug 2: Silent Wrong Value (Prop name typo)
- **Symptom:** Every product badge said "Sold Out" even when the item was in stock. Console had zero errors.
- **Tool:** React DevTools (Components tree).
- **What it showed:** I clicked the `<ProductCard>` in the component tree. The prop was passed as `isAvailable: true` instead of `inStock`, so `inStock` was `undefined` inside the card.
- **Fix:** Fixed the prop name in the parent component to `inStock={product.inStock}` matching the `ProductCardProps` interface.

---

## 3. Bug 3: Network Failure (Mistyped API URL)
- **Symptom:** Clicking "Sync Catalog API" showed a red error alert and no products loaded.
- **Tool:** Chrome DevTools Network Tab.
- **What it showed:** Filtered by Fetch/XHR and saw a red 404 on `GET https://dummyjson.com/productss` because of an extra 's' at the end. Response tab showed `{"message": "Resource not found"}`.
- **Fix:** Fixed the URL from `/productss` to `/products` and added an `if (!response.ok)` check.

---

## Audit Checklist
- [x] `tsc` clean: 0 errors on `npx tsc --noEmit` and `npm run build`
- [x] Zero `any` anywhere in `src/`
- [x] All 3 entries name the exact DevTools tool used
