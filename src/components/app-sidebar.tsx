"use client";

import {
  MessageCircleIcon,
  UserCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type * as React from "react";
import { MdMessage } from "react-icons/md";
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
              tooltip={{ children: "Chats", hidden: false }}
            >
              <div className="flex aspect-square size-9 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                <MessageCircleIcon className="size-5" />
              </div>
              <span className="truncate text-sm font-semibold">Chats</span>
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
