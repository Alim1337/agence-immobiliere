import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "h-11 w-full appearance-none rounded-sm border border-stone-line bg-white px-3.5 pr-9 text-sm text-ink",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:border-pine",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-60" />
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
