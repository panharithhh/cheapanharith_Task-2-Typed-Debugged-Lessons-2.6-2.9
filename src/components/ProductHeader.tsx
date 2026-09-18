import React from 'react'
import { Package, RefreshCw, Sparkles, WifiOff, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export interface ProductHeaderProps {
  title: string
  subtitle: string
  totalProducts: number
  saleProducts: number
  isLoading: boolean
  networkError: string | null
  onSync: () => void
}

export function ProductHeader({
  title,
  subtitle,
  totalProducts,
  saleProducts,
  isLoading,
  networkError,
  onSync,
}: ProductHeaderProps): React.JSX.Element {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">
            {totalProducts} {totalProducts === 1 ? 'Product' : 'Products'} Loaded
          </Badge>
          {saleProducts > 0 && (
            <Badge variant="danger" className="gap-1">
              <Sparkles className="h-3 w-3" />
              {saleProducts} on Sale
            </Badge>
          )}
          {networkError ? (
            <Badge variant="danger" className="gap-1">
              <WifiOff className="h-3 w-3" />
              Network Failure
            </Badge>
          ) : (
            <Badge variant="default" className="gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Catalog Synced
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onSync}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Syncing...' : 'Sync Catalog API'}
        </Button>
      </div>
    </header>
  )
}
