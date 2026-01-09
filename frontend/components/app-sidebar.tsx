'use client';

import { BookOpen, Archive, Leaf, ListTodo } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import dayjs from "dayjs";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { LogoutButton } from "@/components/logout-button";
import { useSession } from "next-auth/react";
import { useSyllabusStore } from "@/lib/store";
import Image from "next/image";

// Menu items.
const items = [
  {
    title: "Syllabus",
    url: "/syllabus",
    icon: BookOpen,
  },
  {
    title: "Monthly Themes",
    url: "/monthly-themes",
    icon: ListTodo,
  },
  {
    title: "Archives",
    url: "/archives",
    icon: Archive,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { themes, fetchThemes, getActiveTheme } = useSyllabusStore();

  useEffect(() => {
    fetchThemes();
  }, [fetchThemes]);

  const currentMonth = dayjs().month() + 1;
  const currentYear = dayjs().year();
  const activeTheme = getActiveTheme(currentMonth, currentYear);

  return (
    <Sidebar className="border-r border-border bg-background">
      <SidebarHeader className="p-6 pb-2">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full overflow-hidden bg-primary/20 shrink-0">
            {session?.user?.image ? (
              <Image 
                src={session.user.image} 
                alt={session.user.name || "User"} 
                width={48} 
                height={48}
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-primary font-bold text-xl">
                {session?.user?.name?.[0] || "E"}
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="font-serif text-xl font-bold text-foreground leading-tight truncate">
              {session?.user?.name || "Editor-in-Chief"}
            </h1>
            <span className="text-sm font-sans font-normal text-muted-foreground truncate">
              Editorial Platform
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {items.map((item) => {
                 const isActive = pathname === item.url;
                 return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                        asChild 
                        isActive={isActive}
                        className="h-12 px-5 text-base font-medium rounded-full data-[active=true]:bg-primary data-[active=true]:text-primary-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200"
                    >
                      <Link href={item.url}>
                        <item.icon className="h-5 w-5 mr-3" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-6 mt-auto space-y-4">
        <Card className="bg-card border-none shadow-sm rounded-3xl overflow-hidden">
          <div className="h-32 bg-primary/10 flex items-center justify-center p-4">
            <div className="w-full h-full rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/20 border-dashed">
                <Leaf className="h-10 w-10 text-primary/40" />
            </div>
          </div>
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2 text-primary font-medium text-sm">
              <span>Active Theme</span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                {dayjs().format('MMMM YYYY')}
              </p>
              <p className="font-serif text-lg font-medium text-foreground leading-tight">
                {activeTheme?.title || "No active theme"}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="w-full">
            <LogoutButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}