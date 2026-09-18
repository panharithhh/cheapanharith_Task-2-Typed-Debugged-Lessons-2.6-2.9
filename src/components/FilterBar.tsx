import React from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Sparkles } from 'lucide-react'

export interface FilterBarProps {
  searchTerm: string
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  inStockOnly: boolean
  onInStockToggle: (e: React.ChangeEvent<HTMLInputElement>) => void
  selectedCategory: string
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  categories: string[]
  totalCount: number
  filteredCount: number
  saleCount: number
}

export function FilterBar({
  searchTerm,
  onSearchChange,
  inStockOnly,
  onInStockToggle,
  selectedCategory,
  onCategoryChange,
  categories,
  totalCount,
  filteredCount,
  saleCount,
}: FilterBarProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search input with React.ChangeEvent handler */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search products or manufacturer..."
            value={searchTerm}
            onChange={onSearchChange}
            className="pl-9"
          />
        </div>

        {/* Category select filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={onCategoryChange}
            className="h-9 rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm text-slate-700 shadow-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="All">All Categories ({totalCount})</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 md:border-t-0 md:pt-0">
        <label className="flex cursor-pointer items-center gap-2 select-none">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={onInStockToggle}
            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="text-xs font-semibold text-slate-700">In stock only</span>
        </label>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            Showing {filteredCount} of {totalCount}
          </Badge>
          {saleCount > 0 && (
            <Badge variant="danger" className="gap-1">
              <Sparkles className="h-3 w-3" />
              {saleCount} on sale
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
