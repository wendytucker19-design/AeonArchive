import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AEON Archive — A world worth keeping',
  description: 'Extraordinary objects. Stories that endure. Explore an immersive collection of antiques, astronomical instruments, and objects of enduring curiosity.',
  applicationName: 'AEON Archive',
  icons: { icon: '/icon.svg' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
