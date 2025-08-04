import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Layout from '@/components/common/Layout';
import { ThirdwebProvider } from '@thirdweb-dev/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CarbonCred NFT Marketplace',
  description: 'A decentralized marketplace for carbon credits.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThirdwebProvider
          activeChain="ethereum"
          clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
          authConfig={{
            domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "",
            authUrl: "/api/auth",
          }}
        >
          <Layout>{children}</Layout>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
