# Next.js 16 & shadcn/ui Style Guide

## Core Principles
- **React Server Components (RSC) by Default**: Favor Server Components for data fetching and layout. Use Client Components ('use client') sparingly for interactivity.
- **Server Actions**: Use Server Actions for all mutations. Call them directly from Client Components or forms.
- **Type Safety**: Use TypeScript for all components, actions, and API routes.
- **Performance**: Leverage Next.js caching mechanisms (`use cache`) and avoid unnecessary client-side state.

## Next.js 16 Best Practices

### Data Fetching
- Fetch data directly in Server Components using `async/await`.
- Use the native `fetch` API. Next.js extends it with caching and revalidation.
- Use `use cache` (Next.js 15/16) for fine-grained caching of component chunks or functions.

```tsx
// Server Component
export default async function Page() {
  const data = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 } // Revalidate every hour
  }).then(res => res.json());

  return <DataList items={data} />;
}
```

### Server Actions
- Define actions in a separate file (e.g., `actions.ts`) with the `'use server'` directive at the top.
- Use `refresh()` from `next/cache` to synchronize the client-side router after a mutation.

```tsx
'use server'

import { refresh } from 'next/cache'

export async function updateItem(id: string, data: any) {
  await db.update(id, data);
  refresh(); // Refresh the client router
}
```

### Metadata API
- Export a `metadata` object or `generateMetadata` function from `layout.tsx` or `page.tsx`. Do NOT use `next/head`.

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Page Title',
}
```

## shadcn/ui (Tailwind CSS v4) Patterns

### Installation & Configuration
- Use the `shadcn` CLI for adding components: `npx shadcn@latest add [component]`.
- Ensure `components.json` is configured for the App Router and your preferred styling.

### Theming & Typography
- **Strict Theme Enforcement**: All components MUST use the global CSS variables defined in `app/globals.css`. Do NOT hardcode colors (e.g., `bg-[#d4a373]`) or use arbitrary utility classes.
- **Warm Editorial Palette Mapping (Hex)**:
  The project's specific palette must be mapped to shadcn/ui's standard variables in `app/globals.css` using **Hex codes**:
  - **Background** (`#fefae0` Cream Paper) -> `--background`
  - **Primary** (`#d4a373` Warm Tan) -> `--primary`
  - **Secondary** (`#faedcd` Warm Beige) -> `--secondary`
  - **Muted/Cards** (`#e9edc9` Earthy Sage) -> `--muted` / `--card`
  - **Text** (`#3D2B1F` Dark Brown) -> `--foreground` / `--primary-foreground` (on light)
  
  ```css
  /* app/globals.css */
  @theme {
    --color-background: var(--background);
    --color-foreground: var(--foreground);
    --color-primary: var(--primary);
    /* ... map other utilities if needed for v4 */
  }

  :root {
    /* Warm Editorial Theme - Hex Values */
    --background: #fefae0;
    --foreground: #3D2B1F;
    
    --card: #e9edc9;
    --card-foreground: #3D2B1F;

    --popover: #fefae0;
    --popover-foreground: #3D2B1F;

    --primary: #d4a373;
    --primary-foreground: #fefae0;

    --secondary: #faedcd;
    --secondary-foreground: #3D2B1F;

    --muted: #e9edc9;
    --muted-foreground: #3D2B1F;

    --accent: #faedcd;
    --accent-foreground: #3D2B1F;

    --destructive: #ef4444; /* Standard Red */
    --destructive-foreground: #fefae0;

    --border: #3D2B1F;
    --input: #3D2B1F;
    --ring: #d4a373;
  }
  ```

- **Variant-Based Design**: Rely on component variants (e.g., `<Button variant="secondary" />`) to apply these colors. 
  - **Do:** `<Button variant="destructive">Delete</Button>`
  - **Don't:** `<Button className="bg-red-500 hover:bg-red-600">Delete</Button>`

- **Typography**: Use `next/font` for optimizing fonts.
  ```tsx
  // app/layout.tsx
  import { Inter } from 'next/font/google'
  const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
  
  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body className={`font-sans ${inter.variable} antialiased`}>{children}</body>
      </html>
    )
  }
  ```

### Styling with Tailwind v4
- Use the new `@import "tailwindcss"` in `globals.css`.
- Favor CSS variables for theming (e.g., `--background`, `--foreground`).

### Component Usage
- Keep `ui` components in `components/ui/`.
- Do not modify `ui` components directly unless necessary; compose them in your feature components.
- Use `cn` utility from `lib/utils.ts` for conditional class merging.

```tsx
import { cn } from "@/lib/utils"

export function MyButton({ className, ...props }) {
  return (
    <button
      className={cn("bg-primary text-primary-foreground", className)}
      {...props}
    />
  )
}
```

## Project Structure
```
frontend/
├── app/               # App Router directory
│   ├── layout.tsx     # Root layout
│   ├── page.tsx       # Home page
│   └── api/           # Route handlers
├── components/
│   ├── ui/            # shadcn/ui components
│   └── [feature]/     # Feature-specific components
├── lib/
│   └── utils.ts       # cn utility
├── hooks/             # Custom hooks
└── types/             # Shared TypeScript types
```
