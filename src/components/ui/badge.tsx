import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide",
  {
    variants: {
      variant: {
        pine: "bg-pine-tint text-pine-dark",
        brass: "bg-brass/15 text-brass-dark",
        outline: "border border-stone-line text-ink-60",
        alert: "bg-alert/10 text-alert",
      },
    },
    defaultVariants: { variant: "pine" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
