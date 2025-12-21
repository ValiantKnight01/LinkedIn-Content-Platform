import { LoginButton } from "@/components/login-button";

export default function LoginPage() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background text-foreground">
      <div className="flex h-screen">
        {/* Left side - visible on medium screens and up - Intentionally blank */}
        <div className="hidden md:block md:w-1/2 bg-background"></div>

        {/* Right side - Login content */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 bg-background">
          <div className="flex flex-col max-w-sm w-full gap-6 items-center justify-center">
            <LoginButton />
            <p className="text-base font-normal leading-normal text-center font-serif text-[#333333]">
              Your Personal LinkedIn Command Center awaits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
