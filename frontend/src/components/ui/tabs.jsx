import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "../../lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md border border-border bg-muted/60 p-1 text-foreground-muted dark:bg-secondary",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium text-foreground-secondary ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:text-foreground-disabled data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm dark:data-[state=active]:shadow-black/20",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef(({ className, forceMount, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    forceMount={forceMount}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring data-[state=inactive]:!hidden",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
