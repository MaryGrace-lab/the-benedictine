import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsContextProps {
  activeTab: string
  setActiveTab: (value: string) => void
}
const TabsContext = React.createContext<TabsContextProps | undefined>(undefined)

export function Tabs({ defaultValue, children, className }: { defaultValue: string, children: React.ReactNode, className?: string }) {
  const [activeTab, setActiveTab] = React.useState(defaultValue)
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("w-full space-y-4", className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("inline-flex items-center justify-center rounded-xl bg-gray-100 p-1 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700/60", className)}>
      {children}
    </div>
  )
}

export function TabsTrigger({ value, children }: { value: string, children: React.ReactNode }) {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error("TabsTrigger must be within a Tabs component")
  const isSelected = context.activeTab === value
  return (
    <button
      onClick={() => context.setActiveTab(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-semibold tracking-wide transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        isSelected ? "bg-white text-gray-950 shadow-sm dark:bg-gray-900 dark:text-gray-50" : "hover:text-gray-900 dark:hover:text-gray-100"
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children }: { value: string, children: React.ReactNode }) {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error("TabsContent must be within a Tabs component")
  if (context.activeTab !== value) return null
  return <div className="animate-in fade-in-50 duration-200">{children}</div>
}