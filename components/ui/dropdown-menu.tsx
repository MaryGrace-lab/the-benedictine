import * as React from "react"
import { cn } from "@/lib/utils"

export interface DropdownMenuProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: 'left' | 'right'
}

export function DropdownMenu({ trigger, children, align = 'right' }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            "absolute z-50 mt-2 w-56 origin-top-right rounded-xl border border-gray-200 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-gray-800 dark:bg-gray-900 animate-in fade-in slide-in-from-top-2 duration-150",
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          <div className="py-1 p-1.5 flex flex-col space-y-0.5" onClick={() => setOpen(false)}>{children}</div>
        </div>
      )}
    </div>
  )
}

export function DropdownMenuItem({ className, ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 text-left transition-colors",
        className
      )}
      {...props}
    />
  )
}