/// <reference types="vite/client" />
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'
import appCss from '../styles/globals.css?url'
import { ThemeProvider } from '@/components/theme-provider'
import { ReleaseProvider } from '@/components/release-provider'
import MaintenancePage from '@/components/maintenance-page'
import Nav from '@/components/nav'
import Footer from '@/components/footer'
import { Toaster } from '@/components/ui/sonner'
import NotFoundPage from '@/components/not-found'
import { getSiteDataFn } from '../server/site.functions'

export const Route = createRootRoute({
  loader: () => getSiteDataFn(),
  head: ({ loaderData }) => {
    const maintenance = loaderData?.maintenance ?? false

    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          title: maintenance
            ? 'Under Maintenance | Sparkle Debloater'
            : 'Sparkle Debloater',
        },
        {
          name: 'description',
          content: maintenance
            ? 'Sparkle is under maintenance. Download the latest version from GitHub.'
            : 'A Windows app to debloat and optimize your PC',
        },
        ...(maintenance
          ? [{ name: 'robots', content: 'noindex, nofollow' }]
          : []),
      ],
      links: [
        { rel: 'stylesheet', href: appCss },
        { rel: 'icon', href: '/favicon.ico' },
      ],
      scripts: [
        {
          defer: true,
          src: 'https://umami.parcoil.com/script.js',
          'data-website-id': '9924bb71-c86f-4f31-8365-b3bf3cc99f88',
        },
        {
          defer: true,
          src: 'https://umami.parcoil.com/recorder.js',
          'data-website-id': '9924bb71-c86f-4f31-8365-b3bf3cc99f88',
        },
      ],
    }
  },
  component: RootComponent,
  shellComponent: Document,
  notFoundComponent: NotFoundPage,
})

function RootComponent() {
  const { maintenance, releaseInfo } = Route.useLoaderData()

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {maintenance || !releaseInfo ? (
        <MaintenancePage />
      ) : (
        <ReleaseProvider value={releaseInfo}>
          <Nav />
          <div className="min-h-screen pt-16">
            <Outlet />
          </div>
          <Toaster />
          <Footer />
        </ReleaseProvider>
      )}
    </ThemeProvider>
  )
}

function Document({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
