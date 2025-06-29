import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef(
  ({ className, align = "center", sideOffset = 4, onInteractOutside, ...props }, ref) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        onInteractOutside={onInteractOutside} // permite pasar una función opcional si querés evitar cierre
        className={cn(
          "z-50 w-72 rounded-md border bg-white p-4 text-black shadow-md outline-none",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
);

PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };