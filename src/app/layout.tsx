import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
import StyledComponentsRegistry from './lib/registry'
import { NextAuthProvider } from './lib/nextAuthProvider'

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MembersOnly',
  description: 'Welcome to book a Room now!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* <ReduxProvider> */}

      <body>
        <NextAuthProvider>
          <StyledComponentsRegistry>
            {children}
          </StyledComponentsRegistry>
        </NextAuthProvider>
      </body>
      {/* </ReduxProvider> */}
    </html>
  )
}
