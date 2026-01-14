'use client';

import { signIn } from 'next-auth/react';

export function LoginButton() {
  return (
    <button
      onClick={() => signIn('linkedin', { callbackUrl: '/' })}
      className="flex h-14 w-full max-w-[480px] min-w-[84px] cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-xl bg-[#0077b5] px-5 text-lg leading-normal font-bold tracking-[0.015em] text-white shadow-sm transition-transform duration-200 ease-in-out hover:scale-105"
    >
      <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
        <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3v9zM6.5 8.25A1.75 1.75 0 118.25 6.5 1.75 1.75 0 016.5 8.25zM19 19h-3v-4.75c0-1.4-.5-2.5-1.8-2.5-1 0-1.5.7-1.7 1.3-.1.2-.1.5-.1.8V19h-3v-9h3v1.4c.4-.7 1.2-1.4 2.6-1.4 2.9 0 3.4 1.9 3.4 4.3V19z"></path>
      </svg>
      <span className="truncate">Connect with LinkedIn</span>
    </button>
  );
}
