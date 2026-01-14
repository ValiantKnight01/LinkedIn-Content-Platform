import { LoginButton } from '@/components/login-button';

export default function LoginPage() {
  return (
    <div className="bg-background text-foreground relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
      <div className="flex h-screen">
        {/* Left side - visible on medium screens and up - Intentionally blank */}
        <div className="bg-background hidden md:block md:w-1/2"></div>

        {/* Right side - Login content */}
        <div className="bg-background flex w-full flex-col items-center justify-center p-8 md:w-1/2">
          <div className="flex w-full max-w-sm flex-col items-center justify-center gap-6">
            <LoginButton />
            <p className="text-center font-serif text-base leading-normal font-normal text-[#333333]">
              Your Personal LinkedIn Command Center awaits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
