"use client";

import { Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

const navItems = [
  {
    href: "/",
    label: "Home",
    icon: Zap,
  },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav>
      <ul className="flex gap-2">
        {navItems.map((item) => (
          <li key={item.href}>
            <Button
              variant="ghost"
              asChild
              className={pathname === item.href ? "bg-accent" : ""}>
              <Link href={item.href}>
                <item.icon />
                <span className="sr-only">{item.label}</span>
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
