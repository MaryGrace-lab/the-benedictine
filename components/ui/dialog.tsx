import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Dialog({ isOpen, onClose, title, children }: DialogProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    if (isOpen) document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg transform overflow-hidden rounded-xl bg-white p-6 shadow-xl transition-all dark:bg-gray-900 border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50">{title}</h3>
          <button onClick={onClose} className="rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}