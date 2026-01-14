'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  return (
    <Button
      variant="outline"
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="border-primary/20 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-12 w-full justify-start gap-3 rounded-full pl-5 text-base font-medium transition-all"
    >
      <LogOut className="h-5 w-5" />
      Sign Out
    </Button>
  );
}
