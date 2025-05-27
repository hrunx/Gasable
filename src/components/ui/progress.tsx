import * as React from "react"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: number
    max?: number
    color?: string
  }
>(({ className, value, max = 100, color, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary-100",
      className
    )}
    {...props}
  >
    <div
      className={cn("h-full w-full flex-1 transition-all", {
        "bg-primary-600": !color,
        "bg-green-600": color === "green",
        "bg-yellow-500": color === "yellow",
        "bg-red-600": color === "red",
      })}
      style={{
        transform: `translateX(-${100 - (value / max) * 100}%)`,
      }}
    />
  </div>
))
Progress.displayName = "Progress"

export { Progress }