'use client';

import { BookOpen, Archive, Leaf, ListTodo } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import dayjs from 'dayjs';

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
} from '@/components/ui/sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { LogoutButton } from '@/components/logout-button';
import { useSession } from 'next-auth/react';
import { useSyllabusStore } from '@/lib/store';
import Image from 'next/image';

// Menu items.
const items = [
  {
    title: 'Syllabus',
    url: '/syllabus',
    icon: BookOpen,
  },
  {
    title: 'Monthly Themes',
    url: '/monthly-themes',
    icon: ListTodo,
  },
  {
    title: 'Archives',
    url: '/archives',
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
    <Sidebar className="border-border bg-background border-r">
      <SidebarHeader className="p-6 pb-2">
        <div className="flex items-center gap-4">
          <div className="bg-primary/20 h-12 w-12 shrink-0 overflow-hidden rounded-full">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || 'User'}
                width={48}
                height={48}
                className="object-cover"
              />
            ) : (
              <div className="text-primary flex h-full w-full items-center justify-center text-xl font-bold">
                {session?.user?.name?.[0] || 'E'}
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-col">
            <h1 className="text-foreground truncate font-serif text-xl leading-tight font-bold">
              {session?.user?.name || 'Editor-in-Chief'}
            </h1>
            <span className="text-muted-foreground truncate font-sans text-sm font-normal">
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
                      className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-12 rounded-full px-5 text-base font-medium transition-all duration-200"
                    >
                      <Link href={item.url}>
                        <item.icon className="mr-3 h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mt-auto space-y-4 p-6">
        <Card className="bg-card overflow-hidden rounded-3xl border-none shadow-sm">
          <div className="bg-primary/10 flex h-32 items-center justify-center p-4">
            <div className="bg-primary/20 border-primary/20 flex h-full w-full items-center justify-center rounded-2xl border border-dashed">
              <Leaf className="text-primary/40 h-10 w-10" />
            </div>
          </div>
          <CardContent className="space-y-3 p-5">
            <div className="text-primary flex items-center gap-2 text-sm font-medium">
              <span>Active Theme</span>
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-xs tracking-wider uppercase">
                {dayjs().format('MMMM YYYY')}
              </p>
              <p className="text-foreground font-serif text-lg leading-tight font-medium">
                {activeTheme?.title || 'No active theme'}
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
