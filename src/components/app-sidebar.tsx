"use client";

import { UserCircleIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type * as React from "react";
import { MdMessage } from "react-icons/md";
import { Logo } from "@/components/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navigation = [
  { title: "Chat", href: "/chat", icon: MdMessage },
  { title: "Profile", href: "/profile", icon: UserCircleIcon },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="md:h-9 md:p-0"
              tooltip={{ children: "Convo", hidden: false }}
            >
              <Logo size="md" className="bg-sidebar-primary text-sidebar-primary-foreground shadow-none hover:scale-100" />
              <span className="truncate text-sm font-semibold">Convo</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="px-1.5 md:px-0">
            <SidebarMenu>
              {navigation.map((item) => {
                const Icon = item.icon;

                return (
                  <SidebarMenuItem
                    key={item.href}
                    className="flex justify-center"
                  >
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      tooltip={{ children: item.title, hidden: false }}
                      isActive={pathname.startsWith(item.href)}
                      className="flex justify-center"
                    >
                      <Icon className="size-5" />
                      <span className="text-sm font-medium hidden">
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
