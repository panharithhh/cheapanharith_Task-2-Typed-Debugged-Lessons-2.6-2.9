import React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Flame, Check, X, Shield, Building2, Trash2 } from 'lucide-react'
import type { PublicProduct } from '@/types'

export interface ProductCardProps {
  product: PublicProduct
  onDelete: (id: string) => void
}

export function ProductCard({ product, onDelete }: ProductCardProps): React.JSX.Element {
  // Safe optional access: using ?. with ?? as required by Lesson 2.7
  const manufacturerName: string = product.details?.manufacturer ?? 'Standard OEM'
  const warrantyText: string = product.details?.warrantyMonths
    ? `${product.details.warrantyMonths} mo warranty`
    : 'No warranty'
  const categoryName: string = product?.category ?? 'General'

  return (
    <Card className="flex flex-col justify-between overflow-hidden border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="outline" className="text-[10px] font-medium tracking-wide uppercase">
            {categoryName}
          </Badge>

          <div className="flex items-center gap-1.5">
            {product.onSale && (
              <Badge variant="danger" className="gap-1 px-2 py-0.5 text-[10px]">
                <Flame className="h-3 w-3" />
                Sale
              </Badge>
            )}
            <Badge
              variant={product.inStock ? 'default' : 'secondary'}
              className="gap-1 px-2 py-0.5 text-[10px]"
            >
              {product.inStock ? (
                <>
                  <Check className="h-3 w-3" />
                  In Stock
                </>
              ) : (
                <>
                  <X className="h-3 w-3" />
                  Sold Out
                </>
              )}
            </Badge>
          </div>
        </div>

        <CardTitle className="mt-2 text-base font-bold text-slate-900 line-clamp-1">
          {product.name}
        </CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Building2 className="h-3 w-3 text-slate-400" />
          {manufacturerName}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-xs text-slate-400">USD</span>
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
          <Shield className="h-3.5 w-3.5 text-emerald-600" />
          <span>{warrantyText}</span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-3">
        <span className="font-mono text-[11px] text-slate-400">
          ID: {product.id.slice(0, 8)}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(product.id)}
          className="h-7 px-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
          aria-label={`Delete ${product.name}`}
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
