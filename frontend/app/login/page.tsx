import { LoginButton } from "@/components/login-button";

export default function LoginPage() {
    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-[var(--color-cornsilk)]" >
            <div className="layout-container flex h-full grow flex-col">
                <main className="flex-grow">
                    <div className="flex h-screen">
                        {/* Left side - visible on medium screens and up */}
                        <div className="hidden md:block md:w-1/2 bg-[var(--color-cornsilk)]">
                            {/* Intentionally blank left column as per design */}
                        </div>

                        {/* Right side - Login content */}
                        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 bg-[var(--color-cornsilk)]">
                            <div className="flex flex-col max-w-sm w-full gap-6 items-center justify-center">

                                <LoginButton />

                                <p className="text-base font-normal leading-normal text-center font-[family-name:var(--font-merriweather)] text-[#333333]">
                                    Your Personal LinkedIn Command Center awaits.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
