import * as React from "react"
import { cn } from "@/lib/utils"

export interface AvatarProps {
  name: string
  src?: string
  className?: string
  showStatus?: boolean
  status?: 'active' | 'inactive' | 'away'
}

export function Avatar({ name, src, className, showStatus, status = 'active' }: AvatarProps) {
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  return (
    <div className={cn("relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-indigo-500 font-semibold text-white uppercase shadow-sm select-none h-10 w-10 text-sm", className)}>
      {src ? (
        <img src={src} alt={name} className="h-full w-full rounded-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
      {showStatus && (
        <span className={cn(
          "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-900",
          status === 'active' && 'bg-emerald-500',
          status === 'inactive' && 'bg-gray-400',
          status === 'away' && 'bg-amber-500'
        )} />
      )}
    </div>
  )
}