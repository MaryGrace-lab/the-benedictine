import * as React from "react"
import { cn } from "@/lib/utils"

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 -mx-4 sm:mx-0">
      <div className="px-4 sm:px-0">
        <table 
          ref={ref} 
          className={cn(
            "w-full caption-bottom text-sm text-left text-gray-900 dark:text-gray-100 min-w-[640px]", 
            className
          )} 
          {...props} 
        />
      </div>
    </div>
  )
)
Table.displayName = "Table"

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead 
      ref={ref} 
      className={cn(
        "bg-gray-50 text-gray-700 uppercase text-xs tracking-wider dark:bg-gray-800/50 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 sticky top-0", 
        className
      )} 
      {...props} 
    />
  )
)
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody 
      ref={ref} 
      className={cn("[&_tr:last-child]:border-0", className)} 
      {...props} 
    />
  )
)
TableBody.displayName = "TableBody"

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr 
      ref={ref} 
      className={cn(
        "border-b border-gray-200 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/40", 
        className
      )} 
      {...props} 
    />
  )
)
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th 
      ref={ref} 
      className={cn(
        "h-12 px-4 text-left align-middle font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap", 
        className
      )} 
      {...props} 
    />
  )
)
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td 
      ref={ref} 
      className={cn(
        "p-4 align-middle whitespace-nowrap", 
        className
      )} 
      {...props} 
    />
  )
)
TableCell.displayName = "TableCell"

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
}