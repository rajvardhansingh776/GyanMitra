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
  useSidebar,
} from "@/components/ui/sidebar";
import { useUser } from "@/context/UserContext";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/sessions", label: "Recent Sessions", icon: BookOpenText },
  { href: "/dashboard/video-call", label: "Video Call", icon: Video },
  {
    href: "/dashboard/gyanmitra-ai",
    label: "GyanMitra AI",
    icon: BrainCircuit,
  },
];

const teacherNavItems = [
    ...navItems,
    {
        href: "/dashboard/engagement-analysis",
        label: "Engagement Analysis",
        icon: HeartPulse,
      },
]

export function DashboardNav() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const { user } = useUser();
  const isTeacher = user.email.includes('teacher');
  const currentNavItems = isTeacher ? teacherNavItems : navItems;

  const handleLinkClick = () => {
    if (setOpenMobile) {
      setOpenMobile(false);
    }
  };

  const getHref = (href: string) => {
    const role = isTeacher ? 'teacher' : 'student';
    return `${href}?role=${role}`;
  }

  return (
    <SidebarMenu>
      {currentNavItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={getHref(item.href)} onClick={handleLinkClick}>
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
