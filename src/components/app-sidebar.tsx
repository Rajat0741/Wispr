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
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="px-1.5 md:px-0">
            <SidebarMenu>
              <SidebarMenuItem className="flex justify-center">
                <SidebarMenuButton
                  render={<Link href="/" />}
                  tooltip={{ children: "Convo", hidden: false }}
                  isActive={pathname === "/"}
                  className="flex justify-center mb-1"
                >
                  <Logo size="md" />
                  <span className="text-sm font-medium hidden">
                    Convo
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
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
