import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ThemeRegistry from '@/components/ThemeRegistry';
import ClientLayout from '@/components/ClientLayout';
import { ThemeProvider } from 'next-themes';
import ClientProviders from '@/components/ClientProviders';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gerenciador de Boletos',
  description: 'Sistema de gerenciamento de boletos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className} style={{ margin: 0, minHeight: '100vh' }}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          storageKey="boletos-theme"
          enableColorScheme={true}
        >
          <ThemeRegistry>
            <ClientProviders>
              <ClientLayout>
                {children}
              </ClientLayout>
            </ClientProviders>
          </ThemeRegistry>
        </ThemeProvider>
      </body>
    </html>
  );
}
