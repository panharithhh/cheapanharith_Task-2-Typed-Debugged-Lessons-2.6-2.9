import React, { useState, useMemo, useCallback } from 'react'
import { ProductHeader } from '@/components/ProductHeader'
import { ProductCard } from '@/components/ProductCard'
import { ProductForm } from '@/components/ProductForm'
import { FilterBar } from '@/components/FilterBar'
import { DebuggingLab } from '@/components/DebuggingLab'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCcw } from 'lucide-react'
import type { Product, PublicProduct, ProductFormDraft } from '@/types'

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Logitech MX Master 3S',
    price: 99.99,
    inStock: true,
    onSale: true,
    category: 'Peripherals',
    internalCost: 54.0,
    internalSupplierNote: 'Tier 1 bulk rate, supplier Shenzen-A',
    details: {
      manufacturer: 'Logitech',
      warrantyMonths: 24,
      origin: 'Vietnam',
    },
  },
  {
    id: 'prod-002',
    name: 'Keychron Q1 Pro Mechanical Keyboard',
    price: 199.0,
    inStock: true,
    onSale: false,
    category: 'Peripherals',
    internalCost: 110.0,
    internalSupplierNote: 'Direct factory contract',
    details: {
      manufacturer: 'Keychron',
      warrantyMonths: 12,
      origin: 'China',
    },
  },
  {
    id: 'prod-003',
    name: 'Dell UltraSharp 27" 4K USB-C Hub Monitor',
    price: 549.99,
    inStock: false,
    onSale: true,
    category: 'Displays',
    internalCost: 380.0,
    internalSupplierNote: 'Authorized distributor stock',
    details: {
      manufacturer: 'Dell Technologies',
      warrantyMonths: 36,
      origin: 'Malaysia',
    },
  },
  {
    id: 'prod-004',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    price: 398.0,
    inStock: true,
    onSale: true,
    category: 'Audio',
    internalCost: 240.0,
    internalSupplierNote: 'Holiday promotion tier',
    details: {
      manufacturer: 'Sony',
      warrantyMonths: 12,
      origin: 'Japan',
    },
  },
  {
    id: 'prod-005',
    name: 'CalDigit TS4 Thunderbolt 4 Dock',
    price: 399.95,
    inStock: false,
    onSale: false,
    category: 'Accessories',
    internalCost: 260.0,
    internalSupplierNote: 'Limited stock backlog',
    details: {
      manufacturer: 'CalDigit',
      warrantyMonths: 24,
    },
  },
]

