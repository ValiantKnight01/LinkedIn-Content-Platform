'use client';

import { LoginButton } from '@/components/login-button';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="flex w-full max-w-sm flex-col items-center justify-center gap-6 text-center">
      {error === 'AccessDenied' && (
        <div className="animate-in fade-in slide-in-from-top-4 mb-4 rounded-2xl bg-red-50 p-6 text-sm font-medium text-red-800 shadow-sm ring-1 ring-red-100 duration-500">
          <p className="font-serif text-lg leading-relaxed">
            Access Denied
          </p>
          <p className="mt-1 opacity-90">
            This is a personal project not for other usage.
          </p>
        </div>
      )}
      <LoginButton />
      <p className="font-serif text-base leading-normal font-normal text-[#333333]">
        Your Personal LinkedIn Command Center awaits.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="bg-background text-foreground relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
      <div className="flex h-screen">
        {/* Left side - visible on medium screens and up - Intentionally blank */}
        <div className="bg-background hidden md:block md:w-1/2"></div>

        {/* Right side - Login content */}
        <div className="bg-background flex w-full flex-col items-center justify-center p-8 md:w-1/2">
          <Suspense fallback={<div className="h-20 w-full animate-pulse rounded-2xl bg-[#faedcd]/20" />}>
            <LoginContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
