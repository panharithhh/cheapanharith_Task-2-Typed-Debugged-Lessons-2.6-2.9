import React, { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, BookmarkCheck, AlertCircle } from 'lucide-react'
import type { Product, ProductFormData, ProductFormDraft, FormErrors } from '@/types'

export interface ProductFormProps {
  onAddProduct: (newProduct: Omit<Product, 'id'>) => void
  initialDraft?: ProductFormDraft
  onSaveDraft?: (draft: ProductFormDraft) => void
}

const DEFAULT_FORM: ProductFormData = {
  name: '',
  price: '',
  category: 'Accessories',
  manufacturer: '',
  warrantyMonths: '12',
  inStock: true,
  onSale: false,
}

export function ProductForm({
  onAddProduct,
  initialDraft,
  onSaveDraft,
}: ProductFormProps): React.JSX.Element {
  // Merge initial draft (derived via Partial) with default form values
  const [formData, setFormData] = useState<ProductFormData>(() => ({
    ...DEFAULT_FORM,
    ...(initialDraft ?? {}),
  }))

  const [errors, setErrors] = useState<FormErrors>({})
  const [draftSaved, setDraftSaved] = useState<boolean>(false)

  // React.ChangeEvent on input text fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field on change
    if (errors[name as keyof ProductFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
    setDraftSaved(false)
  }

  // React.ChangeEvent on input checkboxes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required.'
    }
    const numPrice = Number(formData.price)
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required.'
    } else if (isNaN(numPrice) || numPrice <= 0) {
      newErrors.price = 'Price must be a valid number greater than 0.'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) return

    const productPayload: Omit<Product, 'id'> = {
      name: formData.name.trim(),
      price: Number(formData.price),
      category: formData.category.trim() || 'General',
      inStock: formData.inStock,
      onSale: formData.onSale,
      internalCost: Math.round(Number(formData.price) * 0.65 * 100) / 100, // internal margin calculation
      internalSupplierNote: 'Added via authenticated admin dashboard',
      details: {
        manufacturer: formData.manufacturer.trim() || undefined,
        warrantyMonths: formData.warrantyMonths ? Number(formData.warrantyMonths) : undefined,
      },
    }

    onAddProduct(productPayload)
    setFormData(DEFAULT_FORM)
    setErrors({})
    setDraftSaved(false)
  }

  const handleSaveDraft = () => {
    // Draft derivation using Partial<ProductFormData>
    const currentDraft: ProductFormDraft = {
      name: formData.name || undefined,
      price: formData.price || undefined,
      category: formData.category,
      manufacturer: formData.manufacturer || undefined,
      warrantyMonths: formData.warrantyMonths || undefined,
      inStock: formData.inStock,
      onSale: formData.onSale,
    }
    if (onSaveDraft) {
      onSaveDraft(currentDraft)
    }
    setDraftSaved(true)
    setTimeout(() => setDraftSaved(false), 2500)
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Add New Product</CardTitle>
            <CardDescription>
              Controlled entry with strict field types and draft capabilities.
            </CardDescription>
          </div>
          {draftSaved && (
            <Badge variant="default" className="gap-1 animate-pulse">
              <BookmarkCheck className="h-3 w-3" />
              Draft Saved
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="field-name">Product Name *</Label>
              <Input
                id="field-name"
                name="name"
                placeholder="e.g. Ergonomic Keyboard"
                value={formData.name}
                onChange={handleInputChange}
                hasError={Boolean(errors.name)}
                className="mt-1"
              />
              {errors.name && (
                <p className="mt-1 flex items-center gap-1 text-xs text-rose-600">
                  <AlertCircle className="h-3 w-3" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="field-price">Price (USD) *</Label>
              <Input
                id="field-price"
                name="price"
                placeholder="e.g. 79.99"
                value={formData.price}
                onChange={handleInputChange}
                hasError={Boolean(errors.price)}
                className="mt-1"
              />
              {errors.price && (
                <p className="mt-1 flex items-center gap-1 text-xs text-rose-600">
                  <AlertCircle className="h-3 w-3" />
                  {errors.price}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="field-manufacturer">Manufacturer (Optional)</Label>
              <Input
                id="field-manufacturer"
                name="manufacturer"
                placeholder="e.g. LogiTech, Apple, Corsair"
                value={formData.manufacturer}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="field-category">Category</Label>
              <Input
                id="field-category"
                name="category"
                placeholder="e.g. Peripherals, Audio"
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs font-medium text-slate-700">In Stock</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="onSale"
                  checked={formData.onSale}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs font-medium text-slate-700">On Sale</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSaveDraft}
              >
                Save Draft
              </Button>
              <Button type="submit" size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
