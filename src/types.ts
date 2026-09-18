export interface ProductDetails {
  manufacturer?: string
  warrantyMonths?: number
  origin?: string
}

export interface Product {
  id: string
  name: string
  price: number
  inStock: boolean
  onSale: boolean
  category?: string
  internalCost: number // Internal field stripped via Omit for public views
  internalSupplierNote?: string
  details?: ProductDetails // Optional nested structure for safe ?. and ?? access
}

/**
 * Derived type: PublicProduct
 * Strips internal and sensitive inventory cost/supplier fields using TypeScript's Omit utility.
 */
export type PublicProduct = Omit<Product, 'internalCost' | 'internalSupplierNote'>

export interface ProductFormData {
  name: string
  price: string
  category: string
  manufacturer: string
  warrantyMonths: string
  inStock: boolean
  onSale: boolean
}

/**
 * Derived type: ProductFormDraft
 * Allows draft saving and partial form values using TypeScript's Partial utility.
 */
export type ProductFormDraft = Partial<ProductFormData>

export type FormErrors = Partial<Record<keyof ProductFormData, string>>
