import React from "react";
import { Button } from "@/components/ui/button";

export default function BotonHarmonia({ children, ...props }) {
  return (
    <Button
      className="px-6 py-2 text-center leading-tight w-auto rounded-[40px] bg-gradient-to-b from-[#179cba] to-white text-xl font-normal text-black font-sans shadow-[8px_8px_1.9px_rgba(0,0,0,0.25)]"
      {...props}
    >
      {children}
    </Button>
  );
}