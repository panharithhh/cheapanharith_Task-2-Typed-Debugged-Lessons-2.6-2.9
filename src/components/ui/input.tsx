import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean
}

function Input({ className, type = 'text', hasError, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'flex h-9 w-full rounded-lg border bg-white px-3 py-1 text-sm shadow-sm transition-colors',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
        hasError
          ? 'border-rose-500 focus-visible:border-rose-500 focus-visible:ring-rose-200'
          : 'border-slate-300 focus-visible:border-emerald-600 focus-visible:ring-emerald-100',
        className
      )}
      {...props}
    />
  )
}

export { Input }
