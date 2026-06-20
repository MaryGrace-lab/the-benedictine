import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:pointer-events-none disabled:opacity-50 active:scale-98 transform duration-100",
          {
            'bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 shadow-sm': variant === 'default',
            'border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800': variant === 'outline',
            'hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 text-gray-600 dark:text-gray-400': variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800': variant === 'destructive',
            'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800': variant === 'secondary',
          },
          {
            'h-10 px-4 py-2': size === 'default',
            'h-8 rounded-md px-3 text-xs': size === 'sm',
            'h-12 rounded-xl px-8 text-base': size === 'lg',
            'h-10 w-10 p-0': size === 'icon',
          },
          className
        )}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <svg className="mr-2 h-4 w-4 animate-spin text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"