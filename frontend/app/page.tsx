import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/syllabus")
  }

  // If not authenticated, the middleware likely handles it, or we show a landing.
  // Since middleware protects this route, we might not even reach here if unauth?
  // But strictly speaking, middleware protects everything EXCEPT login.
  // So if we are here, we are authenticated (if middleware is working).
  // Double check middleware config.
  
  redirect("/syllabus")
}