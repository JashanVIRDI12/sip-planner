import { Orbitron , Poppins, Inter } from 'next/font/google'
import './globals.css'
import Navbar from "../components/navbar";
import {Toaster} from "sonner";
import Footer from "/components/Footer";

const poppins = Poppins({
    weight: ['400', '600', '700'],
    subsets: ['latin'],
    variable: '--font-poppins',
})

const inter = Inter({
    weight: ['300', '400', '500'],
    subsets: ['latin'],
    variable: '--font-inter',
})

const orbitron = Orbitron({
    weight: ['600', '700'],
    subsets: ['latin'],
    variable: '--font-orbitron',
})

export const metadata = {
    title: 'SIP App',
    description: 'Dark theme SIP calculator with Tailwind and custom fonts',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${orbitron.variable} ${poppins.variable} ${inter.variable}`}>
        <body className="font-inter bg-black text-white">
        <Navbar />
        <Toaster position="top-center" richColors closeButton />
        {children}
        <Footer />
        </body>
        </html>
    )
}
