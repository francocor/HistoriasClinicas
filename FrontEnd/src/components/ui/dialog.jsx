import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

export const DialogPortal = ({ children }) => (
  <DialogPrimitive.Portal>
    <div className="fixed inset-0 z-50 flex items-center justify-center">{children}</div>
  </DialogPrimitive.Portal>
);

export const DialogOverlay = React.forwardRef((props, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

export const DialogContent = React.forwardRef(({ children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className="z-50 bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative"
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute top-4 right-4 text-gray-500 hover:text-black">
        <X className="w-5 h-5" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = "DialogContent";

export const DialogHeader = ({ children }) => (
  <div className="mb-4 text-center">{children}</div>
);

export const DialogTitle = React.forwardRef((props, ref) => (
  <DialogPrimitive.Title ref={ref} className="text-xl font-semibold" {...props} />
));
DialogTitle.displayName = "DialogTitle";

export const DialogDescription = React.forwardRef((props, ref) => (
  <DialogPrimitive.Description ref={ref} className="text-sm text-gray-500" {...props} />
));
DialogDescription.displayName = "DialogDescription";

export const DialogClose = DialogPrimitive.Close;