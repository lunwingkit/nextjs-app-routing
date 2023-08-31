import React from 'react';
import { Inter } from 'next/font/google';
import StyledComponentsRegistry from './lib/AntdRegistry';
import { NextAuthProvider } from '@/app/lib/nextAuthProvider';
import { Metadata } from 'next';
// import '@/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MembersOnly',
  description: 'Welcome to book a Room now!',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body className={inter.className}>
      <NextAuthProvider>
        <StyledComponentsRegistry>
          {children}
        </StyledComponentsRegistry>
      </NextAuthProvider>
    </body>
  </html>
);

export default RootLayout;