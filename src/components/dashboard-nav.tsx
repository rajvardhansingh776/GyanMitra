"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BrainCircuit,
  HeartPulse,
  LayoutDashboard,
  Video,
  BookOpenText,
} from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/sessions", label: "Recent Sessions", icon: BookOpenText },
  { href: "/dashboard/video-call", label: "Video Call", icon: Video },
  {
    href: "/dashboard/engagement-analysis",
    label: "Engagement Analysis",
    icon: HeartPulse,
  },
  {
    href: "/dashboard/gyanmitra-ai",
    label: "GyanMitra AI",
    icon: BrainCircuit,
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href}>
            <SidebarMenuButton
              isActive={pathname === item.href}
              tooltip={item.label}
              className="justify-start"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
