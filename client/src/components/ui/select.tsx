import React from "react"
import { cn } from "@/lib/utils"

export const Select = ({ className, children, ...props }) => (
  <select
    className={cn(
      "flex h-9 w-full rounded-md border px-3 py-1 text-sm",
      className
    )}
    {...props}
  >
    {children}
  </select>
)

export const SelectTrigger = Select
export const SelectContent = ({ children }) => <>{children}</>
export const SelectItem = ({ value, children }) => <option value={value}>{children}</option>
export const SelectValue = ({ placeholder }) => <option value="">{placeholder}</option>