import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef(({ className, {/* REPLACED_PLACEHOLDER */}props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {{/* REPLACED_PLACEHOLDER */}props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, {/* REPLACED_PLACEHOLDER */}props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {{/* REPLACED_PLACEHOLDER */}props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, {/* REPLACED_PLACEHOLDER */}props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {{/* REPLACED_PLACEHOLDER */}props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, {/* REPLACED_PLACEHOLDER */}props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {{/* REPLACED_PLACEHOLDER */}props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, {/* REPLACED_PLACEHOLDER */}props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {{/* REPLACED_PLACEHOLDER */}props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, {/* REPLACED_PLACEHOLDER */}props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {{/* REPLACED_PLACEHOLDER */}props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

