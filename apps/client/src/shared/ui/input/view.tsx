import { cn } from "@/shared/lib/cn"
import React from "react"
import { Label } from "../label"
import { cva } from "class-variance-authority"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  errorMassage?: string
}

const css = cva(
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      hasError: {
        true: "border-red-900",
      },
    },
  },
)

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, errorMassage, ...props }, ref) => {
    return (
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor={label}>{label}</Label>
        <input
          id={label}
          type={type}
          className={cn(
            css({ hasError: (errorMassage?.length ?? 0) > 0 }),
            className,
          )}
          ref={ref}
          {...props}
        />
        <p className="text-sm h-4 font-medium text-red-900">
          {errorMassage ?? ""}
        </p>
      </div>
    )
  },
)
Input.displayName = "Input"

export { Input }
