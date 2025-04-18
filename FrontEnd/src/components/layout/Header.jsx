import React from "react";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

export default function Header() {
  return (
    <header className="h-[85px] bg-gradient-to-r from-white via-[#4fdfbe] to-[#33bebc] flex items-center justify-end px-6 w-full">
      <div className="flex items-center gap-4">
        <Bell className="w-[32px] h-[32px]" />
        <Button className="h-[50px] bg-[#179cba] rounded-full px-6 text-black text-lg">
          Dr. Pepito Fernandez
        </Button>
        <Avatar className="w-[50px] h-[50px] bg-white text-black flex items-center justify-center rounded-full">
          <User className="w-6 h-6" />
        </Avatar>
      </div>
    </header>
  );
}