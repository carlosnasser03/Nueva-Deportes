import type { ReactNode } from 'react';
import { Navbar } from '@features/navigation/Navbar';

export const metadata = {
  title: 'DeporteHN',
  description: 'App de fútbol infantil por categorías',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-slate-50 text-slate-900">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
