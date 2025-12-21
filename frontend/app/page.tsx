import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <main className="min-h-screen bg-background p-12 flex flex-col gap-8 items-start justify-center">
      <div className="max-w-3xl space-y-6 w-full">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-5xl font-serif text-foreground font-bold">
              Welcome, {session?.user?.name || "Editor"}
            </h1>
            <p className="font-sans text-xl text-muted-foreground leading-relaxed">
              Visual verification of the theme engine using shadcn/ui components.
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Primary Card - Warm Tan */}
          <Card className="bg-primary text-primary-foreground border-none">
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Primary</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Warm Tan (#d4a373)
              </CardDescription>
            </CardHeader>
            <CardContent>
              Used for primary actions and key accents.
            </CardContent>
          </Card>

          {/* Standard Card - Sage Green */}
          <Card className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Card Surface</CardTitle>
              <CardDescription>
                Sage Green (#e9edc9)
              </CardDescription>
            </CardHeader>
            <CardContent>
              The default surface for content modules.
            </CardContent>
          </Card>

          {/* Secondary Card - Warm Beige */}
          <Card className="bg-secondary text-secondary-foreground border-none">
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Secondary</CardTitle>
              <CardDescription className="text-secondary-foreground/80">
                Warm Beige (#faedcd)
              </CardDescription>
            </CardHeader>
            <CardContent>
              For secondary surfaces and subtle differentiation.
            </CardContent>
          </Card>

          {/* Popover/Alt - Warm Beige (Alt) */}
          <Card className="bg-popover text-popover-foreground">
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Popover</CardTitle>
              <CardDescription>
                Warm Beige (#faedcd)
              </CardDescription>
            </CardHeader>
            <CardContent>
              Used for floating elements and tooltips.
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap gap-4 items-center mt-8 p-6 rounded-lg border bg-card/50">
           <div className="flex flex-col gap-2">
             <span className="text-sm font-medium">Buttons</span>
             <div className="flex gap-4">
               <Button variant="default">Primary Action</Button>
               <Button variant="secondary">Secondary Action</Button>
               <Button variant="outline">Outline Action</Button>
               <Button variant="ghost">Ghost Action</Button>
               <Button variant="destructive">Destructive</Button>
             </div>
           </div>
        </div>
      </div>
    </main>
  );
}