export default function App(): React.JSX.Element {
  // =========================================================================
  // PLANTED BUG 1 (Crash: .map() on null state)
  // State is set to null, causing an uncaught TypeError during iteration.
  // Diagnostic Tool: Chrome DevTools Sources Tab Breakpoint.
  // =========================================================================
  const [products, setProducts] = useState<Product[]>(null as unknown as Product[])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [inStockOnly, setInStockOnly] = useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [networkError, setNetworkError] = useState<string | null>(null)
  const [formDraft, setFormDraft] = useState<ProductFormDraft | undefined>(undefined)

  // Debugging lab simulation state
  const [activeBug, setActiveBug] = useState<
    'none' | 'bug1_crash' | 'bug2_typo' | 'bug3_network'
  >('none')

  // Requirement: React.ChangeEvent on handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleInStockToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInStockOnly(e.target.checked)
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value)
  }

  // Requirement: Immutable updates only (prev => ...)
  const handleAddProduct = (newProductData: Omit<Product, 'id'>) => {
    const createdProduct: Product = {
      ...newProductData,
      id: `prod-${crypto.randomUUID().slice(0, 6)}`,
    }
    setProducts((prev) => [createdProduct, ...prev])
  }

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id))
  }

  // Sync API demonstration (demonstrates Bug 3 Network Tab diagnostic)
  const handleSyncApi = useCallback(async () => {
    setIsLoading(true)
    setNetworkError(null)

    // =========================================================================
    // PLANTED BUG 3 (Network Failure: Mistyped URL endpoint)
    // URL has an extra 's' (/productss), resulting in an HTTP 404 response.
    // Diagnostic Tool: Chrome DevTools Network Tab.
    // =========================================================================
    const endpoint = 'https://dummyjson.com/productss?limit=3'

    try {
      const response = await fetch(endpoint)
      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status} ${response.statusText} from ${endpoint}`
        )
      }
      const data = (await response.json()) as {
        products: Array<{ id: number; title: string; price: number; category: string }>
      }

      const fetchedProducts: Product[] = data.products.map((item) => ({
        id: `api-${item.id}`,
        name: item.title,
        price: item.price,
        inStock: true,
        onSale: false,
        category: item.category,
        internalCost: Math.round(item.price * 0.7 * 100) / 100,
        internalSupplierNote: 'Synchronized from external catalog API',
        details: {
          manufacturer: 'External Vendor',
          warrantyMonths: 12,
        },
      }))

      // Requirement: Immutable update
      setProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id))
        const novelItems = fetchedProducts.filter((p) => !existingIds.has(p.id))
        return [...novelItems, ...prev]
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Network request failed'
      setNetworkError(message)
    } finally {
      setIsLoading(false)
    }
  }, [activeBug])

  // Extract unique categories
  const categories = useMemo(() => {
    const list = products.map((p) => p.category ?? 'Uncategorized')
    return Array.from(new Set(list))
  }, [products])

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.details?.manufacturer?.toLowerCase() ?? '').includes(
          searchTerm.toLowerCase()
        )

      const matchesStock = inStockOnly ? product.inStock : true
      const matchesCategory =
        selectedCategory === 'All'
          ? true
          : (product.category ?? 'Uncategorized') === selectedCategory

      return matchesSearch && matchesStock && matchesCategory
    })
  }, [products, searchTerm, inStockOnly, selectedCategory])

  const saleCount = useMemo(() => {
    return products.filter((p) => p.onSale).length
  }, [products])

  // Map to PublicProduct via Omit
  const publicProducts: PublicProduct[] = useMemo(() => {
    return filteredProducts.map((p) => {
      // Strips internalCost and internalSupplierNote
      const { internalCost: _, internalSupplierNote: __, ...publicView } = p
      return publicView
    })
  }, [filteredProducts])

  // Bug 1 crash trigger simulation
  const handleTriggerBug = (bug: 'none' | 'bug1_crash' | 'bug2_typo' | 'bug3_network') => {
    setActiveBug(bug)
    if (bug === 'none') {
      setProducts(INITIAL_PRODUCTS)
      setNetworkError(null)
    }
  }

  // If Bug 1 is active, simulate null crash
  if (activeBug === 'bug1_crash') {
    // Deliberate reproduction of Bug 1: attempting to call .map() on null state
    const nullProductsState: PublicProduct[] = null as unknown as PublicProduct[]
    return (
      <div className="mx-auto max-w-4xl p-10 text-center">
        <Badge variant="danger" className="mb-4">
          Planted Bug 1 Crash Repro
        </Badge>
        <p className="text-sm text-slate-600 mb-4">
          Rendering items using <code>nullProductsState.map(...)</code>
        </p>
        <Button onClick={() => setActiveBug('none')}>Revert to Fixed State</Button>
        {nullProductsState.map((item) => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Header with Catalog Stats */}
        <ProductHeader
          title="Hardware & Tech Catalog"
          subtitle="Enterprise product catalog built with React 19, strict TypeScript, and shadcn UI primitives."
          totalProducts={products.length}
          saleProducts={saleCount}
          isLoading={isLoading}
          networkError={networkError}
          onSync={handleSyncApi}
        />

        {/* Network Error Alert Banner */}
        {networkError && (
          <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>
                <strong>Network Sync Failed:</strong> {networkError} (Check DevTools Network tab for HTTP status)
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSyncApi}
              className="h-8 border-rose-300 bg-white text-rose-700 hover:bg-rose-100"
            >
              <RefreshCcw className="h-3.5 w-3.5 mr-1" />
              Retry
            </Button>
          </div>
        )}

        {/* Lesson 2.6–2.9 Interactive Debugging Lab */}
        <DebuggingLab activeBug={activeBug} onTriggerBug={handleTriggerBug} />

        {/* Controlled Product Add Form */}
        <ProductForm
          onAddProduct={handleAddProduct}
          initialDraft={formDraft}
          onSaveDraft={(draft) => setFormDraft(draft)}
        />

        {/* Filter and Search Bar */}
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          inStockOnly={inStockOnly}
          onInStockToggle={handleInStockToggle}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          categories={categories}
          totalCount={products.length}
          filteredCount={publicProducts.length}
          saleCount={saleCount}
        />

        {/* Product Cards Grid */}
        <section aria-label="Product List">
          {publicProducts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <p className="text-sm font-medium text-slate-500">
                No products found matching your search criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {publicProducts.map((product) => {
                // =========================================================================
                // PLANTED BUG 2 (Silent Wrong Value: Prop Name Typo)
                // Prop name typo causes inStock to be undefined, silently rendering 'Sold Out'.
                // Zero errors in console.
                // Diagnostic Tool: React DevTools (Components Tab).
                // =========================================================================
                const corruptedProduct: PublicProduct = {
                  ...product,
                  inStock: undefined as unknown as boolean,
                }

                return (
                  <ProductCard
                    key={product.id}
                    product={corruptedProduct}
                    onDelete={handleDeleteProduct}
                  />
                )
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
