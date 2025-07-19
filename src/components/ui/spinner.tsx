"use client"

import { cn } from "@/lib/utils"

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "primary" | "secondary"
}

export function Spinner({
  className,
  size = "md",
  variant = "default",
  ...props
}: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  }

  const variantClasses = {
    default: "border-gray-300 border-t-gray-800",
    primary: "border-gray-300 border-t-blue-600",
    secondary: "border-gray-300 border-t-purple-600",
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
}