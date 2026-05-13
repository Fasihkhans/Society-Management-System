import * as React from "react";

import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "flex h-12 w-full rounded-2xl border bg-background px-4 py-2 text-base disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Select.displayName = "Select";

export { Select };
