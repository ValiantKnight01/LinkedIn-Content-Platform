'use client';

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
    return (
        <Button 
            variant="outline" 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="gap-3 w-full justify-start pl-5 h-12 rounded-full text-base font-medium border-primary/20 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all"
        >
            <LogOut className="h-5 w-5" />
            Sign Out
        </Button>
    );
}
