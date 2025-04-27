"use client";

import { motion } from "framer-motion";
import React from "react";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="relative overflow-hidden w-full px-6 py-20 bg-gradient-to-t from-gray-900 via-black to-gray-900 backdrop-blur-2xl border-t border-white/10">

            {/* Sparkles Layer */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="w-full h-full animate-slowMove bg-[radial-gradient(white_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
            </div>

            {/* First Animated Blob */}
            <motion.div
                animate={{
                    y: [0, 20, 0],
                    x: [0, -20, 0]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 opacity-30 rounded-full blur-[140px] z-0"
            />

            {/* Second Animated Blob */}
            <motion.div
                animate={{
                    y: [0, -20, 0],
                    x: [0, 20, 0]
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-gradient-to-tr from-blue-500 to-cyan-400 opacity-20 rounded-full blur-[120px] z-0"
            />

            <div className="relative z-10 flex flex-col items-center text-center text-white space-y-8">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300 bg-clip-text text-transparent"
                >
                    Let's Stay Connected
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="max-w-md text-white/70 leading-relaxed text-lg"
                >
                    Join our growing community and stay ahead in your financial journey. Let's build your future smarter!
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="flex flex-wrap justify-center gap-8 text-white/80 text-base font-medium"
                >
                    <Link href="/" className="relative group transition">
                        <span className="group-hover:underline">Home</span>
                    </Link>
                    <Link href="/about" className="relative group transition">
                        <span className="group-hover:underline">About & Services</span>
                    </Link>
                    <Link href="/about/contact" className="relative group transition">
                        <span className="group-hover:underline">Contact</span>
                    </Link>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="text-xs text-white/50 mt-10"
                >
                    © {new Date().getFullYear()} SIP Planner. All rights reserved.
                </motion.p>
            </div>
        </footer>
    );
};

export default Footer;










