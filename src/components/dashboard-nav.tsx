"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BrainCircuit,
  HeartPulse,
  LayoutDashboard,
  Video,
  BookOpenText,
  Wrench,
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
    href: "/dashboard/ai-problem-solver",
    label: "AI Problem Solver",
    icon: BrainCircuit,
  },
];

const devNavItems = [
  {
    href: "http://localhost:4000",
    label: "Dev Tools",
    icon: Wrench,
    external: true,
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  const allNavItems =
    process.env.NODE_ENV === "development"
      ? [...navItems, ...devNavItems]
      : navItems;

  return (
    <SidebarMenu>
      {allNavItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noopener noreferrer" : undefined}>
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
