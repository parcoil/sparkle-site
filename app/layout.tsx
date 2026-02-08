import type { Metadata } from 'next';
import { Poppins, Fira_Code } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import Nav from '@/components/nav';
import { ReactLenis, useLenis } from 'lenis/react';
import Footer from '@/components/footer';
import { Toaster } from '@/components/ui/sonner';

const poppins = Poppins({
	variable: '--font-poppins-sans',
	subsets: ['latin'],
	weight: ['400', '500', '600', '700']
});

const firaCode = Fira_Code({
	variable: '--font-fira-code-mono',
	subsets: ['latin']
});

export const metadata: Metadata = {
	title: 'Sparkle - Take control of your PC',
	description: 'A Windows app to debloat and optimize your PC'
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${poppins.variable} ${firaCode.variable} antialiased`}
				suppressHydrationWarning
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<ReactLenis root />
					<Nav />
					<div className="min-h-screen pt-16">{children}</div>
					<Toaster />
					<Footer />
				</ThemeProvider>
			</body>
		</html>
	);
}
